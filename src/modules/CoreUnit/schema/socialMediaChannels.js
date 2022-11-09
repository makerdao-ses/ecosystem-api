import { gql } from "apollo-server-core";

export const typeDefs = gql`

    "The social media channels of a Core Unit - If applicable "
    type SocialMediaChannels {
        id: ID!
        cuId: String
        forumTag: String
        twitter: String
        youtube: String
        discord: String
        linkedIn: String
        website: String
        github: String
    }

    type TwitterFollowers {
        id: ID!
        twitterAccountId: ID!
        twitterAccount: String!
        month: String!
        followerCount: Int!
    }

    type YoutubeFollowers {
        id: ID!
        youtubeId: ID!
        youtubeAccount: String!
        month: String!
        followerCount: Int!
    }

    "Allows for filtering of Core Units using Social Media channel values"
    input SocialMediaChannelsFilter {
        id: ID
        cuId: String
        forumTag: String
        twitter: String
        youtube: String
        discord: String
        linkedIn: String
        website: String
        github: String
    }

    extend type Query {
        "Retrieves all Social Media Channels of Core Units"
        socialMediaChannels: [SocialMediaChannels],
        "Retrieves specific Social Media Channel"
        socialMediaChannel(filter: SocialMediaChannelsFilter): [SocialMediaChannels]
    }

`;

export const resolvers = {
    Query: {
        socialMediaChannels: async (_, __, { dataSources }) => {
            return await dataSources.db.CoreUnit.getSocialMediaChannels()
        },
        socialMediaChannel: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.CoreUnit.getSocialMediaChannel(paramName, paramValue)
        }
    }
}