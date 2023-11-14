//Up migration adds targetSourceCode, targetSourceUrl, targetSourceTitle
export async function up(knex) {
  console.log("Adding EcosytemActor ResourceType and BudgetOwner...");

  await knex.raw(
    "ALTER TYPE \"BudgetOwner\" ADD VALUE IF NOT EXISTS 'EcosystemActor'",
  );
  await knex.raw(
    "ALTER TYPE \"ResourceType\" ADD VALUE IF NOT EXISTS 'EcosystemActor'",
  );
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log("Removing EcosystemActor values...");

  //Revert ResourceType to original values
  await knex.schema.raw(`
   CREATE TYPE new_ResourceType AS ENUM ('System', 'CoreUnit', 'Delegates');
 
   ALTER TABLE "RolePermission" ALTER COLUMN resource TYPE new_ResourceType 
       USING resource::text::new_ResourceType;
 
   ALTER TABLE "UserRole" ALTER COLUMN resource TYPE new_ResourceType 
       USING resource::text::new_ResourceType;
 
   DROP TYPE "ResourceType";
 
   ALTER TYPE new_ResourceType RENAME TO "ResourceType";
   
 `);

  //Revert BudgetOwner to original values

  await knex.schema.raw(`
   CREATE TYPE new_BudgetOwner AS ENUM ('CoreUnit', 'Delegates', 'SpecialPurposeFund', 'Project');
 
   ALTER TABLE "BudgetStatement" ALTER COLUMN "ownerType" TYPE new_BudgetOwner 
       USING "ownerType"::text::new_BudgetOwner;
 
   DROP TYPE "BudgetOwner";
 
   ALTER TYPE new_BudgetOwner RENAME TO "BudgetOwner";
   
 `);
}
