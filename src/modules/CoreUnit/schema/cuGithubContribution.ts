import { gql } from "graphql-tag";

export const typeDefs = gql`
  type CuGithubContribution {
    id: ID!
    cuId: ID
    orgId: ID
    repoId: ID
    githubOrg: [GithubOrg]
    githubRepo: [GithubRepo]
  }

  type GithubOrg {
    id: ID!
    org: String!
    githubUrl: String!
  }

  type GithubRepo {
    id: ID!
    repo: String!
    githubUrl: String!
  }

  type MakerGithubEcosystem {
    id: ID!
    makerRepoId: ID!
    cuGithubRepoId: ID!
    date: String!
    url: String!
    org: Int!
    repo: Int!
    uniqueContributors: Int!
    commits4w: Int!
    totalStars: Int!
  }

  input CuGithubContributionFilter {
    id: ID
    cuId: ID
    orgId: ID
    repoId: ID
  }

  input GithubOrgFilter {
    id: ID
    org: String
    githubUrl: String
  }

  input GithubRepoFilter {
    id: ID
    repo: String
    githubUrl: String
  }

  input MakerGithubEcosystemFilter {
    id: ID
    makerRepoId: ID
    cuGithubRepoId: ID
    date: String
    url: String
    org: Int
    repo: Int
    uniqueContributors: Int
    commits4w: Int
    totalStars: Int
  }

  type Query {
    cuGithubContributions(
      filter: CuGithubContributionFilter
    ): [CuGithubContribution]
    githubOrgs(filter: GithubOrgFilter): [GithubOrg]
    githubRepos(filter: GithubRepoFilter): [GithubRepo]
    makerGithubEcosystemAll(
      filter: MakerGithubEcosystemFilter
    ): [MakerGithubEcosystem]
  }
`;

export const resolvers = {
  Query: {
    cuGithubContributions: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      return await dataSources.db.CoreUnit.getCuGithubContributions(filter);
    },
    githubOrgs: async (_: any, { filter }: any, { dataSources }: any) => {
      return dataSources.db.CoreUnit.getGithubOrgs(filter);
    },
    githubRepos: async (_: any, { filter }: any, { dataSources }: any) => {
      return await dataSources.db.CoreUnit.getGithubRepos(filter);
    },
    makerGithubEcosystemAll: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      return await dataSources.db.CoreUnit.getMakerGithubEcosystemAll(filter);
    },
  },
  CuGithubContribution: {
    githubOrg: async (parent: any, __: any, { dataSources }: any) => {
      const { orgId } = parent;
      const result = await dataSources.db.CoreUnit.getGithubOrgs({ id: orgId });
      return result;
    },
    githubRepo: async (parent: any, __: any, { dataSources }: any) => {
      const { repoId } = parent;
      const result = await dataSources.db.CoreUnit.getGithubRepos({
        id: repoId,
      });
      return result;
    },
  },
};
