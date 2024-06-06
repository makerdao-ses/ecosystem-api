// Migration that alters the BudgetStatementCacheValues table

export async function up(knex) {

    console.log('Altering BudgetStatementCacheValues table');
    await knex.schema.alterTable('BudgetStatementCacheValues', (table) => {
        table.specificType('reportedActuals', 'numeric').alter();
        table.specificType('onChainOnlyAmount', 'numeric').alter();
        table.specificType('onChainOnlyDifference', 'numeric').alter();
        table.specificType('offChainIncludedAmount', 'numeric').alter();
        table.specificType('offChainIncludedDifference', 'numeric').alter();
    });

    // add a new column, ownerId, to the BudgetStatementCacheValues table
    console.log('Adding ownerId column to BudgetStatementCacheValues table');
    await knex.schema.alterTable('BudgetStatementCacheValues', (table) => {
        table.integer('ownerId');
    });

}

export async function down(knex) {

    console.log('Reverting BudgetStatementCacheValues table');
    await knex.schema.alterTable('BudgetStatementCacheValues', (table) => {
        table.decimal('reportedActuals', 10, 2).alter();
        table.decimal('onChainOnlyAmount', 10, 2).alter();
        table.decimal('onChainOnlyDifference', 10, 2).alter();
        table.decimal('offChainIncludedAmount', 10, 2).alter();
        table.decimal('offChainIncludedDifference', 10, 2).alter();
    });

    // remove the ownerId column from the BudgetStatementCacheValues table
    console.log('Removing ownerId column from BudgetStatementCacheValues table');
    await knex.schema.alterTable('BudgetStatementCacheValues', (table) => {
        table.dropColumn('ownerId');
    });
}

