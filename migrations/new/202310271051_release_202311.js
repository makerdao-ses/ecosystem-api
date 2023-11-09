//Adding Projects db implementation

export async function up(knex) {

    console.log('Creating tables for Project, Owner, Deliverable, KeyResult...');

    // Construct neccessary types
    await knex.raw(`
    CREATE TYPE "ProjectStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'FINISHED');
    CREATE TYPE "DeliverableStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'FINISHED');
    CREATE TYPE "BudgetType" AS ENUM ('CONTINGENCY', 'OPEX', 'CAPEX', 'OVERHEAD');
    `);

    // Create Owner table
    await knex.schema.createTable('Owner', (table) => {
        table.increments('id').primary();
        table.string('ref').notNullable();
        table.string('imgUrl');
        table.string('name');
        table.string('code');
    });
    
    // Create Deliverable table
    await knex.schema.createTable('Deliverable', (table) => {
        table.increments('id').primary();
        table.integer('ownerId').unsigned().references('id').inTable('Owner');
        table.string('title').notNullable();
        table.enu('status', null, {useNative: true, existingType: true, enumName: 'DeliverableStatus'}).notNullable();
        table.float('storyPointsTotal');
        table.float('storyPointsCompleted');
        table.decimal('percentage', 5, 4);
    });

    // Create Project table
    await knex.schema.createTable('Project', (table) => {
        table.increments('id').primary();
        table.integer('ownerId').unsigned().references('id').inTable('Owner');
        table.integer('deliverableId').unsigned().references('id').inTable('Deliverable');
        table.string('code').notNullable();
        table.string('title').notNullable();
        table.string('abstract');
        table.enu('status', null, {useNative: true, existingType: true, enumName: 'ProjectStatus'}).notNullable();
        table.string('imgUrl');
        table.enu('budgetType', null, {useNative: true, existingType: true, enumName: 'BudgetType'}).notNullable();
    });

    // Create KeyResult table
    await knex.schema.createTable('KeyResult', (table) => {
        table.increments('id').primary();
        table.integer('deliverableId').unsigned().references('id').inTable('Deliverable');
        table.string('title').notNullable();
        table.string('link').notNullable();
    });
}

export async function down(knex) {

    console.log('Dropping tables for Project, Owner, Deliverable, KeyResult...');

    await knex.schema.dropTable('Project');
    await knex.schema.dropTable('KeyResult');
    await knex.schema.dropTable('Deliverable');
    await knex.schema.dropTable('Owner');

     // Drop custom types
     await knex.raw('DROP TYPE IF EXISTS "ProjectStatus"');
     await knex.raw('DROP TYPE IF EXISTS "DeliverableStatus"');
     await knex.raw('DROP TYPE IF EXISTS "BudgetType"');
}