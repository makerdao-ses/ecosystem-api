const createSnapshotReport = async (ownerType, ownerId, monthInfo, knex) => {

  console.log(`Creating snapshot report for ${ownerType} ${ownerId}, month ${monthInfo.month}`);

  if (!monthInfo.month) {
    ownerType = ownerType + 'Draft';
  }

  console.log('OwnerType: ', ownerType);

  const existingSnapshots = await knex('Snapshot')
    .select('id')
    .where({
      ownerType: ownerType,
      ownerId,
    });

  existingSnapshots.forEach(s => {
    removeSnapshot(s.id, knex);
  });

  const newSnapshot = await knex('Snapshot')
    .insert({
      start: monthInfo.firstDay,
      end: monthInfo.lastDay,
      month: monthInfo.lastDay,
      ownerType: ownerType,
      ownerId,
    }).returning('id');

  return {
    id: newSnapshot[0].id
  };
};

const removeSnapshot = async (snapshotId, knex) => {
  const snapshotAccountIds = await knex('SnapshotAccount')
    .where('snapshotId', snapshotId)
    .select('id');

  console.log(`Removing Snapshot with id: ${snapshotId} with accounts`, snapshotAccountIds.map(r => r.id));

  const deletedTransactions = await knex('SnapshotAccountTransaction')
    .whereIn('snapshotAccountId', snapshotAccountIds.map(r => r.id))
    .del();

  console.log(deletedTransactions, `deleted transactions`);

  const deletedBalances = await knex('SnapshotAccountBalance')
    .whereIn('snapshotAccountId', snapshotAccountIds.map(r => r.id))
    .del();

  console.log(deletedBalances, `deleted balances`);

  await knex('SnapshotAccount')
    .where('snapshotId', snapshotId)
    .update({
      groupAccountId: null,
      upstreamAccountId: null
    });

  const deletedAccounts = await knex('SnapshotAccount')
    .where('snapshotId', snapshotId)
    .del();

  console.log(deletedAccounts, 'deleted accounts');

  await knex('Snapshot')
    .where('id', snapshotId)
    .del();
};

export default createSnapshotReport;