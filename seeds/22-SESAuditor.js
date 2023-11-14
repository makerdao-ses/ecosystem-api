/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// Set new auditors for SES

export async function seed(knex) {
  const deniz = await knex
    .select("id")
    .from("User")
    .where({ username: "deniz" });

  const dumitru = await knex
    .select("id")
    .from("User")
    .where({ username: "dumitru" });

  const coreUnitAuditor = await knex
    .select("id")
    .from("Role")
    .where({ roleName: "CoreUnitAuditor" });

  const ses = await knex
    .select("id")
    .from("CoreUnit")
    .where({ code: "SES-001" });

  // Add deniz and dumitru as auditor for SES

  await knex("UserRole").insert([
    {
      userId: deniz[0].id,
      roleId: coreUnitAuditor[0].id,
      resource: "CoreUnit",
      resourceId: ses[0].id,
    },
    {
      userId: dumitru[0].id,
      roleId: coreUnitAuditor[0].id,
      resource: "CoreUnit",
      resourceId: ses[0].id,
    },
  ]);
}
