import { gql } from "apollo-server-core";

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
        cuGithubContributions(filter: CuGithubContributionFilter): [CuGithubContribution]
        githubOrgs(filter: GithubOrgFilter): [GithubOrg]
        githubRepos(filter: GithubRepoFilter): [GithubRepo]
        makerGithubEcosystemAll: [MakerGithubEcosystem]
        makerGithubEcosystem(filter: MakerGithubEcosystemFilter): [MakerGithubEcosystem]

    }

`;

export const resolvers = {
    Query: {
        cuGithubContributions: async (_, { filter }, { dataSources }) => {
            return await dataSources.db.CoreUnit.getCuGithubContributions(filter)
        },
        githubOrgs: async (_, { filter }, { dataSources }) => {
            return dataSources.db.CoreUnit.getGithubOrgs(filter)
        },
        githubRepos: async (_, { filter }, { dataSources }) => {
            return await dataSources.db.CoreUnit.getGithubRepos(filter)
        },
        makerGithubEcosystemAll: async (_, __, { dataSources }) => {
            return await dataSources.db.CoreUnit.getMakerGithubEcosystemAll()
        },
        makerGithubEcosystem: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.CoreUnit.getMakerGithubEcosystem(paramName, paramValue)
        }
    },
    CuGithubContribution: {
        githubOrg: async (parent, __, { dataSources }) => {
            const { orgId } = parent;
            const result = await dataSources.db.CoreUnit.getGithubOrgs({ id: orgId });
            return result
        },
        githubRepo: async (parent, __, { dataSources }) => {
            const { repoId } = parent;
            const result = await dataSources.db.CoreUnit.getGithubRepos({ id: repoId });
            return result;
        }
    }
}