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

const dSpotDelegate = await knex 
    .select('id')
    .from('User')
    .where({username: 'dSpotDelegate'});

const delegatesAdmin = await knex
.select('id')
.from('Role')
.where({
  roleName: 'DelegatesAdmin'
});

const DelegateCU = await knex
.select('id')
.from('CoreUnit')
.where({shortCode: 'DEL'});

await knex('UserRole').insert([{
  userId: dSpotDelegate[0].id,
  roleId: delegatesAdmin[0].id,
  resource: 'Delegates',
  resourceId: DelegateCU[0].id,
}]);



}