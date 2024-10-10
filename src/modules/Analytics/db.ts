import { Knex } from "knex";

import { AnalyticsQueryEngine } from "../../analytics/AnalyticsQueryEngine.js";
import { AnalyticsStore } from "../../analytics/AnalyticsStore.js";
import {
  AnalyticsGranularity,
  AnalyticsQuery,
} from "../../analytics/AnalyticsQuery.js";
import { AnalyticsPath } from "../../analytics/AnalyticsPath.js";
import { measureAnalyticsQueryPerformance } from '../../utils/logWrapper.js';

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
  engine: AnalyticsQueryEngine;
  store: AnalyticsStore;
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
    this.store = new AnalyticsStore(knex);
    this.engine = new AnalyticsQueryEngine(this.store);
  }

  public async query(filter: queryFilter) {

    if (!filter) {
      return [];
    }
    const metrics = await this.getMetrics();
    const filteredMetrics = filter.metrics.filter(metric => metrics.includes(metric));
    if (filteredMetrics.length < 1) {
      throw new Error("No valid metrics provided, make sure to use metrics from this list: " + metrics.join(", "));
    }
    const query: AnalyticsQuery = {
      start: filter.start ? new Date(filter.start) : null,
      end: filter.end ? new Date(filter.end) : null,
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
    return measureAnalyticsQueryPerformance('analyticsQuery', 'analyticsQuery', query, false);

  }

  public async multiCurrencyQuery(filter: MultiCurrencyFilter) {

    if (!filter) {
      return [];
    }
    const metrics = await this.getMetrics();
    const filteredMetrics = filter.metrics.filter(metric => metrics.includes(metric));
    if (filteredMetrics.length < 1) {
      throw new Error("No valid metrics provided, make sure to use metrics from this list: " + metrics.join(", "));
    }
    const query: AnalyticsQuery = {
      start: filter.start ? new Date(filter.start) : null,
      end: filter.end ? new Date(filter.end) : null,
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

  public async test() {
    return await this.engine.test();
  }

  public async getDimensions() {
    return await this.engine.getDimensions()
  }

  public async getMetrics() {
    return await this.engine.getMetrics()
  }

  public async getCurrencies() {
    return await this.engine.getCurrencies()
  }
}

export default (knex: Knex) => new AnalyticsModel(knex);

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
