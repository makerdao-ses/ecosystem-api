//Creation of the independent tables

export function up(knex) {
    return knex.schema

        .createTable('ViewDataCache', function (table) {
            console.log("Creating ViewDataCache table...");
            table.string('key').primary().notNullable();
            table.timestamp('lastUpdate').notNullable();
            table.json('value');
        })

        .createTable('BudgetToolVersion', function (table) {
            console.log("Creating BudgetToolVersion table...");
            table.increments('id').primary();
            table.string('version').notNullable();
            table.string('link').notNullable();
        })

        .createTable('User', function (table) {
            console.log("Creating User table...");
            table.increments('id').primary();
            table.string('username').notNullable();
            table.string('password').notNullable();
        })

        .createTable('Role', function (table) {
            console.log("Creating Role table...");
            table.increments('id').primary();
            table.string('roleName').notNullable();
        })

        .createTable('UserRole', function (table) {
            console.log("Creating UserRole table...");
            table.increments('id').primary();
            table.integer('roleId').notNullable();
            table.foreign('roleId').references('Role.id').onDelete('CASCADE')
            table.integer('userId').notNullable();
            table.foreign('userId').references('User.id').onDelete('CASCADE')
            table.enu('resource', ['System', 'CoreUnit'], {
                useNative: true,
                enumName: 'ResourceType'
            }).notNullable();
            table.integer('resourceId').notNullable();
        })

        .createTable('RolePermission', function (table) {
            console.log("Creating RolePermission table...");
            table.increments('id').primary();
            table.integer('roleId').notNullable();
            table.foreign('roleId').references('Role.id').onDelete('CASCADE')
            table.enu('permission', ['Create', 'Update', 'Delete', 'Audit', 'Manage'], {
                useNative: true,
                enumName: 'Permission'
            }).notNullable();
            table.integer('resourceId').notNullable();
        })

}


export function down(knex) {
    console.log("Dropping tables ViewDataCache and BudgetToolVersion tables...");

    return knex.schema

        .dropTable("RolePermission")
        .dropTable("UserRole")
        .dropTable("Role")
        .dropTable("User")
        .dropTable("BudgetToolVersion")
        .dropTable("ViewDataCache")
        .raw('DROP TYPE "ResourceType"')
        .raw('DROP TYPE "Permission"')

}