// Up migration: remove unused delegate Core Unit


export async function up(knex) {

    console.log('Removing DEL Core Unit...');

    const request = await knex('CoreUnit').where('code', 'DEL');
    const delId = request[0].id;

    await knex('UserRole').where('resourceId', delId).update('resourceId', null);
    await knex('CoreUnit').where('code', 'DEL').del();
}

export async function down(knex) {

  console.log('Re-adding DEL Core Unit...');

  await knex('CoreUnit').insert({
    code: 'DEL',
    name: 'Recognised Delegates',
    image: null,
    category: null,
    sentenceDescription: null,
    paragraphDescription: null,
    paragraphImage: null,
    shortCode: 'DEL',
    legacyBudgetStatementUrl: null,
    budgetId: null,
    type: 'Delegates'
  });

}