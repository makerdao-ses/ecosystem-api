import {
  AnalyticsGranularity,
  AnalyticsSeries,
} from "./AnalyticsQuery.js";
import {
  AnalyticsPeriod,
  AnalyticsRange,
  getPeriodSeriesArray,
} from "./AnalyticsTimeSlicer.js";

export type GroupedPeriodResult = {
  period: string;
  start: Date;
  end: Date;
  rows: Array<{
    dimensions: Record<string, string>;
    metric: string;
    unit: string | null;
    value: number;
    sum: number;
  }>;
};

export type GroupedPeriodResults = Array<GroupedPeriodResult>;

export class AnalyticsDiscretizer {
  public static discretize(
    series: AnalyticsSeries<string>[],
    dimensions: string[],
    start: Date | null,
    end: Date | null,
    granularity: AnalyticsGranularity,
  ): GroupedPeriodResults {
    const index = this._buildIndex(series, dimensions),
      periods = getPeriodSeriesArray(
        this._calculateRange(start, end, granularity, series),
      ),
      disretizedResults = this._discretizeNode(index, {}, dimensions, periods),
      groupedResults = this._groupResultsByPeriod(periods, disretizedResults);

    return groupedResults;
  }

  private static _calculateRange(
    start: Date | null,
    end: Date | null,
    granularity: AnalyticsGranularity,
    results: AnalyticsSeries<any>[],
  ) {
    let calculatedStart: Date | null = start || null;
    let calculatedEnd: Date | null = end || null;

    if (calculatedStart == null || calculatedEnd == null) {
      for (const r of results) {
        if (calculatedStart == null) {
          calculatedStart = r.start;
        }

        const endValue = r.end || r.start;
        if (
          calculatedEnd == null ||
          (calculatedEnd as Date).getTime() < endValue.getTime()
        ) {
          calculatedEnd = endValue;
        }
      }
    }

    if (calculatedStart == null || calculatedEnd == null) {
      throw new Error("Cannot determine query start and/or end.");
    }

    return {
      start: calculatedStart,
      end: calculatedEnd,
      granularity,
    } as AnalyticsRange;
  }

  public static _groupResultsByPeriod(
    periods: AnalyticsPeriod[],
    dimensionedResults: DimensionedSeries[],
  ): GroupedPeriodResults {
    const result: Record<string, GroupedPeriodResult> = {};

    for (const p of periods) {
      const id = p.start.toISOString() + "-" + p.period;
      result[id] = {
        period: p.period,
        start: p.start,
        end: p.end,
        rows: [],
      };
    }

    for (const r of dimensionedResults) {
      for (const period of Object.keys(r.series)) {
        result[period].rows.push({
          dimensions: r.dimensions,
          metric: r.metric,
          unit: r.unit == "__NULL__" ? null : r.unit,
          value: r.series[period].inc,
          sum: r.series[period].sum,
        });
      }
    }

    return Object.values(result);
  }

  public static _discretizeNode(
    node: DiscretizerIndexNode,
    dimensionValues: Record<string, string>,
    remainingDimensions: string[],
    periods: AnalyticsPeriod[],
  ): DimensionedSeries[] {
    const result: DimensionedSeries[] = [];

    if (remainingDimensions.length > 0) {
      const subdimension = remainingDimensions[0] as string;
      Object.keys(node).forEach((subdimensionValue) => {
        const newDimensionValues = { ...dimensionValues };
        newDimensionValues[subdimension] = subdimensionValue;
        result.push(
          ...this._discretizeNode(
            node[subdimensionValue] as DiscretizerIndexNode,
            newDimensionValues,
            remainingDimensions.slice(1),
            periods,
          ),
        );
      });
    } else {
      Object.keys(node).forEach((metric) => {
        result.push(
          ...this._discretizeLeaf(
            node[metric] as DiscretizerIndexLeaf,
            periods,
            metric,
            dimensionValues,
          ),
        );
      });
    }

    return result;
  }

