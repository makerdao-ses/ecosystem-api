//Up migration adds the walletBalance column to the budgetStatementTransferRequest table
export async function up(knex) {
  await knex.schema.alterTable(
    "BudgetStatementTransferRequest",
    function (table) {
      table.decimal("walletBalance", 14, 2);
    },
  );
}

//Down migration reverts the up migration change
export async function down(knex) {
  await knex.schema.alterTable(
    "BudgetStatementTransferRequest",
    function (table) {
      table.dropColumn("walletBalance");
    },
  );
}
