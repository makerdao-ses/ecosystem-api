import initKnex from "../../../initKnex.js";
import { Knex } from "knex";
import { AccountsResolver, AccountsResolverData } from "./AccountsResolver.js";
import { BudgetReportPeriod } from "../BudgetReportPeriod.js";
import { BudgetReportPath } from "../BudgetReportPath.js";
import { BudgetReportGranularity } from "../BudgetReportQuery.js";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('works', async () => {

    const resolver = new AccountsResolver(knex);
    const period = ['2021/10', '2021/11', '2021/12'];
    const query: AccountsResolverData = {
        account: '0x7c09ff9b59baaebfd721cbda3676826aa6d7bae8',
        owner: 'SES-001',
        discontinued: false,
        discontinuedSince: null,
        start: period[0],
        end: period[2],
        periodRange: period.map(p => BudgetReportPeriod.fromString(p)),
        budgetPath: BudgetReportPath.fromString('*'),
        categoryPath: BudgetReportPath.fromString('*'),
        granularity: BudgetReportGranularity.Monthly
    };

    const result = await resolver.execute(query);

    expect(Object.keys(result.nextResolversData)).toEqual([]);
    result.output[0].rows.forEach(r => {
        expect(r.account.toLowerCase()).toBe(query.account.toLowerCase());
        expect(period).toContain(r.month.toString())
    });
});
