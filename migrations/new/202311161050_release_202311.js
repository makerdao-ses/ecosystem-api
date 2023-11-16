// Alter char legnths in Budget table

export async function up(knex) {
    console.log("Altering char lengths for image and description columns in Budget table...");

    // change length image column of charVarying data type from 255 to 1000
    await knex.schema.alterTable("Budget", function (table) {
        table.string("image", 1000).alter();
        table.text("description").alter();
    });

}

export async function down(knex) {
    console.log("Reverting the change in char lengths for image and description columns in Budget table...");

    // change length image column of charVarying data type from 1000 to 255
    await knex.schema.alterTable("Budget", function (table) {
        table.string("image", 255).alter();
        table.string("description", 255).alter();
    });
}