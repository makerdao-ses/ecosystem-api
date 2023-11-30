// Migration that adds new name, image and description columsn to AnalyticsDimension table

export async function up(knex) {
    console.log("Adding new name, image and description columns to AnalyticsDimension table...");

    await knex.schema.alterTable("AnalyticsDimension", function (table) {
        table.string("label", 255)
        table.string("icon", 1000)
        table.text("description");
    });
}

export async function down(knex) {
    console.log("Reverting the addition of new name, image and description columns to AnalyticsDimension table...");

    await knex.schema.alterTable("AnalyticsDimension", function (table) {
        table.dropColumn("label");
        table.dropColumn("icon");
        table.dropColumn("description");
    });
}
