//Up migration tightens constraints on User table
export async function up(knex) {

    await knex.schema.alterTable('User', function (table) {
        table.string('username').alter().notNullable().unique();
        table.string('password').alter().notNullable();
        table.boolean('active').alter().notNullable();
    });

}


//Down migration reverts the up migration change
export async function down(knex) {

    await knex.schema.alterTable('User', function (table) {
        table.string('username').alter().nullable();
        table.dropUnique('username');
        table.string('password').alter().nullable();
        table.boolean('active').alter().nullable();
    });

}