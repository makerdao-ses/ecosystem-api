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

  
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);
  const newestMonth = now.toISOString();
  const oldestMonth = '2021-01-01T12:00:00.000Z';
  

  const ownerTypesAndIds = await db('BudgetStatement')
    .distinct('ownerType', 'ownerId')
    .select();

  console.log(oldestMonth);
  console.log(newestMonth);

  let sCount = 0;

  for (const { ownerType, ownerId } of ownerTypesAndIds) {
    for (let d = new Date(oldestMonth); d <= new Date(newestMonth); d.setUTCMonth(d.getUTCMonth() + 1)) {
      
      const start = startTimestamp(d.toISOString());
      const end = endTimestamp(d.toISOString());
  
      const existingSnapshot = await db('Snapshot')
        .select('id')
        .where({
          start,
          end,
          ownerType,
          ownerId,
        })
        .first();
  
      if (existingSnapshot) {
        continue; // Row already exists, skip inserting
      }
  
      await db('Snapshot')
        .insert({
          start,
          end,
          ownerType,
          ownerId,
        });
  
      sCount++;
    }
  }
  

  console.log(`${sCount} rows inserted into Snapshot table`);
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

  const snapshots = await db('Snapshot')
    .select('id', 'start', 'end', 'ownerType', 'ownerId');

  
  
  const snapshotAccounts = [];

  for (const snapshot of snapshots) {
    const filteredRows = rows.rows.filter((row) => {
      return (
        row.month >= snapshot.start &&
        row.month <= snapshot.end &&
        row.ownerType === snapshot.ownerType &&
        row.ownerId === snapshot.ownerId
      );
    });

    for (const row of filteredRows) {
      
      const existingAccount = await db('SnapshotAccount')
        .where({
          snapshotId: snapshot.id,
          accountAddress: row.address,
        })
        .first();

      if (existingAccount) {
        continue;
      }

      snapshotAccounts.push({
        snapshotId: snapshot.id,
        accountType: 'singular',
        accountAddress: row.address,
        accountLabel: row.code,
      });
    }
  }

  await db('SnapshotAccount').insert(snapshotAccounts);

  console.log(`${snapshotAccounts.length} rows inserted into SnapshotAccount table`);
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