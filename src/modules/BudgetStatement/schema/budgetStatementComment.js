import { gql, AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { BudgetStatementAuthModel } from '../dbAuth.js';

export const typeDefs = [gql`

    type BudgetStatementComment {
        id: ID!
        budgetStatementId: ID!
        timestamp: DateTime
        comment: String
        status: BudgetStatus
        author: User
    }

    type BudgetStatementCommentAuthor {
        id: ID!
        name: String
    }

    extend type BudgetStatement {
        comments: [BudgetStatementComment]
    }

    input BudgetStatementCommentFilter {
        id: ID
        budgetStatementId: ID
        timestamp: DateTime
    }

    input BudgetStatementCommentAuthorFilter {
        id: ID
        name: String
    }

    extend type Query {
        budgetStatementComments(filter: BudgetStatementCommentFilter): [BudgetStatementComment]
    }

    type Mutation {
        budgetStatementCommentCreate(input: BudgetStatementCommentInput): [BudgetStatementComment]
        budgetStatementCommentDelete(input: BudgetStatementCommentDeleteInput): [BudgetStatementComment]
    }

    input BudgetStatementCommentInput {
        budgetStatementId: ID!
        comment: String
        commentAuthorName: String @deprecated(reason: "use commentAuthorId to add userId")
        commentAuthorId: ID!
        status: BudgetStatus
    }

    input BudgetStatementCommentDeleteInput {
        id: ID
    }

`];


export const resolvers = {
    Query: {
        budgetStatementComments: async (_, { filter }, { dataSources }) => {
            let queryParams = undefined;
            let paramName = undefined;
            let paramValue = undefined;
            let secondParamName = undefined;
            let secondParamValue = undefined;
            if (filter !== undefined) {
                queryParams = Object.keys(filter);
                if (queryParams.length > 2) {
                    throw "Choose no more than 2 parameters"
                }
                paramName = queryParams[0]
                paramValue = filter[queryParams[0]];
                secondParamName = queryParams[1];
                secondParamValue = filter[queryParams[1]];
            }
            const comments = await dataSources.db.BudgetStatement.getBudgetStatementComments(
                paramName,
                paramValue,
                secondParamName,
                secondParamValue
            );
            const parsed = parseCommentOutput(comments, dataSources);
            return parsed;
        }
    },
    BudgetStatement: {
        comments: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementComments('budgetStatementId', id);
            const comments = parseCommentOutput(result, dataSources);
            return comments;
        },
    },
    Mutation: {
        budgetStatementCommentCreate: async (_, { input }, { user, dataSources }) => {
            const authModel = new BudgetStatementAuthModel(dataSources.db.BudgetStatement, dataSources.db.Auth, dataSources.db.CoreUnit, dataSources.db.ChangeTracking);
            return await authModel.budgetStatementCommentCreate(input, user, dataSources)
        },
        budgetStatementCommentDelete: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to create budget statment comments")
                } else {
                    const allowed = await dataSources.db.Auth.canUpdate(user.id, 'CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        if (input.length < 1) {
                            throw new Error('"No input data')
                        }
                        console.log(`deleting comment id: ${input.id}`);
                        const deletedComment = await dataSources.db.BudgetStatement.budgetStatementCommentDelete(input.id);
                        const parsed = await parseCommentOutput(deletedComment, dataSources);
                        return parsed;
                    } else {
                        throw new AuthenticationError('You are not authorized to create budget statement comments')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatements')
            }
        }
    }

}

const parseCommentOutput = (comments, dataSources) => {
    const parsed = comments.map(async (comment) => {
        const [user] = await dataSources.db.Auth.getUsersFiltered({ id: comment.authorId });
        delete comment.authorId
        comment.author = user
        return comment;
    });
    return Promise.all(parsed);
};