/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

    // Inserting new Ecosystem Actors
    const ecosystemActors = await knex('CoreUnit').insert([{
            code: 'SOL-001',
            shortCode: 'SOL',
            name: 'Solidi Labs',
            category: '{ActiveEcosystemActor}',
            type: 'EcosystemActor',
            sentenceDescription: 'Solidi Labs aims to accelerate the development of DeFi to be a viable alternative to traditional banking.',
            paragraphDescription: `
            # **About Us** #

            Solidi Labs aims to accelerate the development of DeFi to be a viable alternative to traditional banking.

            ### Services Offered ###

            * Open source software development in Solidity.
            * Open source software development in Cairo.
            * Data Science, Risk Analytics, and Risk dashboards.
            * RWA token design (according to EU framework).
            * Prompt Engineering and AI automation consulting.`
        }
    ]).returning('*');

    // Inserting new Social Media Channels
    await knex('SocialMediaChannels').insert([{
            cuId: ecosystemActors[0].id,
            forumTag: 'https://forum.makerdao.com/t/ecosystem-actor-launch-solidi-labs/21355',
            twitter: '',
            discord: '',
            website: "",
            github: '',

        }
    ]);

    const scopesToAdd = [{
            shortCode: 'SOL',
            scopes: ['Protocol Scope']
        }];

    // Adding Scopes to Ecosystem Actors
    for (const scope of scopesToAdd) {
        const [{
            id
        }] = await knex.select('id').from('CoreUnit').where('shortCode', scope.shortCode)
        const scopes = await knex('AlignmentScope').whereIn('name', scope.scopes);
        await knex('ContributorTeam_AlignmentScope').insert(scopes.map((scope) => ({
            teamId: id,
            scopeId: scope.id
        })));
    }

}