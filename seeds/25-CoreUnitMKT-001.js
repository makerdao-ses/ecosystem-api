/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Add AlignedDelegates and DEWIZ Ecosystem Actor

export async function seed(knex) {

  const [MktId] = await knex('CoreUnit').insert({
    code: 'MKT-001',
    shortCode: 'MKT',
    name: 'Content Production',
    type: 'CoreUnit',
    image: '',
    category: '{Growth}',
    sentenceDescription: 'The Content Production core unit is responsible for creating, and supporting the creation of written, audio, and visual content that educates audiences on MakerDAO, promotes the work and culture of the ecosystem, and encourages people to use Dai and the Maker Protocol.',
    paragraphDescription: `
    The goals of the Content Production core unit will be to:

Enhance MakerDAO’s position as a reputable authority on topics like decentralized governance, token engineering, and DeFi.
Produce entertaining and educational content that promotes engagement with Dai and the Maker Protocol.
Produce promotional content for other Core Units and provide resources to educate the ecosystem on best practices in content production and distribution.

`,
  }).returning('id');

  await knex('SocialMediaChannels').insert({
    cuId: MktId,
    forumTag: 'https://forum.makerdao.com/tag/archive-mkt-001',
  });




}