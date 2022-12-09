import knex from "knex";
//Migration changes creates the new UserActivity table

//Up migration creates the new table
export async function up(knex) {

    await knex.schema
        // The UserActivity table stores data on the activity of a User across the Ecosystem Performance Dashboard
        .createTable('UserActivity', function (table) {
            console.log('Creating the UserActivity table...')

            // Primary Key ID
            table.increments('id').primary();

            // Foreign key referencing the User.id of the UserActivity entry
            table.integer('userId').notNullable();
            table.foreign('userId').references('User.id').onDelete('CASCADE');

            // Collection that the UserActivity relates to
            table.string('collection').notNullable();

            // JSON object containing further information of the activity
            table.json('data');

            // Timestamp of the previous entry (if relevant)
            table.timestamp('lastVisit')

        })
    
};


//Down migration reverts the up migration change
export async function down(knex) {

    console.log("Dropping the UserActivity table... ")
    await knex.schema.dropTable("UserActivity")

};