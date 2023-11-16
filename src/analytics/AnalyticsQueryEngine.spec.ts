import { Knex } from "knex";
import initKnex from "../initKnex.js";
import { AnalyticsPath } from "./AnalyticsPath";
import {
  AnalyticsGranularity,
  AnalyticsMetric,
  AnalyticsQuery,
} from "./AnalyticsQuery";
import { AnalyticsQueryEngine } from "./AnalyticsQueryEngine";
import { AnalyticsStore } from "./AnalyticsStore";
import {
  GroupedPeriodResult,
  GroupedPeriodResults,
} from "./AnalyticsDiscretizer.js";

const knex = initKnex();

// Set to false during testing to see the resulting records in db
const CLEAN_UP_DB = false;
const TEST_SOURCE = AnalyticsPath.fromString(
  "test/analytics/AnalyticsQueryEngine.spec",
);

const store = new AnalyticsStore(knex);
const engine = new AnalyticsQueryEngine(store);

beforeAll(async () => {
  await store.clearSeriesBySource(TEST_SOURCE);

  // budget
  await store.addSeriesValues([
    {
      start: new Date(2021, 0, 1),
      source: TEST_SOURCE,
      value: 10000,
      unit: "DAI",
      params: {},
      metric: AnalyticsMetric.Budget,
      dimensions: {
        budget: AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        category: AnalyticsPath.fromString(
          "atlas/headcount/CompensationAndBenefits/FrontEndEngineering",
        ),
        project: TEST_SOURCE,
      },
    },
    {
      start: new Date(2022, 0, 1),
      source: TEST_SOURCE,
      value: 10000,
      unit: "DAI",
      metric: AnalyticsMetric.Budget,
      dimensions: {
        budget: AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        category: AnalyticsPath.fromString(
          "atlas/headcount/CompensationAndBenefits/FrontEndEngineering",
        ),
        project: TEST_SOURCE,
      },
    },
    {
      start: new Date(2023, 0, 1),
      source: TEST_SOURCE,
      value: 15000,
      unit: "DAI",
      metric: AnalyticsMetric.Budget,
      dimensions: {
        budget: AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        category: AnalyticsPath.fromString(
          "atlas/headcount/CompensationAndBenefits/SmartContractEngineering",
        ),
        project: TEST_SOURCE,
      },
    },
    {
      start: new Date(2022, 0, 1),
      end: new Date(2023, 0, 1),
      source: TEST_SOURCE,
      value: 240,
      unit: "MKR",
      metric: AnalyticsMetric.Budget,
      fn: "DssVest",
      params: {
        cliff: new Date(2023, 11, 1),
      },
      dimensions: {
        budget: AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        category: AnalyticsPath.fromString(
          "atlas/headcount/CompensationAndBenefits/SmartContractEngineering",
        ),
        project: TEST_SOURCE,
      },
    },
    {
      start: new Date(2023, 0, 1),
      end: new Date(2024, 0, 1),
      source: TEST_SOURCE,
      value: 240,
      unit: "MKR",
      metric: AnalyticsMetric.Budget,
      fn: "DssVest",
      params: {
        cliff: new Date(2023, 11, 1),
      },
      dimensions: {
        budget: AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        category: AnalyticsPath.fromString(
          "atlas/headcount/CompensationAndBenefits/SmartContractEngineering",
        ),
        project: TEST_SOURCE,
      },
    },
  ]);

  // add fte's
  await store.addSeriesValues([
    {
      start: new Date(2023, 0, 1),
      source: TEST_SOURCE,
      value: 5.8,
      metric: AnalyticsMetric.FTEs,
      dimensions: {
        project: TEST_SOURCE,
      },
    },
    {
      start: new Date(2023, 2, 1),
      source: TEST_SOURCE,
      value: -0.8,
      metric: AnalyticsMetric.FTEs,
      dimensions: {
        project: TEST_SOURCE,
      },
    },
  ]);
});

afterAll(async () => {
  if (CLEAN_UP_DB) {
    await new AnalyticsStore(knex).clearSeriesBySource(TEST_SOURCE, true);
  }

  knex.destroy();
});

it("should query records", async () => {
  const store = new AnalyticsStore(knex);
  const engine = new AnalyticsQueryEngine(store);

  const query: AnalyticsQuery = {
    start: new Date("2022-09-01 00:00:00Z+0"),
    end: null,
    granularity: AnalyticsGranularity.Total,
    metrics: [
      AnalyticsMetric.Budget,
      AnalyticsMetric.Actuals,
      AnalyticsMetric.FTEs,
    ],
    currency: AnalyticsPath.fromString("DAI,MKR"),
    select: {
      budget: [
        AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
        AnalyticsPath.fromString("atlas/legacy/core-units/PE-001"),
      ],
      category: [AnalyticsPath.fromString("atlas/headcount")],
      project: [TEST_SOURCE],
    },
    lod: {
      budget: 3,
      category: 2,
      project: 2,
    },
  };

  const result = await engine.execute(query);

  expect(result.length).toBe(1);
  expect(result[0].rows.map((r) => r.unit)).toEqual(["DAI", "MKR"]);
  expect(result[0].rows.map((r) => r.dimensions.budget.toString())).toEqual([
    "atlas/legacy/core-units",
    "atlas/legacy/core-units",
  ]);
});

