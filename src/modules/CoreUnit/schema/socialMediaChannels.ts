import { gql } from "graphql-tag";

export const typeDefs = gql`
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
    socialMediaChannels(
      filter: SocialMediaChannelsFilter
    ): [SocialMediaChannels]
  }
`;

export const resolvers = {
  Query: {
    socialMediaChannels: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      return await dataSources.db.CoreUnit.getSocialMediaChannels(filter);
    },
  },
};
