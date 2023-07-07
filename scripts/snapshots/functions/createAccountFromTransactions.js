import createSnapshotAccount from "./createSnapshotAccount.js";
import processTransactions from "./processTransactions.js";

export default async function createAccountFromTransactions(snapshotReportId, accountInfo, transactions, monthInfo, invertFlow, knex) {
    const accountBasics = {
        type: accountInfo.category,
        label: accountInfo.name,
        address: accountInfo.address,
        offChain: accountInfo.offChain,
    };

    const snapshotAccount = await createSnapshotAccount(snapshotReportId, accountInfo, knex);
    const txsProcessingInfo = await processTransactions(snapshotAccount, transactions, monthInfo, invertFlow, knex);
    
    return {
        accountId: snapshotAccount.id, 
        ...accountBasics, 
        ...txsProcessingInfo
    };
};