// Up migration: Add 'includesOffChain' column to the 'SnapshotAccountBalance' table,
// Add month to Snapshot table


export async function up(knex) {

    console.log('Adding month to Snapshot table...');

    await knex.schema.table('Snapshot', table => {
        table.date('month');
    });
}

export async function down(knex) {

    console.log('Removing month from Snapshot table...');

    await knex.schema.table('Snapshot', table => {
        table.dropColumn('month');
    });

}