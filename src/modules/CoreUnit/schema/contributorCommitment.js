import { gql } from "apollo-server-core";

export const typeDefs = gql`

    "Information on the length of time and level of commitment the contributor has to their current position"
    type ContributorCommitment {
        id: ID!
        cuId: ID!
        contributorId: ID!
        "Date on which this commitment period started"
        startDate: String!
        "Level of commitment"
        commitment: Commitment
        cuCode: String!
        contributor: [Contributor]
        "Role title"
        jobTitle: String
    }

    "Level of commitment - Part-Time / Full-Time etc"
    enum Commitment {
        FullTime
        PartTime
        Variable
        Inactive
    }

    "Social media information for a specific contributor"
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
    
    "Allows filtering of the contributor table"
    input ContributorFilter {
        id: ID
        name: String
        forumHandle: String
        discordHandle: String
        twitterHandle: String
        email: String
    }

    type Query {
        "Retrieve the full Contributor Commitment table"
        contributorCommitments: [ContributorCommitment]
        "Retrieve specific data from the Contributor Commitment table"
        contributorCommitment(filter: ContributorCommitmentFilter): [ContributorCommitment]
        "Retrieve ALL Contributors"
        contributors(limit: Int, offset: Int): [Contributor]
        "Retrieve specific Contributor entries"
        contributor(filter: ContributorFilter): [Contributor]
    }

    extend type Mip41 {
        contributor: [Contributor]
    }

`;

export const resolvers = {
    Query: {
        contributorCommitments: async (_, __, { dataSources }) => {
            return await dataSources.db.CoreUnit.getContributorCommitments();
        },
        contributorCommitment: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.CoreUnit.getContributorCommitment(paramName, paramValue)
        },
        contributors: async (_, filter, { dataSources }) => {
            return await dataSources.db.CoreUnit.getContributors(filter.limit, filter.offset)
        },
        contributor: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.CoreUnit.getContributor(paramName, paramValue)
        }
    },
    ContributorCommitment: {
        contributor: async (parent, __, { dataSources }) => {
            const { contributorId } = parent;
            const result = await dataSources.db.CoreUnit.getContributor('id', contributorId);
            return result;
        }
    },
    Mip41: {
        contributor: async (parent, __, { dataSources }) => {
            const { contributorId } = parent;
            const result = await dataSources.db.CoreUnit.getContributor('id', contributorId);
            return result;
        }
    }
}