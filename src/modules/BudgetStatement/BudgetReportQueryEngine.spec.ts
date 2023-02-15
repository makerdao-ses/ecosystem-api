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
        granularity: BudgetReportGranularity.Quarterly,
        budgets: 'makerdao/core-units/*',
        categories: '*'
    };

    const output = await engine.execute(query);

    expect(output.length).toBeGreaterThan(5);
    output.forEach(group => {
        //console.log(group);
        if (group.keys.period == '0x7c09/2022/Q1') {
            expect(group.rows[0].actual).toBeCloseTo(388463.38999999996, 4);
        }
        //expect(group.rows.length).toBeGreaterThan(40);
        //expect(['SES-001','SH-001','DUX-001']).toContain(group.keys.owner);
    });
});