//Up migration creates the Snapshot table and subtables...
export async function up(knex) {

  console.log("Creating AccountTransactions table...");

  return knex.schema
  .alterTable('BudgetStatementTransferRequest', function(table) {
    table.specificType('walletBalance', 'numeric').alter();
    table.specificType('targetAmount', 'numeric').alter();
    table.specificType('requestAmount', 'numeric').alter();
  })
  .createTable('Snapshot', function(table) {
    table.increments('id').primary();
    table.timestamp('start').notNullable();
    table.timestamp('end').notNullable();
    table.string('ownerType').notNullable();
    table.integer('ownerId');
    })
  .createTable('SnapshotAccount', function(table) {
    table.increments('id').primary();
    table.integer('snapshotId').unsigned().notNullable();
    table.foreign('snapshotId').references('id').inTable('Snapshot');
    table.string('accountLabel').notNullable();
    table.string('accountOwnerCode');
    table.string('accountType').notNullable();
    table.string('accountAddress').notNullable().unique();
    table.integer('groupAccountId').unsigned();
    table.foreign('groupAccountId').references('id').inTable('SnapshotAccount');
    table.integer('upstreamAccountId').unsigned();
    table.foreign('upstreamAccountId').references('id').inTable('SnapshotAccount');
  })
  .createTable('SnapshotAccountTransaction', function(table) {
    table.increments('id').primary();
    table.integer('snapshotAccountId').unsigned().notNullable();
    table.foreign('snapshotAccountId').references('id').inTable('SnapshotAccount');
    table.integer('block').notNullable();
    table.timestamp('timestamp').notNullable();
    table.string('tx_hash').notNullable();
    table.string('token').notNullable();
    table.string('account').notNullable();
    table.string('counterParty').notNullable();
    table.specificType('amount', 'numeric');
  })
  .createTable('SnapshotAccountBalance', function(table) {
    table.increments('id').primary();
    table.integer('snapshotAccountId').unsigned().notNullable();
    table.foreign('snapshotAccountId').references('id').inTable('SnapshotAccount');
    table.string('token').notNullable();
    table.specificType('initialBalance', 'numeric');
    table.specificType('newBalance', 'numeric');
  });

}

//Down migration reverts the up migration change  
export async function down(knex) {

  console.log('Removing AccountTransactions table...');

  await knex.schema
    .alterTable('BudgetStatementTransferRequest', function(table) {
    table.decimal('walletBalance', 14, 2).alter();
    table.decimal('targetAmount', 14, 2).alter();
    table.decimal('requestAmount', 14, 2).alter();
    });
    // Drop foreign key constraint in SnapshotAccountTransaction table
  await knex.raw('ALTER TABLE "SnapshotAccountTransaction" DROP CONSTRAINT "snapshotaccounttransaction_snapshotaccountid_foreign";');

  // Drop dependent SnapshotAccountBalance table
  await knex.schema.dropTableIfExists('SnapshotAccountBalance');

  // Drop SnapshotAccount and Snapshot tables
  await knex.schema.dropTableIfExists('SnapshotAccount');
  await knex.schema.dropTableIfExists('Snapshot');

}