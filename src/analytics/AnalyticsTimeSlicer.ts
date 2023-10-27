import { AnalyticsGranularity } from "./AnalyticsQuery.js"
import { addMonths, endOfYear, endOfQuarter, isAfter, startOfMonth, format } from 'date-fns';

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
    console.log('getPeriodSeriesArray', range)
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
    let current: Date | null = range.start;

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
                console.log('calling semiAnnual', current, range)
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
export const _nextAnnualPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    const oneYearLater = new Date(`${nextStart.getFullYear() + 1}-01-01T00:00:00.000Z`)
    return {
        period: 'annual',
        start: nextStart,
        end: oneYearLater
    };
}


export const _nextSemiAnnualPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    // setting half year mark
    const july1st = (year: number): Date => {
        return new Date(`${year}-07-01T00:00:00.000Z`)
    };
    const midYear = july1st(nextStart.getFullYear());

    const startDate = new Date(nextStart);
    const sixMonthsLater = addMonths(startDate, 6);

    let endDate: Date;
    if (sixMonthsLater.getFullYear() > startDate.getFullYear()) {
        endDate = endOfYear(startDate);
    } else {
        endDate = addMonths(startDate, 6);
        isAfter(endDate, midYear) ? endDate = midYear : endDate = endOfYear(startDate);
    }

    return {
        period: 'semiAnnual',
        start: nextStart,
        end: endDate
    };
}

export const _nextQuarterlyPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    const startDate = new Date(nextStart);
    const nextQuarterStart = new Date(startDate);
    const currentQuarter = Math.floor(nextQuarterStart.getMonth() / 3) + 1;
    nextQuarterStart.setMonth((currentQuarter * 3) % 12);
    nextQuarterStart.setFullYear(nextQuarterStart.getFullYear() + Math.floor(currentQuarter / 4));

    let endDate: Date;
    if (nextQuarterStart.getFullYear() > startDate.getFullYear()) {
        endDate = endOfYear(startDate);
    } else {
        endDate = endOfQuarter(addMonths(nextQuarterStart, -1));
    }

    if (isAfter(endDate, seriesEnd)) {
        endDate = seriesEnd;
    }


    return {
        period: 'quarterly',
        start: nextStart,
        end: endDate
    };
}
export const _nextMonthlyPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    return {
        period: 'montly',
        start: nextStart,
        end: seriesEnd
    };
}
export const _nextWeeklyPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    return {
        period: 'weekly',
        start: nextStart,
        end: seriesEnd
    };
}
export const _nextDailyPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    return {
        period: 'daily',
        start: nextStart,
        end: seriesEnd
    };
}
export const _nextHourlyPeriod = (nextStart: Date, seriesEnd: Date): AnalyticsPeriod | null => {
    if (seriesEnd.getTime() <= nextStart.getTime()) {
        return null;
    }

    return {
        period: 'hourly',
        start: nextStart,
        end: seriesEnd
    };
}