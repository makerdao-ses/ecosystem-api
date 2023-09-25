import { Knex } from "knex";
import initKnex from "../initKnex.js";
import { AnalyticsStore } from "./AnalyticsStore.js";
import { AnalyticsPath } from "./AnalyticsPath.js";
import { AnalyticsGranularity, AnalyticsMetric } from "./AnalyticsQuery.js";
import { AnalyticsQueryEngine } from "./AnalyticsQueryEngine.js";

let knex: Knex;

// Set to false during testing to see the resulting records in db
const CLEAN_UP_DB = true;
const TEST_SOURCE = AnalyticsPath.fromString('test/analytics/AnalyticsStore.spec');

beforeAll(async () => {
    knex = initKnex();
    const store = new AnalyticsStore(knex);
    await store.clearSeriesBySource(AnalyticsPath.fromString('test'));

    await store.addSeriesValues([
        {
            start: new Date(),
            source: TEST_SOURCE,
            value: 10000,
            unit: 'DAI',
            metric: AnalyticsMetric.Budget,
            dimensions: {
                budget: AnalyticsPath.fromString('atlas/legacy/core-units/SES-001'),
                category: AnalyticsPath.fromString('atlas/headcount/CompensationAndBenefits/FrontEndEngineering'),
            }
        }, {
            start: new Date(),
            end: new Date(2024, 0, 1),
            source: TEST_SOURCE,
            value: 210,
            unit: 'MKR',
            metric: AnalyticsMetric.Budget,
            fn: 'DssVest',
            params: {
                cliff: new Date(2023, 11, 1)
            },
            dimensions: {
                budget: AnalyticsPath.fromString('atlas/legacy/core-units/SES-001'),
                category: AnalyticsPath.fromString('atlas/headcount/CompensationAndBenefits/SmartContractEngineering'),
            }
        }
    ]);

    await store.addSeriesValue({
        start: new Date(2023, 0, 1),
        source: TEST_SOURCE,
        value: 5.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {}
    });

    await store.addSeriesValue({
        start: new Date(2023, 2, 1),
        source: TEST_SOURCE,
        value: -0.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {}
    });
});

afterAll(async () => {
    if (CLEAN_UP_DB) {
        await new AnalyticsStore(knex).clearSeriesBySource(AnalyticsPath.fromString('test'), true);
    }

    knex.destroy();
});

it ('should query records', async () => {
    const store = new AnalyticsStore(knex);
    const queryEngine = new AnalyticsQueryEngine(store); 

    const results = await store.getMatchingSeries({
        start: null,
        end: null,
        currency: AnalyticsPath.fromString('MKR,DAI'),
        metrics: [
            AnalyticsMetric.Actuals,
            AnalyticsMetric.Budget,
            AnalyticsMetric.FTEs
        ],
        select: {
            budget: [
                AnalyticsPath.fromString('atlas/legacy/core-units/SES-001')
            ],
            category: [ 
                AnalyticsPath.fromString('atlas/headcount'),
                AnalyticsPath.fromString('atlas/non-headcount') 
            ],
            project: []
        }
    });

    expect(results.length).toBe(2);
    expect(results.map(r => r.unit)).toEqual(['DAI', 'MKR']);
    expect(results.map(r => r.dimensions.budget.toString())).toEqual([
        'atlas/legacy/core-units/SES-001',
        'atlas/legacy/core-units/SES-001'
    ]);

    const results2 = await queryEngine.execute({
        start: null,
        end: null,
        granularity: AnalyticsGranularity.Hourly,
        currency: AnalyticsPath.fromString('MKR,DAI'),
        metrics: [
            AnalyticsMetric.Actuals,
            AnalyticsMetric.Budget,
            AnalyticsMetric.FTEs
        ],
        select: {
            budget: [
                AnalyticsPath.fromString('atlas/legacy/core-units/SES-001')
            ],
            category: [ 
                AnalyticsPath.fromString('atlas/headcount'),
                AnalyticsPath.fromString('atlas/non-headcount') 
            ],
            project: []
        },
        lod: {
            budget: 2,
            category: 2,
            project: 0
        }
    });

    expect(results2.length).toBe(2);
    expect(results2.map(r => r.unit)).toEqual(['DAI', 'MKR']);
    expect(results2.map(r => r.dimensions.budget.toString())).toEqual([
        'atlas/legacy',
        'atlas/legacy'
    ]);
});

