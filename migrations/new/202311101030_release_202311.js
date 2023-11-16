// Alter the index in PriceData table

export async function up(knex) {
    console.log("Altering index in PriceData table...");
    await knex.schema.alterTable("PriceData", function (table) {
        table.dropIndex(["market", "metric", "start", "end"]);
        table.index(["market"])
        table.index(["metric"])
        table.index(["start"])
        table.index(["end"])
    })
}

export async function down(knex) {
    console.log("Reverting the change in index in PriceData table...");
    await knex.schema.alterTable("PriceData", function (table) {
        table.index(["market", "metric", "start", "end"]);
        table.dropIndex(["market"])
        table.dropIndex(["metric"])
        table.dropIndex(["start"])
        table.dropIndex(["end"])
    });
}
