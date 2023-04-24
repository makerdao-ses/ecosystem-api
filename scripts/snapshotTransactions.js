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
    skip += 100;
    console.log('Fetching data...');
  } while (jsonData != 0);
  console.log(data.length); 
  return data;
};



// Insert Snapshot data into the table
const insertSnapshotData = async (data) => {
  var transactionCount = 0;

  for (let i = 0; i < data.length; i++) {
    const txData = data[i];
    const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

    // Check if the account already exists in the SnapshotAccount table
    const [existingAccount] = await db('SnapshotAccount').where({
      accountAddress: account
    });

    let code = txData.code;
    
    if (txData.type === 'delegates'){
      code = 'DEL';
    }
      
    // Retrieve Snapshot ids - For Core Units
    const snapshots = await db
      .select('Snapshot.id')
      .from('Snapshot')
      .innerJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
      .innerJoin('CoreUnit', 'Snapshot.ownerId', 'CoreUnit.id')
      .where('Snapshot.start', '<=', txData.timestamp)
      .andWhere('Snapshot.end', '>=', txData.timestamp)
      .andWhere('SnapshotAccount.accountAddress', account)
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
        if(snapshotId != null){
        const [insertedAccount] = await db('SnapshotAccount')
          .insert({
            snapshotId: snapshotId,
            accountType: 'singular',
            accountAddress: account,
            accountLabel: code
          })
          .returning('id');
          console.log(insertedAccount);
        return insertedAccount;
      }}));
      accountId = insertedAccounts[0];
    }

    // Insert the SnapshotAccountTransaction with the corresponding accountId
    const counterParty = txData.flow === 'inflow' ? txData.receiver : txData.sender;
    const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

    if(accountId != null){
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
  }}


  console.log(transactionCount);
};



// Call the function to get the JSON response
//const tokens = ['DAI', 'USDC', 'USDT', 'GUSD', 'TUSD', 'MKR', 'ETH', 'WETH', 'STETH', 'cDAI'];
coreUnitTransfers().then(async (data) => {
  await insertSnapshotData(data);
  console.log('Data inserted successfully');
  process.exit(0);
});