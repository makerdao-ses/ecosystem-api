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

const isCacheDisabled = () => process.env.CACHE_DISABLED === 'true';

let client: any = null;

async function init() {
    if (isCacheDisabled()) {
        console.log('cache is disabled')
        return;
    }
    try {
        const url = process.env.REDIS_TLS_URL;
        if (!url) {
            throw new Error('REDIS_TLS_URL not set');
        }

        client = await createClient({
            url,
            socket: {
                tls: url.startsWith('rediss'),
                rejectUnauthorized: false,
            }
        });

        client.on('error', (err: string) => {
            if (!isCacheDisabled()) {
                console.log('Redis Client Error', err);
            }
        });

        await client.connect();
    } catch (error) {
        if (!isCacheDisabled()) {
            console.error('Redis initialization error:', error);
        }
        client = null;
    }
}

export const timer = isCacheDisabled() ? null : setInterval(
    async () => {
        if (isCacheDisabled()) {
            if (timer) {
                clearInterval(timer);
            }
            return;
        }
        try {
            client && (await client.ping());
        } catch (err) {
            if (!isCacheDisabled()) {
                console.error('Ping Interval Error', err);
                try {
                    await init();
                } catch (initErr) {
                    console.error('Redis reconnection failed:', initErr);
                }
            }
        }
    },
    1000 * 30
);

export const closeRedis = () => {
    if (timer) {
        clearInterval(timer);
    }
    if (client) {
        client.disconnect();
    }
};

export const measureQueryPerformance = async (
    queryName: string,
    moduleName: string,
    knexQuery: Knex.QueryBuilder,
    refreshCache: boolean = false,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) => {
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now();
        
        const results = isCacheDisabled() ? 
            await knexQuery : 
            await handleCachedQuery(knexQuery, refreshCache);

        const end = Date.now();
        const executionTime = (end - start) / 1000;
        
        logQueryPerformance(logger, queryName, executionTime, knexQuery.toString());
        return results;
    } catch (error: any) {
        logger.error({
            error: error.message,
            query: knexQuery.toString(),
        }, queryName);
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
    
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now();
        
        const results = isCacheDisabled() ?
            await engine.execute(analyticsQuery) :
            await handleCachedAnalyticsQuery(engine, analyticsQuery, refreshCache);

        const end = Date.now();
        const executionTime = (end - start) / 1000;
        
        logQueryPerformance(logger, queryName, executionTime, queryString);
        return results;
    } catch (error: any) {
        logger.error({
            error: error.message,
            query: analyticsQuery,
        }, queryName);
        return await engine.execute(analyticsQuery);
    }
};

async function handleCachedQuery(knexQuery: Knex.QueryBuilder, refreshCache: boolean) {
    if (isCacheDisabled()) {
        return await knexQuery;
    }
    
    if (!client) {
        await init();
    }
    const key = getHashKey(knexQuery);
    const value = refreshCache ? null : await client.get(key);
    if (value) {
        return JSON.parse(value, dateTimeReviver);
    }
    const results = await knexQuery;
    client.set(key, JSON.stringify(results), { EX: 14400 });
    return results;
}

async function handleCachedAnalyticsQuery(engine: any, analyticsQuery: AnalyticsQuery, refreshCache: boolean) {
    if (isCacheDisabled()) {
        return await engine.execute(analyticsQuery);
    }
    
    if (!client) {
        await init();
    }
    const key = getHashKey(analyticsQuery);
    const value = refreshCache ? null : await client.get(key);
    if (value) {
        return JSON.parse(value, dateTimeReviver);
    }
    const results = await engine.execute(analyticsQuery);
    client.set(key, JSON.stringify(results), { EX: 14400 });
    return results;
}

function logQueryPerformance(logger: any, queryName: string, executionTime: number, queryString: string) {
    if (executionTime > 0.5) {
        logger.info({
            executionTime: `${executionTime}s`,
            query: queryString,
        }, queryName);
    } else {
        logger.debug({
            executionTime: `${executionTime}s`,
            query: queryString,
        }, queryName);
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

async function addQuery(query: any) {
    if (isCacheDisabled()) {
        return;
    }
    
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
        if (query.priority && getPriorityValue(query.priority) > getPriorityValue(foundQuery.priority)) {
            foundQuery.hitCount *= 50;
        }
    }
}

function getPriorityValue(priority: PrioritizedQuery['priority']): number {
    switch (priority) {
        case 'critical': return 3;
        case 'high': return 2;
        case 'medium': return 1;
        case 'low': return 0;
    }
}

export async function updateQueryCache(maxConcurrency: number = 3, maxQueries: number = 300) {
    if (isCacheDisabled()) {
        return;
    }
    try {
        if (queries.length === 0) return;

        const logger = getChildLogger({}, { moduleName: 'updateQueryCache' });
        const mainStart = Date.now();

        // Skip Redis operations if cache is disabled
        if (!isCacheDisabled()) {
            const sortedQueries = queries.sort((a, b) => {
                return b.hitCount - a.hitCount;
            }).slice(0, maxQueries);

            logger.info({
                nrOfInitialQueries: queries.length,
                highestPriority: sortedQueries[0].priority,
                highestHitCount: sortedQueries[0].hitCount
            });

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

            queries = sortedQueries.map(q => ({ ...q, hitCount: 0 }));

            // Only attempt Redis operations if cache is not disabled and client exists
            if (client && !isCacheDisabled()) {
                await client.set("query-cache", JSON.stringify(sortedQueries.map(q => {
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
                })), { EX: 86400 });
            }
        }

        const mainEnd = Date.now();
        logger.info({
            message: 'Time to update query cache + new nr of queries',
            numberOfQueries: queries.length,
            duration: `${(mainEnd - mainStart) / 1000}s`
        })
    } catch (error) {
        if (!isCacheDisabled()) {
            console.error('Error updating query cache:', error);
        }
    }
}

export async function warmUpQueryCache() {
    if (isCacheDisabled()) {
        return;
    }
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
            updateQueryCache(3, 200);
        }
    } catch (error) {
        console.log('error', error);
        logger.error('Error getting stored queries:', error);
    }
}

export function queryLength() {
    if (isCacheDisabled()) {
        return 0;
    }
    return queries.length;
}

async function logSlowQuery(logData: any) {
    if (isCacheDisabled()) {
        return;
    }
    if (!client) {
        await init();
    }
    const currentLogs = await client.lRange(SLOW_QUERY_LOG_KEY, 0, -1);
    const serializedLog = JSON.stringify(logData);

    if (currentLogs.length >= 100) {
        await client.lPop(SLOW_QUERY_LOG_KEY);
    }

    await client.rPush(SLOW_QUERY_LOG_KEY, serializedLog);
}

export async function getSlowQueryLogs(): Promise<any[]> {
    if (isCacheDisabled()) {
        return [];
    }
    if (!client) {
        await init();
    }
    const logs = await client.lRange(SLOW_QUERY_LOG_KEY, 0, -1);
    return logs.map((log: any) => JSON.parse(log));
}