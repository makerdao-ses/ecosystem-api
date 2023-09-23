import { Knex } from "knex";
import { AnalyticsPath } from "./AnalyticsPath";
import { values } from "lodash";

export class AnalyticsSeries {
    private _knex: Knex;
    private _defaultSource?: string;
    private _defaultMetric?: string;
    private _defaultFn?: string;

    public constructor(knex: Knex, defaultSource?:string, defaultMetric?:string, defaultFn?:string) {
        this._knex = knex;
        this._defaultSource = defaultSource;
        this._defaultMetric = defaultMetric;
        this._defaultFn = defaultFn;
    }

    public async addValue(input: AnalyticsSeriesInput) {
        return this.addValues([input]);
    }

    public async addValues(inputs: AnalyticsSeriesInput[]) {
        const dimensionsMap:DimensionsMap = {};

        for (let i=0; i<inputs.length; i++) {
            const value = this._parseInputValue(inputs[i]);
            
            const record = await this._knex<AnalyticsSeriesRecord>('AnalyticsSeries').insert({
                start: value.start,
                end: value.end,
                source: value.source,
                metric: value.metric,
                value: value.value,
                unit: value.unit,
                fn: value.fn,
                params: value.params,
            }, 'id');

            for (const [dim, path] of Object.entries(inputs[i].dimensions || {})) {
                if (!dimensionsMap[dim]) {
                    dimensionsMap[dim] = {};
                }

                const pKey = path.toString();
                if (!dimensionsMap[dim][pKey]) {
                    dimensionsMap[dim][pKey] = [];
                }

                dimensionsMap[dim][pKey].push(record[0].id);
            };
        }

        for (const [dim, pathMap] of Object.entries(dimensionsMap)) {
            await this._linkDimensions(dim, pathMap);
        }
        
        return values;
    }

    private async _linkDimensions(dimension: string, pathMap: Record<string, number[]>) {
        const dimensionIds = await this._knex('AnalyticsDimension')
            .select('path', 'id')
            .where('dimension', dimension)
            .whereIn('path', Object.keys(pathMap));

        for (const [path, ids] of Object.entries(pathMap)) {
            const i = dimensionIds.findIndex(record => record.path == path);
            
            const dimensionId = (i < 0) ? 
                await this._createDimensionPath(dimension, path) : 
                dimensionIds[i].id;

            for (let j=0; j<ids.length; j++) {
                await this._knex('AnalyticsSeries_AnalyticsDimension').insert({seriesId: ids[j], dimensionId});
            }
        }
    }

    private async _createDimensionPath(dimension: string, path: string) {
        const result = await this._knex('AnalyticsDimension').insert({ dimension, path }, 'id');
        return result[0].id;
    }

    private _parseInputValue(input: AnalyticsSeriesInput): AnalyticsSeriesRecord {
        const result = {...input};

        result.end = input.end || null;
        result.source = input.source || this._defaultSource;
        result.metric = input.metric || this._defaultMetric;
        result.unit = input.unit || null;
        result.fn = input.fn || this._defaultFn;
        result.params = input.params || null;
        result.dimensions = input.dimensions || {};

        if (!result.source) {
            throw new Error('Cannot determine AnalyticsSeriesValue source.');
        }

        if (!result.metric) {
            throw new Error(`Cannot determine AnalyticsSeriesValue metric (source: ${input.source})`);
        }

        if (!result.fn) {
            throw new Error(`Cannot determine AnalyticsSeriesValue function (${input.source} ${input.metric})`);
        }

        return (result as AnalyticsSeriesRecord);
    }
}

type DimensionsMap = Record<string, Record<string, number[]>>;

type AnalyticsSeriesInput = {
    start: Date,
    end?: Date | null,
    source?: string | null,
    metric?: string,
    value: number,
    unit?: string | null,
    fn?: string | null,
    params?: Record<string, any> | null,
    dimensions?: Record<string, AnalyticsPath> | null
}

export type AnalyticsSeriesRecord = {
    id: number,
    start: Date,
    end: Date | null,
    source: string,
    metric: string,
    value: number,
    unit: string | null,
    fn: string,
    params: Record<string, any> | null
}