import { Knex } from "knex";
import initKnex from "../../initKnex.js";
import { BudgetReportGranularity, BudgetReportQuery } from "./BudgetReportQuery";
import { BudgetReportQueryEngine } from "./BudgetReportQueryEngine";
import { DaoResolver } from "./ReportResolvers/DaoResolver.js";
import { CoreUnitsResolver } from "./ReportResolvers/CoreUnitsResolver.js";
import { AccountsResolver } from "./ReportResolvers/AccountsResolver.js";
import { PeriodResolver } from "./ReportResolvers/PeriodResolver.js";

const DEBUG_OUTPUT_TO_FILE = false;
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

    if (DEBUG_OUTPUT_TO_FILE) { 
        const fileContents = output
            .map(group => ({
                period: group.keys.period.replace('/', '-'),
                budget: "/makerdao/core-units",
                prediction: Math.round(group.rows[0].prediction * 100.00) / 100.00,
                actuals: Math.round(group.rows[0].actual * 100.00) / 100.00,
                discontinued: Math.round(group.rows[0].actualDiscontinued * 100.00) / 100.00,
                budgetCap: Math.round(group.rows[0].budgetCap * 100.00) / 100.00
            }))
            .sort((a,b) => (a.period > b.period) ? 1 : ((b.period > a.period) ? -1 : 0));

        let fs = require('fs');
        fs.writeFile(
            (query.granularity == BudgetReportGranularity.Quarterly ? "quarterly" : "monthly") + "-data.json", 
            JSON.stringify(fileContents), 
            function(err:any) {
                if (err) {
                    console.log(err);
                }
            }
        );
    }
});