import { AnalyticsPath } from "./AnalyticsPath.js";
import { AnalyticsGranularity, AnalyticsQuery, AnalyticsSeries, AnalyticsSeriesQuery } from "./AnalyticsQuery.js";
import { AnalyticsQueryResult } from "./AnalyticsQueryResult.js";
import { AnalyticsStore } from "./AnalyticsStore.js";
import { AnalyticsRange, getPeriodSeries } from "./AnalyticsTimeSlicer.js";

export class AnalyticsQueryEngine {
    private _analyticsStore: AnalyticsStore;

    public constructor(store: AnalyticsStore) {
        this._analyticsStore = store;
    }

    public async execute(query: AnalyticsQuery): Promise<AnalyticsSeries[]> {
        const seriesResults = await this._executeSeriesQuery(query);
        const normalizedSeriesResults = seriesResults.map(result => ({
            ...result, 
            dimensions: this._applyLods(result.dimensions, query.lod)
        }));

        if (normalizedSeriesResults.length < 1) {
            return [];
        }

        const periodSeries = getPeriodSeries(this._calculateRange(query.start, query.end, query.granularity, seriesResults));
        //console.log(periodSeries.next(), periodSeries.next())

        return normalizedSeriesResults;
    }

    private _calculateRange(start: Date|null, end: Date|null, granularity: AnalyticsGranularity, results: AnalyticsSeries[]) {
        let calculatedStart: Date|null = start || null;
        let calculatedEnd: Date|null = end || null;
        
        if (calculatedStart == null || calculatedEnd == null) {
            for (const r of results) {
                if (calculatedStart == null) {
                    calculatedStart = r.start;
                }

                const endValue = r.end || r.start;
                if (calculatedEnd == null || (calculatedEnd as Date).getTime() < endValue.getTime()) {
                    calculatedEnd = endValue;
                }
            }
        }

        if (calculatedStart == null || calculatedEnd == null) {
            throw new Error('Cannot determine query start and/or end.');
        }

        return {
            start: calculatedStart,
            end: calculatedEnd,
            granularity
        } as AnalyticsRange;
    }

    private async _executeSeriesQuery(query: AnalyticsQuery): Promise<AnalyticsSeries[]> {
        const seriesQuery: AnalyticsSeriesQuery = {
            start: query.start,
            end: query.end,
            currency: query.currency,
            select: query.select,
            metrics: query.metrics
        };

        return await this._analyticsStore.getMatchingSeries(seriesQuery);
    }

    private _applyLods(dimensionMap: Record<string, AnalyticsPath>, lods: Record<string, number | null>) {
        const result: Record<string, AnalyticsPath> = {};
        for (const [dimension, lod] of Object.entries(lods)) {
            if (lod !== null && dimensionMap[dimension]) {
                result[dimension] = dimensionMap[dimension].applyLod(lod);
            }
        }

        return result;
    }
}