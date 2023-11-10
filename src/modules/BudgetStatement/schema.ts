import _ from "lodash";

import {
  typeDefs as BudgetStatement,
  resolvers as BudgetStatementResolvers,
} from "./schema/budgetStatement.js";

import {
  typeDefs as BudgetStatementComment,
  resolvers as BudgetStatementCommentResolvers,
} from "./schema/budgetStatementComment.js";

const typeDefs = [BudgetStatement, BudgetStatementComment];

const resolvers = _.merge(
  BudgetStatementResolvers,
  BudgetStatementCommentResolvers,
);

export { typeDefs, resolvers };
