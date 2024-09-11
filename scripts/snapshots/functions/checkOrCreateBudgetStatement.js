const checkOrCreateBudgetStatement = async (snapshotKey, knex) => {
  // Check if corresponding entry exists in BudgetStatement table
  const existingBudgetStatement = await knex("BudgetStatement")
    .where(snapshotKey)
    .first();

  // If no entry exists, create an empty BudgetStatement
  if (!existingBudgetStatement && snapshotKey.ownerType != 'Scopes') {
    console.log("No existing budget statement found. Creating a new one...");

    console.log(snapshotKey);

    let code = "";

    if (snapshotKey.ownerType === "Keepers") {
      code = "keepers";
    } else if (snapshotKey.ownerType === "Delegates") {
      code = "recognized-delegates";
    } else if (snapshotKey.ownerType === "AlignedDelegates") {
      code = "aligned-delegates";
    } else if (snapshotKey.ownerType === "SpecialPurposeFund") {
      code = "spfs";
    }
    // Else fetch ownerCode from CoreUnit table
    else {
      const team = await knex("CoreUnit")
        .select("code")
        .where({
          id: snapshotKey.ownerId,
          type: snapshotKey.ownerType,
        })
        .first();

      code = team.code;
    }

    // Insert the new entry into the table
    const bsId = await knex("BudgetStatement")
      .insert({
        ...snapshotKey,
        ownerCode: code,
      })
      .returning("id");

    const mapping = {
      id: snapshotKey.ownerId,
      code: code,
      shortCode: code,
      bsId: bsId[0].id,
      month: snapshotKey.month,
      ownerType: snapshotKey.ownerType,
    };

    console.log(mapping);
    await budgetStatementCreated(mapping, knex);
  }
};

const budgetStatementCreated = async (mapping, knex) => {
  const monthDate = new Date(mapping.month);
  console.log(monthDate);
  const budgetStatementId = mapping.bsId;
  const cuShortCode = mapping.code;
  let ownerType = mapping.ownerType;
  let cuId = mapping.id;
  let description = "";

  if (!cuId) {
    cuId = budgetStatementId;
  }

  let params = JSON.stringify({
    owner: {
      id: mapping.id,
      code: mapping.code,
      shortCode: mapping.code,
      type: mapping.ownerType,
    },
    budgetStatementId,
    month: monthDate.toISOString().slice(0, 7),
  });
  if (ownerType === "CoreUnit" || ownerType === "EcosystemActor") {
    description = `An expense report was auto-generated for ${ownerType} ${cuShortCode} for ${toMonthName(
      Number(monthDate.toISOString().slice(5, 7)),
    )} ${monthDate.getFullYear()}`;
  } else {
    description = `An expense report was auto-generated for ${ownerType} for ${toMonthName(
      Number(monthDate.toISOString().slice(5, 7)),
    )} ${monthDate.getFullYear()}`;
  }

  let eventEvent = "TEAM_BUDGET_STATEMENT_CREATED";
  if (
    cuShortCode == "recognized-delegates" ||
    cuShortCode == "aligned-delegates"
  ) {
    ownerType = "Delegates";
    cuId = budgetStatementId;
    eventEvent = "DELEGATES_BUDGET_STATEMENT_CREATED";
    params = JSON.stringify({
      budgetStatementId,
      month: monthDate.toISOString().slice(0, 7),
    });
    description = `An expense report was auto-generated for Delegates for ${toMonthName(
      Number(monthDate.toISOString().slice(5, 7)),
    )} ${monthDate.getFullYear()}`;
  }
  const event = {
    created_at: monthDate,
    event: eventEvent,
    params,
    description,
  };

  const result = await knex("ChangeTrackingEvents")
    .insert({
      created_at: event.created_at,
      event: event.event,
      params: event.params,
      description: event.description,
    })
    .returning("*");
  const [lastIndex] = await knex("ChangeTrackingEvents_Index")
    .select("id")
    .orderBy("id", "desc")
    .limit(1);
  await knex("ChangeTrackingEvents_Index").insert({
    id: parseInt(lastIndex.id) + 1,
    eventId: result[0].id,
    objectType: ownerType,
    objectId: cuId,
  });
};

const toMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "long",
  });
};

export { checkOrCreateBudgetStatement };
