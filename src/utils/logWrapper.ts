import { getChildLogger } from "../logger.js"
import memize from 'memize';

export const measureQueryPerformance = async (queryName: string, moduleName: string, knexQuery: any) => {
    const logger = getChildLogger({}, { moduleName });

    const start = Date.now(); // Start timing
    const result = await knexQuery;
    const end = Date.now(); // End timing
    logger.info({
        executionTime: `${(end - start) / 1000}s`,
        query: knexQuery.toString(),
    },
        queryName);

    return result
};

// export const measureQueryPerformance = memize(async function (queryName: string, moduleName: string, knexQuery: any) {
//     const logger = getChildLogger({}, { moduleName });

//     const start = Date.now(); // Start timing
//     const result = await knexQuery;
//     const end = Date.now(); // End timing
//     logger.info({
//         executionTime: `${(end - start) / 1000}s`,
//         query: knexQuery.toString(),
//     },
//         queryName);

//     return result
// });

