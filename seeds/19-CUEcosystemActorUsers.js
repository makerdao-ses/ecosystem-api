/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//Set delegate budget caps

export async function seed(knex) {
  // Select new Ecosystem Actors
  const sasdaniel = await knex
    .select("id")
    .from("User")
    .where({ username: "sasdaniel" });

  const sas = await knex.select("id").from("CoreUnit").where({
    type: "EcosystemActor",
    code: "SIDESTREAM",
  });

  const ses = await knex.select("id").from("CoreUnit").where({
    type: "EcosystemActor",
    code: "SES",
  });

  const gov = await knex.select("id").from("CoreUnit").where({
    type: "EcosystemActor",
    code: "GOV",
  });

  const gro = await knex.select("id").from("CoreUnit").where({
    type: "EcosystemActor",
    code: "GROWTH",
  });

  const tech = await knex.select("id").from("CoreUnit").where({
    type: "EcosystemActor",
    code: "TECH",
  });
}
