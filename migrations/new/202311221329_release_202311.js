// Migration that adds new name, image and description columsn to AnalyticsDimension table

export async function up(knex) {
    console.log("Adding new name, image and description columns to AnalyticsDimension table...");

    await knex.schema.alterTable("AnalyticsDimension", function (table) {
        table.string("name", 255)
        table.string("image", 1000)
        table.text("description");
    });
}

export async function down(knex) {
    console.log("Reverting the addition of new name, image and description columns to AnalyticsDimension table...");

    await knex.schema.alterTable("AnalyticsDimension", function (table) {
        table.dropColumn("name");
        table.dropColumn("image");
        table.dropColumn("description");
    });
}
