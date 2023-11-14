//Up migration adds type column to CoreUnit table
export async function up(knex) {
  console.log("Adding type column to CoreUnit table...");

  await knex.schema.alterTable("CoreUnit", (table) => {
    table
      .enu("type", null, {
        useNative: true,
        existingType: true,
        enumName: "ResourceType",
      })
      .notNullable()
      .defaultTo("CoreUnit");
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log("Reverting the change that added type column CoreUnit table...");

  await knex.schema.alterTable("CoreUnit", (table) => {
    table.dropColumn("type");
  });
}
