import { gql } from "apollo-server-core";
import { AnalyticsModel } from "./db.js";

export const typeDefs = [
  gql`
    type AnalyticsResult {
      series: [AnalyticsPeriod]
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
      value: String
    }

    enum AnalyticsMetric {
      budget
      forecast
      actuals
      netExpensesOnchain
      netExpensesOffchainIncluded
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
      granularity: AnalyticsGranularity
      metrics: [AnalyticsMetric]
      dimensions: [AnalyticsFilterDimension]
      currency: String
    }

    extend type Query {
      analytics(filter: AnalyticsFilter): AnalyticsResult
      analyticsDimensions: [String]
    }
  `,
];

export const resolvers = {
  Query: {
    analytics: async (_: any, { filter }: any, { dataSources }: any) => {
      if (!filter) {
        throw new Error("No filter provided");
      }
      const queryEngine: AnalyticsModel = dataSources.db.Analytics;
      const results = await queryEngine.query(filter);

      // results.forEach(r => {
      //     console.log(JSON.stringify(r, null, 2));
      // });

      return {
        series: results.map((s) => ({
          ...s,
          rows: s.rows.map((r) => ({
            ...r,
            dimensions: Object.keys(r.dimensions).map((d) => ({
              name: d,
              value: r.dimensions[d],
            })),
          })),
        })),
      };
    },

    analyticsDimensions: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.db.Analytics.getDimensions();
    }
  },
};
