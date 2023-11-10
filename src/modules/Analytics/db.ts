import { Knex } from "knex";

import { AnalyticsQueryEngine } from "../../analytics/AnalyticsQueryEngine.js";
import { AnalyticsStore } from "../../analytics/AnalyticsStore.js";
import {
  AnalyticsGranularity,
  AnalyticsMetric,
  AnalyticsQuery,
} from "../../analytics/AnalyticsQuery.js";
import { AnalyticsPath } from "../../analytics/AnalyticsPath.js";

type queryFilter = {
  start?: Date;
  end?: Date;
  granularity?: string;
  metrics?: AnalyticsMetric[];
  dimensions: Record<string, Record<string, string>>;
  currency?: string;
};

export class AnalyticsModel {
  engine: AnalyticsQueryEngine;

  constructor(knex: Knex) {
    const store = new AnalyticsStore(knex);
    this.engine = new AnalyticsQueryEngine(store);
  }

  public async query(filter: queryFilter) {
    const query: AnalyticsQuery = {
      start: filter.start ? new Date(filter.start) : null,
      end: filter.end ? new Date(filter.end) : null,
      granularity: getGranularity(filter.granularity),
      metrics: getMetrics(filter.metrics),
      currency: getCurrency(filter.currency),
      select: {
        budget: [AnalyticsPath.fromString(filter.dimensions.select.budget)],
        category: [AnalyticsPath.fromString(filter.dimensions.select.category)],
      },
      lod: {
        budget: Number(filter.dimensions.lod.budget),
        category: Number(filter.dimensions.lod.category),
      },
    };
    return this.engine.execute(query);
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

const getMetrics = (metrics: any) => {
  if (metrics === undefined || metrics.length < 1) {
    throw new Error("No metrics provided");
  }

  const result = metrics.map((metric: string) => {
    switch (metric) {
      case "budget": {
        return AnalyticsMetric.Budget;
      }
      case "forecast": {
        return AnalyticsMetric.Forecast;
      }
      case "actuals": {
        return AnalyticsMetric.Actuals;
      }
      case "netExpensesOnchain": {
        return AnalyticsMetric.PaymentsOnChain;
      }
      case "netExpensesOffchainIncluded": {
        return AnalyticsMetric.PaymentsOffChainIncluded;
      }
    }
  });

  return result;
};

const getCurrency = (currency: string | undefined) => {
  switch (currency) {
    case "DAI": {
      return AnalyticsPath.fromString("DAI");
    }
    case "MKR": {
      return AnalyticsPath.fromString("MKR");
    }
    default: {
      return AnalyticsPath.fromString("DAI");
    }
  }
};
