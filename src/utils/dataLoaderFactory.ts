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
        getMipsByCuIdLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMips({ cuId: parseInt(id) })
            ));
            return results;
        }),
        getMipReplacesLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMipReplaces({ newMip: id })
            ));
            return results;
        }),
        getMip39ByMipIdLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip39s({ mipId: id })
            ));
            return results;
        }),
        getMip40ByCuMipIdLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip40s({ cuMipId: id })
            ));
            return results;
        }),
        getMip41ByCuMipIdLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip41s({ cuMipId: id })
            ));
            return results;
        }),
        getMip40BudgetPeriodsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip40BudgetPeriods({ mip40Id: id })
            ));
            return results;
        }),
        getMip40WalletsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip40Wallets({ mip40Id: id })
            ));
            return results;
        }),
        getMip40BudgetLineItemsLoader: new DataLoader(async (keys: readonly string[]) => {
            const results = await Promise.all(keys.map(id =>
                dataSources.Mip.getMip40BudgetLineItems({ mip40WalletId: id })
            ));
            return results;
        }),
    };
};