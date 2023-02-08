import initKnex from "../../../initKnex.js";
import { Knex } from "knex";
import { BudgetReportPeriod } from "../BudgetReportPeriod.js";
import { BudgetReportPath } from "../BudgetReportPath.js";
import { PeriodResolver } from "./PeriodResolver.js";
import { BudgetReportGranularity } from "../BudgetReportQuery.js";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('works', async () => {

    const resolver = new PeriodResolver();
    const period = ['2021/10', '2021/11', '2021/12'];
    const query = {
        periodRange: period.map(p => BudgetReportPeriod.fromString(p)),
        budgetPath: BudgetReportPath.fromString('*'),
        categoryPath: BudgetReportPath.fromString('*'),
        granularity: BudgetReportGranularity.Monthly,
    };

    const result = await resolver.execute(query);

    expect(Object.keys(result.nextResolversData)).toEqual(['DaoResolver']);
});
