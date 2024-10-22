// add indexes on the analytics table

export async function up(knex) {
    await knex.raw(`
        CREATE INDEX idx_analyticseries_metric_unit_start ON "AnalyticsSeries" ("metric", "unit", "start");
        CREATE INDEX idx_analyticsdimension_path ON "AnalyticsDimension" ("path");
        CREATE INDEX idx_analyticsseries_analyticsdimension_seriesid ON "AnalyticsSeries_AnalyticsDimension" ("seriesId");
    `);
}

export async function down(knex) {
    await knex.raw(`
        DROP INDEX idx_analyticseries_metric_unit_start ON "AnalyticsSeries";
        DROP INDEX idx_analyticsdimension_path ON "AnalyticsDimension";
        DROP INDEX idx_analyticsseries_analyticsdimension_seriesid ON "AnalyticsSeries_AnalyticsDimension";
    `);
}

