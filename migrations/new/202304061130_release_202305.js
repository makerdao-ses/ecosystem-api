//Up migration adds the BudgetCategory table...
export async function up(knex) {
  console.log("Creating BudgetCategory table...");

  await knex.schema.createTable("BudgetCategory", (table) => {
    table.increments("id");
    table.integer("parentId");
    table.string("label");
    table.string("flag");
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  await knex.schema.dropTable("BudgetCategory");
}
