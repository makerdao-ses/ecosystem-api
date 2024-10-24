import { AnalyticsGranularity, AnalyticsPath, AnalyticsQuery, AnalyticsQueryEngine } from "@powerhousedao/analytics-engine-core";
import { PostgresAnalyticsStore } from "@powerhousedao/analytics-engine-pg";
import { measureAnalyticsQueryPerformance } from '../../utils/logWrapper.js';
import { DateTime } from "luxon";

type queryFilter = {
  start?: Date;
  end?: Date;
  granularity?: string;
  metrics: string[];
  dimensions: [Record<string, string>];
  currency?: string;
};

type CurrencyConversion = {
  metric: string;
  sourceCurrency: string;
}

type MultiCurrencyFilter = queryFilter & {
  conversions: CurrencyConversion[];
};


export class AnalyticsModel {
  readonly engine: AnalyticsQueryEngine;

  constructor(pgConnectionString: string) {
    const store = new PostgresAnalyticsStore(pgConnectionString)
    this.engine = new AnalyticsQueryEngine(store);
  }

  public async query(filter: queryFilter) {
    if (!filter) {
      return [];
    }

    const query: AnalyticsQuery = {
      start: filter.start ? DateTime.fromJSDate(filter.start) : null,
      end: filter.end ? DateTime.fromJSDate(filter.end) : null,
      granularity: getGranularity(filter.granularity),
      metrics: filter.metrics,
      currency: getCurrency(filter.currency),
      select: {},
      lod: {},
    };

    if (filter.dimensions.length < 1) {
      throw new Error("No dimensions provided");
    } else {
      filter.dimensions.forEach(dimension => {
        query.select[dimension.name] = [AnalyticsPath.fromString(dimension.select)];
        query.lod[dimension.name] = Number(dimension.lod);
      });
    }

    return measureAnalyticsQueryPerformance('analyticsQuery', 'analyticsQuery', query, false, "high");
  }

  public async multiCurrencyQuery(filter: MultiCurrencyFilter) {
    if (!filter) {
      return [];
    }
    
    const query: AnalyticsQuery = {
      start: filter.start ? DateTime.fromJSDate(filter.start) : null,
      end: filter.end ? DateTime.fromJSDate(filter.end) : null,
      granularity: getGranularity(filter.granularity),
      metrics: filter.metrics,
      currency: getCurrency(filter.currency),
      select: {},
      lod: {},
    };

    if (filter.dimensions.length < 1) {
      throw new Error("No dimensions provided");
    } else {
      filter.dimensions.forEach(dimension => {
        query.select[dimension.name] = [AnalyticsPath.fromString(dimension.select)];
        query.lod[dimension.name] = Number(dimension.lod);
      });
    }
    return this.engine.executeMultiCurrency(query, {
      targetCurrency: query.currency,
      conversions: filter.conversions.map(c => {
        return {
          metric: c.metric,
          currency: getCurrency(c.sourceCurrency)
        }
      })
    });

  }

  public async getDimensions() {
    return await this.engine.getDimensions()
  }

  public async getCurrencies() {
    // todo: use knex inside of the analytics engine to select distinct currencies
    return ['DAI', 'FTE', 'MKR', 'USDC', 'USDP', 'USDT'];
  }
}

export default () => new AnalyticsModel(process.env.PG_CONNECTION_STRING!);

const getGranularity = (
  granularity: string | undefined,
): AnalyticsGranularity => {
  switch (granularity) {
    case "hourly": {
      return AnalyticsGranularity.Hourly;
    }
    case "daily": {
      return AnalyticsGranularity.Daily;
    }
    case "weekly": {
      return AnalyticsGranularity.Weekly;
    }
    case "monthly": {
      return AnalyticsGranularity.Monthly;
    }
    case "quarterly": {
      return AnalyticsGranularity.Quarterly;
    }
    case "semiAnnual": {
      return AnalyticsGranularity.SemiAnnual;
    }
    case "annual": {
      return AnalyticsGranularity.Annual;
    }
    case "total": {
      return AnalyticsGranularity.Total;
    }
    default: {
      return AnalyticsGranularity.Total;
    }
  }
};

const getCurrency = (currency: string | undefined) => {
  return currency ? AnalyticsPath.fromString(currency) : AnalyticsPath.fromString("");
};
