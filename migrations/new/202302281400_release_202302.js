//Up migration adds the Dracaena to the Delegates role
export async function up(knex) {
  await knex("CoreUnit")
    .insert([
      {
        code: "DEL",
        shortCode: "DEL",
        name: "Recognised Delegates",
      },
    ])
    .onConflict()
    .ignore();

  const Dracaena = await knex.select("id").from("User").where({
    username: "Dracaena27",
  });

  const delegatesAdmin = await knex.select("id").from("Role").where({
    roleName: "DelegatesAdmin",
  });

  const DelegateCU = await knex
    .select("id")
    .from("CoreUnit")
    .where({ shortCode: "DEL" });

  await knex("UserRole").insert([
    {
      userId: Dracaena[0].id,
      roleId: delegatesAdmin[0].id,
      resource: "Delegates",
      resourceId: DelegateCU[0].id,
    },
  ]);
}

//Down migration reverts the up migration change
export async function down(knex) {
  await knex("CoreUnit").where("name", "=", "Recognised Delegates").delete();

  const Dracaena = await knex.select("id").from("User").where({
    username: "Dracaena27",
  });

  const delegatesAdmin = await knex.select("id").from("Role").where({
    roleName: "DelegatesAdmin",
  });

  await knex("UserRole")
    .where("userId", "=", Dracaena[0].id)
    .where("roleId", "=", delegatesAdmin[0].id)
    .delete();
}
