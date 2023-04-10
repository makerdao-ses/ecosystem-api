//Up migration adds the removes null constraints in the BudgetStatement table...
export async function up(knex) {

  console.log("Removing null constraints from BudgetStatements...");

  await knex.schema.alterTable('BudgetStatement', (table) => {
    table.integer('ownerId').nullable().alter();
    table.string('ownerCode').nullable().alter();
  });

}

//Down migration reverts the up migration change
export async function down(knex) {

  console.log('Reverting the change made to null constraints from BudgetStatements...');

  await knex.schema.alterTable('BudgetStatement', (table) => {
    table.integer('ownerId').notNullable().alter();
    table.string('ownerCode').notNullable().alter();
  });


}