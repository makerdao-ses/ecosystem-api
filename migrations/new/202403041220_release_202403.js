// Migration that adds a new subtitle column to the Budget table

export async function up(knex) {
    console.log("Adding new subtitle column to Budget table...");

    await knex.schema.alterTable("Budget", function (table) {
        table.string("subtitle", 255);
    });
}

export async function down(knex) {
    console.log("Reverting the addition of new subtitle column to Budget table...");

    await knex.schema.alterTable("Budget", function (table) {
        table.dropColumn("subtitle");
    });
}