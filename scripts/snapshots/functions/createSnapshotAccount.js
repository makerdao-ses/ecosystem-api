const createSnapshotAccount = async (snapshotReportId, account, offChain, knex) => {

  let address = account.address.toLowerCase();
  console.log(`Creating snapshot accounts for ${address}`);

  let accountData;

  const insertedAccount = await knex('SnapshotAccount')
    .insert({
      snapshotId: snapshotReportId,
      accountType: 'singular',
      accountAddress: address,
      accountLabel: account.label,
      offChain: offChain
    })
    .returning('*');
  accountData = insertedAccount[0];



  return accountData;
};



export default createSnapshotAccount;