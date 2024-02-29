/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add the Ecosystem EA

export async function seed(knex) {

  const [EcoId] = await knex('CoreUnit').insert({
    code: 'ECO',
    shortCode: 'ECO',
    name: 'Ecosystem',
    type: 'EcosystemActor',
    image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/ECO/ECO_logo.jpeg',
    category: '{ScopeFacilitator}',
    sentenceDescription: 'The Ecosystem Team is responsible for facilitating the Accessibility, Protocol, Stability, and Support scopes of the Atlas for MakerDAO.',
    paragraphDescription: `The Ecosystem Team is responsible for facilitating the Accessibility, Protocol, Stability, and Support scopes of the Atlas for MakerDAO. This facilitator focused Ecosystem Actor is a team comprised of Governance Operations & Design experts that ensures normal operations of an organization are well supported and leverage technical responses from a system-design perspective.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: EcoId.id,
    forumTag: 'https://forum.makerdao.com/u/ecosystem-team/summary',
  });

  const codes = ['SUP', 'ACC', 'PRO', 'STA'];
  const results = await knex('AlignmentScope').select('id', 'code').whereIn('code', codes);

  for (const scope of results) {
    await knex('ContributorTeam_AlignmentScope').insert({
      teamId: EcoId.id, // Use the ID from the ECO insert
      scopeId: scope.id, // Use the ID from the scope
    });
  }

}