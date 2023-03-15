/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps
export async function seed(knex) {


await knex.raw(`UPDATE "BudgetStatementLineItem" 
SET "budgetCap" =  12000
FROM "BudgetStatement" AS bs
LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
WHERE bsw.id = "BudgetStatementLineItem"."budgetStatementWalletId"
AND bs."ownerCode" = 'DEL'`);

}