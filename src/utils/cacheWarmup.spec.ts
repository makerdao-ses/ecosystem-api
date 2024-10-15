import initApi from "../initApi.js";
import { CoreUnitModel } from "../modules/CoreUnit/db.js";
import { AnalyticsModel } from "../modules/Analytics/db.js";
import {
    updateQueryCache,
    measureAnalyticsQueryPerformance,
    measureQueryPerformance,
    queryLength,
} from "./logWrapper.js";

let authModel: CoreUnitModel;
let analyticsModel: AnalyticsModel;

beforeAll(async () => {
    try {
        const apiModules = await initApi({
            CoreUnit: { enabled: true },
            Analytics: { enabled: true },
        });
        authModel = apiModules.datasource.module<CoreUnitModel>("CoreUnit");
        analyticsModel = apiModules.datasource.module<AnalyticsModel>("Analytics");
    } catch (error) {
        console.log(' error', error)
    }
});

afterAll(async () => {
    await authModel.knex.destroy();
});

describe("cacheWarmup", () => {
    it("should cache db requests", async () => {
        await Promise.all(Array.from(Array(10).keys()).map((index) => {
            const query = authModel.getCoreUnits({ filter: { id: index + 1 } });
            return measureQueryPerformance('should cache db requests', "cacheWarmup test", query);
        }))
        expect(queryLength()).toEqual(10);
    });

    it("should update cache with hitcount 10 and remove unused queries", async () => {
        await updateQueryCache(1, 5);
        expect(queryLength()).toEqual(5);
    });

    // it("should cache analytics requests", async () => {
    //     try {
    //         await Promise.all(Array.from(Array(10).keys()).map((index) => {
    //             const filter = {
    //                 start: "2020/01",
    //                 end: "2100/01",
    //                 granularity: 'total',
    //                 metrics: ['Actuals'],
    //                 dimensions: [
    //                     { name: 'report', select: `atlas/${"CoreUnit"}/${index + 1}/${'2024/01'}`, lod: 5 }
    //                 ],
    //                 currency: 'DAI'
    //             }
    //             // @ts-ignore
    //             return analyticsModel.query(filter);
    //         }))
    //         expect(queryLength()).toEqual(10);
    //     } catch (error) {
    //         console.log(' error', error)
    //     }
    // });

});
