import { gql } from "apollo-server-core";
import { AnalyticsModel } from "./db.js";

export const typeDefs = [
  gql`
    type AnalyticsResult {
      series: [AnalyticsPeriod]
      metrics: [String]
      dimensions: [Dimension]
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
    }

    type Dimension {
      name: String
      values: Value
    }

    type Value {
      path: String
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
      analytics(filter: AnalyticsFilter): AnalyticsResult
    }
  `,
];

export const resolvers = {
  Query: {
    // (parent, args, context, info) => {}
    analytics: async (_: any, { filter }: any, { dataSources }: any) => {
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      const results = await queryEngine.query(filter);
      const metrics = await queryEngine.getMetrics();
      const contextDimensions = await queryEngine.getDimensions();

      return {
        series: results.map((s) => ({
          ...s,
          rows: s.rows.map((r) => ({
            ...r,
            dimensions: Object.keys(r.dimensions).map((d) => ({
              name: d,
              path: r.dimensions[d],
            })),
          })),
        })),
        metrics,
        dimensions: contextDimensions
      };
    }
  },
};
