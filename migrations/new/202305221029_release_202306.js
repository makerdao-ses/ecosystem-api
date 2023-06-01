//Up migration adds budgetId column to budgetStatementLineItem, CoreUnit and Snapshot account tables
export async function up(knex) {

  console.log("Making snapshot start, end and snapshot account accountAddress nullable...");

  await knex.schema.alterTable('Snapshot', (table) => {
    table.timestamp('start').nullable().alter();
    table.timestamp('end').nullable().alter();
  });

  await knex.schema.alterTable('SnapshotAccount', (table) => {
    table.string('accountAddress').nullable().alter();
  });
}

//Down migration reverts the up migration change
export async function down(knex) {

  console.log('Reverting the change that Snapshot start, end and SnapshotAccount accountAddress nullable...');

  await knex.schema.alterTable('Snapshot', (table) => {
    table.timestamp('start').notNullable().alter();
    table.timestamp('end').notNullable().alter();
  });

  await knex.schema.alterTable('SnapshotAccount', (table) => {
    table.string('accountAddress').notNullable().alter();
  });

}