const createSnapshotAccount = async (snapshotReportId, account, offChain, knex) => {
  let address = account.address.toLowerCase();
  
  console.log(`\nCreating snapshot account for ${address} (off-chain: ${offChain})`);

  const insertedAccount = 
    await knex('SnapshotAccount')
      .insert({
        snapshotId: snapshotReportId,
        accountType: 'singular',
        accountAddress: address,
        accountLabel: account.label,
        offChain: offChain
      })
      .returning('*');

  return insertedAccount[0];
};



export default createSnapshotAccount;