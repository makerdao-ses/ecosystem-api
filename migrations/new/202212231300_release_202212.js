import knex from "knex";
//Migration changes the BudgetStatus ENUM to the updated values

//Up migration drops old enum, creates a new one and assigns it to the new column
export async function up(knex) {

    //Drop old budgetStatus ENUM type
    await knex.schema.raw(`DROP TYPE "BudgetStatus" CASCADE`)

    //Create new budgetStatus ENUM type
    await knex.schema.raw(`CREATE TYPE "BudgetStatus" AS ENUM ('Draft', 'Review', 'Escalated', 'Final');`)

    await knex.schema.alterTable('BudgetStatement', function (table) {
        table.enu('status', null, { useNative: true, existingType: true, enumName: 'BudgetStatus' }).defaultTo('Draft');
    })
    

};



//Down migration reverts the up migration change
export async function down(knex) {
    
    console.log('Reverting to old BudgetStatus ENUM...');

    await knex.schema.raw(`DROP TYPE "BudgetStatus" CASCADE`)
    await knex.schema.raw(`CREATE TYPE "BudgetStatus" AS ENUM ('Draft', 'SubmittedToAuditors', 'AwaitingCorrections', 'Final');`)
    await knex.schema.alterTable('BudgetStatement', function (table) {
        table.enu('budgetStatus', null, { useNative: true, existingType: true, enumName: 'BudgetStatus' }).defaultTo('Draft');
    })

};