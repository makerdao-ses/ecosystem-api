// Up migration adds AlignedDelegates resourceType, Admin, Auditor roles, and  role permissions

export async function up(knex) {

    console.log('Adding AlignedDelegates resourceType, Admin, Auditor roles, role permissions and user roles...');

    // Adding ResourceType
    console.log('Adding AlignedDelegates to ResourceType');
    await knex.schema.raw(`
        ALTER TYPE "ResourceType" ADD VALUE 'AlignedDelegates';
        COMMIT;
    `);

    // Adding Roles
    const roles = await knex('Role').insert([
        { roleName: 'AlignedDelegatesAdmin' },
        { roleName: 'AlignedDelegatesAuditor', system: true }
    ]).returning('*');

    // Adding RolePermissions
    await knex('RolePermission').insert([
        { roleId: roles[0].id, resource: 'AlignedDelegates', permission: 'Update' },
        { roleId: roles[1].id, resource: 'AlignedDelegates', permission: 'Audit' }
    ]);
}

//Down migration reverts the up migration change
export async function down(knex) {

    // Delete RolePermissions
    await knex('RolePermission').where('resource', '=', 'AlignedDelegates').del();

    // Delete Roles
    await knex('Role').where('roleName', '=', 'AlignedDelegatesAdmin').del();
    await knex('Role').where('roleName', '=', 'AlignedDelegatesAuditor').del();

}