/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {



  await knex('CoreUnit')
    .where('shortCode', 'SES')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/makerdao-ses/transparency-reporting'
    })

  await knex('CoreUnit')
    .where('shortCode', 'RWF')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/makerdao-rwf001/transparency-reporting'
    })

  await knex('CoreUnit')
    .where('shortCode', 'DUX')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/https://github.com/makerdao-dux/transparency-reporting'
    })

  await knex('CoreUnit')
    .where('shortCode', 'IS')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/makerdao-is/transparency-reporting'
    })


  await knex('CoreUnit')
    .where('shortCode', 'SAS')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/makerdao-sas/transparency-reporting'
    })

  await knex('CoreUnit')
    .where('shortCode', 'TECH')
    .update({
      legacyBudgetStatementUrl: 'https://github.com/MakerOps/tech-001-transparency-reporting'
    })


};