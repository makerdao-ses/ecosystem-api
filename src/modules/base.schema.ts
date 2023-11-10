import { gql } from "apollo-server-core";

export const typeDefs = gql`
  type Error {
    message: String!
  }
`;

export const resolvers = {
  Query: {},
};
