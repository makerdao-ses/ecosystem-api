import { Knex } from "knex";
import { AnalyticsPath } from "./AnalyticsPath.js";
import {
  AnalyticsSeriesQuery,
  AnalyticsSeries,
  toPascalCase,
} from "./AnalyticsQuery.js";
import { measureQueryPerformance } from "../utils/logWrapper.js";

export class AnalyticsStore {
  private _knex: Knex;

  public constructor(knex: Knex) {
    this._knex = knex;
  }

  public async clearSeriesBySource(
    source: AnalyticsPath,
    cleanUpDimensions: boolean = false,
  ) {
    let result = await this._knex("AnalyticsSeries")
      .whereLike("source", source.toString("/%"))
      .delete();

    if (cleanUpDimensions) {
      result += await this.clearEmptyAnalyticsDimensions();
    }

    return result;
  }

  public async clearEmptyAnalyticsDimensions() {
    const query = this._knex("AnalyticsDimension AS AD")
      .whereNotExists((q) =>
        q
          .select("*")
          .from("AnalyticsSeries_AnalyticsDimension AS ASAD")
          .where("ASAD.dimensionId", this._knex.ref("AD.id")),
      )
      .delete();

    return await query;
  }

  public async getMatchingSeries(
    query: AnalyticsSeriesQuery,
  ): Promise<AnalyticsSeries<AnalyticsPath>[]> {
    const analyticsView = this._buildViewQuery(
      "AV",
      Object.keys(query.select),
      query.metrics.map((m) => m),
      query.currency.firstSegment().filters,
      query.end,
    );

    const baseQuery = this._knex<AnalyticsSeriesRecord>(
      this._knex.raw(analyticsView),
    ).select("AV.*");

    // Add dimension filter(s)
    for (const [dimension, paths] of Object.entries(query.select)) {
      baseQuery.leftJoin(`AnalyticsDimension as ${dimension}`, (q) => {
        q.on(`${dimension}.path`, `dim_${dimension}`);
      });
      baseQuery.select(`${dimension}.icon as dim_icon`);
      baseQuery.select(`${dimension}.description as dim_description`);
      baseQuery.select(`${dimension}.label as dim_label`);
      if (paths.length == 1) {
        baseQuery.andWhereLike(`dim_${dimension}`, paths[0].toString("/%"));
      } else if (paths.length > 1) {
        baseQuery.andWhere((q) => {
          paths.forEach((p) =>
            q.orWhereLike(`dim_${dimension}`, p.toString("/%")),
          );
          return q;
        });
      }
    }
    baseQuery.orderBy("start");
    const results = await measureQueryPerformance('analyticsQuery', 'analyticsQuery', baseQuery);
    return this._formatQueryRecords(results, Object.keys(query.select));
  }

  public async addSeriesValue(input: AnalyticsSeriesInput) {
    return this.addSeriesValues([input]);
  }

  public async addSeriesValues(inputs: AnalyticsSeriesInput[]) {
    const dimensionsMap: DimensionsMap = {};

    for (let i = 0; i < inputs.length; i++) {
      const record = await this._knex<AnalyticsSeriesRecord>(
        "AnalyticsSeries",
      ).insert(
        {
          start: inputs[i].start,
          end: inputs[i].end || null,
          source: inputs[i].source.toString("/"),
          metric: toPascalCase(inputs[i].metric),
          value: inputs[i].value,
          unit: inputs[i].unit || null,
          fn: inputs[i].fn || "Single",
          params: inputs[i].params || null,
        },
        "id",
      );

      for (const [dim, path] of Object.entries(inputs[i].dimensions || {})) {
        if (!dimensionsMap[dim]) {
          dimensionsMap[dim] = {};
        }

        const pKey = path.toString("/");
        if (!dimensionsMap[dim][pKey]) {
          dimensionsMap[dim][pKey] = [];
        }

        dimensionsMap[dim][pKey].push(record[0].id);
      }
    }

    for (const [dim, pathMap] of Object.entries(dimensionsMap)) {
      await this._linkDimensions(dim, pathMap);
    }

    // Adding dimension metadata
    for (let i = 0; i < inputs.length; i++) {
      const metaDimension: any = inputs[i].dimensionMetadata
      if (!metaDimension) {
        continue
      }
      await this.addDimensionMetadata(metaDimension.path, metaDimension.icon, metaDimension.label, metaDimension.description)
    }
  }

  private _formatQueryRecords(
    records: AnalyticsSeriesRecord[],
    dimensions: string[],
  ): AnalyticsSeries<AnalyticsPath>[] {
    return records.map((r: AnalyticsSeriesRecord) => {
      const result = {
        id: r.id,
        source: AnalyticsPath.fromString(r.source.slice(0, -1)),
        start: r.start,
        end: r.end,
        metric: r.metric,
        value: r.value,
        unit: r.unit,
        fn: r.fn,
        params: r.params,
        dimensions: {} as Record<string, AnalyticsPath> | any,
      };

      dimensions.forEach((d) => (result.dimensions[d] = {
        path: AnalyticsPath.fromString(r[`dim_${d}`] ? r[`dim_${d}`].slice(0, -1) : "?"),
        icon: r[`dim_icon`] ? r[`dim_icon`] : "",
        label: r[`dim_label`] ? r[`dim_label`] : "",
        description: r[`dim_description`] ? r[`dim_description`] : "",
      }),
      );
      return result;
    });
  }

