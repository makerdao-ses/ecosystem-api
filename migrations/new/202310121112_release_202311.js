//Creating created field for Snapshot table 

export async function up(knex) {
    console.log('Creating created field in Snapshot table...');

    await knex.schema.table('Snapshot', table => {
        table.datetime('created');
    });
}

export async function down(knex) {
    console.log('Removing created field in Snapshot table...');

    await knex.schema
        .table('Snapshot', table => {
            table.dropColumn('created');
        });
}
