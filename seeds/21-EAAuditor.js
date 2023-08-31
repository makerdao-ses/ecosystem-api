/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */


// Set Elizapancake as auditor for Dewiz

export async function seed(knex) {

    const elizapancake = await knex
        .select('id')
        .from('User')
        .where({ username: 'ElizaPancake' });

    const ecosystemAuditorRole = await knex
        .select('id')
        .from('Role')
        .where({ roleName: 'EcosystemActorAuditor' });

    const dewiz = await knex
        .select('id')
        .from('CoreUnit')
        .where({ code: 'DEWIZ' });

    // Add Elizapancake as auditor for Dewiz

    await knex('UserRole').insert([
        {
            userId: elizapancake[0].id,
            roleId: ecosystemAuditorRole[0].id,
            resource: 'EcosystemActor',
            resourceId: dewiz[0].id,
        }
    ])
}