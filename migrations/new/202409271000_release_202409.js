export async function up(knex) {
  // Update BudgetStatement table
  console.log('Updating BudgetStatement table for AlignedDelegates');
  await knex.raw(`
    UPDATE "BudgetStatement"
    SET "ownerCode" = 'ALD-001',
        "ownerId" = (SELECT id FROM "CoreUnit" WHERE code = 'ALD-001')
    WHERE "ownerType" = 'AlignedDelegates';
  `);

  // Update ChangeTrackingEvents table
  console.log('Updating ChangeTrackingEvents table for AlignedDelegates');
  await knex.raw(`
    UPDATE public."ChangeTrackingEvents"
    SET params = jsonb_build_object(
      'owner', jsonb_build_object(
        'id', (SELECT id FROM "CoreUnit" WHERE code = 'ALD-001'),
        'code', 'ALD-001',
        'shortCode', 'ALD-001',
        'type', 'AlignedDelegates'
      ),
      'budgetStatementId', (params::jsonb ->> 'budgetStatementId')::int,
      'month', params::jsonb ->> 'month'
    )::jsonb
    WHERE params::jsonb -> 'owner' ->> 'type' = 'AlignedDelegates';
  `);
}

export async function down(knex) {
  // Revert changes in BudgetStatement table
  console.log('Reverting changes in BudgetStatement table for AlignedDelegates');
  await knex.raw(`
    UPDATE "BudgetStatement"
    SET "ownerCode" = NULL,
        "ownerId" = NULL
    WHERE "ownerType" = 'AlignedDelegates';
  `);

  // Revert changes in ChangeTrackingEvents table
  console.log('Reverting changes in ChangeTrackingEvents table for AlignedDelegates');
  await knex.raw(`
    UPDATE public."ChangeTrackingEvents"
    SET params = jsonb_build_object(
      'owner', jsonb_build_object(
        'type', 'AlignedDelegates'
      ),
      'budgetStatementId', (params::jsonb ->> 'budgetStatementId')::int,
      'month', params::jsonb ->> 'month'
    )::jsonb
    WHERE params::jsonb -> 'owner' ->> 'type' = 'AlignedDelegates';
  `);
}
