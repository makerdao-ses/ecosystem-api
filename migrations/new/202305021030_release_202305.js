//Up migration removes ownerCode and ownerId values for ownerType = "Delegates"
export async function up(knex) {

    // Set ownerCode and ownerId to null in all budgetStatements with ownerType = "Delegates"
    await knex("BudgetStatement").update({ ownerCode: null, ownerId: null }).where({ ownerType: "Delegates" })

}

//Down migration reverts the up migration change
export async function down(knex) {

}
