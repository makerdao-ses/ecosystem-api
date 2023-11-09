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

  await knex('CoreUnit')
  .where('shortCode', 'CES')
  .update({
    legacyBudgetStatementUrl: 'https://github.com/monkeyirish/ces-core-unit/tree/master/reporting/budget-monthly'
  })

  const claudia = await knex
    .select('id')
    .from('User')
    .where({username: 'claudia'});

  const prose = await knex
  .select('id')
  .from('User')
  .where({username: 'prose'});

  const DUX = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'DUX'});

    const IS = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'IS'});

    const SAS = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'SAS'});

    const TECH = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'TECH'});

    const DECO = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'DECO'});

    const SES = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'SES'});

    const auditId = await knex
    .select('id')
    .from('Role')
    .where({roleName: 'CoreUnitAuditor'});


    await knex('UserRole').insert([{
      userId: claudia[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: DUX[0].id,
    },
    {
      userId: claudia[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: IS[0].id,
    },
    {
      userId: claudia[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: SAS[0].id,
    },
    {
      userId: claudia[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: TECH[0].id,
    },
    {
      userId: claudia[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: DECO[0].id,
    },
    {
      userId: prose[0].id,
      roleId: auditId[0].id,
      resource: 'CoreUnit',
      resourceId: SES[0].id,
    }
  ])


}