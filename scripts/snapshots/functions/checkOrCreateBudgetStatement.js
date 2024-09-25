const checkOrCreateBudgetStatement = async (snapshotKey, knex) => {
  // Check if corresponding entry exists in BudgetStatement table
  const existingBudgetStatement = await knex("BudgetStatement")
    .where(snapshotKey)
    .first();

  // If no entry exists, create an empty BudgetStatement
  if (!existingBudgetStatement && snapshotKey.ownerType != 'Scopes') {
    console.log("No existing budget statement found. Creating a new one...");

    let code = "";
    let shortCode ="";

    if (snapshotKey.ownerType === "Keepers") {
      code = "keepers";
    } else if (snapshotKey.ownerType === "Delegates") {
      code = "recognized-delegates";
    } else if (snapshotKey.ownerType === "AlignedDelegates") {
      console.log("ALIGNED DELEGATES INFO",snapshotKey.ownerId, snapshotKey.ownerType)
      const delCodes = await knex("CoreUnit")
        .select("code", "shortCode")
        .where({
          type: snapshotKey.ownerType,
        })
        .first().returning('id');
      code = delCodes.code;
      shortCode = delCodes.shortCode;
    } else if (snapshotKey.ownerType === "SpecialPurposeFund") {
      code = "spfs";
    }
    // Else fetch ownerCode from CoreUnit table
    else {
      const team = await knex("CoreUnit")
        .select("code", "shortCode")
        .where({
          id: snapshotKey.ownerId,
          type: snapshotKey.ownerType,
        })
        .first();

      code = team.code;
      shortCode = team.shortCode;
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
  
  // Create a date object that ignores timezone effects
  let monthDate;
  if (typeof mapping.month === 'string' && mapping.month.includes('-')) {
    const [year, month] = mapping.month.split('-');
    monthDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
  } else if (mapping.month instanceof Date) {
    monthDate = new Date(Date.UTC(mapping.month.getFullYear(), mapping.month.getMonth(), 1));
  } else {
    console.error("Invalid month format:", mapping.month);
    monthDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
  }
  console.log("MonthDate:", monthDate.toISOString());
  
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

  if (cuShortCode == "recognized-delegates") {
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
  } else if (cuShortCode == "ALD-001") {
    ownerType = "Delegates";
    cuId = budgetStatementId;
    eventEvent = "DELEGATES_BUDGET_STATEMENT_CREATED";
    params = JSON.stringify({
      owner: {
        id: mapping.id,
        code: mapping.code,
        shortCode: mapping.code,
        type: mapping.ownerType,
      },
      budgetStatementId,
      month: monthDate.toISOString().slice(0, 7),
    });
    description = `An expense report was auto-generated for Delegates for ${toMonthName(
      Number(monthDate.toISOString().slice(5, 7)),
    )} ${monthDate.getFullYear()}`;
  }
  
  const event = {
    // Convert monthDate to UTC string to preserve timezone information
    created_at: toUTCString(monthDate),
    event: eventEvent,
    params,
    description,
  };

  const result = await knex("ChangeTrackingEvents")
    .insert({
      // Use raw SQL to explicitly cast the timestamp string to a database timestamp
      created_at: knex.raw('?::timestamp', [event.created_at]),
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

// Helper function to convert Date to UTC string format
const toUTCString = (date) => {
  return date.toISOString().replace('T', ' ').replace('Z', '+00');
};

export { checkOrCreateBudgetStatement };
