//Up migration renamed the budgetStatementLineId column
export async function up(knex) {


  await knex.schema.table('BudgetStatementPayment', table => {
    table.renameColumn('budgetStatementLineId', 'budgetStatementLineItemId');

});}


//Down migration reverts the up migration change
export async function down(knex) {

  await knex.schema.table('BudgetStatementPayment', table => {
    table.renameColumn('budgetStatementLineItemId', 'budgetStatementLineId');

  });}