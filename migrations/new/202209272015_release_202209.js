//Up migration creates BudgetToolVersion table
export async function up(knex) {
    await knex.schema
        // The BudgetToolVersion table keeps track of github release versions of budget tool
        .createTable('BudgetToolVersion', function (table) {
            console.log("Creating BudgetToolVersion table...");

            // Primary Key ID
            table.increments('id').primary();

            // Github release version number of budget tool
            table.string('version').notNullable();

            // Link to github release version of budget tool
            table.string('link').notNullable();
        });

    return knex.insert({
        version: '1.1.0',
        link: 'https://github.com/pcatana/budget-tool/releases/tag/v1.1.0'
    }).into('BudgetToolVersion');
}

//Down migration deletes Core Unit and all root table
export function down(knex) {
    console.log("Dropping table BudgetToolVersion");
    return knex.schema
        .dropTable("BudgetToolVersion");
}