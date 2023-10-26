//Adding image and description fields to Budget table

export async function up(knex) {
    console.log('Creating image and description fields in Budget table...');

    await knex.schema.table('Budget', table => {
        table.string('image');
        table.string('description');
    });
};

export async function down(knex) {
    console.log('Removing image and description fields in Budget table...');

    await knex.schema
        .table('Budget', table => {
            table.dropColumn('image');
            table.dropColumn('description');
        });
};