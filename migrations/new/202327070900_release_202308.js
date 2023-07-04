// Up migration: Alter column types in SnashotAccountTransaciton to nullable


export async function up(knex) {

    console.log('Altering SnapshotAccountTransactions table...');

    return knex.schema.alterTable('SnapshotAccountTransaction', function(table) {
        table.string('block').nullable().alter();
        table.string('txHash').nullable().alter();
        table.string('counterParty').nullable().alter();
      });
}

export async function down(knex) {

    console.log('Altering SnapshotAccountTransactions table...');

    return knex.schema.alterTable('SnapshotAccountTransaction', function(table) {
        table.string('block').notNullable().alter();
        table.string('txHash').notNullable().alter();
        table.string('counterParty').notNullable().alter();
      });

}