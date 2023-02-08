import { Knex } from "knex";
import initKnex from "../../initKnex.js";
import { BudgetReportGranularity, BudgetReportQuery } from "./BudgetReportQuery";
import { BudgetReportQueryEngine } from "./BudgetReportQueryEngine";
import { DaoResolver } from "./ReportResolvers/DaoResolver.js";
import { CoreUnitsResolver } from "./ReportResolvers/CoreUnitsResolver.js";
import { AccountsResolver } from "./ReportResolvers/AccountsResolver.js";
import { PeriodResolver } from "./ReportResolvers/PeriodResolver.js";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('Configures the resolvers correctly and returns concatenated output.', async () => {
    const resolvers = [ 
        new PeriodResolver(),
        new DaoResolver(),
        new CoreUnitsResolver(knex),
        new AccountsResolver(knex)
    ];

    const engine = new BudgetReportQueryEngine(knex, resolvers, 'PeriodResolver');
    
    expect(engine.rootResolver.name).toEqual('PeriodResolver');
    expect(engine.resolvers.map(r => r.name))
        .toEqual(['PeriodResolver', 'DaoResolver', 'CoreUnitsResolver', 'AccountsResolver']);

    const query:BudgetReportQuery = {
        start: null,
        end: null,
        granularity: BudgetReportGranularity.Quartely,
        budgets: 'makerdao/core-units/SES-001,sh-001,DuX-001',
        categories: '*'
    };

    const output = await engine.execute(query);    
    expect(output.length).toBeGreaterThan(570);
});