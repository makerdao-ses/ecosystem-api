/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// Set Dracaena27 as auditor for Sidestream, Jetstream and Techops

export async function seed(knex) {
  const dracaena27 = await knex
    .select("id")
    .from("User")
    .where({ username: "Dracaena27" });

  const ecosystemAuditorRole = await knex
    .select("id")
    .from("Role")
    .where({ roleName: "EcosystemActorAuditor" });

  const sidestream = await knex
    .select("id")
    .from("CoreUnit")
    .where({ code: "SIDESTREAM" });

  const jetstream = await knex
    .select("id")
    .from("CoreUnit")
    .where({ code: "JETSTREAM" });

  const techops = await knex
    .select("id")
    .from("CoreUnit")
    .where({ code: "TECHOPS" });

  // Add Dracaena27 as auditor for Sidestream, Jetstream and Techops

  await knex("UserRole").insert([
    {
      userId: dracaena27[0].id,
      roleId: ecosystemAuditorRole[0].id,
      resource: "EcosystemActor",
      resourceId: sidestream[0].id,
    },
    {
      userId: dracaena27[0].id,
      roleId: ecosystemAuditorRole[0].id,
      resource: "EcosystemActor",
      resourceId: jetstream[0].id,
    },
    {
      userId: dracaena27[0].id,
      roleId: ecosystemAuditorRole[0].id,
      resource: "EcosystemActor",
      resourceId: techops[0].id,
    },
  ]);
}
