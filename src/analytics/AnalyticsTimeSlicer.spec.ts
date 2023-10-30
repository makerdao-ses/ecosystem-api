import { endOfYear, parseISO } from 'date-fns';
import {
    _nextSemiAnnualPeriod,
    _nextAnnualPeriod,
    _nextQuarterlyPeriod,
    _nextMonthlyPeriod,
    _nextWeeklyPeriod,
    _nextDailyPeriod,
    _nextHourlyPeriod
} from './AnalyticsTimeSlicer.js';

describe('_nextAnnualPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextAnnualPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns null if nextStart is equal to seriesEnd', () => {
        const nextStart = new Date('2021-12-31');
        const seriesEnd = new Date('2021-12-31');
        expect(_nextAnnualPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the first half of the year', () => {
        const nextStart = new Date('2021-04-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextAnnualPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('annual');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2022-01-01'));
    });

    it('returns the correct period for a start date in the second half of the year', () => {
        const nextStart = new Date('2021-09-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextAnnualPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('annual');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2022-01-01'));
    });
});

describe('_nextSemiAnnualPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextSemiAnnualPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the first half of the year', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextSemiAnnualPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('semiAnnual');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-07-01'));
    });

    it('returns the correct period for a start date in the second half of the year', () => {
        const nextStart = new Date('2021-09-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextSemiAnnualPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('semiAnnual');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(endOfYear(nextStart));
    });

    it('returns the correct period for a start date in the second half of the year that is after July 1st', () => {
        const nextStart = new Date('2021-12-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextSemiAnnualPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('semiAnnual');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-12-31T23:59:59.999Z'));
    });
});

describe('_nextQuarterlyPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextQuarterlyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns null if nextStart is equal to seriesEnd', () => {
        const nextStart = new Date('2021-12-31');
        const seriesEnd = new Date('2021-12-31');
        expect(_nextQuarterlyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the first quarter', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-04-01T00:00:00.000Z'));
    });

    it('returns the correct period for a start date in the second quarter', () => {
        const nextStart = new Date('2021-04-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-07-01T00:00:00.000Z'));
    });

    it('returns the correct period for a start date in the third quarter', () => {
        const nextStart = new Date('2021-07-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-10-01T00:00:00.000Z'));
    });

    it('returns the correct period for a start date in the fourth quarter', () => {
        const nextStart = new Date('2021-10-01');
        const seriesEnd = endOfYear(nextStart);
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-12-31T23:59:59.999Z'));
    });

    it('returns the correct period when the end date is before the end of the quarter', () => {
        const nextStart = new Date('2021-09-01');
        const seriesEnd = new Date('2021-09-30');
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(seriesEnd);
    });

    it('returns the correct period when the end date is after the end of the quarter', () => {
        const nextStart = new Date('2021-09-01');
        const seriesEnd = new Date('2021-10-01');
        const period = _nextQuarterlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('quarterly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-10-01T00:00:00.000Z'));
    });
});

describe('_nextMonthlyPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextMonthlyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns null if nextStart is equal to seriesEnd', () => {
        const nextStart = new Date('2021-12-31');
        const seriesEnd = new Date('2021-12-31');
        expect(_nextMonthlyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the first half of the month', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2021-01-31');
        const period = _nextMonthlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('monthly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-02-01'));
    });

    it('returns the correct period for a start date in the second half of the month', () => {
        const nextStart = new Date('2021-01-15');
        const seriesEnd = new Date('2021-01-31');
        const period = _nextMonthlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('monthly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-02-01'));
    });

    it('returns the correct period when the end date is before the end of the month', () => {
        const nextStart = new Date('2021-01-15');
        const seriesEnd = new Date('2021-01-20');
        const period = _nextMonthlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('monthly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-02-01'));
    });

    it('returns the correct period when the end date is the last day of the month', () => {
        const nextStart = new Date('2021-01-15');
        const seriesEnd = new Date('2021-01-31');
        const period = _nextMonthlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('monthly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-02-01'));
    });

    it('returns the correct period when the end date is after the end of the month', () => {
        const nextStart = new Date('2021-01-15');
        const seriesEnd = new Date('2021-02-15');
        const period = _nextMonthlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('monthly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-02-01'));
    });
});

