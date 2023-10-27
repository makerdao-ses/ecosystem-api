import { endOfYear, parseISO } from 'date-fns';
import { _nextSemiAnnualPeriod } from './AnalyticsTimeSlicer.js';

describe('_nextSemiAnnualPeriod', () => {
  it('returns null if seriesEnd is before nextStart', () => {
    const nextStart = new Date('2021-01-01');
    const seriesEnd = new Date('2020-12-31');
    expect(_nextSemiAnnualPeriod(nextStart, seriesEnd)).toBeNull();
  });

  it('returns the correct period for a start date in the first half of the year', () => {
    const nextStart = new Date('2021-04-01');
    const seriesEnd = endOfYear(nextStart);
    const period = _nextSemiAnnualPeriod(nextStart, seriesEnd);
    console.log(period)
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