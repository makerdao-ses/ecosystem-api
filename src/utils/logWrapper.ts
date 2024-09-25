import { getChildLogger } from "../logger.js"
import { createClient } from 'redis';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { AnalyticsQueryEngine, } from "../analytics/AnalyticsQueryEngine.js";
import { AnalyticsQuery } from "../analytics/AnalyticsQuery.js";

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

export const measureQueryPerformance = async (queryName: string, moduleName: string, knexQuery: any) => {
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now(); // Start timing
        if (!client) {
            await init()
        }

        const key = getHashKey(knexQuery);
        const value = await client.get(key);
        let results = null;
        if (value) {
            results = JSON.parse(value, dateTimeReviver);
        } else {
            results = await knexQuery;
            client.set(key, JSON.stringify(results), { EX: 120 });
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

export const measureAnalyticsQueryPerformance = async (queryName: string, moduleName: string, query: AnalyticsQuery, analyticsEngine: AnalyticsQueryEngine) => {
    const logger = getChildLogger({}, { moduleName });
    try {
        const start = Date.now(); // Start timing
        if (!client) {
            await init()
        }

        const queryString = JSON.stringify(query);

        const key = getHashKey(queryString);
        const value = await client.get(key);
        let results = null;
        if (value) {
            results = JSON.parse(value, dateTimeReviver);
        } else {
            results = await analyticsEngine.execute(query) as any;
            client.set(key, JSON.stringify(results), { EX: 120 });
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
            query: query,
        },
            queryName);
        return await analyticsEngine.execute(query) as any;
    }
}

export const getHashKey = (knexQuery: any) => {
    let retKey = '';
    if (knexQuery) {
        const text = knexQuery.toString();
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