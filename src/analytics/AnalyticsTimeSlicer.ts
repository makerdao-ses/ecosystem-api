import { AnalyticsGranularity } from "./AnalyticsQuery.js";
import {
  addMonths,
  endOfYear,
  startOfMonth,
  isAfter,
  startOfWeek,
  addWeeks,
  isSameDay,
  addHours,
  addSeconds,
} from "date-fns";

export type AnalyticsRange = {
  start: Date;
  end: Date;
  granularity: AnalyticsGranularity;
};

export type AnalyticsPeriod = {
  period: string;
  start: Date;
  end: Date;
};

interface AnalyticsPeriodSeries {
  start: Date;
  end: Date;
  granularity: AnalyticsGranularity;
  next(): AnalyticsPeriod | null;
}

export const getPeriodSeriesArray = (
  range: AnalyticsRange,
): AnalyticsPeriod[] => {
  const result: AnalyticsPeriod[] = [];
  const series = getPeriodSeries(range);

  let next = series.next();
  while (next) {
    result.push(next);
    next = series.next();
  }

  return result;
};

export const getPeriodSeries = (
  range: AnalyticsRange,
): AnalyticsPeriodSeries => {
  return {
    ...range,
    next: _createFactoryFn(range),
  };
};

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

    current = result == null ? null : new Date(result.end.getTime() + 1); // Update current to start of next period
    return result;
  };
};

const _nextTotalPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  return {
    period: "total",
    start: nextStart,
    end: seriesEnd,
  };
};

export const _nextAnnualPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  const oneYearLater = new Date(
    `${nextStart.getFullYear() + 1}-01-01T00:00:00.000Z`,
  );
  return {
    period: "annual",
    start: nextStart,
    end: oneYearLater,
  };
};

export const _nextSemiAnnualPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  const midYear = new Date(`${nextStart.getFullYear()}-07-01T00:00:00.000Z`);
  const endYear = new Date(
    `${nextStart.getFullYear() + 1}-01-01T00:00:00.000Z`,
  );

  let endDate: Date;
  if (isAfter(midYear, nextStart)) {
    endDate = midYear;
  } else {
    endDate = endYear;
  }

  if (isAfter(endDate, seriesEnd)) {
    endDate = seriesEnd;
  }

  return {
    period: "semiAnnual",
    start: nextStart,
    end: endDate,
  };
};

export const _nextQuarterlyPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  let endDate: Date;
  const startMonth = nextStart.getMonth();

  if (startMonth < 3) {
    endDate = new Date(`${nextStart.getFullYear()}-04-01T00:00:00.000Z`);
  } else if (startMonth < 6) {
    endDate = new Date(`${nextStart.getFullYear()}-07-01T00:00:00.000Z`);
  } else if (startMonth < 9) {
    endDate = new Date(`${nextStart.getFullYear()}-10-01T00:00:00.000Z`);
  } else {
    endDate = new Date(`${nextStart.getFullYear() + 1}-01-01T00:00:00.000Z`);
  }

  if (isAfter(endDate, seriesEnd)) {
    endDate = seriesEnd;
  }

  return {
    period: "quarterly",
    start: nextStart,
    end: endDate,
  };
};
export const _nextMonthlyPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  // Get the first day of the next month
  let endDate = startOfMonth(addMonths(nextStart, 1));

  // If the end date is after the series end, then use the series end as the end date
  if (isAfter(endDate, seriesEnd)) {
    if (nextStart.getMonth() === seriesEnd.getMonth()) {
      endDate;
    } else {
      endDate = seriesEnd;
    }
  }

  // Otherwise, return the end date as the first day of the next month
  return {
    period: "monthly",
    start: nextStart,
    end: endDate,
  };
};

export const _nextWeeklyPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  // Calculate the start of the next week (Monday) in UTC
  const nextWeekStartUTC = startOfWeek(addWeeks(nextStart, 1), {
    weekStartsOn: 1,
  });

  // If the calculated next week start is later or equal to the series end date, return the series end
  if (
    isAfter(nextWeekStartUTC, seriesEnd) ||
    isSameDay(nextWeekStartUTC, seriesEnd)
  ) {
    return {
      period: "weekly",
      start: nextStart,
      end: seriesEnd,
    };
  }

  return {
    period: "weekly",
    start: nextStart,
    end: nextWeekStartUTC,
  };
};

export const _nextDailyPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  // Set the end date to the start of the next day
  const endDate = new Date(
    nextStart.getFullYear(),
    nextStart.getMonth(),
    nextStart.getDate() + 1,
    0,
    0,
    0,
    0,
  );

  if (isAfter(endDate, seriesEnd)) {
    endDate.setTime(seriesEnd.getTime());
  }

  return {
    period: "daily",
    start: nextStart,
    end: endDate,
  };
};

export const _nextHourlyPeriod = (
  nextStart: Date,
  seriesEnd: Date,
): AnalyticsPeriod | null => {
  if (seriesEnd.getTime() <= nextStart.getTime()) {
    return null;
  }

  // Define a counter outside the function to keep track of the hour offset
  let hourOffset = 0;
  const chunkSize = 24; // Process one day's worth of hours at a time

  // Reset hourOffset if nextStart has changed (i.e., a new day has started)
  if (nextStart.getHours() === 0) {
    hourOffset = 0;
  }

  const startDate = new Date(nextStart.getTime() + hourOffset * 60 * 60 * 1000); // Increment by hourOffset hours
  let endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // One hour later

  if (isAfter(endDate, seriesEnd)) {
    if (nextStart.getHours() === seriesEnd.getHours()) {
      endDate;
    } else {
      endDate = seriesEnd;
    }
  }

  hourOffset += 1;
  if (hourOffset >= chunkSize) {
    hourOffset = 0; // Reset hourOffset after processing a chunk
  }

  return {
    period: "hourly",
    start: startDate,
    end: endDate,
  };
};
