//Up migration adds ownerType and renamed cuId to ownerId
export async function up(knex) {

  await knex.schema.alterTable('BudgetStatement', function (table) {
    console.log('Adding ownerType and renaming cuId to ownerId in BudgetStatement table...');
    table.enu('ownerType', ['CoreUnit', 'Delegate', 'SpecialPurposeFund', 'Project'], {
      useNative: true,
      enumName: 'BudgetOwner'
    });
    table.renameColumn('cuId', 'ownerId');
  });

  await knex('BudgetStatement').update(
    'ownerType', 'CoreUnit'
  );

}


//Down migration reverts the up migration change
export async function down(knex) {

  return knex.schema.alterTable('BudgetStatement', function (table) {
      console.log("Removing ownerType and renaming ownerId to cuId... ");
      table.dropColumn('ownerType');
      table.renameColumn('ownerId', 'cuId');
    })
    .raw('DROP TYPE "BudgetOwner"');
}





