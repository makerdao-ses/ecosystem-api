// Migration adds scopes to BudgetOwner type

export async function up(knex) {
    await knex.raw(`ALTER TYPE "BudgetOwner" ADD VALUE 'Scopes'`);
}

export async function down(knex) {
    await knex.schema.raw(`
    CREATE TYPE new_BudgetOwner AS ENUM ('CoreUnit', 'Delegates', 'SpecialPurposeFund', 'Project', 'EcosystemActor', 'AlignedDelegates', 'Keepers');
    
    ALTER TABLE "BudgetStatement" ALTER COLUMN "ownerType" TYPE new_BudgetOwner 
        USING "ownerType"::text::new_BudgetOwner;
    
    DROP TYPE "BudgetOwner";
    
    ALTER TYPE new_BudgetOwner RENAME TO "BudgetOwner";
    
    `);
}

