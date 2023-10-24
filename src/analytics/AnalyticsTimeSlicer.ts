import { AnalyticsGranularity } from "./AnalyticsQuery.js"


export type AnalyticsRange = {
    start: Date,
    end: Date,
    granularity: AnalyticsGranularity
}

export type AnalyticsPeriod = {
    period: string,
    start: Date,
    end: Date
}

interface AnalyticsPeriodSeries {
    start: Date,
    end: Date,
    granularity: AnalyticsGranularity,
    next(): AnalyticsPeriod | null
}

export const getPeriodSeriesArray = (range: AnalyticsRange): AnalyticsPeriod[] => {
    const result: AnalyticsPeriod[] = [];
    const series = getPeriodSeries(range);

    let next = series.next();
    while (next) {
        result.push(next);
        next = series.next();
    }

    return result;
}

export const getPeriodSeries = (range: AnalyticsRange): AnalyticsPeriodSeries => {
    return {
        ...range,
        next: _createFactoryFn(range)
    };
}

const _createFactoryFn = (range: AnalyticsRange) => {
    let current: Date|null = range.start;

    return () => {
        if (current == null) {
            return null;
        }

        let result: AnalyticsPeriod | null = null;
        switch (range.granularity) {
            case AnalyticsGranularity.Total:
                console.log('calling total', current, range)
                result = _nextTotalPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Annual:
                console.log('calling annual', current, range)
                result = _nextAnnualPeriod(current, range.end);
                break;
            case AnalyticsGranularity.SemiAnnual:
                result = _nextSemiAnnualPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Quarterly:
                result = _nextQuarterlyPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Monthly:
                result = _nextMonthlyPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Weekly:
                result = _nextWeeklyPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Daily:
                result = _nextDailyPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Hourly:
                result = _nextHourlyPeriod(current, range.end);
        }

        current = (result == null ? null : result.end);
        return result;
    };
}

const _nextTotalPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    return {
        period: 'total',
        start: nextStart,
        end: seriesEnd
    };
}

/* We look at the year and split it into these time periods:

- annual: 1 year, 01/01/2022/00:00:00 - 01/01/2023/00:00:00
- semi annual: 6 months, 01/01/2022/00:00:00 - 01/07/2022/00:00:00, 01/07/2022/00:00:00 - 31/12/2022/23:59:59




*/
// TODO: implement below functions for each period type
const _nextAnnualPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    const oneYearLater = new Date(nextStart.getFullYear() + 1, 0, 0, 0, 0, 0);
    console.log('_nextAnnualPeriod', nextStart, oneYearLater)
    return {
        period: 'annual',
        start: nextStart,
        end: oneYearLater
    };
}


const _nextSemiAnnualPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    const halfYearLater = new Date(nextStart.getFullYear() + 1, 0, 0, 0, 0, 0);

    return {
        period: 'semiAnnual',
        start: nextStart,
        end: halfYearLater
    };
}

const _nextQuarterlyPeriod = _nextTotalPeriod;
const _nextMonthlyPeriod = _nextTotalPeriod;
const _nextWeeklyPeriod = _nextTotalPeriod;
const _nextDailyPeriod = _nextTotalPeriod;
const _nextHourlyPeriod = _nextTotalPeriod;