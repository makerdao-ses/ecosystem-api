import { getChildLogger } from "../logger.js"
import { createClient } from 'redis';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { AnalyticsQueryEngine, } from "../analytics/AnalyticsQueryEngine.js";
import { AnalyticsQuery } from "../analytics/AnalyticsQuery.js";
import { Knex } from "knex";

let apiModules: any;

const getApiModules = async () => {
    if (!apiModules) {
        const module = await import('../index.js');
        apiModules = module.apiModules;
    }
    return apiModules;
};

let client: any;

async function init() {
    client = await createClient({
        url: process.env.REDIS_TLS_URL,
        socket: {
            tls: true,
            rejectUnauthorized: false,
        }
    }).on('error', (err: string) => console.log('Redis Client Error', err))
        .connect();
    client.flushAll("ASYNC", function (succeeded: any) {
        console.log(succeeded); // will be true if successfull
    });
}

export const timer = setInterval(
    async () => {
        try {
            client && (await client.ping());
        } catch (err) {
            console.error('Ping Interval Error', err);
        }
    },
    1000 * 60 * 4
);

export const closeRedis = () => {
    clearInterval(timer);
    client && client.disconnect();
};

export const measureQueryPerformance = async (queryName: string, moduleName: string, knexQuery: Knex.QueryBuilder, refreshCache: boolean = false) => {
    addQuery({ queryName, moduleName, knexQuery });
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now(); // Start timing
        if (!client) {
            await init()
        }

        const key = getHashKey(knexQuery);
        const value = refreshCache ? null : await client.get(key);
        let results = null;
        if (value) {
            results = JSON.parse(value, dateTimeReviver);
        } else {
            results = await knexQuery;
            client.set(key, JSON.stringify(results), { EX: 14400 });
        }
        const end = Date.now(); // End timing
        const executionTime = (end - start) / 1000;
        const logData = {
            timestamp: new Date().toISOString(),
            queryName,
            moduleName,
            executionTime: `${executionTime}s`,
            query: knexQuery.toString(),
        };
        if (executionTime > 0.5) {
            logger.info({
                executionTime: `${(end - start) / 1000}s`,
                query: knexQuery.toString(),
            },
                queryName);
            // await appendLogToFile(logData);
        } else {
            logger.debug({
                executionTime: `${(end - start) / 1000}s`,
                query: knexQuery.toString(),
            },
                queryName);
        }

        return results;
    } catch (error: any) {
        logger.error({
            error: error.message,
            query: knexQuery.toString(),
        },
            queryName);
        return await knexQuery;
    }
};

export const measureAnalyticsQueryPerformance = async (queryName: string, moduleName: string, analyticsQuery: AnalyticsQuery, refreshCache: boolean = false) => {
    const modules = await getApiModules();
    const engine = modules.datasource.Analytics.engine;

    addQuery({ queryName, moduleName, analyticsQuery });
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now(); // Start timing
        if (!client) {
            await init()
        }
        const queryString = JSON.stringify(analyticsQuery);
        const key = getHashKey(analyticsQuery);
        const value = refreshCache ? null : await client.get(key);
        let results = null;
        if (value) {
            results = JSON.parse(value, dateTimeReviver);
        } else {
            results = await engine.execute(analyticsQuery) as any;
            client.set(key, JSON.stringify(results), { EX: 14400 });
            // log request if !requestCache, to also include timing info
        }
        const end = Date.now(); // End timing
        const executionTime = (end - start) / 1000;
        const logData = {
            timestamp: new Date().toISOString(),
            queryName,
            moduleName,
            executionTime: `${executionTime}s`,
            query: queryString,
        };
        if (executionTime > 0.5) {
            logger.info({
                executionTime: `${(end - start) / 1000}s`,
                query: queryString,
            },
                queryName);
            // await appendLogToFile(logData);
        } else {
            logger.debug({
                executionTime: `${(end - start) / 1000}s`,
                query: queryString,
            },
                queryName);
        }

        return results;
    } catch (error: any) {
        logger.error({
            error: error.message,
            query: analyticsQuery,
        },
            queryName);
        return await engine.execute(analyticsQuery) as any;
    }
}

export const getHashKey = (query: Knex.QueryBuilder | AnalyticsQuery) => {
    let retKey = '';
    if ((query as Knex.QueryBuilder).toQuery) {
        const text = (query as Knex.QueryBuilder).toQuery();
        retKey = createHash('BLAKE2s256').update(text).digest('hex');
    } else {
        const text = JSON.stringify(query);
        retKey = createHash('BLAKE2s256').update(text).digest('hex');
    }
    return 'CACHE_ASIDE' + retKey;
};

const dateTimeReviver = function (key: any, value: any) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    let a: any;
    if (typeof value === 'string') {
        a = regex.exec(value);
        if (a) {
            return new Date(value);
        }
    }
    return value;
}

async function appendLogToFile(logData: any) {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'query_performance.log');

    try {
        await fs.mkdir(logDir, { recursive: true });
        await fs.appendFile(logFile, JSON.stringify(logData) + '\n');
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

const getQueries = async () => {
    const queryCache = await client.get("query-cache");
    if (queryCache) {
        return JSON.parse(queryCache);
    }
    return [];
}

async function addQuery(query: any) {
    const queryHash = getHashKey(query.knexQuery ?? query.analyticsQuery);
    const queries = await getQueries();
    const foundQuery = queries.find(q => q.queryHash === queryHash);
    if (!foundQuery) {
        queries.push({ ...query, hitCount: 0, queryHash });
    } else {
        foundQuery.hitCount++;
    }
    client.set("query-cache", JSON.stringify(queries));
}


// add maxconcurrency param
// maxQueries param
// it refreshes most popular(maxQuery) queries and reduces their hit number by 1
// should look through queries but only up to max concurrency param ( 4 / 5 at a time )
export async function updateQueryCache(maxConcurrency: number = 5, maxQueries: number = 500) {
    const queries = await getQueries();
    if (queries.length === 0) return;

    const logger = getChildLogger({}, { moduleName: 'updateQueryCache' });

    const mainStart = Date.now();

    // sort querie by hitCount
    const sortedQueries = queries.sort((a, b) => b.hitCount - a.hitCount).slice(0, maxQueries);
    logger.info({
        nrOfInitialQueries: queries.length,
        hitCount: sortedQueries[0].hitCount
    })

    // update query cache with max concurrency
    for (let i = 0; i < maxQueries; i += maxConcurrency) {
        const batchStart = Date.now();
        await Promise.all(sortedQueries.slice(i, i + maxConcurrency).map(query =>
            query.analyticsQuery ?
                measureAnalyticsQueryPerformance(query.queryName, query.moduleName, query.analyticsQuery, true)
                : measureQueryPerformance(query.queryName, query.moduleName, query.knexQuery, true)
        ));
        logger.info({
            message: `Time to update query cache batch ${i}`,
            duration: `${(Date.now() - batchStart) / 1000}s`
        })
    }

    // replace query with sorted query and reset hitCount
    await client.set("query-cache", JSON.stringify(sortedQueries.map(q => ({ ...q, hitCount: 0 }))));
    const mainEnd = Date.now();
    logger.info({
        message: 'Time to update query cache + new nr of queries',
        numberOfQueries: queries.length,
        duration: `${(mainEnd - mainStart) / 1000}s`
    })
}

export async function queryLength() {
    const queries = await getQueries();
    return queries.length;
}
