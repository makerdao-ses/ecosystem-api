// Up migration adds Keepers resourceType, Admin, Auditor roles, role permissions and budget type

export async function up(knex) {

    console.log('Adding Keepers resourceType, Admin, Auditor roles, role permissions and user roles...');

    // Adding ResourceType
    console.log('Adding Keepers to ResourceType');
    await knex.schema.raw(`
        ALTER TYPE "ResourceType" ADD VALUE 'Keepers';
        COMMIT;
    `);

    // Adding Roles
    const roles = await knex('Role').insert([
        { roleName: 'KeepersAdmin' },
        { roleName: 'KeepersAuditor', system: true }
    ]).returning('*');

    // Adding RolePermissions
    await knex('RolePermission').insert([
        { roleId: roles[0].id, resource: 'Keepers', permission: 'Update' },
        { roleId: roles[1].id, resource: 'Keepers', permission: 'Audit' }
    ]);

    console.log('Adding BudgetOwner Keepers...');
    await knex.raw(`ALTER TYPE "BudgetOwner" ADD VALUE 'Keepers'`);

}

//Down migration reverts the up migration change
export async function down(knex) {

    // Delete RolePermissions
    await knex('RolePermission').where('resource', '=', 'Keepers').del();

    // Delete Roles
    await knex('Role').where('roleName', '=', 'KeepersAdmin').del();
    await knex('Role').where('roleName', '=', 'KeepersAuditor').del();

    await knex.schema.raw(`
    CREATE TYPE new_BudgetOwner AS ENUM ('CoreUnit', 'Delegates', 'SpecialPurposeFund', 'Project', 'Ecosystem Actor', 'Aligned Delegates');
    
    ALTER TABLE "BudgetStatement" ALTER COLUMN "ownerType" TYPE new_BudgetOwner 
        USING "ownerType"::text::new_BudgetOwner;
    
    DROP TYPE "BudgetOwner";
    
    ALTER TYPE new_BudgetOwner RENAME TO "BudgetOwner";
    
    `);

}