import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Error {
    message: String!
  }
`;

export const resolvers = {
  Query: {},
};
