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
                result = _nextTotalPeriod(current, range.end);
                break;
            case AnalyticsGranularity.Annual:
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

// TODO: implement below functions for each period type
const _nextAnnualPeriod = _nextTotalPeriod;
const _nextSemiAnnualPeriod = _nextTotalPeriod;
const _nextQuarterlyPeriod = _nextTotalPeriod;
const _nextMonthlyPeriod = _nextTotalPeriod;
const _nextWeeklyPeriod = _nextTotalPeriod;
const _nextDailyPeriod = _nextTotalPeriod;
const _nextHourlyPeriod = _nextTotalPeriod;