describe('_nextWeeklyPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextWeeklyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns null if nextStart is equal to seriesEnd', () => {
        const nextStart = new Date('2021-12-31');
        const seriesEnd = new Date('2021-12-31');
        expect(_nextWeeklyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the middle of the week', () => {
        const nextStart = new Date('2021-09-01T00:00:00.000Z');  // Use UTC date
        const seriesEnd = new Date('2021-09-30T00:00:00.000Z');  // Use UTC date
        const period = _nextWeeklyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('weekly');
        expect(period?.start.toISOString()).toEqual(nextStart.toISOString());
        expect(period?.end.toISOString()).toEqual(new Date('2021-09-06T00:00:00.000Z').toISOString());
    });

    it('returns the correct period for a start date on a Sunday', () => {
        const nextStart = new Date('2021-09-05');
        const seriesEnd = new Date('2021-09-30');
        const period = _nextWeeklyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('weekly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-09-06'));
    });

    it('returns the correct period for a start date on a Monday', () => {
        const nextStart = new Date('2021-09-06');
        const seriesEnd = new Date('2021-09-30');
        const period = _nextWeeklyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('weekly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-09-13'));
    });

    it('returns the correct period for a start date on the last day of the series', () => {
        const nextStart = new Date('2021-09-27');
        const seriesEnd = new Date('2021-09-30');
        const period = _nextWeeklyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('weekly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(seriesEnd);
    });

    it('returns the correct period for a start date after the end of the series', () => {
        const nextStart = new Date('2021-10-01');
        const seriesEnd = new Date('2021-09-30');
        expect(_nextWeeklyPeriod(nextStart, seriesEnd)).toBeNull();
    });
});

describe('_nextDailyPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2020-12-31');
        expect(_nextDailyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns null if nextStart is equal to seriesEnd', () => {
        const nextStart = new Date('2021-12-31');
        const seriesEnd = new Date('2021-12-31');
        expect(_nextDailyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the middle of the series', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2021-01-10');
        const period = _nextDailyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('daily');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-02'));
    });

    it('returns the correct period for a start date at the end of the series', () => {
        const nextStart = new Date('2021-01-09');
        const seriesEnd = new Date('2021-01-10');
        const period = _nextDailyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('daily');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(seriesEnd);
    });

    it('returns the correct period for a start date at the beginning of the series', () => {
        const nextStart = new Date('2021-01-01');
        const seriesEnd = new Date('2021-01-10');
        const period = _nextDailyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('daily');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-02'));
    });
});

describe('_nextHourlyPeriod', () => {
    it('returns null if seriesEnd is before nextStart', () => {
        const nextStart = new Date('2021-01-01T00:00:00.000Z');
        const seriesEnd = new Date('2020-12-31T23:59:59.999Z');
        expect(_nextHourlyPeriod(nextStart, seriesEnd)).toBeNull();
    });

    it('returns the correct period for a start date in the same hour', () => {
        const nextStart = new Date('2021-01-01T00:00:00.000Z');
        const seriesEnd = new Date('2021-01-01T00:59:59.999Z');
        const period = _nextHourlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('hourly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-01T01:00:00.000Z'));
    });

    it('returns the correct period for a start date in the first hour of the day', () => {
        const nextStart = new Date('2021-01-01T00:00:00.000Z');
        const seriesEnd = new Date('2021-01-01T23:59:59.999Z');
        const period = _nextHourlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('hourly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-01T01:00:00.000Z'));
    });

    it('returns the correct period for a start date in the last hour of the day', () => {
        const nextStart = new Date('2021-01-01T23:00:00.000Z');
        const seriesEnd = new Date('2021-01-01T23:59:59.999Z');
        const period = _nextHourlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('hourly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-02T00:00:00.000Z'));
    });

    it('returns the correct period for a start date that is not at the beginning of an hour', () => {
        const nextStart = new Date('2021-01-01T00:30:00.000Z');
        const seriesEnd = new Date('2021-01-01T01:29:59.999Z');
        const period = _nextHourlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('hourly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(seriesEnd);
    });

    it('returns the correct period when seriesEnd is within the same hour', () => {
        const nextStart = new Date('2021-01-01T00:00:00.000Z');
        const seriesEnd = new Date('2021-01-01T00:30:00.000Z');
        const period = _nextHourlyPeriod(nextStart, seriesEnd);
        expect(period?.period).toBe('hourly');
        expect(period?.start).toEqual(nextStart);
        expect(period?.end).toEqual(new Date('2021-01-01T01:00:00.000Z'));
    });
});