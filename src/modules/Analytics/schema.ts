import { gql } from "apollo-server-core";
import { AnalyticsModel } from "./db.js";

export const typeDefs = [
  gql`
    type AnalyticsQuery {
      series(filter: AnalyticsFilter): [AnalyticsPeriod]
      multiCurrencySeries(filter: MultiCurrencyConversions): [AnalyticsPeriod]
      metrics: [String]
      dimensions: [Dimension]
      currencies: [String]
    }

    type AnalyticsPeriod {
      period: String
      start: DateTime
      end: DateTime
      rows: [AnalyticsSeries]
    }

    type AnalyticsSeries {
      dimensions: [AnalyticsSeriesDimension]
      metric: String
      unit: String
      value: Float
      sum: Float
    }

    type AnalyticsSeriesDimension {
      name: String
      path: String
      label: String
      description: String
      icon: String
    }

    type Dimension {
      name: String
      values: [Value]
    }

    type Value {
      path: String
      label: String
      description: String
      icon: String
    }

    enum AnalyticsGranularity {
      hourly
      daily
      weekly
      monthly
      quarterly
      semiAnnual
      annual
      total
    }

    input AnalyticsFilterDimension {
      name: String!
      select: String!
      lod: Int!
    }

    input MultiCurrencyConversions {
      start: String
      end: String
      "Period to group by"
      granularity: AnalyticsGranularity
      "List of metrics to filter by, such as 'budget' or 'actuals'"
      metrics: [String]
      "List of dimensions to filter by, such as 'budget' or 'project'"
      dimensions: [AnalyticsFilterDimension]
      currency: String
      conversions: [CurrencyConversion]!
      
    }

    input CurrencyConversion {
      metric: String!
      sourceCurrency: String!
    }

    input AnalyticsFilter {
      start: String
      end: String
      "Period to group by"
      granularity: AnalyticsGranularity
      "List of metrics to filter by, such as 'budget' or 'actuals'"
      metrics: [String]
      "List of dimensions to filter by, such as 'budget' or 'project'"
      dimensions: [AnalyticsFilterDimension]
      currency: String
    }

    extend type Query {
      analytics: AnalyticsQuery
    }
  `,
];

export const resolvers = {
  Query: {
    analytics: (_: any, __: any, { dataSources }: any) => {
      return {}
    },
  },
  AnalyticsQuery: {
    series: async (parent: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      const results = await queryEngine.query(filter);
      return results.map((s) => ({
        ...s,
        rows: s.rows.map((r: any) => ({
          ...r,
          dimensions: Object.keys(r.dimensions).map((d) => (
            {
              name: d,
              path: r.dimensions[d]['path'],
              icon: r.dimensions[d]['icon'],
              label: r.dimensions[d]['label'],
              description: r.dimensions[d]['description'],
            })),
        })),
      }))
    },
    metrics: async (parent: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      return await queryEngine.getMetrics();
    },
    dimensions: async (_: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      return await queryEngine.getDimensions();
    },
    currencies: async (_: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      return await queryEngine.getCurrencies();
    },
    multiCurrencySeries: async (_: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      const results = await queryEngine.multiCurrencyQuery(filter);

      return results.map((s) => ({
        ...s,
        rows: s.rows.map((r: any) => ({
          ...r,
          dimensions: Object.keys(r.dimensions).map((d) => (
            {
              name: d,
              path: r.dimensions[d]['path'],
              icon: r.dimensions[d]['icon'],
              label: r.dimensions[d]['label'],
              description: r.dimensions[d]['description'],
            })),
        })),
      }))

    },
  }
};