  private _buildViewQuery(
    name: string,
    dimensions: string[],
    metrics: string[],
    units: string[] | null,
    until: Date | null,
  ) {
    const baseQuery = this._knex("AnalyticsSeries as AS_inner")
      .select("*")
      .whereIn("metric", metrics);

    for (const dimension of dimensions) {
      baseQuery.select(this._buildDimensionQuery(dimension));
    }

    if (units && units[0] !== '') {
      baseQuery.whereIn("unit", units);
    }

    if (until) {
      baseQuery.where("start", "<", until);
    }

    return `(${baseQuery.toString()}) AS "${name}"`;
  }

  private _buildDimensionQuery(dimension: string) {
    const seriesIdRef = this._knex.ref("AS_inner.id");

    return this._knex("AnalyticsSeries_AnalyticsDimension as ASAD")
      .leftJoin("AnalyticsDimension as AD", "AD.id", "ASAD.dimensionId")
      .where("ASAD.seriesId", seriesIdRef)
      .where("AD.dimension", dimension)
      .select("path")
      .as(`dim_${dimension}`);
  }

  private async _linkDimensions(
    dimension: string,
    pathMap: Record<string, number[]>,
  ) {
    const dimensionIds = await this._knex("AnalyticsDimension")
      .select("path", "id")
      .where("dimension", dimension)
      .whereIn("path", Object.keys(pathMap));

    for (const [path, ids] of Object.entries(pathMap)) {
      const i = dimensionIds.findIndex((record) => record.path == path);

      const dimensionId =
        i < 0
          ? await this._createDimensionPath(dimension, path)
          : dimensionIds[i].id;

      for (let j = 0; j < ids.length; j++) {
        await this._knex("AnalyticsSeries_AnalyticsDimension").insert({
          seriesId: ids[j],
          dimensionId,
        });
      }
    }
  }

  private async _createDimensionPath(dimension: string, path: string) {
    const result = await this._knex("AnalyticsDimension").insert(
      { dimension, path },
      "id",
    );
    return result[0].id;
  }

  private async addDimensionMetadata(
    path: string,
    icon: string | null | undefined,
    label: string | null | undefined,
    description: string | null | undefined,
  ) {

    if (!icon && !label && !description) {
      return
    }
    try {
      await this._knex("AnalyticsDimension")
        .where("path", `${path.toString()}/`)
        .update({
          icon: icon ? icon : '',
          label: label ? label : '',
          description: description ? description : '',
        })
    } catch (error) {
      console.error('Error updating AnalyticsDimension:', error);
    }
  }

  public async getDimensions() {
    // Fetch all rows from the database
    const rows = await this._knex
      .select('dimension', 'path', 'icon', 'label', 'description')
      .from('AnalyticsDimension')
      .whereNotNull('path')
      .whereNot('path', '')
      .whereNot('path', '/');

    // Process the rows to group them by dimension and format them
    const grouped = rows.reduce((acc, row) => {
      // If the dimension is not yet in the accumulator, add it
      if (!acc[row.dimension]) {
        acc[row.dimension] = {
          name: row.dimension,
          values: [],
        };
      }

      // Add the path, icon, label, and description to the dimension's values
      acc[row.dimension].values.push({
        path: row.path,
        icon: row.icon,
        label: row.label,
        description: row.description,
      });

      return acc;
    }, {});

    // Convert the grouped object to an array
    const dimensionPaths: any = Object.values(grouped);
    return dimensionPaths;
  }

  public async getMetrics() {
    const list = await this._knex("AnalyticsSeries").select('metric').distinct().whereNotNull('metric');
    const filtered = list.map((l) => l.metric);
    const metrics = ['Budget', 'Forecast', 'Actuals', 'PaymentsOnChain', 'PaymentsOffChainIncluded'];
    metrics.forEach(metric => {
      if (!filtered.includes(metric)) {
        filtered.push(metric);
      }
    });
    return filtered;
  }
}

type DimensionsMap = Record<string, Record<string, number[]>>;

type AnalyticsSeriesInput = {
  start: Date;
  end?: Date | null;
  source: AnalyticsPath;
  metric: string;
  value: number;
  unit?: string | null;
  fn?: string | null;
  params?: Record<string, any> | null;
  dimensions: Record<string, AnalyticsPath>;
  dimensionMetadata?: Record<string, string>;
};

type AnalyticsSeriesRecord = {
  id: number;
  source: string;
  start: Date;
  end: Date | null;
  metric: string;
  value: number;
  unit: string | null;
  fn: string;
  params: Record<string, any> | null;
  [dimension: `dim_${string}`]: string;
  dimensionMetadata?: Record<string, string>;
};
