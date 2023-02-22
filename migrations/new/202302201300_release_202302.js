//Up migration adds ownerType and renamed cuId to ownerId
export async function up(knex) {

  await knex.schema.alterTable('BudgetStatement', function (table) {
    console.log('Adding ownerType, renaming cuId to ownerId and renaming cuCode to ownerCode in BudgetStatement table...');
    table.enu('ownerType', ['CoreUnit', 'Delegates', 'SpecialPurposeFund', 'Project'], {
      useNative: true,
      enumName: 'BudgetOwner'
    });
    table.renameColumn('cuId', 'ownerId');
    table.renameColumn('cuCode', 'ownerCode');
  });

  await knex('BudgetStatement').update(
    'ownerType', 'CoreUnit'
  );

}


//Down migration reverts the up migration change
export async function down(knex) {

  return knex.schema.alterTable('BudgetStatement', function (table) {
      console.log("Removing ownerType, renaming ownerId to cuId and renaming ownerCode to cuCode... ");
      table.dropColumn('ownerType');
      table.renameColumn('ownerId', 'cuId');
      table.renameColumn('ownerCode', 'cuCode');
    })
    .raw('DROP TYPE "BudgetOwner"');
}





