import { AnalyticsGranularity, AnalyticsMetric, AnalyticsSeries, getAnalyticsMetricEnum, getAnalyticsMetricString } from "./AnalyticsQuery.js";
import { AnalyticsPeriod } from "./AnalyticsTimeSlicer.js";

export type DiscretizedRange = {
    start: Date,
    end: Date, 
    granularity: AnalyticsGranularity
}

type Series = Record<string, { inc: number, sum: number }>;
type DimensionedSeries = {
    unit: string,
    metric: string,
    dimensions: Record<string, string>,
    series: Series
}

export class AnalyticsDiscretizer {
    private _range: DiscretizedRange;
    private _dimensions: string[];

    public constructor(range: DiscretizedRange, dimensions: string[]) {
        this._range = range;
        this._dimensions = dimensions;
    }

    public static _discretizeNode(node:DiscretizerIndexNode, dimensionValues:Record<string, string>, remainingDimensions: string[], periods:AnalyticsPeriod[]): DimensionedSeries[] {
        const result: DimensionedSeries[] = [];
    
        if (remainingDimensions.length > 0) {
            const subdimension = remainingDimensions[0] as string;
            console.log('next subdimension', subdimension);

            Object.keys(node).forEach(subdimensionValue => {
                const newDimensionValues = {...dimensionValues};
                newDimensionValues[subdimension] = subdimensionValue;
                result.push(
                    ...this._discretizeNode(node[subdimensionValue] as DiscretizerIndexNode, newDimensionValues, remainingDimensions.slice(1), periods)
                );
            });

        } else {
            Object.keys(node).forEach(metric => {
                result.push(
                    ...this._discretizeLeaf(node[metric] as DiscretizerIndexLeaf, periods, metric, dimensionValues)
                );
            });
        }

        return result;
    }

    public static _discretizeLeaf(leaf: DiscretizerIndexLeaf, periods: AnalyticsPeriod[], metric: string, dimensionValues:Record<string, string>): DimensionedSeries[] {
        const result: DimensionedSeries[] = [];

        console.log('discretizing leaf', dimensionValues, leaf);

        Object.keys(leaf).forEach(unit => {
            result.push({
                unit,
                metric,
                dimensions: dimensionValues,
                series: this._discretizeSeries(leaf[unit], periods)
            });
        });

        console.log('discretized leaf', JSON.stringify(result, null, 2))

        return result;
    }

    public static _discretizeSeries(series: AnalyticsSeries<string>[], periods: AnalyticsPeriod[]): Series {
        const result: Series = {};

        for (const s of series) {
            let oldSum = this._getValue(s, periods[0].start);
            for (const p of periods) {
                let newSum = this._getValue(s, p.end);

                if (result[p.period]) {
                    result[p.period].inc += newSum - oldSum;
                    result[p.period].sum += newSum;
                } else {
                    result[p.period] = {
                        inc: newSum - oldSum,
                        sum: newSum
                    }
                }

                oldSum = newSum;
            }
        }

        return result;
    }

    public static _getValue(series: AnalyticsSeries<string>, when: Date): number {
        switch(series.fn) {
            case 'Single':
                return this._getSingleValue(series, when);
            case 'DssVest':
                return this._getVestValue(series, when);
            default:
                console.error(`Unknown analytics series function: '${series.fn}'`);
                return 0.00;
        }
    }

    public static _getSingleValue(series: AnalyticsSeries<string>, when: Date): number {
        return when.getTime() > series.start.getTime() ? series.value : 0.00;
    }

    public static _getVestValue(series: AnalyticsSeries<string>, when: Date): number {
        return when.getTime() > series.start.getTime() ? series.value : 0.00;
    }

    public static _buildIndex(series:AnalyticsSeries<string>[], dimensions:string[]): DiscretizerIndexNode {
        const result: DiscretizerIndexNode = {};
        const map:DiscretizerIndexLeaf = {};
        const dimName = dimensions[0] || '';

        for (const s of series) {
            const dimValue = s.dimensions[dimName];
            if (undefined === map[dimValue]) {
                map[dimValue] = [];
            }

            map[dimValue].push(s);
        }

        if (dimensions.length > 1) {
            const newDimensions = dimensions.slice(1);
            Object.keys(map).forEach(k => {
                result[k] = this._buildIndex(map[k], newDimensions);
            });

        } else {
            Object.keys(map).forEach(k => {
                result[k] = this._buildMetricsIndex(map[k]);
            });
        }

        return result;
    }

    public static _buildMetricsIndex(series:AnalyticsSeries<string>[]): DiscretizerIndexNode {
        const result: DiscretizerIndexNode = {};
        
        const map: DiscretizerIndexLeaf = {};
        for (const s of series) {
            const metric = getAnalyticsMetricString(s.metric);
            if (undefined === map[metric]) {
                map[metric] = [];
            }

            map[metric].push(s);
        }

        Object.keys(map).forEach(k => result[k] = this._buildUnitIndex(map[k]));
        return result;
    }

    public static _buildUnitIndex(series:AnalyticsSeries<string>[]): DiscretizerIndexLeaf {
        const result: DiscretizerIndexLeaf = {};

        for (const s of series) {
            const unit = s.unit || '__NULL__';
            if (undefined === result[unit]) {
                result[unit] = [];
            }

            result[unit].push(s);
        }

        return result;
    }
}

type DiscretizerIndexLeaf = { [k:string]: AnalyticsSeries<string>[] };
type DiscretizerIndexNode = { [k:string]: DiscretizerIndexNode | DiscretizerIndexLeaf };