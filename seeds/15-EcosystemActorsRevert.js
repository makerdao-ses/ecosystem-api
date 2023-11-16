/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// Revert Core Unit Ecosystem Actor changes

export async function seed(knex) {
  // Reverting Ecosystem Actor changes
  console.log("Reverting Core Unit Ecosystem Actor changes...");
  // Inserting new Ecosystem Actors
  await knex("CoreUnit")
    .where({
      shortCode: "GRO",
      type: "CoreUnit",
    })
    .update({
      category: "{Growth, RWAs, Business}",
    });

  await knex("CoreUnit")
    .where({
      shortCode: "SAS",
      type: "CoreUnit",
    })
    .update({
      category: "{Technical}",
    });

  await knex("CoreUnit")
    .where({
      shortCode: "GOV",
      type: "CoreUnit",
    })
    .update({
      category: "{Operational}",
    });

  await knex("CoreUnit")
    .where({
      shortCode: "SES",
      type: "CoreUnit",
    })
    .update({
      category: "{Technical, Growth}",
    });

  await knex("CoreUnit")
    .where({
      shortCode: "TECH",
      type: "CoreUnit",
    })
    .update({
      category: "{Technical}",
    });

  const groCuId = await knex("CoreUnit")
    .where({
      shortCode: "GRO",
    })
    .select("id");
  const sasCuId = await knex("CoreUnit")
    .where({
      shortCode: "SAS",
    })
    .select("id");
  const govCuId = await knex("CoreUnit")
    .where({
      shortCode: "GOV",
    })
    .select("id");
  const sesCuId = await knex("CoreUnit")
    .where({
      shortCode: "SES",
    })
    .select("id");
  const techCuId = await knex("CoreUnit")
    .where({
      shortCode: "TECH",
    })
    .select("id");

  const cuIds = [
    groCuId[0].id,
    sasCuId[0].id,
    govCuId[0].id,
    sesCuId[0].id,
    techCuId[0].id,
  ];

  console.log("Deleting previous ContributorTeam_AlignmentScope entries...");
  await knex("ContributorTeam_AlignmentScope").whereIn("teamId", cuIds).del();
  console.log("Previous ContributorTeam_AlignmentScope entries deleted");

  const scopesToAdd = [
    {
      shortCode: "SAS",
      scopes: ["Support Scope", "Protocol Scope"],
    },
    {
      shortCode: "SES",
      scopes: ["Support Scope", "Protocol Scope", "Stability Scope"],
    },
    {
      shortCode: "GOV",
      scopes: ["Governance Scope"],
    },
    {
      shortCode: "GRO",
      scopes: ["Accessibility Scope"],
    },
    {
      shortCode: "TECH",
      scopes: ["Support Scope", "Accessibility Scope", "Governance  Scope"],
    },
  ];

  // Adding Scopes to Ecosystem Actors
  for (const scope of scopesToAdd) {
    const [{ id }] = await knex("CoreUnit")
      .where("code", scope.shortCode)
      .andWhere("type", "EcosystemActor")
      .select("id");
    const scopes = await knex("AlignmentScope").whereIn("name", scope.scopes);
    await knex("ContributorTeam_AlignmentScope").insert(
      scopes.map((scope) => ({ teamId: id, scopeId: scope.id })),
    );
  }
}
