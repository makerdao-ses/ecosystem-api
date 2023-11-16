/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add AlignedDelegates and DEWIZ Ecosystem Actor

export async function seed(knex) {

  const [VoteWizardId] = await knex('CoreUnit').insert({
    code: 'VOTEWIZARD',
    shortCode: 'VOTEWIZARD',
    name: 'VoteWizard',
    type: 'EcosystemActor',
    image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/VOTEWIZARD/VOTEWIZARD_logo.png',
    category: '{ActiveEcosystemActor}',
    sentenceDescription: 'VoteWizard (Endgame Edge) is a Governance Facilitator with a dedicated team of Governance collaborators, committed to ensuring sharp, professional, and reliable governance with a vision of mastery in our operations.',
    paragraphDescription: `Our team structure includes experienced and skilled members, ensuring a blend of dedication and expertise in our operations. We are tasked with a range of responsibilities, from coordinating governance processes to engaging with various community stakeholders. Our focus is on maintaining a transparent, efficient, and effective governance system that upholds the values and goals of the Maker community.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: VoteWizardId.id,
    forumTag: 'https://forum.makerdao.com/u/votewizard/summary',
    twitter: 'https://twitter.com/Vote_Wizard'
  });

  const [GallagherId] = await knex('CoreUnit').insert({
    code: 'GALLAGHER',
    shortCode: 'GALLAGHER',
    name: 'Gallagher',
    type: 'EcosystemActor',
    image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/GALLAGHER/GALLAGHER_logo.jpeg',
    category: '{ActiveEcosystemActor}',
    sentenceDescription: 'Gallagher is a leading insurance and reinsurance broker offering an extensive range of insurance, self-insurance, risk management, claims administration, and employee benefits products and services through highly specialized companies.',
    paragraphDescription: `As the first member of the Resilience Fund Technical Committee, Gallagher oversees the administration, assessment, processing, and investigation of claims.

    Gallagher has several tasks as a member of the Technical Committee 2, which include but are not limited to:
    
    Membership Administration of the Resilience Fund: Overseeing the administration of the onboarding process for beneficiaries of the Resilience Fund, ensuring transparency and effective management within MakerDAO.
    
    Claims Assessment: Evaluating, processing, and investigating claims submitted within MakerDAO, providing payout recommendations based on thorough technical assessments.
    
    Surplus Buffer Adequacy: Assessing the adequacy of the Surplus Buffer with MakerDAO’s Endgame and structural changes, ensuring the stability and sustainability of the Resilience Fund.
    
    Evaluation of Legal Processes: Evaluating legal processes in similar ecosystems, identifying risks and contingencies to safeguard MakerDAO.`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: GallagherId.id,
    forumTag: 'https://forum.makerdao.com/u/technical_committee/summary',
    twitter: 'https://twitter.com/GallagherGlobal',
    linkedIn: 'https://www.linkedin.com/company/gallagher-global/',
    youtube: 'https://www.youtube.com/GallagherGlobal'
  });

  const gallagher = await knex('CoreUnit').select('id').where({
    code: 'GALLAGHER'
  }).first();
  const gallagherId = gallagher.id;

  const votewizard = await knex('CoreUnit').select('id').where({
    code: 'VOTEWIZARD'
  }).first();
  const votewizardId = votewizard.id;

  const SUP = await knex('AlignmentScope').select('id').where({
    code: 'SUP'
  }).first();
  const SUPid = SUP.id;

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: gallagherId,
    scopeId: SUPid,
  });

  await knex('ContributorTeam_AlignmentScope').insert({
    teamId: votewizardId,
    scopeId: SUPid,
  });





}