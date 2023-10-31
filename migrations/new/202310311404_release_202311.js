// Creating PriceData table

export async function up(knex) {
    console.log('Creating PriceData table...');
    try {
        await knex.schema.createTable('PriceData', (table) => {
            table.increments('id').primary(); // Primary key, auto-increment
            table.timestamp('start', { useTz: false }).notNullable(); // Start timestamp
            table.timestamp('end', { useTz: false }).notNullable(); // End timestamp
            table.string('market', 16).notNullable(); // Market string (e.g., "MKR.USD")
            table.enu('metric', [
                'CLOSE',
                'DAY_AVERAGE',
                'DAY_CLOSE',
                'MONTH_AVERAGE',
                'MONTH_CLOSE',
            ]).notNullable(); // Enum for metric
            table.float('price').notNullable(); // Price in float

            // Index on (market, metric, start, end)
            table.index(['market', 'metric', 'start', 'end']);
        });

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        knex.destroy(); // Close the Knex connection
    }
}

export async function down(knex) {
    console.log('Dropping PriceData table...');
    await knex.schema.dropTable('PriceData');
};