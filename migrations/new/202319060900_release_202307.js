// Up migration add column to 'includesOffChain' to SnapshotAccountBalance table and 'offChain' to SnapshotAccount

export async function up(knex) {

    console.log('Adding offChain columns to Snapshot subtables...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.boolean('includesOffChain');
    });

    await knex.schema.table('SnapshotAccount', table => {
        table.boolean('offChain');
    });
}

export async function down(knex) {

    console.log('Reverting the change that added offChain columns to Snapshot subtables...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.dropColumn('includesOffChain');
    });

    await knex.schema.table('SnapshotAccount', table => {
        table.dropColumn('offChain');
    });

};