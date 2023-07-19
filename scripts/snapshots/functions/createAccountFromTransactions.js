import processTransactions from "./processTransactions.js";

const createAccountFromTransactions = async (snapshotReportId, accountInfo, transactions, monthInfo, invertFlow, knex) => {
    const accountBasics = {
        type: accountInfo.type,
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

const createSnapshotAccount = async (snapshotReportId, accountInfo, knex) => {
    console.log(`\nCreating snapshot account for`, accountInfo);
  
    const insertedAccount = 
      await knex('SnapshotAccount')
        .insert({
          snapshotId: snapshotReportId,
          accountType: 'singular',
          accountAddress: accountInfo.address,
          accountLabel: accountInfo.name,
          offChain: accountInfo.offChain
        })
        .returning('*');
  
    return insertedAccount[0];
  };

export { 
    createAccountFromTransactions,
    createSnapshotAccount
};