export async function up(knex) {
  // Step 1: Delete from ChangeTrackingEvents and log affected rows
  const deleteChangeTrackingEventsResult = await knex.raw(`
    DELETE FROM public."ChangeTrackingEvents"
    WHERE ("ChangeTrackingEvents".params::json->>'budgetStatementId')::int IN (
      SELECT "id" FROM public."BudgetStatement"
      WHERE "ownerType" = 'Delegates'
      AND "month" > '2024-05-01'
    )
    RETURNING *;
  `);
  console.log(
    `Step 1: Deleted ${deleteChangeTrackingEventsResult.rowCount} rows from ChangeTrackingEvents`
  );

  // Step 2: Delete from BudgetStatement and log affected rows
  const deleteBudgetStatementResult = await knex.raw(`
    DELETE FROM public."BudgetStatement"
    WHERE "ownerType" = 'Delegates'
    AND "month" > '2024-05-01'
    RETURNING *;
  `);
  console.log(
    `Step 2: Deleted ${deleteBudgetStatementResult.rowCount} rows from BudgetStatement`
  );

  // Step 3: Update AlignedDelegates months in ChangeTrackingEvents and log affected rows
  const updateAlignedDelegatesResult = await knex.raw(`
    UPDATE "ChangeTrackingEvents"
    SET params = ('{"owner":{"id":' || COALESCE("BudgetStatement"."ownerId"::text, 'null') || ',"code":"ALD-001","shortCode":"ALD-001","type":"AlignedDelegates"},"budgetStatementId":' || "BudgetStatement".id || ',"month":"' || TO_CHAR("BudgetStatement".month, 'YYYY-MM') || '"}')::json,
        description = 'An expense report was auto-generated for Delegates for ' || TO_CHAR("BudgetStatement".month, 'FMMonth YYYY')
    FROM "BudgetStatement"
    WHERE "ChangeTrackingEvents".params::json->>'budgetStatementId' = "BudgetStatement".id::text
      AND "ChangeTrackingEvents".event = 'DELEGATES_BUDGET_STATEMENT_CREATED'
      AND "BudgetStatement"."ownerType" = 'AlignedDelegates'
    RETURNING *;
  `);
  console.log(
    `Step 3: Updated ${updateAlignedDelegatesResult.rowCount} rows in ChangeTrackingEvents for AlignedDelegates`
  );

  // Step 4: Update codes in ChangeTrackingEvents and log affected rows
  const updateCodesResult = await knex.raw(`
    UPDATE "ChangeTrackingEvents"
    SET 
      params = jsonb_build_object(
        'owner', jsonb_build_object(
          'id', "CoreUnit".id,
          'code', "CoreUnit".code,
          'shortCode', LEFT("CoreUnit".code, 3),
          'type', 'EcosystemActor'  -- Keep type as EcosystemActor
        ),
        'budgetStatementId', "BudgetStatement".id,
        'month', TO_CHAR("BudgetStatement".month, 'YYYY-MM')
      ),
      description = regexp_replace(
        "ChangeTrackingEvents".description,
        '(EcosystemActor\\s+\\w+)', 
        'EcosystemActor ' || "CoreUnit".code
      )
    FROM 
      "BudgetStatement"
    JOIN 
      "CoreUnit"
      ON "CoreUnit".id = "BudgetStatement"."ownerId"
    WHERE 
      "ChangeTrackingEvents".params::json->>'budgetStatementId' = "BudgetStatement".id::text
      AND "ChangeTrackingEvents".params::json->'owner'->>'code' != "CoreUnit".code
      AND "ChangeTrackingEvents".params::json->'owner'->>'type' = 'EcosystemActor'
    RETURNING *;
  `);
  console.log(
    `Step 4: Updated ${updateCodesResult.rowCount} rows in ChangeTrackingEvents for codes`
  );

}

export async function down(knex) {}
