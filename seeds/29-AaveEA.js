/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add the AAVE Ecosystem EA

export async function seed(knex) {

  const [AaveId] = await knex('CoreUnit').insert({
    code: 'AAVE-001',
    shortCode: 'AAVE',
    name: 'AAVE',
    type: 'EcosystemActor',
    image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/AAVE/AAVE_logo.png',
    category: '{ActiveEcosystemActor}',
    sentenceDescription: `AAVE is an ecosystem actor in the MakerDAO ecosystem through a revenue share agreement with Phoenix Labs, leveraging Spark Protocol's use of AAVE V3 for a mutual profit-sharing model from DAI market revenues.`,
    paragraphDescription: `AAVE plays a strategic role in the MakerDAO ecosystem as a key ecosystem actor, facilitated by a revenue-sharing agreement with Phoenix Labs, the creators of the Spark Protocol. This partnership capitalizes on the Spark Protocol's deployment of Spark Lend, a liquidity protocol that is built upon AAVE v3's codebase and focuses on the DAI stablecoin. Phoenix Labs proposed a profit-sharing program that allocates 10% of the gross profits from DAI borrowings within Spark Lend to AAVE, as recognition for the foundational open-source software work AAVE has contributed. This innovative revenue model is designed to foster closer collaboration between the two entities, ensuring mutual benefits and further aligning their interests in the decentralized finance ecosystem.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: AaveId.id,
    forumTag: 'https://governance.aave.com/t/arc-spark-lend-profit-share-proposal/11615',
    twitter: 'https://twitter.com/aave',
    discord: 'https://discord.com/invite/aave',
    github: 'https://github.com/aave',
    website: 'https://app.aave.com/'
  });

  const codes = 'SUP';
  const results = await knex('AlignmentScope').select('id', 'code').where('code', codes);

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: AaveId.id, // Use the ID from the ECO insert
    scopeId: results[0].id, // Use the ID from the scope
  });
}