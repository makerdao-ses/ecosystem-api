// Up migration adds legacyCategory and parentId columns to ExpenseCategory table
export async function up(knex) {

    console.log('Adding legacyCategory and parentId columns to ExpenseCategory table...')

    await knex.schema.table('ExpenseCategory', table => {
        table.enu('legacyCategory', null, { useNative: true, existingType: true, enumName: 'CanonicalBudgetCategory' })
        table.integer('parentId').unsigned().references('id').inTable('ExpenseCategory');

    })

}

//Down migration reverts the up migration change
export async function down(knex) {

    console.log('Reverting the change that added legacyCategory and parentId columns to ExpenseCategory table...')

    await knex.schema.table('ExpenseCategory', table => {
        table.dropColumn('legacyCategory');
        table.dropColumn('parentId');
    })
}