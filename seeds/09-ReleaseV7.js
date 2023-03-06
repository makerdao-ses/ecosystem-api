/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps
export async function seed(knex) {


await knex.raw(`UPDATE "BudgetStatementLineItem" as bsli
SET "budgetCap" = 12000
FROM "BudgetStatement" AS bs
LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
WHERE bs."ownerCode" = 'DEL' AND bsli."canonicalBudgetCategory" = 'CompensationAndBenefits'`);



}