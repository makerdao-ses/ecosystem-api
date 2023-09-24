import { Knex } from "knex";
import initKnex from "../initKnex.js";
import { AnalyticsSeries } from "./AnalyticsSeries.js";
import { AnalyticsPath } from "./AnalyticsPath.js";
import { AnalyticsMetric } from "./AnalyticsQuery.js";

let knex: Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('should query records', async () => {
    const series = new AnalyticsSeries(knex);
    const results = await series.getValues({
        start: null,
        end: null,
        currency: AnalyticsPath.fromString('MKR'),
        metrics: [
            AnalyticsMetric.Actuals,
            AnalyticsMetric.Budget,
            AnalyticsMetric.FTEs
        ],
        filter: {
            budget: [
                AnalyticsPath.fromString('makerdao/core-units/SES-001')
            ],
            category: [ 
                AnalyticsPath.fromString('headcount'),
                AnalyticsPath.fromString('non-headcount') 
            ],
            project: []
        }
    });

    console.log(JSON.stringify(results, null, 2));
});

it('should add values without error', async () => {
    const series = new AnalyticsSeries(knex);
    
    await series.addValues([
        {
            start: new Date(),
            source: AnalyticsPath.fromString('test/mips/MIP40c2-SP1'),
            value: 10000,
            unit: 'DAI',
            metric: AnalyticsMetric.Budget,
            dimensions: {
                budget: AnalyticsPath.fromString('makerdao/core-units/SES-001'),
                category: AnalyticsPath.fromString('headcount/CompensationAndBenefits/FrontEndEngineering'),
            }
        }, {
            start: new Date(),
            end: new Date(2024, 0, 1),
            source: AnalyticsPath.fromString('test/mips/MIP40c2-SP1'),
            value: 210,
            unit: 'MKR',
            metric: AnalyticsMetric.Budget,
            fn: 'DssVest',
            params: {
                cliff: new Date(2023, 11, 1)
            },
            dimensions: {
                budget: AnalyticsPath.fromString('makerdao/core-units/SES-001'),
                category: AnalyticsPath.fromString('headcount/CompensationAndBenefits/SmartContractEngineering'),
            }
        }
    ]);

    await series.addValue({
        start: new Date(2023, 0, 1),
        source: AnalyticsPath.fromString('test/mips/MIP40c2-SP1'),
        value: 5.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {}
    });

    await series.addValue({
        start: new Date(2023, 2, 1),
        source: AnalyticsPath.fromString('test/mips/MIP40c2-SP1'),
        value: -0.8,
        metric: AnalyticsMetric.FTEs,
        dimensions: {}
    });
});