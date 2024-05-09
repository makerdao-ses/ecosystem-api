// Migration that adds new budgetPath column in the CoreUnit table

export async function up(knex) {
    console.log('Adding budgetPath column to CoreUnit table and filling it with data from AnalyticsDimension')
    await knex.schema.table('CoreUnit', (table) => {
        table.string('budgetPath');
    });

    // Updating budgetPath for all CoreUnits from AnalyticsDimension
    const cus = await knex('CoreUnit').select('code');
    for (const cu of cus) {
        const budgetPath = await getBudgetPath(cu.code, knex);
        await knex('CoreUnit')
            .where('code', cu.code)
            .update({ budgetPath });
    }

}

// Migration that removes the budgetPath column from the CoreUnit table

export async function down(knex) {
    await knex.schema.table('CoreUnit', (table) => {
        table.dropColumn('budgetPath');
    });
}

async function getBudgetPath(code, knex) {
    const result = await knex('AnalyticsDimension')
        .select('path')
        .where('dimension', 'budget')
        .andWhere('path', 'like', `%${code}%`);

    if (result.length > 0) {
        return result[0].path;
    }

    return null;
}