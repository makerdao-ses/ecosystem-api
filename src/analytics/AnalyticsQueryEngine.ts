import { AnalyticsPath } from "./AnalyticsPath.js";
import { AnalyticsQuery, AnalyticsSeries, AnalyticsSeriesQuery } from "./AnalyticsQuery.js";
import { AnalyticsQueryResult } from "./AnalyticsQueryResult.js";
import { AnalyticsStore } from "./AnalyticsStore.js";

export class AnalyticsQueryEngine {
    private _analyticsStore: AnalyticsStore;

    public constructor(store: AnalyticsStore) {
        this._analyticsStore = store;
    }

    public async execute(query: AnalyticsQuery): Promise<AnalyticsSeries[]> {
        const seriesResults = await this._executeSeriesQuery(query);
        const normalizedSeriesResults = this._applyLods(seriesResults, query.lod);
        
        return normalizedSeriesResults;
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

    private _applyLods(results: AnalyticsSeries[], lods: Record<string, number | null>): AnalyticsSeries[] {

        const applyLods = (dimensionMap: Record<string, AnalyticsPath>) => {
            const result: Record<string, AnalyticsPath> = {};
            for (const [dimension, lod] of Object.entries(lods)) {
                if (lod !== null && dimensionMap[dimension]) {
                    result[dimension] = dimensionMap[dimension].applyLod(lod);
                }
            }

            return result;
        };

        results = results.map(r => ({
            ...r,
            dimensions: applyLods(r.dimensions)
        }));

        return results;
    }
}