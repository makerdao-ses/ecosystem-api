import { GraphQLError } from "graphql";

export class ForbiddenError extends GraphQLError {
  constructor(message?: string) {
    super(message || "You are not authorized.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
}
