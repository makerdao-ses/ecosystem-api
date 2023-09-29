import { Knex } from "knex";
import initKnex from "../initKnex.js";
import { AnalyticsPath } from "./AnalyticsPath";
import { AnalyticsGranularity, AnalyticsMetric, AnalyticsQuery } from "./AnalyticsQuery";
import { AnalyticsQueryEngine } from "./AnalyticsQueryEngine";
import { AnalyticsStore } from "./AnalyticsStore";

let knex: Knex;

// Set to false during testing to see the resulting records in db
const CLEAN_UP_DB = true;
const TEST_SOURCE = AnalyticsPath.fromString('test/analytics/AnalyticsQueryEngine.spec');

beforeAll(async () => {
    knex = initKnex();
    const store = new AnalyticsStore(knex);
    await store.clearSeriesBySource(TEST_SOURCE);

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
                project: TEST_SOURCE,    
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
                project: TEST_SOURCE,
            }
        }
    ]);

    await store.addSeriesValue({
        start: new Date(2023, 0, 1),
        source: TEST_SOURCE,
        value: 5.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {
            project: TEST_SOURCE,
        }
    });

    await store.addSeriesValue({
        start: new Date(2023, 2, 1),
        source: TEST_SOURCE,
        value: -0.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {
            project: TEST_SOURCE,
        }
    });
});

afterAll(async () => {
    if (CLEAN_UP_DB) {
        await new AnalyticsStore(knex).clearSeriesBySource(TEST_SOURCE, true);
    }

    knex.destroy();
});

it('should query records', async () => {
    const store = new AnalyticsStore(knex)
    const engine = new AnalyticsQueryEngine(store);
    
    const query: AnalyticsQuery = {
        start: null,
        end: null,
        granularity: AnalyticsGranularity.Total,
        metrics: [
            AnalyticsMetric.Budget,
            AnalyticsMetric.Actuals,
            AnalyticsMetric.FTEs
        ],
        currency: AnalyticsPath.fromString('DAI,MKR'),
        select: {
            budget: [ 
                AnalyticsPath.fromString('atlas/legacy/core-units/SES-001'),
                AnalyticsPath.fromString('atlas/legacy/core-units/PE-001'), 
            ],
            category: [
                AnalyticsPath.fromString('atlas/headcount')
            ],
            project: [
                TEST_SOURCE
            ]
        },
        lod: {
            budget: 3,
            category: 1,
            project: 1
        }
    };

    const result = await engine.execute(query);

    expect(result.length).toBe(2);
    expect(result.map(r => r.unit)).toEqual(['DAI', 'MKR']);
    expect(result.map(r => r.dimensions.budget.toString())).toEqual([
        'atlas/legacy/core-units',
        'atlas/legacy/core-units'
    ]);
});