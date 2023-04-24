import fetch from 'node-fetch';
import knex from 'knex';

// Connect to database selected in the .env file
const db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

const startTimestamp = (month) => {
  const date = new Date(month);
  date.setUTCDate(15);
  date.setUTCMonth(date.getUTCMonth() + 1); // add 1 to get the next month
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString();
};

const endTimestamp = (month) => {
  const date = new Date(month);
  date.setUTCDate(15);
  date.setUTCMonth(date.getUTCMonth() + 2);
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString();
}

const fillSnapshotTable = async () => {
  const cuBs = await db
    .select('ownerType', 'ownerId', 'month')
    .distinctOn(['ownerType', 'ownerId', 'month'])
    .from('BudgetStatement');

  let sCount = 0;

  const snapshotData = await Promise.all(
    cuBs.map(async (row) => {
      const [existingSnapshot] = await db
        .select('id')
        .from('Snapshot')
        .where({
          start: startTimestamp(row.month),
          end: endTimestamp(row.month),
          ownerType: row.ownerType,
          ownerId: row.ownerId,
        })
        .limit(1);

      if (existingSnapshot) {
        return null; // Row already exists, skip inserting
      }

      await db('Snapshot')
        .insert({
          start: startTimestamp(row.month),
          end: endTimestamp(row.month),
          ownerType: row.ownerType,
          ownerId: row.ownerId,
        });

      sCount++;

      return {};
    })
  );

  console.log(`${sCount} rows inserted into SnapshotAccount table`);
};

const fillSnapshotAccountTable = async () => {
  const rows = await db.raw(`
    SELECT DISTINCT ON (cu.code, bs.month, bsw.address) cu.code, bsw.address, bs."ownerType", bs."ownerId", bs.month, bs.id
    FROM "CoreUnit" as cu
    LEFT JOIN "BudgetStatement" as bs ON bs."ownerId" = cu.id
    LEFT JOIN "BudgetStatementWallet" as bsw ON bsw."budgetStatementId" = bs.id
    LEFT JOIN "BudgetStatementLineItem" as bsli ON bsw.id = bsli."budgetStatementWalletId"
    WHERE bsw.address NOTNULL
  `);

  let count = 0;

  await Promise.all(
    rows.rows.map(async (row) => {
      const [snapshot] = await db('Snapshot')
        .select('id')
        .where({
          start: startTimestamp(row.month),
          end: endTimestamp(row.month),
          ownerType: row.ownerType,
          ownerId: row.ownerId,
        })
        .limit(1);

      if (!snapshot) {
        return null;
      }

      const [existingAccount] = await db('SnapshotAccount')
        .where({
          snapshotId: snapshot.id,
          accountAddress: row.address,
        })
        .select('id');

      if (existingAccount) {
        return null;
      }

      await db('SnapshotAccount').insert({
        snapshotId: snapshot.id,
        accountType: 'singular',
        accountAddress: row.address,
        accountLabel: row.code,
      });

      count++;

      return { success: true };
    })
  );

  console.log(`${count} rows inserted into SnapshotAccount table`);
};

fillSnapshotTable()
  .then(() => {
    console.log('Snapshot table filled successfully');
    return fillSnapshotAccountTable();
  })
  .then(() => {
    console.log('SnapshotAccount table filled successfully');
  })
  .catch((error) => console.error(error))
  .finally(() => db.destroy());
