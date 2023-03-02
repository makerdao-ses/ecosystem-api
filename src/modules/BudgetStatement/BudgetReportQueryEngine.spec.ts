import { Knex } from "knex";
import initKnex from "../../initKnex.js";
import { BudgetReportGranularity, BudgetReportQuery } from "./BudgetReportQuery";
import { BudgetReportQueryEngine } from "./BudgetReportQueryEngine";
import { DaoResolver } from "./ReportResolvers/DaoResolver.js";
import { CoreUnitsResolver } from "./ReportResolvers/CoreUnitsResolver.js";
import { AccountsResolver } from "./ReportResolvers/AccountsResolver.js";
import { PeriodResolver } from "./ReportResolvers/PeriodResolver.js";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";
import { BudgetReportPath } from "./BudgetReportPath.js";
import { ResolverCache } from "./ResolverCache.js";
import { DelegatesResolver } from "./ReportResolvers/DelegatesResolver.js";

const DEBUG_OUTPUT_TO_FILE = false;
let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('Correctly does basic validation of its configuration', async () => {
    const resolvers = [ 
        new PeriodResolver(knex),
        new DaoResolver(),
        new CoreUnitsResolver(knex),
        new AccountsResolver(knex)
    ];

    expect(() => new BudgetReportQueryEngine(resolvers, 'UnknownResolver'))
        .toThrowError('Cannot find root resolver \'UnknownResolver\'');

    const engine = new BudgetReportQueryEngine(resolvers, 'PeriodResolver');
    const badQuery:BudgetReportQuery = {
        start: BudgetReportPeriod.fromString('2022/Q4'),
        end: BudgetReportPeriod.fromString('2023/Q2'),
        granularity: BudgetReportGranularity.Quarterly,
        budgets: 'makerdao/core-units/*',
        categories: '*'
    };

    await expect(() => engine.execute(badQuery)).rejects
        .toThrow('Quarters and years are not allowed as query start or end values. Use the respective months instead.');

    const rangeTests = [
        [null, '2022/01'],
        [null, BudgetReportPeriod.fromString('2022/01')],
        ['2022/01', null],
        ['2022/01', '2022/01'],
        ['2022/01', BudgetReportPeriod.fromString('2022/01')],
        [BudgetReportPeriod.fromString('2022/01'), null],
        [BudgetReportPeriod.fromString('2022/01'), '2022/01'],
        [BudgetReportPeriod.fromString('2022/01'), BudgetReportPeriod.fromString('2022/01')]
    ];

    for (const range of rangeTests) {
        const query = {
            start: range[0], 
            end: range[1],
            granularity: BudgetReportGranularity.Quarterly,
            budgets: BudgetReportPath.fromString('makerdao/core-units/DECO-001'),
            categories: BudgetReportPath.fromString('*')
        };

        const result = await engine.execute(query);
        expect(result.filter(r => r.period === '2022/Q1').length).toEqual(1);
    }
});

it ('Configures the resolvers correctly and returns concatenated output.', async () => {
    const resolvers = [ 
        new PeriodResolver(knex),
        new DaoResolver(),
        new CoreUnitsResolver(knex),
        new AccountsResolver(knex)
    ];

    const engine = new BudgetReportQueryEngine(resolvers, 'PeriodResolver');
    
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
                period: group.period.replace('/', '-'),
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

it ('Applies caching correctly.', async () => {
    jest.setTimeout(10000);

    const resolvers = [ 
        new PeriodResolver(knex),
        new DaoResolver(),
        new CoreUnitsResolver(knex),
        new DelegatesResolver(),
        new AccountsResolver(knex)
    ];

    const resolverCache = new ResolverCache(knex);
    const engine = new BudgetReportQueryEngine(resolvers, 'PeriodResolver', resolverCache);
    expect(engine.resolverCache).toBeInstanceOf(ResolverCache);

    const query:BudgetReportQuery = {
        start: null,
        end: null,
        granularity: BudgetReportGranularity.Quarterly,
        budgets: 'makerdao/*:*',
        categories: '*'
    };

    await engine.execute(query);
});