import { Knex } from "knex";
import initKnex from "../../initKnex.js";
import { BudgetReportPath, BudgetReportPathSegment } from "./BudgetReportPath.js";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";
import { BudgetReportOutputGroup, CacheKeys } from "./BudgetReportResolver";
import { ResolverCache } from "./ResolverCache";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('Caches items and maintains the database table correctly', async () => {
    const resolverCache = new ResolverCache(knex);

    const cacheKeys = {
        resolver: 'test',
        keys: [{
            month: BudgetReportPeriod.fromString('2022/12'),
            coreUnit: 'CES-001'
        }]
    };

    const cacheItem: BudgetReportOutputGroup[] = [
        {
            period: '2022/Q4',
            keys: [
                BudgetReportPathSegment.fromString('makerdao'),
                BudgetReportPath.fromString('core-units/CES-001'),
            ],
            rows: [
                {
                    month: BudgetReportPeriod.fromString('2022/12'),
                    group: 'group 1',
                    category: 'TravelAndEntertainment',
                    headcountExpense: true,
                    account: '0xD740882B8616B50d0B317fDFf17Ec3f4f853F44f',
                    actual: 10000.00,
                    actualDiscontinued: 10000.00,
                    forecast: 10000.00,
                    forecastDiscontinued: 10000.00,
                    budgetCap: 10000.00,
                    budgetCapDiscontinued: 10000.00,
                    payment: 10000.00,
                    paymentDiscontinued: 10000.00,
                    prediction: 10000.00,
                    predictionDiscontinued: 10000.00,
                },
                {
                    month: BudgetReportPeriod.fromString('2022/12'),
                    group: 'group 2',
                    category: 'TravelAndEntertainment',
                    headcountExpense: true,
                    account: '0xD740882B8616B50d0B317fDFf17Ec3f4f853F44f',
                    actual: 20000.00,
                    actualDiscontinued: 20000.00,
                    forecast: 20000.00,
                    forecastDiscontinued: 20000.00,
                    budgetCap: 20000.00,
                    budgetCapDiscontinued: 20000.00,
                    payment: 20000.00,
                    paymentDiscontinued: 20000.00,
                    prediction: 20000.00,
                    predictionDiscontinued: 20000.00,
                }
            ]
        }
    ];

    const expectedHash = '61f87819fcbc62f1';

    const hash = await resolverCache.calculateHash(cacheKeys);
    expect(hash).toBe(expectedHash);

    await resolverCache.emptyCache();
    const cacheMiss = await resolverCache.load(cacheKeys);
    expect(cacheMiss).toBe(null);

    await resolverCache.store(cacheKeys, cacheItem, -1);
    const cleanedUp = await resolverCache.pruneCache();
    expect(cleanedUp).toBe(1);

    await resolverCache.store(cacheKeys, cacheItem);
    
    const cacheHit = await resolverCache.load(cacheKeys);
    expect(cacheHit).toEqual(cacheItem);
    
});