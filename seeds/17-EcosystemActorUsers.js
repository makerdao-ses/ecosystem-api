/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

    // Select new Ecosystem Actors
    const Dracaena = await knex
    .select('id')
    .from('User')
    .where({username: 'Dracaena27'});

    const Eliza = await knex
    .select('id')
    .from('User')
    .where({username: 'ElizaPancake'});

    const rachel = await knex
    .select('id')
    .from('User')
    .where({username: 'rachel'});
    
    const mosanto = await knex
    .select('id')
    .from('User')
    .where({username: 'Mosanto'});

    const juanbug = await knex
    .select('id')
    .from('User')
    .where({username: 'juanbug'});

    const artautas = await knex
    .select('id')
    .from('User')
    .where({username: 'artautas'});
    
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
    .where({shortCode: 'BA-LABS'});

    const l2b = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'L2BEAT'});

    const chl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'CHRONICLE'});

    const jst = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'JETSTREAM'});

    const dp = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'DEVPOOL'});

    const pl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'PULLUP'});

    const ses = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'SES'})
    .andWhere({type: 'EcosystemActor'});

    const sas = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'SIDESTREAM'})
    .andWhere({type: 'EcosystemActor'});

    const tech = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'TECHOPS'})
    .andWhere({type: 'EcosystemActor'});

    const phl = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'PHOENIX'});

    const ph = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'POWERHOUSE'});

    const steak = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'STEAKHOUSE'});

    const viridian = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'VIRIDIAN'});

    const sol = await knex
    .select('id')
    .from('CoreUnit')
    .where({shortCode: 'SOL'});

    const ecosystemActorAdmin = await knex
    .select('id')
    .from('Role')
    .where({roleName: 'EcosystemActorAdmin'});

    
    //Add UserRoles
    await knex('UserRole').insert([
      {
        userId: Dracaena[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: ph[0].id,
      },
      {
        userId: Eliza[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: viridian[0].id,
      },
      {
        userId: Eliza[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: pl[0].id,
      },
      {
        userId: Eliza[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: phl[0].id,
      },
      {
        userId: Eliza[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: ses[0].id,
      },
      { 
        userId: rachel[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: chl[0].id,
      },
      { 
        userId: mosanto[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: sas[0].id,
      },
      { 
        userId: juanbug[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: steak[0].id,
      },
      { 
        userId: artautas[0].id,
        roleId: ecosystemActorAdmin[0].id,
        resource: 'EcosystemActor',
        resourceId: tech[0].id,
      },
      {
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