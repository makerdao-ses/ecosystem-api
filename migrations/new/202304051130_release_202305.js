//Up migration adds targetSourceCode, targetSourceUrl, targetSourceTitle
export async function up(knex) {

  console.log("Creating DelegatesAudit role and permissions...");

  const [newRoleId] = await knex('Role').insert({
    roleName: 'DelegatesAudit'
  }).returning('id');

  await knex('RolePermission').insert({
    roleId: newRoleId.id,
    resource: 'Delegates',
    permission: 'Audit'
  });

  // First, find the user with username "Dracaena27" and get their id
const user = await knex('User').select('id').where({ username: 'Dracaena27' }).first();
const userId = user.id;

// Find Delegates resourceId
const del = await knex('CoreUnit').select('id').where({ code: 'DEL' }).first();
const delId = del.id;

// Finally, insert the new user role record with the appropriate values
await knex('UserRole').insert({
  roleId: newRoleId.id,
  resource: 'Delegates',
  resourceId: delId,
  userId: userId
});

}

//Down migration reverts the up migration change
export async function down(knex) {

  const delAudit = await knex('Role').select('id').where({ roleName: 'DelegatesAudit' });
  const delAuditId = delAudit[0].id;

  console.log("Removing DelegatesAudit role and permissions...");

  // First, delete the user role record
  await knex('UserRole').where({ roleId: delAuditId }).del();

  // Then, delete the role permission record
  await knex('RolePermission').where({ roleId: delAuditId }).del();

  // Finally, delete the role record
  await knex('Role').where({ id: delAuditId }).del();


}