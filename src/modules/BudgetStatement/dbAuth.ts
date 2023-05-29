import { BudgetStatementModel } from "./db";
import { AuthModel } from '../Auth/db'
import { CoreUnitModel } from '../CoreUnit/db'
import { ChangeTrackingModel } from '../ChangeTracking/db'
import { AuthenticationError, ForbiddenError } from 'apollo-server-core';

export class BudgetStatementAuthModel {
    private bsModel: BudgetStatementModel;
    private authModel: AuthModel;
    private cuModel: CoreUnitModel;
    private ctModel: ChangeTrackingModel;

    constructor(bsModel: BudgetStatementModel, authModel: AuthModel, cuModel: CoreUnitModel, ctModel: ChangeTrackingModel) {
        this.bsModel = bsModel;
        this.authModel = authModel;
        this.cuModel = cuModel;
        this.ctModel = ctModel;
    }

    async destroy() {
        await this.bsModel.knex.destroy();
        await this.authModel.knex.destroy();
        await this.cuModel.knex.destroy();
        await this.ctModel.knex.destroy();
    }

    getRoleName(ownerType: string) {

        switch (ownerType) {
            case 'CoreUnit': {
                return 'CoreUnitAuditor'
            }
            case 'Delegates': {
                return 'DelegatesAuditor'
            }
            case 'EcosystemActor': {
                return 'EcosystemActorAuditor'
            }
            default: {
                return 'CoreUnitAuditor'
            }
        }

    }

    async budgetStatementCommentCreate(input: any, user: any) {
        try {
            if (!user) {
                throw new AuthenticationError("Not authenticated, login to create budget statment comments")
            } else {
                if (input.length < 1) {
                    throw new ForbiddenError('No input data')
                }
                const [ownerTypeResult] = await this.bsModel.getBSOwnerType(input.budgetStatementId);
                const [budgetStatement] = await this.bsModel.getBudgetStatements({ filter: { id: input.budgetStatementId, ownerType: ownerTypeResult.ownerType } });

                // returning error if no comment or same status
                if (input.comment === null || input.comment === '' && budgetStatement.status === input.status) {
                    throw new ForbiddenError('Need to add a comment or change status')
                }
                const canUpdate = await this.authModel.canUpdateCoreUnit(user.id, ownerTypeResult.ownerType, budgetStatement.ownerId);
                const canAudit = await this.authModel.canAudit(user.id, ownerTypeResult.ownerType);
                const cuAuditors = await this.authModel.getSystemRoleMembers(
                    this.getRoleName(ownerTypeResult.ownerType),
                    ownerTypeResult.ownerType,
                    budgetStatement.ownerId
                );
                const coreUnitHasAuditors = () => {
                    return cuAuditors.length > 0 ? true : false;
                }
                const userHasUpdatePermission = () => {
                    return parseInt(canUpdate[0].count) > 0
                }
                const userHasAuditPermission = () => {
                    let auditor = false;
                    canAudit.forEach((obj: any) => {
                        if (obj.resourceId === budgetStatement.ownerId || obj.resourceId === null) {
                            auditor = true
                        }
                    })
                    return auditor;
                }
                /**
                *    Handle status transition
                */
                const oldStatus = budgetStatement.status as string;
                const newStatus = input.status as string;
                if (oldStatus != newStatus) {
                    const isAllowed: any = {
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

                    const addedComment = await this.bsModel.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                    const parsed = await parseCommentOutput(addedComment, this.authModel);
                    await createBudgetStatementCommentEvent(this.bsModel, this.cuModel, this.ctModel, parsed[0], budgetStatement.status, ownerTypeResult.ownerType)
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

                    const addedComment = await this.bsModel.addBudgetStatementComment(input.commentAuthorId, input.budgetStatementId, input.comment, input.status);
                    const parsed = await parseCommentOutput(addedComment, this.authModel);
                    await createBudgetStatementCommentEvent(this.bsModel, this.cuModel, this.ctModel, parsed[0], budgetStatement.status, ownerTypeResult.ownerType)
                    return parsed;
                }
            }
        } catch (error: any) {
            throw new Error(error ? error : 'You are not authorized to update budgetStatements')
        }
    }
}

const parseCommentOutput = (comments: any, authModel: AuthModel) => {
    const parsed = comments.map(async (comment: any) => {
        const [user] = await authModel.getUsersFiltered({ id: comment.authorId });
        delete comment.authorId
        comment.author = user
        return comment;
    });
    return Promise.all(parsed);
};

const createBudgetStatementCommentEvent = async (bsModel: BudgetStatementModel, cuModel: CoreUnitModel, ctModel: ChangeTrackingModel, parsedComment: any, oldStatus: any, ownerType: string) => {
    const [budgetStatement] = await bsModel.getBudgetStatements({ filter: { id: parsedComment.budgetStatementId, ownerType } })
    let CU;
    if (ownerType === 'Delegates') {
        CU = { id: '', code: '', shortCode: '' }
    } else {
        [CU] = await cuModel.getCoreUnits({ filter: { id: budgetStatement.ownerId } });
    }
    const eventDescription = getEventDescription(oldStatus, parsedComment.status, CU, parsedComment.author, budgetStatement.month.substring(0, budgetStatement.month.length - 3), ownerType)
    ctModel.budgetStatementCommentUpdate(
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

const getEventDescription = (oldStatus: string, newStatus: string, CU: any, author: any, month: string, ownerType: string) => {
    if (oldStatus === newStatus) {
        return `${author.username} commented on the ${ownerType === 'Delegates' ? 'Delegates' : CU.code} ${month} Expense Report`
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