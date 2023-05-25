import fetch from 'node-fetch';
import knex from 'knex';

// Connect to database selected in the .env file
const db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
});

const fillSnapshotTable = async () => {

  const ownerTypesAndIds = await db('BudgetStatement')
    .distinct('ownerType', 'ownerId')
    .select();

    console.log(ownerTypesAndIds);

  let sCount = 0;

  for (const { ownerType, ownerId } of ownerTypesAndIds) {
      
      const start = '1999-01-01 12:00:00+00';
      const end = '2099-01-01 12:00:00+00';
  
      const existingSnapshot = await db('Snapshot')
        .select('id')
        .where({
          start,
          end,
          ownerType: ownerType+'Draft',
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
          ownerType: ownerType+'Draft',
          ownerId,
        });
  
      sCount++;
    }
    console.log(`${sCount} rows inserted into Snapshot table`);

};


const fillSnapshotAccountTable = async () => {
  const rows = await db.raw(`
  SELECT cu.code, bsw.address, bs."ownerType", bs."ownerId"
  FROM "CoreUnit" AS cu
  LEFT JOIN "BudgetStatement" AS bs ON bs."ownerId" = cu.id
  LEFT JOIN "BudgetStatementWallet" AS bsw ON bsw."budgetStatementId" = bs.id
  LEFT JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId"
  WHERE bsw.address IS NOT NULL
  GROUP BY cu.code,  bs."ownerType", bsw.address, bs."ownerId";
  `);

  const snapshots = await db('Snapshot')
    .select('id', 'start', 'end', 'ownerType', 'ownerId');

  
  
  const snapshotAccounts = [];

  for (const snapshot of snapshots) {
    const filteredRows = rows.rows.filter((row) => {
      return (
        row.ownerType + 'Draft' === snapshot.ownerType &&
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