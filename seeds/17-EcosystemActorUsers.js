/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

    // Inserting new Ecosystem Actors
    const dewizAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'DewizAdmin'});

    const chronicleLabsAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'ChronicleLabsAdmin'});

    const baLabsAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'BaLabsAdmin'});

    const devPoolAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'DevPoolAdmin'});

    const jetStreamAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'JetStreamAdmin'});

    const l2BeatAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'L2BeatAdmin'});

    const phoenixLabsAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'PhoenixLabsAdmin'});

    const pullUpAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'PullUpAdmin'});

    const steakHouseAdmin = await knex
    .select('id')
    .from('User')
    .where({username: 'SteakHouseAdmin'});

    const dewiz = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'DEWIZ'});

    const baLabs = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'BAL'});

    const l2b = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'L2B'});

    const chl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'CH'});

    const jst = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'JST'});

    const dp = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'DP'});

    const pl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'PL'});

    const phl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'PHL'});

    const steak = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'STEAK'});

    const ecosystemActorAdmin = await knex
    .select('id')
    .from('Role')
    .where({roleName: 'EcosystemActorAdmin'});

    
    //Add UserRoles
    await knex('UserRole').insert([{
      userId: dewizAdmin[0].id,
      roleId: ecosystemActorAdmin[0].id,
      resource: 'EcosystemActor',
      resourceId: dewiz[0].id,
    },
    {
      userId: chronicleLabsAdmin[0].id,
      roleId: ecosystemActorAdmin[0].id,
      resource: 'EcosystemActor',
      resourceId: chl[0].id,
    },
    {
        userId: baLabsAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: baLabs[0].id,
      },
      {
        userId: devPoolAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: dp[0].id,
      },
      {
        userId: jetStreamAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: jst[0].id,
      },
      {
        userId: l2BeatAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: l2b[0].id,
      },
      {
        userId: phoenixLabsAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: phl[0].id,
      },
      {
        userId: pullUpAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: pl[0].id,
      },
      {
        userId: steakHouseAdmin[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: steak[0].id,
      },
   ]).onConflict()
   .ignore();
    

}