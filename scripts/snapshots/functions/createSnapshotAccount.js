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

export default createSnapshotAccount;