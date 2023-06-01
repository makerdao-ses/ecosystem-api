// Up migration adds EcosystemActor Admin and Auditor roles, role permissions, and user roles

export async function up(knex) {

    console.log('Adding EcosystemActor Admin and Auditor roles, role permissions and user roles...');
    // Adding Roles
    const roles = await knex('Role').insert([
        { roleName: 'EcosystemActorAdmin' },
        { roleName: 'EcosystemActorAuditor', system: true }
    ]).returning('*');

    // Adding RolePermissions
    await knex('RolePermission').insert([
        { roleId: roles[0].id, resource: 'EcosystemActor', permission: 'Update' },
        { roleId: roles[1].id, resource: 'EcosystemActor', permission: 'Audit' }
    ]);
};

//Down migration reverts the up migration change
export async function down(knex) {

    // Delete RolePermissions
    await knex('RolePermission').where('resource', '=', 'EcosystemActor').del();

    // Delete Roles
    await knex('Role').where('roleName', '=', 'EcosystemActorAdmin').del();
    await knex('Role').where('roleName', '=', 'EcosystemActorAuditor').del();
};