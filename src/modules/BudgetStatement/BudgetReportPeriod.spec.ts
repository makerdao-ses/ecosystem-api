import {
  BudgetReportPeriod,
  BudgetReportPeriodType,
} from "./BudgetReportPeriod";

it("Correctly generates the range between periods with the same granularity", () => {
  const validRanges = [
    [["2022", "2022"], ["2022"]],
    [
      ["2022", "2023"],
      ["2022", "2023"],
    ],
    [
      ["2022", "2026"],
      ["2022", "2023", "2024", "2025", "2026"],
    ],
    [
      ["2026", "2022"],
      ["2022", "2023", "2024", "2025", "2026"],
    ],
    [["2022/Q2", "2022/Q2"], ["2022/Q2"]],
    [
      ["2022/Q2", "2023/Q1"],
      ["2022/Q2", "2022/Q3", "2022/Q4", "2023/Q1"],
    ],
    [
      ["2023/Q1", "2022/Q2"],
      ["2022/Q2", "2022/Q3", "2022/Q4", "2023/Q1"],
    ],
    [
      ["2023/09", "2024/02"],
      ["2023/09", "2023/10", "2023/11", "2023/12", "2024/01", "2024/02"],
    ],
  ];

  validRanges.forEach((r) => {
    const range = BudgetReportPeriod.fillRange(r[0][0], r[0][1]).map((o) =>
      o.toString(),
    );
    expect(range).toEqual(r[1]);
  });

  expect(() =>
    BudgetReportPeriod.fillRange(
      BudgetReportPeriod.fromString("2022/Q3"),
      BudgetReportPeriod.fromString("2023"),
    ),
  ).toThrowError(
    "Cannot fill range of different type periods 2022/Q3 and 2023.",
  );
});

it("Correctly performs period calculations", () => {
  const examples = [
    ["2022", "2022/01", "2022/12", "2021", "2023"],
    ["2022/Q1", "2022/01", "2022/03", "2021/Q4", "2022/Q2"],
    ["2022/Q4", "2022/10", "2022/12", "2022/Q3", "2023/Q1"],
    ["2022/01", "2022/01", "2022/01", "2021/12", "2022/02"],
    ["2022/12", "2022/12", "2022/12", "2022/11", "2023/01"],
  ];

  examples.forEach((e) => {
    const p = BudgetReportPeriod.fromString(e[0]);
    expect(p.firstMonth().toString()).toEqual(e[1]);
    expect(p.lastMonth().toString()).toEqual(e[2]);
    expect(p.previousPeriod().toString()).toEqual(e[3]);
    expect(p.nextPeriod().toString()).toEqual(e[4]);
    expect(p.previousPeriod().comesAfter(p)).toBe(false);
    expect(p.previousPeriod().comesBefore(p)).toBe(true);
    expect(p.nextPeriod().comesAfter(p)).toBe(true);
    expect(p.nextPeriod().comesBefore(p)).toBe(false);
  });
});

it("Correctly compares periods of different granularity", () => {
  const timeline = [
    ["2022/01"],
    ["2022/02", "2022/02"],
    ["2022/Q2", "2022/04"],
    ["2022/Q3", "2022/07"],
    ["2022/Q4", "2022/10"],
    ["2023", "2023/01"],
    ["2024/Q1", "2024/01"],
    ["2024/04", "2024/04"],
  ];

  for (let i = 1; i < timeline.length; i++) {
    const p = BudgetReportPeriod.fromString(timeline[i][0]);
    expect(
      p.comesAfter(BudgetReportPeriod.fromString(timeline[i - 1][0])),
    ).toBe(true);
    expect(p.comesAfter(BudgetReportPeriod.fromString(timeline[i][1]))).toBe(
      false,
    );
  }

  const containers = [
    [["2022"]],
    [
      ["2022/Q1", "2022/Q2", "2022/Q4"],
      ["2021/Q4", "2023/Q1"],
    ],
    [
      ["2022/01", "2022/02", "2022/03"],
      ["2021/12", "2022/04"],
    ],
  ];

  for (let i = 1; i < containers.length; i++) {
    const p = BudgetReportPeriod.fromString(containers[i - 1][0][0]);
    expect(p.contains(p)).toBe(true);

    containers[i][0].forEach((contained) => {
      expect(p.contains(BudgetReportPeriod.fromString(contained))).toBe(true);
    });

    containers[i][1].forEach((notContained) => {
      expect(p.contains(BudgetReportPeriod.fromString(notContained))).toBe(
        false,
      );
    });
  }
});

it("Correctly normalizes out of band y/q/m numbers", () => {
  const quarterExamples = [
    [2022, 1, "2022/Q1"],
    [2022, 4, "2022/Q4"],
    [2022, 5, "2023/Q1"],
    [2022, 10, "2024/Q2"],
    [2022, 0, "2021/Q4"],
    [2022, -1, "2021/Q3"],
    [2022, -5, "2020/Q3"],
  ];

  quarterExamples.forEach((e: any) => {
    const [y, q, m] = BudgetReportPeriod.normalizeQuarters(e[0], e[1]);
    const period = new BudgetReportPeriod(y, q, m || undefined);
    expect(period.toString()).toEqual(e[2]);
  });

  const monthExamples = [
    [2022, 1, "2022/01"],
    [2022, 12, "2022/12"],
    [2022, 13, "2023/01"],
    [2022, 26, "2024/02"],
    [2022, 0, "2021/12"],
    [2022, -1, "2021/11"],
    [2022, -13, "2020/11"],
  ];

  monthExamples.forEach((e: any) => {
    const [y, q, m] = BudgetReportPeriod.normalizeMonths(e[0], e[1]);
    const period = new BudgetReportPeriod(y, q || undefined, m || undefined);
    expect(period.toString()).toEqual(e[2]);
  });
});

