import { Knex } from "knex";
import initKnex from "../../initKnex.js";
import { BudgetReportGranularity, BudgetReportQuery } from "./BudgetReportQuery";
import { BudgetReportQueryEngine } from "./BudgetReportQueryEngine";
import { DaoResolver } from "./ReportResolvers/DaoResolver.js";
import { CoreUnitsResolver } from "./ReportResolvers/CoreUnitsResolver.js";
import { AccountsResolver } from "./ReportResolvers/AccountsResolver.js";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('Configures the resolvers correctly and returns concatenated output.', async () => {
    const resolvers = [ 
        new DaoResolver(),
        new CoreUnitsResolver(),
        new AccountsResolver()
    ];

    const engine = new BudgetReportQueryEngine(knex, resolvers, 'DaoResolver');
    
    expect(engine.rootResolver.name).toEqual('DaoResolver');
    expect(engine.resolvers.map(r => r.name))
        .toEqual(['DaoResolver', 'CoreUnitsResolver', 'AccountsResolver']);

    const query:BudgetReportQuery = {
        start: null,
        end: null,
        granularity: BudgetReportGranularity.Quartely,
        budgets: 'makerdao/core-units/*',
        categories: '*'
    };

    const output = await engine.execute(query);
    expect(output).toEqual([
        { actuals: 100.00 },
        { actuals: 200.00 },
        { actuals: 300.00 },
        { actuals: 400.00 }
    ]);
});