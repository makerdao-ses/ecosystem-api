import { BudgetReportPeriod, BudgetReportPeriodType } from "./BudgetReportPeriod";

it ('Correctly parses valid periods', () => {
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
        "1970", "2100", 
        "1970/Q1", "1970/Q4", "2100/Q1", "2100/Q4",
        "1970/01", "1970/03", "1970/10", "1970/12",
        "2100/01", "2100/03", "2100/10", "2100/12",
        "1970/01", "1970/03", "1970/10", "1970/12",
        "2100/01", "2100/03", "2100/10", "2100/12",
    ];

    // First two examples are years
    expect(periods[0].year).toBe(1970);
    expect(periods[1].year).toBe(2100);

    for (let i=0; i<2; i++) {
        expect(periods[i].type).toBe(BudgetReportPeriodType.Year);
    }

    // Next 4 examples are quarters
    expect(periods[2].quarter).toBe(1);
    expect(periods[3].quarter).toBe(4);

    for (let i=2; i<6; i++) {
        expect(periods[i].type).toBe(BudgetReportPeriodType.Quarter);
    }

    // Remaining examples are months
    expect(periods[6].month).toBe(1);
    expect(periods[7].month).toBe(3);
    expect(periods[8].month).toBe(10);
    expect(periods[9].month).toBe(12);

    for (let i=7; i<periods.length; i++) {
        expect(periods[i].type).toBe(BudgetReportPeriodType.Month);
    }

    // Check that they produce the expected output string
    periods.forEach((p, i) => expect(p.toString()).toBe(strings[i]));

    // Check that the output strings are correctly parsed into objects
    strings.forEach((s, i) => expect(BudgetReportPeriod.fromString(s).equals(periods[i])).toBe(true));

    // Check equality comparison to strings
    [0, 2, 9].forEach(i => expect(periods[i].equals(strings[i])).toBe(true));
});

it ('Correctly rejects invalid period strings', () => {
    const expectedErrors = [
        ["", "Invalid period string: ''"],
        ["1969", "Invalid period year: '1969'"],
        ["2101", "Invalid period year: '2101'"],
        ["1970/Q0", "Invalid period quarter: 0"],
        ["1970/00", "Invalid period month: 0"],
        ["1970/1", "Invalid period string: '1970/1'"],
        ["1970/13", "Invalid period month: 13"],
        ["1970-12", "Invalid period string: '1970-12'"]
    ];

    expectedErrors.forEach(e => expect(() => BudgetReportPeriod.fromString(e[0])).toThrowError(e[1]));
});

it ('Correctly rejects inconsistent periods', () => {
    expect(() => new BudgetReportPeriod(1970, 1, 4)).toThrowError('Period month 4 outside of quarter 1');
    expect(() => new BudgetReportPeriod(1970, 4, 9)).toThrowError('Period month 9 outside of quarter 4');
});