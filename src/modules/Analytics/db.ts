import { Knex } from "knex";

import { AnalyticsQueryEngine } from "../../analytics/AnalyticsQueryEngine.js";
import { AnalyticsStore } from "../../analytics/AnalyticsStore.js";
import {
  AnalyticsGranularity,
  AnalyticsQuery,
  toPascalCase
} from "../../analytics/AnalyticsQuery.js";
import { AnalyticsPath } from "../../analytics/AnalyticsPath.js";

type queryFilter = {
  start?: Date;
  end?: Date;
  granularity?: string;
  metrics: string[];
  dimensions: [Record<string, string>];
  currency?: string;
};

export class AnalyticsModel {
  engine: AnalyticsQueryEngine;
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
    const store = new AnalyticsStore(knex);
    this.engine = new AnalyticsQueryEngine(store);
  }

  public async query(filter: queryFilter) {

    if (!filter) {
      return [];
    }
    const metrics = await this.getMetrics();
    const filteredMetrics = filter.metrics.filter(metric => metrics.includes(metric));
    if(filteredMetrics.length < 1){
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
    return this.engine.execute(query);

  }

  public async getDimensions() {
    const list = await this.knex
      .select(this.knex.raw('distinct on ("dimension") dimension, path'))
      .from('AnalyticsDimension')
      .whereNotNull('path')
      .whereNot('path', '')
      .whereNot('path', '/')
      .orderBy('dimension', 'asc');
    const result = list.map(l => {
      return {
        name: l.dimension,
        values: {
          path: l.path
        }
      }
    })
    return result;
  }

  public async getMetrics() {
    const list = await this.knex("AnalyticsSeries").select('metric').distinct().whereNotNull('metric');
    const filtered = list.map((l) => l.metric);
    const metrics = ['Budget', 'Forecast', 'Actuals', 'PaymentsOnChain', 'PaymentsOffChainIncluded'];
    metrics.forEach(metric => {
      if (!filtered.includes(metric)) {
        filtered.push(metric);
      }
    });
    return filtered;
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
