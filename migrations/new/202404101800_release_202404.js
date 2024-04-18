// Migration that creates a materialized view BudgetPathMap table

export async function up(knex) {
    await knex.raw(`
    CREATE MATERIALIZED VIEW "BudgetPathMap" AS
    SELECT series."source",
           ad."path",
           SUBSTRING(series."source" FROM 'budget-statements/([0-9]+)/') AS "budgetStatementId"
    FROM "AnalyticsSeries" AS series
    JOIN "AnalyticsSeries_AnalyticsDimension" AS asad ON series."id" = asad."seriesId"
    JOIN "AnalyticsDimension" AS ad ON asad."dimensionId" = ad."id" AND ad."dimension" = 'budget'
    WHERE series."source" SIMILAR TO 'powerhouse/legacy-api/budget-statements/[0-9]+/';
    
    `)

    // add index to the created columns in above table
    await knex.schema.alterTable("BudgetPathMap", function (table) {
        table.index(["source"])
        table.index(["path"])
        table.index(["budgetStatementId"])
    });
}

export async function down(knex) {
    await knex.raw(`
    DROP MATERIALIZED VIEW "BudgetPathMap";
    `)
}