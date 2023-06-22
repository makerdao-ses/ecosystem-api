// Up migration: Add 'includesOffChain' column to the 'SnapshotAccountBalance' table,
// 'offChain' column to the 'SnapshotAccount' table, and modify columns in 'SnapshotAccountTransaction' table.


export async function up(knex) {

    console.log('Applying migration: Adding columns for off-chain support...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.boolean('includesOffChain');
    }).table('SnapshotAccount', table => {
        table.boolean('offChain');
    }).alterTable('SnapshotAccountTransaction', function (table) {
        table.renameColumn('tx_hash', 'txHash');
        table.string('txLabel');
        table.string('counterPartyName');
    });
}

export async function down(knex) {

    console.log('Reverting migration: Removing columns for off-chain support...');

    await knex.schema.table('SnapshotAccountBalance', table => {
        table.dropColumn('includesOffChain');
    }).table('SnapshotAccount', table => {
        table.dropColumn('offChain');
    }).alterTable('SnapshotAccountTransaction', function (table) {
        table.renameColumn('txHash', 'tx_hash');
        table.dropColumn('counterPartyName');
        table.dropColumn('txLabel');
    });

}