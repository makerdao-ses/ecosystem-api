//Up migration new columns to the transfer request table
export async function up(knex) {

    console.log("Adding new columns to the transfer request table");
    return knex.schema.table('BudgetStatementTransferRequest', function(table) {
      table.timestamp('walletBalanceTimestamp');
      table.decimal('targetAmount', 14, 2);
      table.string('targetCalculation');
      table.string('targetDescription');
      table.string('targetSourceCode');
      table.string('targetSourceUrl');
      table.string('targetSourceTitle');
      table.dropColumn('comments');
    });
  }
  
//Down migration reverts the up migration change
export async function down(knex) {  

    console.log("Dropping columns to the transfer request table");
    return knex.schema.table('BudgetStatementTransferRequest', function(table) {
      table.dropColumn('walletBalanceTimestamp');
      table.dropColumn('targetAmount');
      table.dropColumn('targetCalculation');
      table.dropColumn('targetDescription');
      table.dropColumn('targetSourceCode');
      table.dropColumn('targetSourceUrl');
      table.dropColumn('targetSourceTitle');
      table.string('comments');
    });
  }