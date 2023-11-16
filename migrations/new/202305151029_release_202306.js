//Up migration adds budgetId column to budgetStatementLineItem, CoreUnit and Snapshot account tables
export async function up(knex) {
  console.log(
    "Adding budgetId column to budgetStatementLineItem, CoreUnit and SnapshotAccount tables...",
  );

  await knex.schema.alterTable("BudgetStatementLineItem", (table) => {
    table.integer("budgetId");
  });

  await knex.schema.alterTable("CoreUnit", (table) => {
    table.integer("budgetId").nullable();
  });

  await knex.schema.alterTable("SnapshotAccount", (table) => {
    table.integer("budgetId").nullable();
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log(
    "Reverting the change that added budgetId columns to BudgetStatmentLineItem, CoreUnit and SnapshotAccount tables...",
  );

  await knex.schema.alterTable("BudgetStatementLineItem", (table) => {
    table.dropColumn("budgetId");
  });

  await knex.schema.alterTable("CoreUnit", (table) => {
    table.dropColumn("budgetId");
  });

  await knex.schema.alterTable("SnapshotAccount", (table) => {
    table.dropColumn("budgetId");
  });
}