describe("totals of different granularities", () => {
  let total = 0;

  it("should return one row on total granularity", async () => {
    const result = await getResultsForGranularity(AnalyticsGranularity.Total);
    expect(result.length).toBe(1);
    expect(result[0].rows[0].sum).toBe(25000);
    expect(result[0].period).toBe("total");
    total = result[0].rows[0].sum;
  });

  it("should correct sum up on annual granularity", async () => {
    const result = await getResultsForGranularity(AnalyticsGranularity.Annual);
    expect(result.length).toBe(2);
    expect(getTotalSumOfResults(result)).toBe(total);
    expect(result[result.length - 1].rows[0].sum).toBe(25000);
    expect(result[result.length - 1].period).toBe("2023");
  });

  it("should correct sum up on semi annual granularity", async () => {
    const result = await getResultsForGranularity(
      AnalyticsGranularity.SemiAnnual,
    );
    expect(result.length).toBe(3);
    expect(getTotalSumOfResults(result)).toBe(total);
    expect(result[result.length - 1].rows[0].sum).toBe(25000);
    expect(result[result.length - 1].period).toBe("2023/H1");
  });

  it("should correct sum up on monthly granularity", async () => {
    const result = await getResultsForGranularity(AnalyticsGranularity.Monthly);
    expect(result.length).toBe(17);
    expect(getTotalSumOfResults(result)).toBe(total);
    expect(result[result.length - 1].rows[0].sum).toBe(25000);
    expect(result[0].period).toBe("2022/1");
  });

  it("should correct sum up on weekly granularity", async () => {
    const result = await getResultsForGranularity(AnalyticsGranularity.Weekly);
    expect(result.length).toBe(75);
    expect(getTotalSumOfResults(result)).toBe(total);
    expect(result[result.length - 1].rows[0].sum).toBe(25000);
    expect(result[0].period).toBe("2021/W52");
  });

  it("should correct sum up on daily granularity", async () => {
    const start = new Date("2021-12-30 00:00:00Z+0");
    const end = new Date("2022-01-05 00:00:00Z+0");
    const result = await getResultsForGranularity(
      AnalyticsGranularity.Daily,
      start,
      end,
    );
    expect(result.length).toBe(6);
    expect(result[result.length - 1].rows[0].sum).toBe(10000);
    expect(result[0].period).toBe("2021/12/30");
  });

  it("should correct sum up on hourly granularity", async () => {
    const start = new Date("2021-12-31 23:00:00Z+0");
    const end = new Date("2022-01-01 05:00:00Z+0");
    const result = await getResultsForGranularity(
      AnalyticsGranularity.Hourly,
      start,
      end,
    );
    expect(result.length).toBe(6);
    expect(result[result.length - 1].rows[0].sum).toBe(10000);
    expect(result[0].period).toBe("2021/12/31/23");
  });

  const getResultsForGranularity = async (
    granularity: AnalyticsGranularity = AnalyticsGranularity.Annual,
    start: Date = new Date("2022-01-01 00:00:00Z+0"),
    end: Date = new Date("2023-06-01 00:00:00Z+0"),
  ): Promise<GroupedPeriodResults> => {
    const query: AnalyticsQuery = {
      start,
      end,
      granularity,
      metrics: [AnalyticsMetric.Budget, AnalyticsMetric.Actuals],
      currency: AnalyticsPath.fromString("DAI"),
      select: {
        budget: [AnalyticsPath.fromString("atlas/legacy/core-units/PE-001")],
        category: [AnalyticsPath.fromString("atlas/headcount")],
        project: [TEST_SOURCE],
      },
      lod: {
        budget: 3,
        category: 2,
        project: 2,
      },
    };

    const result = await engine.execute(query);
    return result;
  };

  const getTotalSumOfResults = (result: GroupedPeriodResult[]) => {
    let sum = 0;
    result.forEach((result) => {
      result.rows.forEach((row) => {
        sum += row.value;
      });
    });

    return sum;
  };
});

describe("dss vesting", () => {
  it("should return values linear proportional to the time passed", async () => {
    const start = new Date(2023, 0, 1);
    const end = new Date(2024, 0, 1);
    const query: AnalyticsQuery = {
      start,
      end,
      granularity: AnalyticsGranularity.Monthly,
      metrics: [AnalyticsMetric.Budget, AnalyticsMetric.Actuals],
      currency: AnalyticsPath.fromString("MKR"),
      select: {
        budget: [AnalyticsPath.fromString("atlas/legacy/core-units/PE-001")],
        category: [
          AnalyticsPath.fromString(
            "atlas/headcount/CompensationAndBenefits/SmartContractEngineering",
          ),
        ],
        project: [TEST_SOURCE],
      },
      lod: {
        budget: 3,
        category: 2,
        project: 2,
      },
    };

    const result = await engine.execute(query);
    expect(result.length).toBe(12);
    const january = result[0].rows[0];
    const november = result[10].rows[0];
    const december = result[11].rows[0];

    expect(january.value).toBe(0);
    expect(november.value.toFixed(0)).toBe("220"); // vest everything until cliff date
    expect(december.value.toFixed(0)).toBe("20"); // vest normal amount
  });
});
