// Up migration adds BudgetType AlignedDelegates

export async function up(knex) {
  console.log("Adding BudgetOwner AlignedDelegates...");

  await knex.raw(`ALTER TYPE "BudgetOwner" ADD VALUE 'AlignedDelegates'`);
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log(
    "Reverting the change that added BudgetOwner AlignedDelegates...",
  );

  await knex.schema.raw(`
   CREATE TYPE new_BudgetOwner AS ENUM ('CoreUnit', 'Delegates', 'SpecialPurposeFund', 'Project', 'Ecosystem Actor');
 
   ALTER TABLE "BudgetStatement" ALTER COLUMN "ownerType" TYPE new_BudgetOwner 
       USING "ownerType"::text::new_BudgetOwner;
 
   DROP TYPE "BudgetOwner";
 
   ALTER TYPE new_BudgetOwner RENAME TO "BudgetOwner";
   
 `);
}
