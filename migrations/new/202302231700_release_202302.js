//Up migration adds the Delegates/Update RolePermission
export async function up(knex) {

  const result = await knex('Role')
    .select('id')
    .where('roleName', '=', 'DelegatesAdmin');

    await knex.schema.raw(`
    INSERT INTO "RolePermission" ("roleId", "resource", "permission")
    VALUES (?, ?, ?);
  `, [result[0].id, 'Delegates', 'Update']);
  

}


//Down migration reverts the up migration change
export async function down(knex) {

  await knex('RolePermission')
    .where('resource', '=', 'Delegates')
    .where('permission', '=', 'Update')
    .delete();

}