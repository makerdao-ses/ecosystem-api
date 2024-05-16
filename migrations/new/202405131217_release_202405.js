// Migration that creates a new BudgetStatementCacheValues table

export async function up(knex) {
    console.log('Creating BudgetStatementCacheValues table');
    await knex.schema.createTable('BudgetStatementCacheValues', (table) => {
        table.increments('id').primary();
        table.integer('snapshotId').notNullable();
        table.string('month').notNullable();
        table.string('currency').notNullable();
        table.decimal('reportedActuals').notNullable();
        table.decimal('onChainOnlyAmount').notNullable();
        table.decimal('onChainOnlyDifference').notNullable();
        table.decimal('offChainIncludedAmount').notNullable();
        table.decimal('offChainIncludedDifference').notNullable();

    });
}

// Migration that drops the BudgetStatementCacheValues table

export async function down(knex) {
    console.log('Dropping BudgetStatementCacheValues table');
    await knex.schema.dropTable('BudgetStatementCacheValues');
}