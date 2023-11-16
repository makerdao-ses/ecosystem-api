// Up migration adds currency column in BudgetStatementLineItem table

export async function up(knex) {
  console.log("Adding currency column in BudgetStatementLineItem table...");

  await knex.schema.alterTable("BudgetStatementLineItem", (table) => {
    table.string("currency").notNullable().defaultTo("DAI");
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log(
    "Reverting the change that added currency column in BudgetStatementLineItem table...",
  );

  await knex.schema.alterTable("BudgetStatementLineItem", (table) => {
    table.dropColumn("currency");
  });
}
