import { gql, AuthenticationError } from 'apollo-server-core';

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
        budgetStatementComments: [BudgetStatementComment]
        budgetStatementComment(filter: BudgetStatementCommentFilter): [BudgetStatementComment]
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
        budgetStatementComments: async (_, __, { dataSources }) => {
            const comments = await dataSources.db.BudgetStatement.getBudgetStatementComments()
            const parsed = parseCommentOutput(comments, dataSources);
            return parsed;
        },
        budgetStatementComment: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 2) {
                throw "Choose no more than 2 parameters"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const secondParamName = queryParams[1];
            const secondParamValue = filter[queryParams[1]];
            const comments = await dataSources.db.BudgetStatement.getBudgetStatementComment(paramName, paramValue, secondParamName, secondParamValue)
            const parsed = parseCommentOutput(comments, dataSources);
            return parsed;
        },
    },
    BudgetStatement: {
        comments: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementComments(id);
            const comments = parseCommentOutput(result, dataSources);
            return comments;
        },
    },
    Mutation: {
        budgetStatementCommentCreate: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to create budget statment comments")
                } else {
                    if (input.length < 1) {
                        throw new Error('No input data')
                    }
                    const canUpdate = await dataSources.db.Auth.canUpdate(user.id, 'CoreUnit', user.cuId)
                    const [canAudit] = await dataSources.db.Auth.can(user.id, 'Audit', 'CoreUnit');
                    if (canAudit.count > 0 && (input.status === 'Final' || input.status === 'Review' || input.status === 'Escalated')) {
                        console.log(`As an auditor, changing status to ${input.status}`)
                        const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                        const parsed = parseCommentOutput(addedComment, dataSources);
                        return parsed;
                    }
                    else if (canUpdate[0].count > 0) {
                        if (user.cuId !== undefined) {
                            const cuAuditors = await dataSources.db.Auth.getSystemRoleMembers('CoreUnitAuditor', 'CoreUnit', user.cuId);
                            if (cuAuditors.length > 0 && (input.status === 'Draft' || input.status === 'Review')) {
                                console.log('With auditors - changing budget statment status to :', input.status);
                                const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                                const parsed = parseCommentOutput(addedComment, dataSources);
                                return parsed;
                            }
                            if (cuAuditors.length < 1 && (input.status === 'Draft' || input.status === 'Final')) {
                                console.log('No auditors - changing budget statment status to :', input.status);
                                const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                                const parsed = parseCommentOutput(addedComment, dataSources);
                                return parsed;
                            }
                        }
                        console.log(`adding comment to budgetStatement id: ${input.budgetStatementId}`);
                        // add comment
                        const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                        const parsed = parseCommentOutput(addedComment, dataSources);
                        return parsed;
                    } else {
                        throw new AuthenticationError('You are not authorized to create budget statement comments')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatements')
            }
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
                        const parsed = parseCommentOutput(deletedComment, dataSources);
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
    return parsed;
}