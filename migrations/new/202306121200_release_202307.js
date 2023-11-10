// Up migration that adds new values to the CoreUnitCategory enum type

export async function up(knex) {
  console.log("Adding new values to the CoreUnitCategory enum type...");

  await knex.raw(`
        ALTER TYPE "CoreUnitCategory" ADD VALUE IF NOT EXISTS 'ActiveEcosystemActor';
        ALTER TYPE "CoreUnitCategory" ADD VALUE IF NOT EXISTS 'AdvisoryCouncilMember';
        ALTER TYPE "CoreUnitCategory" ADD VALUE IF NOT EXISTS 'ScopeFacilitator';
    `);
}

// Down migration that removes the new values from the CoreUnitCategory enum type
export async function down(knex) {
  console.log(
    "Reverting the change that added new categories to CoreUnitCategory enum type...",
  );

  await knex.schema.raw(`
        CREATE TYPE new_CoreUnitCategory AS ENUM ('Technical', 'Support', 'Operational', 'Business', 'RWAs', 'Growth', 'Finance', 'Legal');
        
        ALTER TABLE "CoreUnit" ALTER COLUMN "category" TYPE new_CoreUnitCategory[] 
            USING "category"::text::new_CoreUnitCategory[];
        
        DROP TYPE "CoreUnitCategory";

        ALTER TYPE new_CoreUnitCategory RENAME TO "CoreUnitCategory";
    
    `);
}
