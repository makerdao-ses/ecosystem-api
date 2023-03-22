//Up migration renamed the budgetStatementLineId column
export async function up(knex) {

    return knex.schema.table("BudgetStatement", function(table) {
      table.dropForeign('coreUnitId', 'BudgetStatement_coreUnitId_fkey');
    });
  };
  

//Down migration reverts the up migration change
export async function down(knex) {

  return knex.schema.table("BudgetStatement", function(table) {
    table.foreign('ownerId').references('CoreUnit.id');
  });
  

  }