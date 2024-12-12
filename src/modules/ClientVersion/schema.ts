import { gql } from "graphql-tag";

export const typeDefs = [
  gql`
    type BudgetToolVersion {
      id: ID!
      version: String!
      link: String!
    }

    extend type Query {
      budgetToolVersions: [BudgetToolVersion]
      latestBudgetToolVersion: [BudgetToolVersion]
    }
  `,
];

export const resolvers = {
  Query: {
    budgetToolVersions: async (_: any, __: any, { dataSources }: any) => {
      return await dataSources.db.ClientVersion.getBudgetToolVersions();
    },
    latestBudgetToolVersion: async (_: any, __: any, { dataSources }: any) => {
      return await dataSources.db.ClientVersion.getLatestBudgetToolVersion();
    },
  },
};
