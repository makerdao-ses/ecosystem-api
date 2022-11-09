import _ from 'lodash';

import {
    typeDefs as BudgetStatement,
    resolvers as BudgetStatementResolvers
} from './schema/budgetStatement.js';

const typeDefs = [
    BudgetStatement,
    BudgetStatementComment
];

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        budgetStatements: async (_, filter, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatements(filter.limit, filter.offset)
        },
        budgetStatement: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 2) {
                throw "Choose no more than 2 parameters"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const secondParamName = queryParams[1];
            const secondParamValue = filter[queryParams[1]];
            return await dataSources.db.BudgetStatement.getBudgetStatement(paramName, paramValue, secondParamName, secondParamValue)
        },
        auditReports: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getAuditReports();
        },
        auditReport: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getAuditReport(paramName, paramValue)
        },
        budgetStatementFTEs: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementFTEs();
        },
        budgetStatementFTE: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getBudgetStatementFTE(paramName, paramValue)
        },
        budgetStatementMKRVests: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementMKRVests();
        },
        budgetStatementMKRVest: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getBudgetStatementMKRVest(paramName, paramValue)
        },
        budgetStatementWallets: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementWallets();
        },
        budgetStatementWallet: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getBudgetStatementWallet(paramName, paramValue)
        },
        budgetStatementLineItems: async (_, filter, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementLineItems(filter.limit, filter.offset);
        },
        budgetStatementLineItem: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 2) {
                throw "Choose no more than 2 parameters"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const secondParamName = queryParams[1];
            const secondParamValue = filter[queryParams[1]];
            return await dataSources.db.BudgetStatement.getBudgetStatementLineItem(paramName, paramValue, secondParamName, secondParamValue)
        },
        budgetStatementPayments: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementPayments();
        },
        budgetStatementPayment: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getBudgetStatementPayment(paramName, paramValue)
        },
        budgetStatementTransferRequests: async (_, __, { dataSources }) => {
            return await dataSources.db.BudgetStatement.getBudgetStatementTransferRequests()
        },
        budgetStatementTransferRequest: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.BudgetStatement.getBudgetStatementTransferRequest(paramName, paramValue)
        }

    },
    CoreUnit: {
        budgetStatements: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementByCuId(id);
            return result;
        },
    },
    BudgetStatement: {
        auditReport: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getAuditReports(id);
            return result;
        },
        budgetStatementFTEs: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementFTEs(id);
            return result
        },
        budgetStatementMKRVest: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementMKRVests(id)
            return result;
        },
        budgetStatementWallet: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementWallets(id);
            return result;
        }
    },
    BudgetStatementWallet: {
        budgetStatementLineItem: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getLineItemsByWalletId(id);
            return result;
        },
        budgetStatementPayment: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementPayments(id);
            return result;
        },
        budgetStatementTransferRequest: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.BudgetStatement.getBudgetStatementTransferRequests(id);
            return result;
        }
    },
    Mutation: {
        budgetStatementsBatchAdd: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatements")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        if (input.length < 1) {
                            throw new Error('"No input data')
                        }
                        console.log(`adding ${input.length} budgetStatements to CU ${user.cuId}`)
                        const result = await dataSources.db.BudgetStatement.addBatchBudgetStatements(input);
                        return result
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatements')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatements')
            }


        },
        budgetLineItemsBatchAdd: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItems")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnit('id', user.cuId);
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallet('id', input[0].budgetStatementWalletId)
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatement('id', wallet.budgetStatementId)
                        dataSources.db.ChangeTracking.coreUnitBudgetStatementCreated(CU.id, CU.code, CU.shortCode, wallet.budgetStatementId, bStatement.month)
                        //Adding lineItems
                        console.log(`adding ${input.length} line items to CU ${user.cuId}`,)
                        const result = await dataSources.db.BudgetStatement.addBatchtLineItems(input)
                        return result;
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetLineItems')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemUpdate: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItem")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnit('id', user.cuId);
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallet('id', input.budgetStatementWalletId)
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatement('id', wallet.budgetStatementId)
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
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemsBatchUpdate: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetLineItem")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        //Tacking Change
                        const [CU] = await dataSources.db.CoreUnit.getCoreUnit('id', user.cuId);
                        const [wallet] = await dataSources.db.BudgetStatement.getBudgetStatementWallet('id', input[0].budgetStatementWalletId)
                        const [bStatement] = await dataSources.db.BudgetStatement.getBudgetStatement('id', wallet.budgetStatementId)
                        dataSources.db.ChangeTracking.coreUnitBudgetStatementUpdated(CU.id, CU.code, CU.shortCode, wallet.budgetStatementId, bStatement.month)
                        //Updating lineItems
                        console.log(`updating line items ${input.length} to CU ${user.cuId}`,)
                        const result = await dataSources.db.BudgetStatement.batchUpdateLineItems(input)
                        return result;
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetLineItems')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetLineItems')
            }
        },
        budgetLineItemsBatchDelete: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to delete budgetLineItems")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`deleting ${input.length} line items from CU ${user.cuId}`);
                        return await dataSources.db.BudgetStatement.batchDeleteLineItems(input)
                    } else {
                        throw new AuthenticationError('You are not authorized to delete budgetLineItems')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to delete budgetLineItems')
            }

        },
        budgetStatementWalletBatchAdd: async (_, { input }, { user, auth, dataSources }) => { // this one
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`Adding ${input.length} wallets to CU ${user.cuId}`)
                        return await dataSources.db.BudgetStatement.addBudgetStatementWallets(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        },
        budgetStatementFTEAdd: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`Adding ${input.ftes} ftes to CU ${user.cuId}`)
                        return await dataSources.db.BudgetStatement.addBudgetStatementFTE(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        },
        budgetStatementFTEUpdate: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login to update budgetStatementWallets")
                } else {
                    const allowed = await auth.canUpdate('CoreUnit', user.cuId)
                    if (allowed[0].count > 0) {
                        console.log(`Updating ${input.ftes} ftes to CU ${user.cuId}`)
                        return await dataSources.db.BudgetStatement.updateBudgetStatementFTE(input);
                    } else {
                        throw new AuthenticationError('You are not authorized to update budgetStatementWallets')
                    }
                }
            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to update budgetStatementWallets')
            }
        }
    }
}