import DataLoader from 'dataloader';
import { 
    getAnalyticsForecast,
    getAnalyticsActuals,
    getAnalyticsOnChain,
    getAnalyticsOffChain,
    getAnalyticsNetOutflow,
} from '../modules/BudgetStatement/schema/utils.js';

export const createDataLoaders = (dataSources: any) => {
    return {
        getBudgetStatementLineItemsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key =>
                dataSources.BudgetStatement.getBudgetStatementLineItems(
                    undefined,
                    undefined,
                    "budgetStatementWalletId",
                    key
                )
            ));
            return results;
        }),
        getBudgetStatementPaymentsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key =>
                dataSources.BudgetStatement.getBudgetStatementPayments({
                    budgetStatementWalletId: key
                })
            ));
            return results;
        }),
        getBudgetStatementTransferRequestsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key =>
                dataSources.BudgetStatement.getBudgetStatementTransferRequests({
                    budgetStatementWalletId: key
                })
            ));
            return results;
        }),
        getBudgetStatementsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(async key => {
                const [ownerId, ownerType] = key.split('-');
                return dataSources.BudgetStatement.getBudgetStatements({
                    filter: {
                        ownerId: [ownerId],
                        ownerType: [ownerType]
                    }
                });
            }));
            return results
        }),
        getBsEventsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.ChangeTracking.getBsEvents(id)
            ));
            return results;
        }),
        getAuditReportsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.BudgetStatement.getAuditReports({
                    budgetStatementId: id
                })
            ));
            return results;
        }),
        getBudgetStatementFTEsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.BudgetStatement.getBudgetStatementFTEs({
                    budgetStatementId: id
                })
            ));
            return results;
        }),
        getBudgetStatementMKRVestsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.BudgetStatement.getBudgetStatementMKRVests({
                    budgetStatementId: id
                })
            ));
            return results;
        }),
        getBudgetStatementWalletsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.BudgetStatement.getBudgetStatementWallets({
                    budgetStatementId: id
                })
            ));
            return results;
        }),
        getAnalyticsForecastLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key => {
                const [convertedMonth, ownerType, ownerId] = key.split('-');
                return getAnalyticsForecast(
                    dataSources.Analytics,
                    convertedMonth,
                    ownerType,
                    parseInt(ownerId)
                );
            }));
            return results;
        }),
        getAnalyticsActualsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key => {
                const [convertedMonth, ownerType, ownerId] = key.split('-');
                return getAnalyticsActuals(
                    dataSources.Analytics,
                    convertedMonth,
                    ownerType,
                    parseInt(ownerId)
                );
            }));
            return results;
        }),
        getAnalyticsOnChainLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key => {
                const [convertedMonth, ownerType, ownerId] = key.split('-');
                return getAnalyticsOnChain(
                    dataSources.Analytics,
                    convertedMonth,
                    ownerType,
                    parseInt(ownerId)
                );
            }));
            return results;
        }),
        getAnalyticsOffChainLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key => {
                const [convertedMonth, ownerType, ownerId] = key.split('-');
                return getAnalyticsOffChain(
                    dataSources.Analytics,
                    convertedMonth,
                    ownerType,
                    parseInt(ownerId)
                );
            }));
            return results;
        }),
        getAnalyticsNetOutflowLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(key => {
                const [convertedMonth, ownerType, ownerId] = key.split('-');
                return getAnalyticsNetOutflow(
                    dataSources.Analytics,
                    convertedMonth,
                    ownerType,
                    parseInt(ownerId)
                );
            }));
            return results;
        }),
        mip40BudgetLineItemsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await dataSources.Mip.getMip40BudgetLineItemsBatch(keys);
            const resultsMap = new Map();
            results.forEach((item: any) => {
                if (!resultsMap.has(item.mip40WalletId)) {
                    resultsMap.set(item.mip40WalletId, []);
                }
                resultsMap.get(item.mip40WalletId).push(item);
            });
            return keys.map((key) => resultsMap.get(key) || []);
        }),
        mip39Loader: new DataLoader(async (keys: readonly string[]) => {
            const results = await dataSources.Mip.getMip39sBatch(keys);
            const resultsMap = new Map();
            results.forEach((item: any) => {
                if (!resultsMap.has(item.mipId)) {
                    resultsMap.set(item.mipId, []);
                }
                resultsMap.get(item.mipId).push(item);
            });
            return keys.map((key) => resultsMap.get(key) || []);
        }),
    };
};