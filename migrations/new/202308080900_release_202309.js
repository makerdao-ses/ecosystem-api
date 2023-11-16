// Up migration that removes start and end columns from Budget Table and adds Start and End columsn to BudgetCap table

export async function up(knex) {
  console.log("Removing Start & End columns from Budget table");
  await knex.schema.alterTable("Budget", function (table) {
    table.dropColumn("start");
    table.dropColumn("end");
  });

  console.log("Adding Start & End columsn to BudgetCap table");
  await knex.schema.alterTable("BudgetCap", function (table) {
    table.timestamp("start");
    table.timestamp("end");
  });
}

// Up migration that adds start and date columns to Budget table and removes Start and End columsn from BudgetCap table

export async function down(knex) {
  console.log("Removing Start & End columns from BudgetCap table");
  await knex.schema.alterTable("BudgetCap", (table) => {
    table.dropColumn("start");
    table.dropColumn("end");
  });

  console.log("Adding Start & End column to Budget Table");
  await knex.schema.alterTable("Budget", (table) => {
    table.timestamp("start");
    table.timestamp("end");
  });
}
