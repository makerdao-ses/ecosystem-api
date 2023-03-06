import { gql, AuthenticationError } from 'apollo-server-core';

export const typeDefs = [gql`

    type BudgetStatement {
        "Auto generated id field"
        id: ID!
        "Auto generated id field from Core Unit table"
        ownerId: ID!
        ownerType: String
        "Month of corresponding budget statement"
        month: String!
        "Status of the budgest statement (Draft/Final)"
        status: BudgetStatus
        "Link to the complete publication of the budget statement"
        publicationUrl: String @deprecated(reason: "Moving this field to CoreUnit.legacyBudgetStamentUrl")
        "Core Unit code as defined with the Core Units' MIP39"
        ownerCode: String
        mkrProgramLength: Float
        activityFeed: [ChangeTrackingEvent]
        auditReport: [AuditReport]
        "Number of full-time employees in the corresponding budget statement"
        budgetStatementFTEs: [BudgetStatementFTEs]
        "Details on the amount of MKR vested in the corresponding budget statement"
        budgetStatementMKRVest: [BudgetStatementMKRVest]
        "Details on the wallets used for budget statement wallets"
        budgetStatementWallet: [BudgetStatementWallet]
    }

    enum BudgetStatus {
        Draft
        Review
        Escalated
        Final
    } 

    type AuditReport {
        id: ID!
        budgetStatementId: ID!
        auditStatus: AuditStatus
        reportUrl: String
        timestamp: Timestamp
    }

    enum AuditStatus {
        Approved
        ApprovedWithComments
        NeedActionsBeforeApproval
        Escalated
    }

    type BudgetStatementFTEs {
        id: ID!
        budgetStatementId: ID
        month: String
        "Full-time employees"
        ftes: Float
    }

    type BudgetStatementMKRVest {
        id: ID!
        budgetStatementId: ID!
        vestingDate: String!
        "Current MKR amount"
        mkrAmount: Float
        "Previous MKR amount"
        mkrAmountOld: Float
        comments: String
    }

    type BudgetStatementWallet {
        id: ID!
        budgetStatementId: ID!
        "Wallet name"
        name: String
        "Wallet address"
        address: String
        "Current wallet balance (as defined within the budget statement"
        currentBalance: Float
        topupTransfer: Float
        comments: String
        "Retrieve breakdown of the line items that make up the corresponding budget statement"
        budgetStatementLineItem(offset: Int, limit: Int): [BudgetStatementLineItem]
        "Retrieve payment information for corresponding budget statement"
        budgetStatementPayment: [BudgetStatementPayment]
        budgetStatementTransferRequest: [BudgetStatementTransferRequest]

    }

    type BudgetStatementTransferRequest {
        id: ID!
        budgetStatementWalletId: ID!
        budgetStatementPaymentId: ID
        requestAmount: Float
        comments: String
        walletBalance: Float
    }

    type BudgetStatementLineItem {
        id: ID!
        budgetStatementWalletId: ID!
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: CanonicalBudgetCategory
        headcountExpense: Boolean
        budgetCap: Float
        payment: Float
    }

    enum CanonicalBudgetCategory {
        CompensationAndBenefits
        AdminExpense
        TravelAndEntertainment
        FreightAndDuties
        GasExpense
        GovernancePrograms
        HardwareExpense
        MarketingExpense
        ProfessionalServices
        SoftwareDevelopmentExpense
        SoftwareExpense
        Supplies
        TrainingExpense
        CommunityDevelopmentExpense
        Bonus
        ContingencyBuffer
    }

    type BudgetStatementPayment {
        id: ID!
        budgetStatementWalletId: ID!
        transactionDate: String!
        transactionId: String
        budgetStatementLineItemId: Int
        comments: String
    }

    type BudgetStatementPayload {
        errors: [Error]
        budgetStatement: [BudgetStatement]
    }

    input BudgetStatementInput {
        ownerId: ID
        ownerCode: String
        month: String
        status: BudgetStatus
    }

    input BudgetStatementFilter {
        id: ID
        ownerId: ID
        ownerType: BudgetOwner!
        month: String
        status: BudgetStatus
        ownerCode: String
        mkrProgramLength: Float
    }

    enum BudgetOwner {
        CoreUnit
        Delegates
        SpecialPurposeFund
        Project
    }

    input BudgetStatementWalletFilter {
        id: ID
        budgetStatementId: ID
        name: String
        address: String
        currentBalance: Float
        topupTransfer: Float
        comments: String
    }

    input BudgetStatementLineItemFilter {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        canonicalBudgetCategory: CanonicalBudgetCategory
        forecast: Float
        actual: Float
        comments: String
        budgetCap: Float
    }

    input BudgetStatementPaymentFilter {
        id: ID
        budgetStatementWalletId: ID
        transactionDate: String
        transactionId: String
        budgetStatementLineItemId: Int
        comments: String
    }

    extend type Query {
        budgetStatements(limit: Int, offset: Int, filter: BudgetStatementFilter): [BudgetStatement!]
        budgetStatementWallets(filter: BudgetStatementWalletFilter): [BudgetStatementWallet]
        budgetStatementLineItems(limit: Int, offset: Int, filter: BudgetStatementLineItemFilter): [BudgetStatementLineItem]
        # budgetStatementPayments: [BudgetStatementPayment]
        # budgetStatementPayment(filter: BudgetStatementPaymentFilter): [BudgetStatementPayment]
    }

    extend type CoreUnit {
        "Access details on the budget statements of a Core Unit"
        budgetStatements: [BudgetStatement]
    }

    type Mutation {
        budgetStatementsBatchAdd(input: [BudgetStatementBatchAddInput]): [BudgetStatement]
        budgetLineItemsBatchAdd(input: [LineItemsBatchAddInput]): [BudgetStatementLineItem]
        budgetLineItemsBatchDelete(input: [LineItemsBatchDeleteInput]): [BudgetStatementLineItem]
        budgetLineItemUpdate(input: LineItemUpdateInput): [BudgetStatementLineItem]
        budgetLineItemsBatchUpdate(input: [LineItemsBatchUpdateInput]): [BudgetStatementLineItem]
        budgetStatementWalletBatchAdd(input: [BudgetStatementWalletBatchAddInput]): [BudgetStatementWallet]
        budgetStatementFTEAdd(input: BudgetStatementFTEInput): [BudgetStatementFTEs]
        budgetStatementFTEUpdate(input: BudgetStatementFTEUpdateInput): [BudgetStatementFTEs]
        budgetStatementStatusUpdate(input: BudgetStatementStatusInput): BudgetStatement
    }

    input BudgetStatementStatusInput{
        id: ID!
        status: BudgetStatus!
    }

    input BudgetStatementFTEInput {
        budgetStatementId: ID!
        month: String!
        ftes: Float!
        coreUnitId: Float
    }

    input BudgetStatementFTEUpdateInput {
        id: ID!
        budgetStatementId: ID!
        month: String!
        ftes: Float!
        coreUnitId: Float
    }

    input LineItemsBatchUpdateInput {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: CanonicalBudgetCategory
        headcountExpense: Boolean
        budgetCap: Float
        payment: Float
        cuId: ID
        ownerType: String
    }

    input LineItemUpdateInput {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: CanonicalBudgetCategory
        headcountExpense: Boolean
        budgetCap: Float
        payment: Float
    }

    input LineItemsBatchAddInput {
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
        budgetCap: Float
        payment: Float
        cuId: ID
        ownerType: String
    }

    input LineItemsBatchDeleteInput {
        id: ID
        budgetStatementWalletId: ID
        month: String
        position: Int
        group: String
        budgetCategory: String
        forecast: Float
        actual: Float
        comments: String
        canonicalBudgetCategory: String
        headcountExpense: Boolean
        cuId: ID
        ownerType: String
    }

    input BudgetStatementBatchAddInput {
        ownerId: ID
        month: String
        status: BudgetStatus
        ownerCode: String
        ownerType: String
    }

    input BudgetStatementWalletBatchAddInput {
        budgetStatementId: ID
        name: String
        address: String
        currentBalance: Float
        topupTransfer: Float
        comments: String
        cuId: ID
    }

`];

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        budgetStatements: async (_: any, filter: any, { dataSources }: any) => {
            return await dataSources.db.BudgetStatement.getBudgetStatements(filter)
        },
        budgetStatementWallets: async (_: any, { filter }: any, { dataSources }: any) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementWallets(filter);
        },
        budgetStatementLineItems: async (_: any, filter: any, { dataSources }: any) => {
            let queryParams: string[] | undefined = undefined;
            let paramName: string | undefined = undefined;
            let paramValue: string[] | undefined = undefined;
            let secondParamName: string | undefined = undefined;
            let secondParamValue: string[] | undefined = undefined;
            if (filter.filter !== undefined) {
                queryParams = Object.keys(filter.filter);
                if (queryParams.length > 2) {
                    throw "Choose no more than 2 parameters"
                }
                paramName = queryParams[0]
                paramValue = filter?.filter[queryParams[0]];
                secondParamName = queryParams[1];
                secondParamValue = filter?.filter[queryParams[1]];
            }
            return await dataSources.db.BudgetStatement.getBudgetStatementLineItems(
                filter?.limit,
                filter?.offset,
                paramName,
                paramValue,
                secondParamName,
                secondParamValue
            );
        },
        // budgetStatementPayments: async (_, __, { dataSources }) => {
        //     return await dataSources.db.BudgetStatement.getBudgetStatementPayments();
        // },
        // budgetStatementPayment: async (_, { filter }, { dataSources }) => {
        //     const queryParams = Object.keys(filter);
        //     if (queryParams.length > 1) {
        //         throw "Choose one parameter only"
        //     }
        //     const paramName = queryParams[0];
        //     const paramValue = filter[queryParams[0]];
        //     return await dataSources.db.BudgetStatement.getBudgetStatementPayment(paramName, paramValue)
        // }
    },
    CoreUnit: {
        budgetStatements: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            let ownerType = 'CoreUnit';
            if (parent.code === 'DEL') {
                ownerType = 'Delegates'
            }
            const result = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { ownerId: id, ownerType } });
            return result;
        },
    },
    BudgetStatement: {
        activityFeed: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.ChangeTracking.getBsEvents(id)
            return result
        },
        auditReport: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getAuditReports({ budgetStatementId: id });
            return result;
        },
        budgetStatementFTEs: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementFTEs({ budgetStatementId: id });
            return result
        },
        budgetStatementMKRVest: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementMKRVests({ budgetStatementId: id })
            return result;
        },
        budgetStatementWallet: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementWallets({ budgetStatementId: id });
            return result;
        }
    },
    BudgetStatementWallet: {
        budgetStatementLineItem: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementLineItems(undefined, undefined, 'budgetStatementWalletId', id);
            return result;
        },
        budgetStatementPayment: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementPayments({ budgetStatementWalletId: id });
            return result;
        },
        budgetStatementTransferRequest: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementTransferRequests({ budgetStatementWalletId: id });
            return result;
        }
    },
    Mutation: {
        budgetStatementsBatchAdd: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatements")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        if (input.length < 1) {
                            throw new Error('No input data')
                        }
                        if (input[0].ownerType === undefined) {
                            throw new Error('ownerType not defined')
                        }
                        console.log(`adding ${input.length} budgetStatements to CU ${input[0].ownerId}`)
                        const result = await dataSources.db.BudgetStatement.addBatchBudgetStatements(input);
                        return result
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatements')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatements')
            }


        },
        budgetLineItemsBatchAdd: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItems")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const cuIdFromInput = input.pop()
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnits({ filter: { id: cuIdFromInput.cuId } });
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallets({ id: input[0].budgetStatementWalletId })
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: wallet.budgetStatementId, ownerType: cuIdFromInput.ownerType } })
                        if (bStatement.status === 'Final' || bStatement.status === 'Escalated') {
                            throw new Error(`Cannot update statement with status ${bStatement.status}`)
                        }
                        dataSources.db.ChangeTracking.coreUnitBudgetStatementCreated(CU.id, CU.code, CU.shortCode, wallet.budgetStatementId, bStatement.month)
                        //Adding lineItems
                        console.log(`adding ${input.length} line items to CU ${cuIdFromInput.cuId}`,)
                        const result = await dataSources.db.BudgetStatement.addBatchtLineItems(input)
                        return result;
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetLineItems')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemUpdate: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItem")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnits({ filter: { id: user.cuId } });
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallets({ id: input.budgetStatementWalletId })
                        const [ownerTypeResult] = await dataSources.db.BudgetStatement.getBSOwnerType(input.budgetStatementId);
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: wallet.budgetStatementId, ownerType: ownerTypeResult.ownerType } })
                        if (bStatement.status === 'Final' || bStatement.status === 'Escalated') {
                            throw new Error(`Cannot update statement with status ${bStatement.status}`)
                        }
                        dataSources.db.ChangeTracking.coreUnitBudgetStatementUpdated(CU.id, CU.code, CU.shortCode, wallet.budgetStatementId, bStatement.month)
                        //Updating lineItems
                        console.log(`updating line item ${input.id} to CU ${user.cuId}`,)
                        console.log('updating lineItem input', input);
                        const result = await dataSources.db.BudgetStatement.updateLineItem(input)
                        return result;
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetLineItems')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemsBatchUpdate: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItem")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const cuIdFromInput = input.pop()
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnits({ filter: { id: cuIdFromInput.cuId } });
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallets({ id: input[0].budgetStatementWalletId })
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: wallet.budgetStatementId, ownerType: cuIdFromInput.ownerType } })
                        if (bStatement.status === 'Final' || bStatement.status === 'Escalated') {
                            throw new Error(`Cannot update statement with status ${bStatement.status}`)
                        }
                        dataSources.db.ChangeTracking.coreUnitBudgetStatementUpdated(CU.id, CU.code, CU.shortCode, wallet.budgetStatementId, bStatement.month)
                        //Updating lineItems
                        console.log(`updating line items ${input.length} to CU ${cuIdFromInput.cuId}`,)
                        const result = await dataSources.db.BudgetStatement.batchUpdateLineItems(input)
                        return result;
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetLineItems')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemsBatchDelete: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to delete budgetLineItems")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        const cuIdFromInput = input.pop()
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallets({ id: input[0].budgetStatementWalletId })
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatements({ filter: { id: wallet.budgetStatementId, ownerType: cuIdFromInput.ownerType } })
                        if (bStatement.status === 'Final' || bStatement.status === 'Escalated') {
                            throw new Error(`Cannot update statement with status ${bStatement.status}`)
                        }
                        console.log(`deleting ${input.length} line items from CU ${cuIdFromInput.cuId}`);
                        return await dataSources.db.BudgetStatement.batchDeleteLineItems(input)
                    } else {
                        throw new AuthenticationError('You are not authorized to delete budgetLineItems')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to delete budgetLineItems')
            }

        },
        budgetStatementWalletBatchAdd: async (_: any, { input }: any, { user, auth, dataSources }: any) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        const cuIdFromInput = input.pop()
                        console.log(`Adding ${input.length} wallets to CU ${cuIdFromInput.cuId}`)
                        return await dataSources.db.BudgetStatement.addBudgetStatementWallets(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        },
        budgetStatementFTEAdd: async (_: any, { input }: any, { user, auth, dataSources }: any) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`Adding ${input.ftes} ftes to CU ${input.coreUnitId}`)
                        delete input.coreUnitId
                        return await dataSources.db.BudgetStatement.addBudgetStatementFTE(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        },
        budgetStatementFTEUpdate: async (_: any, { input }: any, { user, auth, dataSources }: any) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const [userObj] = await dataSources.db.Auth.getUser('username', user.username)
                    if (userObj.active === false) {
                        throw new Error('Account disabled. Reach admin for more info.')
                    }
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`Updating ${input.ftes} ftes to CU ${input.coreUnitId}`);
                        delete input.coreUnitId;
                        return await dataSources.db.BudgetStatement.updateBudgetStatementFTE(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error: any) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        },
        // budgetStatementStatusUpdate: async (_, { input }, { user, auth, dataSources }) => {
        //     try {
        //         if (!user && !auth) {
        //             throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
        //         } else {
        //             if (input.length < 1) {
        //                 throw new Error('No input data')
        //             }
        //             const canUpdate = await dataSources.db.Auth.canUpdate(user.id, 'CoreUnit', user.cuId)
        //             const [canAudit] = await dataSources.db.Auth.can(user.id, 'Audit', 'CoreUnit');
        //             if (canAudit.count > 0 && (input.status === 'Final' || input.status === 'Review' || input.status === 'Escalated')) {
        //                 console.log(`As an auditor, changing status to ${input.status}`)
        //                 const [result] = await dataSources.db.BudgetStatement.budgetStatementStatusUpdate(input.id, input.status)
        //                 return result
        //             }
        //             else if (canUpdate[0].count > 0) {
        //                 if (user.cuId !== undefined) {
        //                     const cuAuditors = await dataSources.db.Auth.getSystemRoleMembers('CoreUnitAuditor', 'CoreUnit', user.cuId);
        //                     if (cuAuditors.length > 0 && (input.status === 'Draft' || input.status === 'Review')) {
        //                         console.log('With auditors - changing budget statment status to :', input.status);
        //                         const [result] = await dataSources.db.BudgetStatement.budgetStatementStatusUpdate(input.id, input.status)
        //                         return result
        //                     }
        //                     if (cuAuditors.length < 1 && (input.status === 'Draft' || input.status === 'Final')) {
        //                         console.log('No auditors - changing budget statment status to :', input.status);
        //                         const [result] = await dataSources.db.BudgetStatement.budgetStatementStatusUpdate(input.id, input.status)
        //                         return result
        //                     }
        //                 }
        //             }
        //         }
        //     } catch (error) {
        //         throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
        //     }
        // }
    }
}