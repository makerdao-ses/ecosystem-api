import { AnalyticsDiscretizer, GroupedPeriodResults } from "./AnalyticsDiscretizer.js";
import { AnalyticsPath } from "./AnalyticsPath.js";
import { AnalyticsQuery, AnalyticsSeries, AnalyticsSeriesQuery } from "./AnalyticsQuery.js";
import { AnalyticsStore } from "./AnalyticsStore.js";

export class AnalyticsQueryEngine {
    private _analyticsStore: AnalyticsStore;

    public constructor(store: AnalyticsStore) {
        this._analyticsStore = store;
    }

    public async execute(query: AnalyticsQuery): Promise<GroupedPeriodResults> {
        const 
            seriesResults = await this._executeSeriesQuery(query),
            normalizedSeriesResults = this._applyLods(seriesResults, query.lod),
            dimensions = Object.keys(query.select),
            discretizedResult = (normalizedSeriesResults.length < 1) ? [] : AnalyticsDiscretizer.discretize(
                normalizedSeriesResults, 
                dimensions, 
                query.start,
                query.end,
                query.granularity
            );

        return discretizedResult;
    }

    private async _executeSeriesQuery(query: AnalyticsQuery): Promise<AnalyticsSeries<AnalyticsPath>[]> {
        const seriesQuery: AnalyticsSeriesQuery = {
            start: query.start,
            end: query.end,
            currency: query.currency,
            select: query.select,
            metrics: query.metrics
        };

        return await this._analyticsStore.getMatchingSeries(seriesQuery);
    }

    private _applyLods(series: AnalyticsSeries<AnalyticsPath>[], lods: Record<string, number|null>): AnalyticsSeries<string>[] {
        return series.map(result => ({
            ...result, 
            dimensions: this._applyDimensionsLods(result.dimensions, lods)
        }));
    }

    private _applyDimensionsLods(dimensionMap: Record<string, AnalyticsPath>, lods: Record<string, number | null>) {
        const result: Record<string, string> = {};
        
        for (const [dimension, lod] of Object.entries(lods)) {
            if (lod !== null && dimensionMap[dimension]) {
                result[dimension] = dimensionMap[dimension].applyLod(lod).toString();
            }
        }

        return result;
    }
}