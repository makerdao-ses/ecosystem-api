export async function up(knex) {
    console.log('Creating AnalyticsSeries and AnalyticsDimension tables...');

    await knex.schema.createTable('AnalyticsSeries', (table) => {
        table.increments('id').primary();
        table.string('source').notNullable();
        table.timestamp('start', { useTz: false }).notNullable();
        table.timestamp('end', { useTz: false });
        table.string('metric').notNullable();
        table.float('value').notNullable();
        table.string('unit');
        table.string('fn').notNullable();
        table.json('params');
    });

    await knex.schema.createTable('AnalyticsDimension', (table) => {
        table.increments('id').primary();
        table.string('dimension').notNullable();
        table.string('path').notNullable();
    });

    await knex.schema.createTable('AnalyticsSeries_AnalyticsDimension', (table) => {
        table.integer('seriesId').notNullable();
        table.foreign('seriesId').references('AnalyticsSeries.id').onDelete('CASCADE');
        table.integer('dimensionId').notNullable();
        table.foreign('dimensionId').references('AnalyticsDimension.id').onDelete('CASCADE');
    });
}

export async function down(knex) {
    await knex.schema
        .dropTable('AnalyticsSeries_AnalyticsDimension')
        .dropTable('AnalyticsDimension')
        .dropTable('AnalyticsSeries');
}