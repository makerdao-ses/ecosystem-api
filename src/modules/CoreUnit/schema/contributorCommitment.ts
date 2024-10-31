import { gql } from "graphql-tag";

export const typeDefs = gql`
  type ContributorCommitment {
    id: ID!
    cuId: ID!
    contributorId: ID!
    startDate: String!
    commitment: Commitment
    cuCode: String!
    contributor: [Contributor]
    jobTitle: String
  }

  enum Commitment {
    FullTime
    PartTime
    Variable
    Inactive
  }

  type Contributor {
    id: ID!
    name: String!
    forumHandle: String
    discordHandle: String
    twitterHandle: String
    email: String
    facilitatorImage: String
    githubUrl: String
  }

  "Choose only one parameter from this list. Here you have the versatility of choosing the right argument according to your needs"
  input ContributorCommitmentFilter {
    id: ID
    cuId: ID
    contributorId: ID
    startDate: String
    commitment: Commitment
    cuCode: String
    jobTitle: String
  }

  input ContributorFilter {
    id: ID
    name: String
    forumHandle: String
    discordHandle: String
    twitterHandle: String
    email: String
  }

  type Query {
    contributorCommitments(
      filter: ContributorCommitmentFilter
    ): [ContributorCommitment]
    contributors(
      limit: Int
      offset: Int
      filter: ContributorFilter
    ): [Contributor]
  }

  extend type Mip41 {
    contributor: [Contributor]
  }
`;

export const resolvers = {
  Query: {
    contributorCommitments: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      return await dataSources.db.CoreUnit.getContributorCommitments(filter);
    },
    contributors: async (_: any, filter: any, { dataSources }: any) => {
      return await dataSources.db.CoreUnit.getContributors(filter);
    },
  },
  ContributorCommitment: {
    contributor: async (parent: any, __: any, { dataSources }: any) => {
      const { contributorId } = parent;
      const result = await dataSources.db.CoreUnit.getContributors({
        filter: { id: contributorId },
      });
      return result;
    },
  },
  Mip41: {
    contributor: async (parent: any, __: any, { dataSources }: any) => {
      const { contributorId } = parent;
      const result = await dataSources.db.CoreUnit.getContributors({
        filter: { id: contributorId },
      });
      return result;
    },
  },
};
