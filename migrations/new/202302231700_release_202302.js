//Up migration adds the Delegates/Update RolePermission
export async function up(knex) {

  const result = await knex('Role')
    .select('id')
    .where('roleName', '=', 'DelegatesAdmin');

  await knex('RolePermission').insert({
    roleId: result[0].id,
    resource: 'Delegates',
    permission: 'Update'
  });


}


//Down migration reverts the up migration change
export async function down(knex) {

  await knex('RolePermission')
    .where('resource', '=', 'Delegates')
    .where('permission', '=', 'Update')
    .delete();

}