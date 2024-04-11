const checkOrCreateBudgetStatement = async (snapshotKey, knex) => {
  // Check if corresponding entry exists in BudgetStatement table
  const existingBudgetStatement = await knex("BudgetStatement")
    .where(snapshotKey)
    .first();

  // If no entry exists, create an empty BudgetStatement
  if (!existingBudgetStatement) {
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
    await knex("BudgetStatement").insert({
      ...snapshotKey,
      ownerCode: code, // Insert ownerCode fetched from CoreUnit
    });
  }
};

export { checkOrCreateBudgetStatement };
