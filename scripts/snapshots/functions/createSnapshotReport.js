const createSnapshotReport = async (ownerType, ownerId, month, knex) => {
  console.log(
    `\nCreating snapshot report for ${ownerType} ${ownerId}, month ${month}`,
  );

  const snapshotKey = {
    ownerType: month ? ownerType : ownerType + "Draft",
    ownerId,
    month: month ? convertMonthStringToDate(month) : null,
  };

  const existingSnapshots = await knex("Snapshot")
    .select("id")
    .where(snapshotKey);
  for (let i = 0; i < existingSnapshots.length; i++) {
    await removeSnapshot(existingSnapshots[i].id, knex);
  }

  const newSnapshot = await knex("Snapshot")
    .insert({
      ...snapshotKey,
      start: null,
      end: null,
      created: knex.fn.now(),
    })
    .returning("id");

  return {
    id: newSnapshot[0].id,
  };
};

const convertMonthStringToDate = (month) => {
  const monthPattern = /^[0-9]{4}[\/\-][0-9]{2}([\/\-]01)*$/;
  if (!monthPattern.test(month)) {
    throw new Error(
      `"${month}" is not a valid month string. Use YYYY/MM or YYYY-MM-01 format.`,
    );
  }

  return new Date(
    parseInt(month.slice(0, 4)),
    parseInt(month.slice(5, 7)) - 1,
    1,
  );
};

const removeSnapshot = async (snapshotId, knex) => {
  const snapshotAccountIds = await knex("SnapshotAccount")
    .where("snapshotId", snapshotId)
    .select("id");

  console.log(
    `\nRemoving Snapshot with id: ${snapshotId} with accounts`,
    snapshotAccountIds.map((r) => r.id),
  );

  const deletedTransactions = await knex("SnapshotAccountTransaction")
    .whereIn(
      "snapshotAccountId",
      snapshotAccountIds.map((r) => r.id),
    )
    .del();

  console.log(` ...${deletedTransactions} deleted transactions`);

  const deletedBalances = await knex("SnapshotAccountBalance")
    .whereIn(
      "snapshotAccountId",
      snapshotAccountIds.map((r) => r.id),
    )
    .del();

  console.log(` ...${deletedBalances} deleted balances`);

  await knex("SnapshotAccount").where("snapshotId", snapshotId).update({
    groupAccountId: null,
    upstreamAccountId: null,
  });

  const deletedAccounts = await knex("SnapshotAccount")
    .where("snapshotId", snapshotId)
    .del();

  console.log(` ...${deletedAccounts} deleted accounts`);

  await knex("Snapshot").where("id", snapshotId).del();
};

export default createSnapshotReport;
