import fetch from "node-fetch";
import knex from "knex";

const DIN_API_USER = process.env.DIN_API_USER;
const DIN_API_PW = process.env.DIN_API_PW;

// Connect to database selected in the .env file
const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

// First Curl Request to get the Bearer token
const getToken = async () => {
  const url = "https://data-api.makerdao.network/v1/login/access-token";
  const body = new URLSearchParams({
    grant_type: "",
    username: DIN_API_USER,
    password: DIN_API_PW,
    scope: "",
    client_id: "",
    client_secret: "",
  });
  const headers = {
    accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await fetch(url, {
    method: "POST",
    body: body,
    headers: headers,
  });
  const data = await response.json();
  const token = data.access_token;
  return token;
};

const delegateAddresses = [
  "0x688d508f3a6b0a377e266405a1583b3316f9a2b3",
  "0x80882f2a36d49fc46c3c654f7f9cb9a2bf0423e1",
  "0x89c5d54c979f682f40b73a9fc39f338c88b434c6",
  "0x0988e41c02915fe1befa78c556f946e5f20ffbd3",
  "0x9ac6a6b24bcd789fa59a175c0514f33255e1e6d0",
  "0x5b9c98e8a3d9db6cd4b4b4c1f92d0a551d06f00d",
  "0xe070c2dcfcf6c6409202a8a210f71d51dbae9473",
  "0xa6e8772af29b29b9202a073f8e36f447689beef6",
  "0x4bd73eee3d0568bb7c52dfcad7ad5d47fff5e2cf",
  "0x3b91ebdfbc4b78d778f62632a4004804ac5d2db0",
  "0xccffdbc38b1463847509dcd95e0d9aaf54d1c167",
  "0x62a43123fe71f9764f26554b3f5017627996816a",
  "0x070341aa5ed571f0fb2c4a5641409b1a46b4961b",
  "0xa3f0abb4ba74512b5a736c5759446e9b50fda170",
  "0xdc1f98682f4f8a5c6d54f345f448437b83f5e432",
  "0x97fb39171acd7c82c439b6158ea2f71d26ba383d",
  "0x2165d41af0d8d5034b9c266597c1a415fa0253bd",
  "0xa519a7ce7b24333055781133b13532aeabfac81b",
  "0x46dfcbc2afd5dd8789ef0737fedb03489d33c428",
  "0xa2d55b89654079987cf3985aeff5a7bd44da15a8",
  "0xb83b3e9c8e3393889afb272d354a7a3bd1fbcf5c",
  "0x4efb12d515801ecfa3be456b5f348d3cd68f9e8a",
  "0x6ebb1a9031177208a4ca50164206bf2fa5ff7416",
  "0x1ef753934c40a72a60eab12a68b6f8854439aa78",
  "0x7ae109a63ff4dc852e063a673b40bed85d22e585",
  "0xe78658a8acfe982fde841abb008e57e6545e38b3",
];

// Del Unit Transfers
const delegateTransfers = async (addresses) => {
  const token = "DAI";
  const headers = {
    accept: "application/json",
    Authorization: "Bearer " + (await getToken()),
  };
  let data = [];
  let skip = 0;
  let response = null;
  let jsonData = null; // declare jsonData variable
  let apiCalls = 0;

  // loop through each address
  for (let i = 0; i < addresses.length; i++) {
    const fromUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${addresses[i]}&skip=`;
    const toUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&to_address=${addresses[i]}&skip=`;

    // make the API call for from_address
    do {
      response = await fetch(fromUrl + skip, {
        method: "GET",
        headers: headers,
      });
      jsonData = await response.json(); // assign response to jsonData

      if (jsonData.detail === "Could not validate credentials") {
        console.log("Error: Could not validate credentials");
        return data;
      }
      data = data.concat(jsonData);
      skip += jsonData.length;
      apiCalls++;
      console.log(
        `Address ${
          i + 1
        }: API call ${apiCalls} - from_address - fetching data...`,
      );
    } while (jsonData.length !== 0);

    // reset skip and make the API call for to_address
    skip = 0;
    jsonData = null;

    do {
      response = await fetch(toUrl + skip, {
        method: "GET",
        headers: headers,
      });
      jsonData = await response.json(); // assign response to jsonData

      if (jsonData.detail === "Could not validate credentials") {
        console.log("Error: Could not validate credentials");
        return data;
      }
      data = data.concat(jsonData);
      skip += jsonData.length;
      apiCalls++;
      console.log(
        `Address ${
          i + 1
        }: API call ${apiCalls} - to_address - fetching data...`,
      );
    } while (jsonData.length !== 0);
  }
  console.log(`Total transaction length: ${data.length}`);
  return data;
};

// Check Snapshot entry
const snapshotEntryCheck = async (account, timestamp) => {
  const existingAccount = await db("SnapshotAccount")
    .select("SnapshotAccount.id")
    .join("Snapshot", "Snapshot.id", "=", "SnapshotAccount.snapshotId")
    .where({
      accountAddress: account,
    })
    .andWhere("Snapshot.start", "<=", timestamp)
    .andWhere("Snapshot.end", ">=", timestamp);

  return existingAccount.length > 0 ? existingAccount[0].id : null;
};

// Insert Snapshot data into the table
const insertSnapshotData = async (data) => {
  var transactionCount = 0;
  var accountCount = 0;
  var accountPCount = 0;

  // Group transactions by account and timestamp
  const groupedTransactions = data.reduce((groups, tx) => {
    const account = tx.flow === "outflow" ? tx.sender : tx.receiver;
    const timestamp = tx.timestamp;
    const key = `${account}-${timestamp}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
    return groups;
  }, {});

  // Iterate through each group and insert data into the database
  for (const group of Object.values(groupedTransactions)) {
    const txData = group[0];
    const account = txData.flow === "outflow" ? txData.sender : txData.receiver;
    const transactionTime = txData.timestamp;
    let accountId = null;

    if (txData.type != "delegates") {
      continue;
    }

    // Check if the account already exists in the SnapshotAccount table
    const existingAccount = await snapshotEntryCheck(account, transactionTime);

    // Retrieve Snapshot ids - For Core Units
    const snapshots = await db
      .select("Snapshot.id")
      .from("Snapshot")
      .leftJoin("SnapshotAccount", "Snapshot.id", "SnapshotAccount.snapshotId")
      .innerJoin("CoreUnit", "Snapshot.ownerId", "CoreUnit.id")
      .where("Snapshot.start", "<=", txData.timestamp)
      .andWhere("Snapshot.end", ">=", txData.timestamp)
      .andWhere("CoreUnit.code", "=", "DEL");

    let snapshotIds = [];
    try {
      snapshotIds = snapshots.map((snapshot) => snapshot.id);
    } catch (error) {
      console.error(`Snapshot not found for account: ${account}`);
      continue;
    }

    if (!existingAccount) {
      // Insert a new account and retrieve the id
      const insertedAccounts = await Promise.all(
        snapshotIds.map(async (snapshotId) => {
          if (snapshotId != null) {
            const [insertedAccount] = await db("SnapshotAccount")
              .insert({
                snapshotId: snapshotId,
                accountType: "singular",
                accountAddress: account,
                accountLabel: txData.label,
              })
              .returning("id");
            accountCount++;
            return insertedAccount;
          }
        }),
      );
      if (insertedAccounts > 0) {
        accountId = insertedAccounts[0].id;
      }
    } else {
      accountId = existingAccount;
    }

    // Insert the SnapshotAccountTransaction with the corresponding accountId
    const counterParty =
      txData.flow === "inflow" ? txData.sender : txData.receiver;
    const amount = txData.flow === "inflow" ? txData.amount : -txData.amount;

    //Drop records for same transaction hash for account (filter account + transaction hash)
    if (accountId) {
      // Check if the transaction already exists
      const [existingTransaction] = await db("SnapshotAccountTransaction")
        .where({
          snapshotAccountId: accountId,
        })
        .andWhere({ tx_hash: txData.tx_hash })
        .andWhere({ amount: amount })
        .andWhere({ counterParty: counterParty });

      if (!existingTransaction) {
        // If the transaction does not exist, insert it
        await db("SnapshotAccountTransaction").insert({
          block: txData.block,
          timestamp: txData.timestamp,
          tx_hash: txData.tx_hash,
          token: txData.token,
          counterParty: counterParty,
          amount: amount,
          snapshotAccountId: accountId,
        });
        transactionCount++;

        //Check MakerProtocol addressses
        if (
          counterParty.toLowerCase() ===
            "0x0048fc4357db3c0f45adea433a07a20769ddb0cf" ||
          counterParty.toLowerCase() ===
            "0xbe8e3e3618f7474f8cb1d074a26affef007e98fb" ||
          counterParty.toLowerCase() ===
            "0x0000000000000000000000000000000000000000"
        ) {
          const existingAccountP = await snapshotEntryCheck(
            counterParty,
            txData.timestamp,
          );
          let accountIdProtocol;

          if (existingAccountP) {
            accountIdProtocol = existingAccountP;
          } else {
            const insertedAccountsProtocol = await Promise.all(
              snapshotIds.map(async (snapshotId) => {
                if (snapshotId != null) {
                  let [insertedAccountProtocol] = await db("SnapshotAccount")
                    .insert({
                      snapshotId: snapshotId,
                      accountType: "singular",
                      accountAddress: counterParty,
                      accountLabel: txData.label,
                    })
                    .returning("id");
                  return insertedAccountProtocol;
                }
              }),
            );
            if (
              insertedAccountsProtocol.length > 0 &&
              insertedAccountsProtocol[0].id
            ) {
              accountIdProtocol = insertedAccountsProtocol[0].id;
              accountPCount++;
            }
          }

          if (accountIdProtocol) {
            // Check if the transaction already exists for the protocol counterParty
            const [existingProtocolTransaction] = await db(
              "SnapshotAccountTransaction",
            )
              .where({
                snapshotAccountId: accountIdProtocol,
              })
              .andWhere({ tx_hash: txData.tx_hash })
              .andWhere({ amount: -amount })
              .andWhere({ counterParty: account });

            if (!existingProtocolTransaction) {
              // If the transaction does not exist, insert it
              await db("SnapshotAccountTransaction").insert({
                block: txData.block,
                timestamp: txData.timestamp,
                tx_hash: txData.tx_hash,
                token: txData.token,
                counterParty: account,
                amount: -amount,
                snapshotAccountId: accountIdProtocol,
              });
              transactionCount++;
            }
          }
        }
      }
    }
  }

  console.log(transactionCount + " transactions added to the DB");
  console.log(accountCount + " accounts added to the DB");
  console.log(accountPCount + " Maker Protocol accounts added to the DB");
};

// Call the function to get the JSON response
//const tokens = ['DAI', 'USDC', 'USDT', 'GUSD', 'TUSD', 'MKR', 'ETH', 'WETH', 'STETH', 'cDAI'];
delegateTransfers(delegateAddresses).then(async (data) => {
  await insertSnapshotData(data);
  console.log("Data inserted successfully");
  process.exit(0);
});
