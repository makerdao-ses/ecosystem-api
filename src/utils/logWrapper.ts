import { getChildLogger } from "../logger.js"
import { createClient } from 'redis';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { AnalyticsQuery } from "@powerhousedao/analytics-engine-core";
import { Knex } from "knex";
import { serializeAnalyticsQuery, deserializeAnalyticsQuery } from './analyticsSerializer.js';

const SLOW_QUERY_LOG_KEY = 'slow_query_logs';
const SLOW_QUERY_THRESHOLD = 10; // 10 seconds

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
    const redisUrl = process.env.REDIS_TLS_URL!;
    console.log(`Connecting to Redis at ${redisUrl}`);
    client = await createClient({
        url: redisUrl,
        socket: {
            tls: redisUrl.startsWith('rediss'),
            rejectUnauthorized: false,
        }
    }).on('error', (err: string) => console.log('Redis Client Error', err))
        .connect();
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

export const measureQueryPerformance = async (
    queryName: string,
    moduleName: string,
    knexQuery: Knex.QueryBuilder,
    refreshCache: boolean = false,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) => {
    addQuery({ queryName, moduleName, knexQuery, priority });
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
        // Store slow queries in Redis
        if (executionTime > SLOW_QUERY_THRESHOLD) {
            await logSlowQuery(logData);
        }
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

export const measureAnalyticsQueryPerformance = async (
    queryName: string,
    moduleName: string,
    analyticsQuery: AnalyticsQuery,
    refreshCache: boolean = false,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) => {
    const modules = await getApiModules();
    const engine = modules.datasource.Analytics.engine;
    const store = modules.datasource.Analytics.store;

    const queryString = store.getBaseQuery(analyticsQuery).toString();
    addQuery({ queryName, moduleName, analyticsQuery, analyticsQueryString: queryString, priority });
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now(); // Start timing
        if (!client) {
            await init()
        }
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

        // Store slow queries in Redis
        if (executionTime > SLOW_QUERY_THRESHOLD) {
            await logSlowQuery(logData);
        }
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

// Add a new type for PrioritizedQuery
type PrioritizedQuery = {
    queryHash: string;
    queryName: string;
    moduleName: string;
    knexQuery?: Knex.QueryBuilder;
    analyticsQuery?: AnalyticsQuery;
    analyticsQueryString?: string;
    hitCount: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
};

let queries: PrioritizedQuery[] = [];

// Modify the addQuery function to include priority
async function addQuery(query: any) {
    const logger = getChildLogger({}, { moduleName: 'addQuery' });
    const queryHash = getHashKey(query.knexQuery ?? query.analyticsQuery);
    const foundQuery = queries.find(q => q.queryHash === queryHash);
    if (!foundQuery) {
        const queryString = query.knexQuery ? query.knexQuery.toString() : query.analyticsQueryString;
        queries.push({ ...query, hitCount: 0, queryHash, priority: query.priority || 'medium' });
        logger.info({
            query: queryString,
            priority: query.priority || 'medium'
        }, 'New query added to cache');
    } else {
        foundQuery.hitCount++;
        // Update priority if it's higher than the existing one
        if (query.priority && getPriorityValue(query.priority) > getPriorityValue(foundQuery.priority)) {
            foundQuery.hitCount *= 50;
        }
    }
}

// Helper function to convert priority to numeric value
function getPriorityValue(priority: PrioritizedQuery['priority']): number {
    switch (priority) {
        case 'critical': return 3;
        case 'high': return 2;
        case 'medium': return 1;
        case 'low': return 0;
    }
}

// Modify updateQueryCache to consider priority
export async function updateQueryCache(maxConcurrency: number = 5, maxQueries: number = 300) {
    try {
        if (queries.length === 0) return;

        const logger = getChildLogger({}, { moduleName: 'updateQueryCache' });

        const mainStart = Date.now();

        // Sort queries by hitCount
        const sortedQueries = queries.sort((a, b) => {
            // Compare by hitCount (higher hitCount comes first)
            return b.hitCount - a.hitCount;
        }).slice(0, maxQueries);

        logger.info({
            nrOfInitialQueries: queries.length,
            highestPriority: sortedQueries[0].priority,
            highestHitCount: sortedQueries[0].hitCount
        });

        // update query cache with max concurrency
        for (let i = 0; i < maxQueries; i += maxConcurrency) {
            const batchStart = Date.now();
            await Promise.all(sortedQueries.slice(i, i + maxConcurrency).map((query: any) =>
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
        queries = sortedQueries.map(q => ({ ...q, hitCount: 0 }));

        // storing queries in redis
        if (client) {
            client.set("query-cache", JSON.stringify(sortedQueries.map(q => {
                if (q.analyticsQuery) {
                    return {
                        query: q.analyticsQueryString,
                        analyticsQuery: serializeAnalyticsQuery(q.analyticsQuery),
                        hitCount: q.hitCount,
                        moduleName: q.moduleName,
                        queryName: q.queryName
                    }
                } else {
                    return {
                        query: typeof q.knexQuery === 'object' ? q.knexQuery.toQuery() : q.knexQuery,
                        hitCount: q.hitCount,
                        moduleName: q.moduleName,
                        queryName: q.queryName
                    }
                }
            })), { EX: 86400 })
        }
        const mainEnd = Date.now();
        logger.info({
            message: 'Time to update query cache + new nr of queries',
            numberOfQueries: queries.length,
            duration: `${(mainEnd - mainStart) / 1000}s`
        })
    } catch (error) {
        console.error('Error updating query cache:', error);
    }
}

export async function warmUpQueryCache() {
    const logger = getChildLogger({}, { moduleName: 'warmUpQueryCache' });

    if (!client) {
        await init();
    }
    try {
        const storedQueries = await client.get("query-cache");
        if (storedQueries) {
            const parsedQueries = JSON.parse(storedQueries);
            logger.info(`Found ${parsedQueries.length} stored queries. Starting cache warm-up.`);

            queries = parsedQueries.map((q: any) => {
                if (q.analyticsQuery) {
                    return { ...q, query: q.analyticsQueryString, analyticsQuery: deserializeAnalyticsQuery(q.analyticsQuery) }
                }
                return {
                    ...q,
                    knexQuery: q.query
                };
            });
            updateQueryCache(5, 200);
        }
    } catch (error) {
        console.log('error', error);
        logger.error('Error getting stored queries:', error);
    }
}


export function queryLength() {
    return queries.length;
}

async function logSlowQuery(logData: any) {
    if (!client) {
        await init();
    }
    const currentLogs = await client.lRange(SLOW_QUERY_LOG_KEY, 0, -1);
    const serializedLog = JSON.stringify(logData);

    // Keep only the last 100 slow query logs
    if (currentLogs.length >= 100) {
        await client.lPop(SLOW_QUERY_LOG_KEY);
    }

    await client.rPush(SLOW_QUERY_LOG_KEY, serializedLog);
}

// New function to retrieve slow query logs
export async function getSlowQueryLogs(): Promise<any[]> {
    if (!client) {
        await init();
    }
    const logs = await client.lRange(SLOW_QUERY_LOG_KEY, 0, -1);
    return logs.map((log: any) => JSON.parse(log));
}