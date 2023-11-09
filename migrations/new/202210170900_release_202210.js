// Up migration creates BudgetStatementComment Table 

import knex from "knex";

export async function up(knex) {

    await knex.schema
        // The BudgetStatementComment table stores comments provided by users on specific budget statements
        .createTable('BudgetStatementComment', function (table) {
            console.log("Creating BudgetStatementComment table...");

            // Primary Key ID
            table.increments('id').primary();

            // Foreign key referencing the Budget Statement to which the comments corresponds
            table.integer('budgetStatementId').notNullable();
            table.foreign('budgetStatementId').references('BudgetStatement.id').onDelete('CASCADE');

            // Timestamp of provided comment
            table.timestamp('timestamp').notNullable();

            // Comment
            table.text('comment').notNullable();
        })

        .createTable('BudgetStatementCommentAuthor', function (table) {
            console.log("Creating BudgetStatementCommentAuthor table...")

            // Primary Key ID
            table.increments('id').primary();

            // Name of author of comment
            table.string('name').notNullable();
        })

        .createTable('BudgetStatementComment_BudgetStatementCommentAuthor', function (table) {
            console.log("Creating BudgetStatementComment_BudgetStatementCommentAuthor table...")

            // Primary Key ID
            table.increments('id').primary();

            // Foreign key referencing the BudgetStatementComment which the author created
            table.integer('bsCommentId').notNullable();
            table.foreign('bsCommentId').references('BudgetStatementComment.id').onDelete('CASCADE');

            // Foreign key referencing the BudgetStatementAuthor who created the comment
            table.integer('bsCommentAuthorId').notNullable();
            table.foreign('bsCommentAuthorId').references('BudgetStatementCommentAuthor.id').onDelete('CASCADE');

        })

        // Alter the BudgetStatement table to remove the old comments attributes - use knex raw as knex does not have a drop column if exists feature
        .raw('ALTER TABLE "BudgetStatement" DROP COLUMN IF EXISTS comments')

    }
    

// Down migration drops the BudgetStatementComment, BudgetStatementComment_BudgetStatementCommentAuthor and BudgetStatementCommentAuthor tables
export function down(knex) {

    console.log('Dropping BudgetStatementComment , BudgetStatementComment_BudgetStatementCommentAuthor and BudgetStatementCommentAuthor tables...')

    return knex.schema

        .dropTable("BudgetStatementComment_BudgetStatementCommentAuthor")
        .dropTable("BudgetStatementComment")
        .dropTable("BudgetStatementCommentAuthor")

}