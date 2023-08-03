/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

//Set delegate budget caps

export async function seed(knex) {

  await knex('CoreUnit')
  .where({
      shortCode: 'DEWIZ',
      type: 'EcosystemActor'
  })
  .update({
      code: 'DEWIZ',
      shortCode: 'DEWIZ',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/DEWIZ/DEWIZ_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'BAL',
      type: 'EcosystemActor'
  })
  .update({
      code: 'BA-LABS',
      shortCode: 'BA-LABS',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/BA-LABS/BA_LABS_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'PHL',
      type: 'EcosystemActor'
  })
  .update({
      code: 'PHOENIX',
      shortCode: 'PHOENIX',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/PHOENIX/PHOENIX_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'DP',
      type: 'EcosystemActor'
  })
  .update({
      code: 'DEVPOOL',
      shortCode: 'DEVPOOL',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/DEVPOOL/DEVPOOL_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'L2B',
      type: 'EcosystemActor'
  })
  .update({
      code: 'L2BEAT',
      shortCode: 'L2BEAT',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/L2BEAT/L2BEAT_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'PL',
      type: 'EcosystemActor'
  })
  .update({
      code: 'PULLUP',
      shortCode: 'PULLUP',
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'VPAC',
      type: 'EcosystemActor'
  })
  .update({
      code: 'VIRIDIAN',
      shortCode: 'VIRIDIAN',
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'JST',
      type: 'EcosystemActor'
  })
  .update({
      code: 'JETSTREAM',
      shortCode: 'JETSTREAM',
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'PH',
      type: 'EcosystemActor'
  })
  .update({
      code: 'POWERHOUSE',
      shortCode: 'POWERHOUSE',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/POWERHOUSE/POWERHOUSE_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'STEAK',
      type: 'EcosystemActor'
  })
  .update({
      code: 'STEAKHOUSE',
      shortCode: 'STEAKHOUSE',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/ecosystem-actors/STEAKHOUSE/STEAKHOUSE_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'SAS',
      type: 'EcosystemActor'
  })
  .update({
      code: 'SIDESTREAM',
      shortCode: 'SIDESTREAM',
      image: 'https://makerdao-ses.github.io/ecosystem-dashboard/core-units/sas-001/SAS_logo.png'
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'TECH',
      type: 'EcosystemActor'
  })
  .update({
      code: 'TECHOPS',
      shortCode: 'TECHOPS',
  });

  await knex('CoreUnit')
  .where({
      shortCode: 'GRO',
      type: 'EcosystemActor'
  })
  .update({
      code: 'GROWTH',
      shortCode: 'GROWTH',
  });  

}