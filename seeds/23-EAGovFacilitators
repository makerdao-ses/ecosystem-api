/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add AlignedDelegates and DEWIZ Ecosystem Actor

export async function seed(knex) {

  const [JanSkyId] = await knex('CoreUnit').insert({
    code: 'JANSKY',
    shortCode: 'JANSKY',
    name: 'JanSky',
    type: 'EcosystemActor'
    image: '',
    category: '{ActiveEcosystemActor}',
    sentenceDescription: 'Dewiz is a team of engineers with a proven track record of delivering high-quality, secure, and reliable smart contracts for the premier DeFi projects.',
    paragraphDescription: ``,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: JanSkyId,
    forumTag: 'https://forum.makerdao.com/u/jansky/summary',
  });

  const [VoteWizardId] = await knex('CoreUnit').insert({
    code: 'VOTEWIZARD',
    shortCode: 'VOTEWIZARD',
    name: 'VoteWizard',
    type: 'EcosystemActor'
    image: '',
    category: '{ActiveEcosystemActor}',
    sentenceDescription: 'Dewiz is a team of engineers with a proven track record of delivering high-quality, secure, and reliable smart contracts for the premier DeFi projects.',
    paragraphDescription: ``,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: VoteWizardId,
    forumTag: 'https://forum.makerdao.com/u/jansky/summary',
  });

  await knex('SocialMediaChannels').insert({
    cuId: VoteWizardId,
    forumTag: 'https://forum.makerdao.com/u/jansky/summary',
  });

  let JanSkyUserId = await knex('User').select('id').where({
    username: 'JanSky'
  }).first();
  JanSkyUserId = JanSkyUserId.id;

  let VoteWizardUserId = await knex('User').select('id').where({
    username: 'VoteWizard'
  }).first();
  VoteWizardUserId = VoteWizardUserId.id;

  const jansky = await knex('CoreUnit').select('id').where({
    code: 'JANSKY'
  }).first();
  const janskyId = jansky.id;

  const votewizard = await knex('CoreUnit').select('id').where({
    code: 'VOTEWIZARD'
  }).first();
  const votewizardId = votewizard.id;

  // Finally, insert the new user role record with the appropriate values
  await knex('UserRole').insert({
    roleId: roleId,
    resource: 'EcosystemActor',
    resourceId: dewizId,
    userId: userId
  });

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: JanSkyId,
    scopeId: govId,
  }, {
    teamId: VoteWizardId,
    scopeId: govId,
  });





}