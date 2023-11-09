//Up migration creates Core Unit and all root tables
export function up(knex) {
    return knex.schema
        // The ChangeTrackingEvents table keeps track of all the changes that have happened in the system (in the form of an activity feed) 
        .createTable('ChangeTrackingEvents', function (table) {
            console.log("Creating ChangeTrackingEvents table...");
            
            // Primary Key ID
            table.increments('id').primary();

            // Timestamp with the time of creation of each record. Indexed for ordering.
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable().index('idx_created_at');

            // Type of the event, for example "CU_BUDGET_STATEMENT_CREATE". Indexed for searching, grouping, and ordering.
            table.string('event').notNullable();
            table.index(['event', 'created_at'], 'idx_event_created_at');

            // Object with relevant parameters, for example {coreUnit: {id: 5, code: 'GOV-001', shortCode: 'GOV'}, budgetStatementId: 123, month: '2022-09'}
            table.json('params').notNullable();

            // Description of the update in English, for example "Core Unit GOV submitted a new budget statement for 2022-09"
            table.string('description').notNullable();
        })

        // The ChangeTrackingEvents_CoreUnits table links events to core units where relevant. This makes it easy to fetch all events for a particular core unit. 
        .createTable('ChangeTrackingEvents_CoreUnits', function (table) {
            console.log("Creating ChangeTrackingEvents_CoreUnits table...");
            
            // Primary Key ID
            table.increments('id').primary();

            // Foreign Key referencing ChangeTrackingEvents.id
            table.integer('event_id').notNullable();
            table.foreign('event_id').references('ChangeTrackingEvents.id').onDelete('CASCADE');

            // Foreign Key referencing CoreUnit.id
            table.integer('coreunit_id').notNullable();
            table.foreign('coreunit_id').references('CoreUnit.id').onDelete('CASCADE');
        });
}

//Down migration deletes Core Unit and all root table
export function down(knex) {
    console.log("Dropping tables ChangeTrackingEvents_CoreUnits, ChangeTrackingEvents...");
    return knex.schema
        .dropTable("ChangeTrackingEvents_CoreUnits")
        .dropTable("ChangeTrackingEvents");
}