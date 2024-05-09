/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// Set Deniz and Dumitru as Powerhouse Auditor
// Set Dracaena27 as Jetstream, Sidestream and Techoops as Auditor

export async function seed(knex) {

    // Finding user ids
    const dumitru = await knex
        .select("id")
        .from("User")
        .where({ username: "dumitru" });

    const deniz = await knex
        .select("id")
        .from("User")
        .where({ username: "deniz" });

    // Find EA Auditor id
    const ecosystemActorAuditor = await knex
        .select("id")
        .from("Role")
        .where({ roleName: "EcosystemActorAuditor" });

    // Find team IDs
    const powerhouse = await knex
        .select("id")
        .from("CoreUnit")
        .where({ code: "PH-001" });

    // Set Auditor Roles
    await knex("UserRole").insert([
        {
            userId: deniz[0].id,
            roleId: ecosystemActorAuditor[0].id,
            resource: "EcosystemActor",
            resourceId: powerhouse[0].id,
        },
        {
            userId: dumitru[0].id,
            roleId: ecosystemActorAuditor[0].id,
            resource: "EcosystemActor",
            resourceId: powerhouse[0].id,
        }
    ]);
}