import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  constructor(message?: string) {
    super(message || "You must be logged in to access this resource.", {
      extensions: {
        code: "NOT_AUTHORIZED",
      },
    });
  }
}
