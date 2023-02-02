import { gql, AuthenticationError, ForbiddenError } from 'apollo-server-core';

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
            const result = await dataSources.db.BudgetStatement.getBudgetStatementComments('id', id);
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
                        throw new ForbiddenError('No input data')
                    }
                    const [budgetStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: input.budgetStatementId } });

                    // returning error if no comment or same status
                    if (input.comment === null || input.comment === '' && budgetStatement.status === input.status) {
                        throw new ForbiddenError('Need to add a comment or change status')
                    }
                    const canUpdate = await dataSources.db.Auth.canUpdateCoreUnit(user.id, 'CoreUnit', budgetStatement.cuId);
                    const canAudit = await dataSources.db.Auth.canAudit(user.id);
                    const cuAuditors = await dataSources.db.Auth.getSystemRoleMembers('CoreUnitAuditor', 'CoreUnit', budgetStatement.cuId);
                    const cuAdmin = (parseInt(canUpdate[0].count) > 0 && budgetStatement.cuId == user?.cuId) || user.cuId == null ? true : false;
                    const withAuditors = cuAuditors.length > 0 ? true : false;
                    const coreUnitHasAuditors = () => {
                        return cuAuditors.length > 0 ? true : false;
                    }
                    const userHasUpdatePermission = () => {
                        return parseInt(canUpdate[0].count) > 0
                    }
                    const userHasAuditPermission = () => {
                        let auditor = false;
                        canAudit.forEach(obj => {
                            if (obj.resourceId === budgetStatement.cuId || obj.resourceId === null) {
                                auditor = true
                            }
                        })
                        return auditor;
                    }
                    /**
                    *    Handle status transition
                    */
                    const oldStatus = budgetStatement.status;
                    const newStatus = input.status;
                    if (oldStatus != newStatus) {
                        const isAllowed = {
                            Draft: {
                                Review: false,
                                Final: false,
                                Escalated: false
                            },
                            Review: {
                                Draft: false,
                                Final: false,
                                Escalated: false
                            },
                            Final: {
                                Draft: false,
                                Review: false,
                                Escalated: false
                            },
                            Escalated: {
                                Draft: false,
                                Review: false,
                                Final: false,
                            }
                        }

                        if (!coreUnitHasAuditors()) {
                            if (userHasUpdatePermission()) {
                                isAllowed.Draft.Final = true;
                                isAllowed.Final.Draft = true;
                            }
                        }

                        if (coreUnitHasAuditors()) {
                            if (userHasUpdatePermission()) {
                                isAllowed.Draft.Review = true;
                                isAllowed.Final.Draft = true;
                            }

                            if (userHasAuditPermission()) {
                                isAllowed.Review.Final = true;
                                isAllowed.Review.Escalated = true;
                                isAllowed.Final.Review = true;
                                isAllowed.Escalated.Review = true;
                            }
                        }

                        if (!isAllowed[oldStatus][newStatus]) {
                            throw new ForbiddenError(`You are not authorized to move the expense report status from ${oldStatus} to ${newStatus}.`);
                        }

                        const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                        const parsed = await parseCommentOutput(addedComment, dataSources);
                        await createBudgetStatementCommentEvent(dataSources, parsed[0], budgetStatement.status, cuAdmin, userHasAuditPermission(), withAuditors)
                        return parsed;
                    }

                    /**
                    *    Handle comment submission
                    */

                    if (input.comment != null || input.comment != undefined) {
                        const canComment = userHasUpdatePermission() || userHasAuditPermission();

                        if (!canComment) {
                            throw new ForbiddenError("You are not authorized to add a comment to this expense report.");
                        }

                        const addedComment = await dataSources.db.BudgetStatement.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                        const parsed = await parseCommentOutput(addedComment, dataSources);
                        await createBudgetStatementCommentEvent(dataSources, parsed[0], budgetStatement.status, cuAdmin, userHasAuditPermission(), withAuditors)
                        return parsed;
                    }
                }
            } catch (error) {
                throw new Error(error ? error : 'You are not authorized to update budgetStatements')
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

const createBudgetStatementCommentEvent = async (dataSources, parsedComment, oldStatus, cuAdmin, auditor, withAuditors) => {
    const [budgetStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: parsedComment.budgetStatementId } })
    const [CU] = await dataSources.db.CoreUnit.getCoreUnit('id', budgetStatement.cuId);
    const eventDescription = getEventDescription(oldStatus, parsedComment.status, CU, parsedComment.author, budgetStatement.month.substring(0, budgetStatement.month.length - 3))
    dataSources.db.ChangeTracking.budgetStatementCommentUpdate(
        eventDescription,
        CU.id,
        CU.code,
        CU.shortCode,
        parsedComment.budgetStatementId,
        budgetStatement.month,
        parsedComment.author.id,
        parsedComment.author.username,
        parsedComment.id,
        oldStatus,
        parsedComment.status
    )
}

const getEventDescription = (oldStatus, newStatus, CU, author, month) => {
    if (oldStatus === newStatus) {
        return `${author.username} commented on the ${CU.code} ${month} Expense Report`
    }
    // Initial status is Draft
    if (oldStatus === 'Draft' && newStatus === 'Review') {
        return `${author.username} submitted the ${CU.code} ${month} Expense Report for Review`
    }
    if (oldStatus === 'Draft' && newStatus === 'Final') {
        return `${author.username} marked the ${CU.code} ${month} Expense Report as final`
    }
    // Initial status is Review
    if (oldStatus === 'Review' && newStatus === 'Final') {
        return `${author.username} approved the ${CU.code} ${month} Expense Report`
    }
    if (oldStatus === 'Review' && newStatus === 'Escalated') {
        return `${author.username} escalated the ${CU.code} ${month} Expense Report`
    }
    // Initial status is Final
    if (oldStatus === 'Final' && newStatus === 'Review') {
        return `${author.username} reopened the ${CU.code} ${month} Expense Report`
    }
    if (oldStatus === 'Final' && newStatus === 'Draft') {
        return `${author.username} reopened the ${CU.code} ${month} Expense Report`
    }
    // Initial status is Escalated
    if (oldStatus === 'Escalated' && newStatus === 'Review') {
        return `${author.username} reopened the ${CU.code} ${month} Expense Report`
    }
    // Catch all for other transitions (this should never happen)
    return `${author.username} changed the status of ${CU.code} ${month} Expense Report from ${oldStatus} to ${newStatus}`
}