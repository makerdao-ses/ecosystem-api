// Up migration add column to 'includesOffChain' to SnapshotAccountBalance table

export async function up(knex) {

    console.log('Adding includesOffChain column to SnapshotAccountBalance table...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.boolean('includesOffChain');
      });
}

// Down migration that removes the new values from the CoreUnitCategory enum type
export async function down(knex) {

    console.log('Reverting the change that added includesOffChain to SnapshotAccountBalance...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.dropColumn('includesOffChain');
      });

};