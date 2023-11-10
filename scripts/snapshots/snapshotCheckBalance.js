import fetch from "node-fetch";
import knex from "knex";

// Connect to database selected in the .env file
const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

const getDistinctAddresses = async () => {
  const rows = await db("SnapshotAccount").select("accountAddress").distinct();

  return rows.map(({ accountAddress }) => accountAddress);
};

const getBalance = async (address) => {
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );
  const { status, result } = await response.json();

  if (status !== "1") {
    console.log(status);
    throw new Error(`Failed to get balance for address ${address}`);
  }

  return result;
};

const checkBalances = async () => {
  const distinctAddresses = await getDistinctAddresses();

  await Promise.all(
    distinctAddresses.map(async (address) => {
      const balance = await getBalance(address);

      const [{ amount }] = await db("Snapshot")
        .select(db.raw("round(sum(amount), 2) as amount"))
        .leftJoin(
          "SnapshotAccount",
          "Snapshot.id",
          "SnapshotAccount.snapshotId",
        )
        .leftJoin(
          "SnapshotAccountTransaction",
          "SnapshotAccount.id",
          "SnapshotAccountTransaction.snapshotAccountId",
        )
        .leftJoin("CoreUnit", "Snapshot.ownerId", "CoreUnit.id")
        .whereRaw('lower("SnapshotAccount"."accountAddress") = ?', [
          address.toLowerCase(),
        ]);

      console.log(
        `Address: ${address}, Balance: ${balance}, Sum of Amount: ${amount}`,
      );

      if (parseFloat(balance) !== parseFloat(amount)) {
        console.log(`Mismatch for address ${address}`);
      }
    }),
  );
};

checkBalances()
  .then(() => console.log("Check complete"))
  .catch((error) => console.error(error))
  .finally(() => db.destroy());
