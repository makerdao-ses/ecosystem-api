import { BudgetReportPath, BudgetReportPathSegment } from "./BudgetReportPath";

const
    // Unescaped test string
    raw = "@@abc@@@:/,\\",
    // Escaped input test string (with unnecessary escaping of the first character) 
    escI = "\\@@abc@@@\\:\\/\\,\\\\",
    // Escaped expected output string (without unnecessary escaping of the first character)
    escO = "@@abc@@@\\:\\/\\,\\\\";

it ('correctly parses paths into segments', () => {
    const paths:any = [
        ['makerdao/core-units/SES-001/*/*:discontinued', 5],
        [`${escO},${escO}:${escO},${escO}/${escO},${escO}:${escO},${escO}`, 2]
    ];

    paths.forEach((p:any) => {
        const path = BudgetReportPath.fromString(p[0]);
        expect(path.segments.length).toBe(p[1]);
        expect(path.toString()).toEqual(p[0]);
    });
});

it ('correctly parses path segment filters and groups', () => {
    const segments: any = [
        // Filters without grouping (implicit)
        ['*', '*', null, []],
        ['makerdao', 'makerdao', ['makerdao'], []],
        ['SES-001,PE-001', 'SES-001,PE-001', ['SES-001','PE-001'], []],

        // Filters without grouping (explicit)
        ['*:', '*', null, []],
        ['makerdao:', 'makerdao', ['makerdao'], []],
        ['SES-001,PE-001:', 'SES-001,PE-001', ['SES-001','PE-001'], []],

        // Filters with preserved grouping
        ['*:*', '*:*', null, null],
        ['makerdao:*', 'makerdao:*', ['makerdao'], null],
        ['SES-001,PE-001:*', 'SES-001,PE-001:*', ['SES-001','PE-001'], null],

        // Filters with 1 specific grouping
        ['*:discontinued', '*:discontinued', null, ['discontinued']],
        ['makerdao:discontinued', 'makerdao:discontinued', ['makerdao'], ['discontinued']],
        ['SES-001,PE-001:discontinued', 'SES-001,PE-001:discontinued', ['SES-001','PE-001'], ['discontinued']],

        // Filters with multiple specific grouping
        ['*:discontinued,category', '*:discontinued,category', null, ['discontinued', 'category']],
        ['makerdao:discontinued,category', 'makerdao:discontinued,category', ['makerdao'], ['discontinued', 'category']],
        ['SES-001,PE-001:discontinued,category', 'SES-001,PE-001:discontinued,category', ['SES-001','PE-001'], ['discontinued', 'category']],

        // Filters and groups with escaped characters
        ["abc\\,def", "abc\\,def", ["abc,def"], []],
        ["abc\\:def", "abc\\:def", ["abc:def"], []],
        ["abc\\/def", "abc\\/def", ["abc/def"], []],
        ["abc\\\\def", "abc\\\\def", ["abc\\def"], []],
        ["*:abc\\,def", "*:abc\\,def", null, ["abc,def"]],
        ["*:abc\\:def", "*:abc\\:def", null, ["abc:def"]],
        ["*:abc\\/def", "*:abc\\/def", null, ["abc/def"]],
        ["*:abc\\\\def", "*:abc\\\\def", null, ["abc\\def"]],
        [escI, escO, [raw], []],
        [`${escI},${escI}`, `${escO},${escO}`, [raw, raw], []],
        [`*:${escI},${escI}`, `*:${escO},${escO}`, null, [raw, raw]],
        [`${escI},${escI}:${escI},${escI}`, `${escO},${escO}:${escO},${escO}`, [raw, raw], [raw, raw]],
    ];

    segments.forEach((s: any) => {
        const segment = BudgetReportPathSegment.fromString(s[0]);
        expect(segment.toString()).toEqual(s[1]);
        expect(segment.filters).toEqual(s[2]);
        expect(segment.groups).toEqual(s[3]);
    });

    // Test constructor default args
    expect(new BudgetReportPathSegment().toString()).toEqual('*');
});