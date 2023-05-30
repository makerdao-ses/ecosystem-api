const createSnapshotAccount = async (snapshotReportId, account, knex) => {
    
    console.log(`Creating snapshot accounts for ${account.address}`);

    let existingAccount = await checkSnapshotAccount(snapshotReportId, account.address, knex);
    let accountData;

    if (existingAccount) {
        accountData = existingAccount;
      } else {
        // Insert a new account and retrieve the id
          if (snapshotReportId != null) {
            const insertedAccount = await knex('SnapshotAccount')
              .insert({
                snapshotId: snapshotReportId,
                accountType: 'singular',
                accountAddress: account.address,
                accountLabel: account.label
              })
              .returning('*');
            accountData = insertedAccount[0];
          }
        }

    return accountData;
};

// Check for existing SnapshotAccount entry
const checkSnapshotAccount = async (snapshotId, address, knex) => {

    const existingAccount = await knex('SnapshotAccount')
      .select('SnapshotAccount.*')
      .join('Snapshot', 'Snapshot.id', '=', 'SnapshotAccount.snapshotId')
      .where({ 
        accountAddress: address
      })
      .andWhere({snapshotId: snapshotId});

    return existingAccount[0] || null;
  };

export default createSnapshotAccount;