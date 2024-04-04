const checkOrCreateBudgetStatement = async (snapshotKey, knex) => {
    // Check if corresponding entry exists in BudgetStatement table
    const existingBudgetStatement = await knex("BudgetStatement")
      .where(snapshotKey)
      .first();

    // If no entry exists, create an empty BudgetStatement
    if (!existingBudgetStatement) {
      console.log("No existing budget statement found. Creating a new one...");

      // Fetch ownerCode from CoreUnit table
      const team = await knex("CoreUnit")
        .select("code")
        .where({
          id: snapshotKey.ownerId,
          type: snapshotKey.ownerType
        })
        .first();

      if (!team) {
        console.log("Error: Team not found for the given snapshotKey.");
        return; // Exit the function if Team not found
      }

      // Insert the new entry into the table
      await knex("BudgetStatement").insert({
        ...snapshotKey,
        ownerCode: team.code, // Insert ownerCode fetched from CoreUnit
      });
    }
};

export { checkOrCreateBudgetStatement };