it("Correctly parses valid periods", () => {
  const periods = [
    new BudgetReportPeriod(1970),
    new BudgetReportPeriod(2100),
    new BudgetReportPeriod(1970, 1),
    new BudgetReportPeriod(1970, 4),
    new BudgetReportPeriod(2100, 1),
    new BudgetReportPeriod(2100, 4),
    new BudgetReportPeriod(1970, 1, 1),
    new BudgetReportPeriod(1970, 1, 3),
    new BudgetReportPeriod(1970, 4, 10),
    new BudgetReportPeriod(1970, 4, 12),
    new BudgetReportPeriod(2100, 1, 1),
    new BudgetReportPeriod(2100, 1, 3),
    new BudgetReportPeriod(2100, 4, 10),
    new BudgetReportPeriod(2100, 4, 12),
    new BudgetReportPeriod(1970, undefined, 1),
    new BudgetReportPeriod(1970, undefined, 3),
    new BudgetReportPeriod(1970, undefined, 10),
    new BudgetReportPeriod(1970, undefined, 12),
    new BudgetReportPeriod(2100, undefined, 1),
    new BudgetReportPeriod(2100, undefined, 3),
    new BudgetReportPeriod(2100, undefined, 10),
    new BudgetReportPeriod(2100, undefined, 12),
  ];

  const strings = [
    "1970",
    "2100",
    "1970/Q1",
    "1970/Q4",
    "2100/Q1",
    "2100/Q4",
    "1970/01",
    "1970/03",
    "1970/10",
    "1970/12",
    "2100/01",
    "2100/03",
    "2100/10",
    "2100/12",
    "1970/01",
    "1970/03",
    "1970/10",
    "1970/12",
    "2100/01",
    "2100/03",
    "2100/10",
    "2100/12",
  ];

  const sqlStrings = [
    "1970-01-01",
    "2100-01-01",
    "1970-01-01",
    "1970-10-01",
    "2100-01-01",
    "2100-10-01",
    "1970-01-01",
    "1970-03-01",
    "1970-10-01",
    "1970-12-01",
    "2100-01-01",
    "2100-03-01",
    "2100-10-01",
    "2100-12-01",
    "1970-01-01",
    "1970-03-01",
    "1970-10-01",
    "1970-12-01",
    "2100-01-01",
    "2100-03-01",
    "2100-10-01",
    "2100-12-01",
  ];

  // First two examples are years
  expect(periods[0].year).toBe(1970);
  expect(periods[1].year).toBe(2100);

  for (let i = 0; i < 2; i++) {
    expect(periods[i].type).toBe(BudgetReportPeriodType.Year);
  }

  // Next 4 examples are quarters
  expect(periods[2].quarter).toBe(1);
  expect(periods[3].quarter).toBe(4);

  for (let i = 2; i < 6; i++) {
    expect(periods[i].type).toBe(BudgetReportPeriodType.Quarter);
  }

  // Remaining examples are months
  expect(periods[6].month).toBe(1);
  expect(periods[7].month).toBe(3);
  expect(periods[8].month).toBe(10);
  expect(periods[9].month).toBe(12);

  for (let i = 7; i < periods.length; i++) {
    expect(periods[i].type).toBe(BudgetReportPeriodType.Month);
  }

  // Check that they produce the expected output string
  periods.forEach((p, i) => {
    expect(p.toString()).toBe(strings[i]);
    expect(p.startAsSqlDate()).toBe(sqlStrings[i]);
  });

  // Check that the output strings are correctly parsed into objects
  strings.forEach((s, i) =>
    expect(BudgetReportPeriod.fromString(s).equals(periods[i])).toBe(true),
  );

  // Check equality comparison to strings
  [0, 2, 9].forEach((i) => expect(periods[i].equals(strings[i])).toBe(true));
});

it("Correctly rejects invalid period strings", () => {
  const expectedErrors = [
    ["", "Invalid period string: ''"],
    ["1969", "Invalid period year: '1969'"],
    ["2101", "Invalid period year: '2101'"],
    ["1970/Q0", "Invalid period quarter: 0"],
    ["1970/00", "Invalid period month: 0"],
    ["1970/1", "Invalid period string: '1970/1'"],
    ["1970/13", "Invalid period month: 13"],
    ["1970-12", "Invalid period string: '1970-12'"],
  ];

  expectedErrors.forEach((e) =>
    expect(() => BudgetReportPeriod.fromString(e[0])).toThrowError(e[1]),
  );
});

it("Correctly rejects inconsistent periods", () => {
  expect(() => new BudgetReportPeriod(1970, 1, 4)).toThrowError(
    "Period month 4 outside of quarter 1",
  );
  expect(() => new BudgetReportPeriod(1970, 4, 9)).toThrowError(
    "Period month 9 outside of quarter 4",
  );
});
