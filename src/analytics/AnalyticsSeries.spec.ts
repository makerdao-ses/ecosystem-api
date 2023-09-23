import { Knex } from "knex";
import initKnex from "../initKnex.js";
import { AnalyticsSeries } from "./AnalyticsSeries";
import { AnalyticsPath } from "./AnalyticsPath.js";

let knex: Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it('should add values without error', async () => {
    const series = new AnalyticsSeries(knex, 'mips/MIP40c2-SP1', 'BudgetCap', 'Immediate');
    
    await series.addValues([
        {
            start: new Date(),
            value: 10000,
            unit: 'DAI',
            metric: 'BudgetCap',
            dimensions: {
                budget: AnalyticsPath.fromString('makerdao/core-units/SES-001'),
                category: AnalyticsPath.fromString('headcount/CompensationAndBenefits/FrontEndEngineering'),
            }
        }, {
            start: new Date(),
            end: new Date(2024, 0, 1),
            value: 20000,
            unit: 'DAI',
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
        value: 5.8,
        metric: 'FTE'
    });

    await series.addValue({
        start: new Date(2023, 2, 1),
        value: -0.8,
        metric: 'FTE'
    });
});