/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add the Ecosystem EA

export async function seed(knex) {

  const [EgeId] = await knex('CoreUnit').insert({
    code: 'EGE-001',
    shortCode: 'EGE',
    name: 'Endgame Edge',
    type: 'EcosystemActor',
    image: '',
    category: '{ScopeFacilitator}',
    sentenceDescription: 'Endgame Edge is a team comprised of Governance faciliators responsible for the Governance Scope as defined in MIP113',
    paragraphDescription: `The name Endgame Edge (EE) encapsulates our vision of sharpness, professionalism, mastery, and reliability.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: EgeId.id,
    forumTag: 'https://forum.makerdao.com/g/EE-Gov-Facilitator',
  });

  const codes = 'GOV';
  const results = await knex('AlignmentScope').select('id', 'code').where('code', codes);

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: EgeId.id, // Use the ID from the ECO insert
    scopeId: results[0].id, // Use the ID from the scope
  });

  const [JskId] = await knex('CoreUnit').insert({
    code: 'JSKY-001',
    shortCode: 'JSKY',
    name: 'JanSky',
    type: 'EcosystemActor',
    image: '',
    category: '{ScopeFacilitator}',
    sentenceDescription: 'JanSky is one of the faciliators responsible for the Governance Scope as defined in MIP113',
    paragraphDescription: `Background and Training
    My journey into the realm of MakerDAO governance has been both enlightening and challenging. During my training under the guidance of the GovAlpha team, I received valuable insights and knowledge. However, it’s essential to acknowledge that their evaluation may carry a degree of bias due to differing perspectives on the direction of Endgame. I have long admired GovAlpha’s pragmatic approach, but fear that bias for slow iteration is present in their recommendations for Interim Facilitators. In contrast to the existing team, I wholeheartedly support Rune’s vision and the rapid implementation of Endgame.
    
    Commitment to Anonymity and SubDAO
    I want to emphasize my unwavering commitment to anonymity, a fundamental principle that I believe strengthens the Maker ecosystem. If appointed, I am dedicated to later serving in a FacilitatorDAO within the SubDAO structure. I view the Interim Facilitator position not as a temporary gig but as a first position in a long-term commitment to the MakerDAO community.
    
    Use of ChatGPT
    The use of ChatGPT in my responses during Maker interactions is intentional. It is aimed at promoting enhanced anonymity and serving as a practical training exercise aligned with Rune’s recent vision. While there have been challenges in this regard, I appreciate the leeway provided by the Maker community in this experimental phase. I continue to improve my model and the quality of its output.
    
    Openness to Feedback
    I want to assure the community that I am open to feedback and collaboration. Regardless of the outcome of the vote, I am ready and willing to work alongside whoever is appointed as Interim Governance Facilitator. Our shared goal is the continued success of MakerDAO, and I am committed to contributing to that success in any way possible.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: JskId.id,
    forumTag: 'https://forum.makerdao.com/u/jansky/summary',
  });

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: JskId.id, // Use the ID from the ECO insert
    scopeId: results[0].id, // Use the ID from the scope
  });

}