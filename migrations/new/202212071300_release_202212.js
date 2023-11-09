import knex from "knex";
//Migration changes creates the new ChangeTrackingEvents_Index and adds Status attribute to the BudgetStatementComment table

//Up migration creates the new table
export async function up(knex) {

    await knex.schema
        // The ChangeTrackingEvents_Index table stores references to allow for indexes between a ChangeTrackingEvent and an change type with an id of the refernced change
        .createTable('ChangeTrackingEvents_Index', function (table) {
            console.log('Creating the ChangeTrackingEvents_Index table...')

            // Primary Key ID
            table.increments('id').primary();

            // Foreign key referencing the Change Tracking Events to which the event corresponds
            table.integer('eventId').notNullable();
            table.foreign('eventId').references('ChangeTrackingEvents.id').onDelete('CASCADE');

            // Object Type of the event
            table.string('objectType').notNullable();

            // Corresponding Object Id of the event
            table.integer('objectId').notNullable();

        })

    //Create an index on the objectType and objectId fields
    await knex.raw(`CREATE INDEX "changeTrackingEventsIndex" ON public."ChangeTrackingEvents_Index" ("objectType" ASC, "objectId" DESC)`)

    await knex.raw(`INSERT INTO public."ChangeTrackingEvents_Index"  (SELECT id, event_id as "eventId", 'CoreUnit' as "objectType", coreunit_id as "objectId" FROM public."ChangeTrackingEvents_CoreUnits")`)


    //Add status attribute to the BudgetStatementComment table and make comment field nullable
    console.log("Adding the BudgetStatementComment.status attribute...")
    await knex.schema.alterTable('BudgetStatementComment', function (table) {
        table.enu('status', null, {
            useNative: true,
            existingType: true,
            enumName: 'BudgetStatus'
        }).defaultTo('Draft');
        table.text('comment').alter({
            alterNullable: true
        });
        table.integer('authorId')
    })

    //SQL to retrieve authorId's from the previous set up
    const authorIds = await knex
        .select('User.id').as('authorId')
        .from('BudgetStatementComment')
        .leftJoin('BudgetStatementComment_BudgetStatementCommentAuthor', 'BudgetStatementComment.id', 'BudgetStatementComment_BudgetStatementCommentAuthor.bsCommentId')
        .leftJoin('BudgetStatementCommentAuthor', 'BudgetStatementComment_BudgetStatementCommentAuthor.bsCommentAuthorId', 'BudgetStatementCommentAuthor.id')
        .leftJoin('User', 'BudgetStatementCommentAuthor.name', 'User.username')
        .orderBy('BudgetStatementComment.id')


    //Insert authorId's to new attribute
    for (var i = 0; i < authorIds.length; i++) {
        await knex('BudgetStatementComment')
            .where('id', i + 1)
            .update({
                authorId: authorIds[i].id
            })
    }

}




//Down migration reverts the up migration change
export async function down(knex) {

    console.log("Dropping the ChangeTrackingEvents_Index table... ")
    await knex.schema.dropTable("ChangeTrackingEvents_Index")

    console.log("Dropping the status and authorId attributes from the BudgetStatementComment table... ")
    await knex.schema.alterTable('BudgetStatementComment', function (table) {
        table.dropColumn('status');
        table.dropColumn('authorId')
    });

}