import { Knex } from "knex";

import { AnalyticsQueryEngine } from "../../analytics/AnalyticsQueryEngine.js";
import { AnalyticsStore } from "../../analytics/AnalyticsStore.js";
import { AnalyticsGranularity, AnalyticsMetric, AnalyticsQuery } from "../../analytics/AnalyticsQuery.js";
import { AnalyticsPath } from "../../analytics/AnalyticsPath.js";

export class AnalyticsModel {
    engine: AnalyticsQueryEngine;

    constructor(knex: Knex) {
        const store = new AnalyticsStore(knex);
        this.engine = new AnalyticsQueryEngine(store);
    }

    public async query() {
        const query: AnalyticsQuery = {
            start: null,
            end: null,
            granularity: AnalyticsGranularity.Total,
            metrics: [
                AnalyticsMetric.Budget
            ],
            currency: AnalyticsPath.fromString('DAI'),
            select: {
                budget: [ AnalyticsPath.fromString('atlas') ],
                category: [ AnalyticsPath.fromString('atlas') ]
            },
            lod: {
                budget: 4,
                category: 2
            }
        };

        return this.engine.execute(query);
    }
}

export default (knex: Knex) => new AnalyticsModel(knex);