  public static _discretizeLeaf(
    leaf: DiscretizerIndexLeaf,
    periods: AnalyticsPeriod[],
    metric: string,
    dimensionValues: Record<string, string>,
  ): DimensionedSeries[] {
    const result: DimensionedSeries[] = [];

    Object.keys(leaf).forEach((unit) => {
      result.push({
        unit,
        metric,
        dimensions: dimensionValues,
        series: this._discretizeSeries(leaf[unit], periods),
      });
    });

    return result;
  }

  public static _discretizeSeries(
    series: AnalyticsSeries<string>[],
    periods: AnalyticsPeriod[],
  ): Series {
    const result: Series = {};

    for (const s of series) {
      let oldSum = this._getValue(s, periods[0].start);
      for (const p of periods) {
        const newSum = this._getValue(s, p.end);
        const id = `${p.start.toISOString()}-${p.period}`;
        // const id = p.period;
        if (result[id]) {
          result[id].inc += newSum - oldSum;
          result[id].sum += newSum;
        } else {
          result[id] = {
            inc: newSum - oldSum,
            sum: newSum,
          };
        }

        oldSum = newSum;
      }
    }

    return result;
  }

  public static _getValue(series: AnalyticsSeries<string>, when: Date): number {
    switch (series.fn) {
      case "Single":
        return this._getSingleValue(series, when);
      case "DssVest":
        return this._getVestValue(series, when);
      default:
        console.error(`Unknown analytics series function: '${series.fn}'`);
        return 0.0;
    }
  }

  public static _getSingleValue(
    series: AnalyticsSeries<string>,
    when: Date,
  ): number {
    return when.getTime() > series.start.getTime() ? series.value : 0.0;
  }

  public static _getVestValue(
    series: AnalyticsSeries<string>,
    when: Date,
  ): number {
    const now = when.getTime();
    const start = series.start.getTime();
    const end = series.end!.getTime();
    const cliff = series.params?.cliff
      ? new Date(series.params.cliff!).getTime()
      : null;
    if (now < start || (cliff && now < cliff)) {
      return 0.0;
    } else if (now > end) {
      return series.value;
    }

    return ((now - start) / (end - start)) * series.value;
  }

  public static _buildIndex(
    series: AnalyticsSeries<string>[],
    dimensions: string[],
  ): DiscretizerIndexNode {
    const result: DiscretizerIndexNode = {};
    const map: DiscretizerIndexLeaf = {};
    const dimName = dimensions[0] || "";

    for (const s of series) {
      const dimValue = s.dimensions[dimName];
      if (undefined === map[dimValue]) {
        map[dimValue] = [];
      }

      map[dimValue].push(s);
    }

    if (dimensions.length > 1) {
      const newDimensions = dimensions.slice(1);
      Object.keys(map).forEach((k) => {
        result[k] = this._buildIndex(map[k], newDimensions);
      });
    } else {
      Object.keys(map).forEach((k) => {
        result[k] = this._buildMetricsIndex(map[k]);
      });
    }

    return result;
  }

  public static _buildMetricsIndex(
    series: AnalyticsSeries<string>[],
  ): DiscretizerIndexNode {
    const result: DiscretizerIndexNode = {};

    const map: DiscretizerIndexLeaf = {};
    for (const s of series) {
      const metric = s.metric;
      if (undefined === map[metric]) {
        map[metric] = [];
      }

      map[metric].push(s);
    }

    Object.keys(map).forEach((k) => (result[k] = this._buildUnitIndex(map[k])));
    return result;
  }

  public static _buildUnitIndex(
    series: AnalyticsSeries<string>[],
  ): DiscretizerIndexLeaf {
    const result: DiscretizerIndexLeaf = {};

    for (const s of series) {
      const unit = s.unit || "__NULL__";
      if (undefined === result[unit]) {
        result[unit] = [];
      }

      result[unit].push(s);
    }

    return result;
  }
}

type DiscretizerIndexLeaf = { [k: string]: AnalyticsSeries<string>[] };
type DiscretizerIndexNode = {
  [k: string]: DiscretizerIndexNode | DiscretizerIndexLeaf;
};
type Series = Record<string, { inc: number; sum: number }>;
type DimensionedSeries = {
  unit: string;
  metric: string;
  dimensions: Record<string, string>;
  series: Series;
};
