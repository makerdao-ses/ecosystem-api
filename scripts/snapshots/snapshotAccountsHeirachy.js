import fs from "fs";
import knex from "knex";

// Connect to the database
const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

const jsonFile = process.env.WALLET_FILE;

// Read the JSON file
const jsonData = fs.readFileSync(jsonFile);
const data = JSON.parse(jsonData);

// Process the data
data.forEach(async (row) => {
  if (row.group === "Y") {
    // Find the Snapshot with matching CoreUnit code
    const snapshot = await db("Snapshot")
      .join("CoreUnit", "CoreUnit.id", "=", "Snapshot.ownerId")
      .where("CoreUnit.code", "=", row["budget path 3"])
      .select("Snapshot.id")
      .first();

    if (snapshot) {
      // Add a new SnapshotAccount with group values
      const groupAccount = {
        snapshotId: snapshot.id,
        accountAddress: null,
        accountLabel: "Group Account",
        accountType: "group",
      };

      await db("SnapshotAccount").insert(groupAccount);

      // Update existing SnapshotAccount with group values
      await db("SnapshotAccount")
        .where("accountAddress", "=", row.Address)
        .andWhere("snapshotId", "=", snapshot.id)
        .update({
          accountType: "group",
          groupAccountId: snapshot.id,
        });
    }
  }
});

// Close the database connection
db.destroy();
