//Up migration creates Budget, BudgetCap and ExpenseCategory tables
export async function up(knex) {
  console.log("Creating Budget, BudgetCap and ExpenseCategory tables...");

  await knex.schema.createTable("Budget", (table) => {
    table.increments("id").primary();
    table.integer("parentId").unsigned().references("id").inTable("Budget");
    table.string("name");
    table.string("code");
    table.timestamp("start");
    table.timestamp("end");
  });

  await knex.schema.createTable("ExpenseCategory", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.boolean("headcountExpense");
    table.integer("order").unsigned();
  });

  await knex.schema.createTable("BudgetCap", (table) => {
    table.increments("id").primary();
    table.integer("budgetId").unsigned().references("id").inTable("Budget");
    table
      .integer("expenseCategoryId")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("ExpenseCategory");
    table.specificType("amount", "numeric");
    table.string("currency");
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  await knex.schema.dropTable("BudgetCap");
  await knex.schema.dropTable("ExpenseCategory");
  await knex.schema.dropTable("Budget");
}
