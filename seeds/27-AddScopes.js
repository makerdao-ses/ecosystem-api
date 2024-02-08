/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add AlignedDelegates and DEWIZ Ecosystem Actor

export async function seed(knex) {

  await knex('CoreUnit')
  .where({
    code: 'GOV',
    shortCode: 'GOV'
  })
  .update({
    code: 'GOVALPHA',
    shortCode: 'GOVALPHA'
  });

    const [SupId] = await knex('CoreUnit').insert({
      code: 'SUP',
      shortCode: 'SUP',
      name: 'Support',
      type: 'Scopes',
    }).returning('id');

    const [StaId] = await knex('CoreUnit').insert({
      code: 'STA',
      shortCode: 'STA',
      name: 'Stability',
      type: 'Scopes',
    }).returning('id');

    const [ProId] = await knex('CoreUnit').insert({
      code: 'PRO',
      shortCode: 'PRO',
      name: 'Protocol',
      type: 'Scopes',
    }).returning('id');

    const [AccId] = await knex('CoreUnit').insert({
      code: 'ACC',
      shortCode: 'ACC',
      name: 'Accessibility',
      type: 'Scopes',
    }).returning('id');

    const [GovId] = await knex('CoreUnit').insert({
      code: 'GOV',
      shortCode: 'GOV',
      name: 'Governance',
      type: 'Scopes',
    }).returning('id');
  
  }