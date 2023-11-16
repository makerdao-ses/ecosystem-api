import { gql } from "apollo-server-core";
import { data } from "./data.js";

export const typeDefs = [
  gql`
    type RecognizedDelegate {
      name: String
      image: String
      latestVotingContract: String
      socials: Social
    }

    type Social {
      forumProfile: String
      forumPlatform: String
      votingPortal: String
      youtube: String
      twitter: String
    }

    extend type Query {
      recognizedDelegates: [RecognizedDelegate]
    }
  `,
];

export const resolvers = {
  Query: {
    recognizedDelegates: async (_: any, __: any, ___: any) => {
      return data;
    },
  },
};
