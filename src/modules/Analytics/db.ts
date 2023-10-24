import { Knex } from "knex";

import { AnalyticsQueryEngine } from "../../analytics/AnalyticsQueryEngine.js";
import { AnalyticsStore } from "../../analytics/AnalyticsStore.js";
import { AnalyticsGranularity, AnalyticsMetric, AnalyticsQuery } from "../../analytics/AnalyticsQuery.js";
import { AnalyticsPath } from "../../analytics/AnalyticsPath.js";

type queryFilter = {
    start?: Date,
    end?: Date,
    granularity?: string,
    metrics?: AnalyticsMetric[],
    dimensions?: Record<string, string>,
    currency?: string

}

export class AnalyticsModel {
    engine: AnalyticsQueryEngine;

    constructor(knex: Knex) {
        const store = new AnalyticsStore(knex);
        this.engine = new AnalyticsQueryEngine(store);
    }

    public async query(filter: queryFilter) {
        const query: AnalyticsQuery = {
            start: filter.start ? new Date(filter.start) : null,
            end: filter.end ? new Date(filter.end) : null,
            granularity: getGranularity(filter.granularity),
            metrics: [
                AnalyticsMetric.Budget
            ],
            currency: AnalyticsPath.fromString('DAI'),
            select: {
                budget: [AnalyticsPath.fromString('atlas')],
                category: [AnalyticsPath.fromString('atlas')]
            },
            lod: {
                // budget: 4,
                // category: 2
            }
        };
        return this.engine.execute(query);
    }
}

export default (knex: Knex) => new AnalyticsModel(knex);

const getGranularity = (granularity: string | undefined): AnalyticsGranularity => {
    switch (granularity) {
        case 'hourly': {
            return AnalyticsGranularity.Hourly;
        }
        case 'daily': {
            return AnalyticsGranularity.Daily;
        }
        case 'weekly': {
            return AnalyticsGranularity.Weekly;
        }
        case 'monthly': {
            return AnalyticsGranularity.Monthly;
        }
        case 'quarterly': {
            return AnalyticsGranularity.Quarterly;
        }
        case 'semiAnnual': {
            return AnalyticsGranularity.SemiAnnual;
        }
        case 'annual': {
            return AnalyticsGranularity.Annual;
        }
        case 'total': {
            return AnalyticsGranularity.Total;
        }
        default: {
            return AnalyticsGranularity.Total;
        }
    }
}