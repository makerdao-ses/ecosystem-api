/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */


export async function seed(knex) {

    const eliza = await knex
        .select('id')
        .from('User')
        .where({ username: 'ElizaPancake' });

    const ecosystemActorAdmin = await knex
        .select('id')
        .from('Role')
        .where({ roleName: 'EcosystemActorAdmin' });

    const growth = await knex
        .select('id')
        .from('CoreUnit')
        .where({ shortCode: 'GROWTH' });

    await knex('UserRole').insert([
        {
            userId: eliza[0].id,
            roleId: ecosystemActorAdmin[0].id,
            resource: 'EcosystemActor',
            resourceId: growth[0].id,
        }
    ]);

}