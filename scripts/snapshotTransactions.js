  import fetch from 'node-fetch';
  import knex from 'knex';

  const DIN_API_USER = process.env.DIN_API_USER;
  const DIN_API_PW = process.env.DIN_API_PW;

  // Connect to database selected in the .env file
  const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
  });

  // First Curl Request to get the Bearer token
  const getToken = async () => {
    const url = 'https://data-api.makerdao.network/v1/login/access-token';
    const body = new URLSearchParams({
      'grant_type': '',
      'username': DIN_API_USER,
      'password': DIN_API_PW,
      'scope': '',
      'client_id': '',
      'client_secret': ''
    });
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: headers
    });
    const data = await response.json();
    const token = data.access_token;
    return token;
  };

  // Core Unit Transfers
  const coreUnitTransfers = async () => {
    const url = 'https://data-api.makerdao.network/v1/core_units/transfers?skip=';
    const headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + await getToken()
    };
    let data = [];
    let skip = 0;
    let response = null;
    let jsonData = null; // declare jsonData variable
    do {
      response = await fetch(url + skip, {
        method: 'GET',
        headers: headers
      });
      jsonData = await response.json(); // assign response to jsonData

      if (jsonData.detail === 'Could not validate credentials') {
        console.log('Error: Could not validate credentials');
        return data;
      }
      data = data.concat(jsonData);
      skip += jsonData.length;
      console.log('Fetching data...');
    } while (jsonData != 0);
    console.log("Total transaction length: "+data.length);
    return data;
  };

  const startTimestamp = () => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const startOfMonth = new Date(Date.UTC(year, month, 1, 12, 0, 0, 0));
    const fifteenthOfMonth = new Date(Date.UTC(year, month, 15, 12, 0, 0, 0));

    // If current date is before the 15th, use last month as start date
    if (today < fifteenthOfMonth) {
      startOfMonth.setUTCMonth(month - 1);
    }

    startOfMonth.setUTCDate(15);
    startOfMonth.setUTCHours(12, 0, 0, 0);
    return startOfMonth.toISOString();
  };


  const endTimestamp = () => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 12, 0, 0, 0));
    const fifteenthOfMonth = new Date(Date.UTC(year, month, 15, 12, 0, 0, 0));

    // If current date is after the 15th, use next month as end date
    if (today >= fifteenthOfMonth) {
      endOfMonth.setUTCMonth(month + 1);
    }

    endOfMonth.setUTCDate(15);
    endOfMonth.setUTCHours(12, 0, 0, 0);
    return endOfMonth.toISOString();
  };


  // Check Snapshot entry
  const snapshotEntryCheck = async (account, timestamp) => {

    const existingAccount = await db('SnapshotAccount')
      .select('SnapshotAccount.id')
      .join('Snapshot', 'Snapshot.id', '=', 'SnapshotAccount.snapshotId')
      .where({
        accountAddress: account
      })
      .andWhere('Snapshot.start', '<=', timestamp)
      .andWhere('Snapshot.end', '>=', timestamp);

    return existingAccount || null;
  };

  // Insert Snapshot data into the table
  const insertSnapshotData = async (data) => {
    var transactionCount = 0;
    var accountCount = 0;
    var accountPCount = 0;

    for (let i = 0; i < data.length; i++) {
      const txData = data[i];
      const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
      const transactionTime = txData.timestamp;
      let code = txData.code;

      if (txData.type === 'delegates') {
        continue;
      }

      // Check if the account already exists in the SnapshotAccount table
      const [existingAccount] = await snapshotEntryCheck(account, transactionTime);
      



      // Retrieve Snapshot ids - For Core Units
      const snapshots = await db
        .select('Snapshot.id')
        .from('Snapshot')
        .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
        .innerJoin('CoreUnit', 'Snapshot.ownerId', 'CoreUnit.id')
        .where('Snapshot.start', '<=', txData.timestamp)
        .andWhere('Snapshot.end', '>=', txData.timestamp)
        .andWhere('CoreUnit.code', '=', code);

      let snapshotIds = [];
      try {
        snapshotIds = snapshots.map(snapshot => snapshot.id);
      } catch (error) {
        console.error(`Snapshot not found for account: ${account}`);
        continue;
      }

      let accountId;
      if (existingAccount) {
        accountId = existingAccount.id;
      } else {
        // Insert a new account and retrieve the id
        const insertedAccounts = await Promise.all(snapshotIds.map(async snapshotId => {
          
          if (snapshotId != null) {
            const [insertedAccount] = await db('SnapshotAccount')
              .insert({
                snapshotId: snapshotId,
                accountType: 'singular',
                accountAddress: account,
                accountLabel: code
              })
              .returning('id');
            accountCount++;
            return insertedAccount;
          }
        }));
        if(insertedAccounts>0){
        accountId = insertedAccounts[0].id;}
      }

      // Insert the SnapshotAccountTransaction with the corresponding accountId
      const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
      const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

      //Drop records for same transaction hash for account (filter account + transaction hash)
      if (accountId) {
        // Check if the transaction already exists
        const [existingTransaction] = await db('SnapshotAccountTransaction')
          .where({
            snapshotAccountId: accountId
          })
          .andWhere({tx_hash: txData.tx_hash})
          .andWhere({amount: amount})
          .andWhere({counterParty: counterParty});

        if (!existingTransaction) {
          // If the transaction does not exist, insert it
          await db('SnapshotAccountTransaction').insert({
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
          if (counterParty.toLowerCase() === '0x0048fc4357db3c0f45adea433a07a20769ddb0cf' ||
            counterParty.toLowerCase() === '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb' ||
            counterParty.toLowerCase() === '0x0000000000000000000000000000000000000000') {


            const [existingAccountP] = await snapshotEntryCheck(counterParty, txData.timestamp);
            let accountIdProtocol;

            if (existingAccountP) {
              accountIdProtocol = existingAccountP.id;
            } else {
              const insertedAccountsProtocol = await Promise.all(snapshotIds.map(async snapshotId => {
                if (snapshotId != null) {
                  let [insertedAccountProtocol] = await db('SnapshotAccount')
                    .insert({
                      snapshotId: snapshotId,
                      accountType: 'singular',
                      accountAddress: counterParty,
                      accountLabel: code
                    })
                    .returning('id');
                  return insertedAccountProtocol;
                }
              }));
              if (insertedAccountsProtocol.length > 0 && insertedAccountsProtocol[0].id) {
                accountIdProtocol = insertedAccountsProtocol[0].id;
                accountPCount++;
              }
            }

            if (accountIdProtocol) {
              // Check if the transaction already exists for the protocol counterParty
              const [existingProtocolTransaction] = await db('SnapshotAccountTransaction')
                .where({
                  snapshotAccountId: accountIdProtocol,
                })
                .andWhere({tx_hash: txData.tx_hash})
                .andWhere({amount: -amount})
                .andWhere({counterParty: account});

              if (!existingProtocolTransaction) {
                // If the transaction does not exist, insert it
                await db('SnapshotAccountTransaction').insert({
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



    console.log(transactionCount +" transactions added to the DB");
    console.log(accountCount +" accounts added to the DB");
    console.log(accountPCount +" Maker Protocol accounts added to the DB");
  };



  // Call the function to get the JSON response
  //const tokens = ['DAI', 'USDC', 'USDT', 'GUSD', 'TUSD', 'MKR', 'ETH', 'WETH', 'STETH', 'cDAI'];
  coreUnitTransfers().then(async (data) => {
    await insertSnapshotData(data);
    console.log('Data inserted successfully');
    process.exit(0);
  });