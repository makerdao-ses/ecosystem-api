  import fetch from 'node-fetch';
  import knex from 'knex';

  const DIN_API_USER = process.env.DIN_API_USER;
  const DIN_API_PW = process.env.DIN_API_PW;

  // Connect to database selected in the .env file
  const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    idleTimeoutMillis: 0,
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

  var transactionCount = 0;
  var accountCount = 0;
  var accountPCount = 0;

  //List of wallets to be sent to the DIN API
  const cuWallets = ["0x01d26f8c5cc009868a4bf66e268c17b057ff7a73"];
  
  /*["0x25307ab59cd5d8b4e2c01218262ddf6a89ff86da",
  "0xd740882b8616b50d0b317fdff17ec3f4f853f44f",
  "0x1ee3eca7aef17d1e74ed7c447ccba61ac76adba9",
  "0x99e1696a680c0d9f426be20400e468089e7fdb0f",
  "0x34d8d61050ef9d2b48ab00e6dc8a8ca6581c5d63",
  "0x5f5c328732c9e52dfcb81067b8ba56459b33921f",
  "0x56349a38e09f36039f6af77309690d217beaf0bf",
  "0xa78f1f5698f8d345a14d7323745c6c56fb8227f0",
  "0xf482d1031e5b172d42b2daa1b6e5cbf6519596f7",
  "0x7327aed0ddf75391098e8753512d8aec8d740a1f",
  "0x5a994d8428ccebcc153863ccda9d2be6352f89ad",
  "0x8cd0ad5c55498aacb72b6689e1da5a284c69c0c7",
  "0x3d274fbac29c92d2f624483495c0113b44dbe7d2",
  "0x01d26f8c5cc009868a4bf66e268c17b057ff7a73",
  "0x73f09254a81e1f835ee442d1b3262c1f1d7a13ff",
  "0x7800c137a645c07132886539217ce192b9f0528e",
  "0x124c759d1084e67b19a206ab85c4527fab26c342",
  "0xd1f2eef8576736c1eba36920b957cd2af07280f4",
  "0x2d09b7b95f3f312ba6ddfb77ba6971786c5b50cf",
  "0x53ccaa8e3bef14254041500acc3f1d4edb5b6d24",
  "0x2b6180b413511ce6e3da967ec503b2cc19b78db6",
  "0x1a5b692029b157df517b7d21a32c8490b8692b0f",
  "0xe2c16c308b843ed02b09156388cb240ced58c01c",
  "0x83e36aaa1c7b99e2d3d07789f7b70fce46f0d45e",
  "0xb386bc4e8bae87c3f67ae94da36f385c100a370a",
  "0xd98ef20520048a35eda9a202137847a62120d2d9",
  "0x96d7b01cc25b141520c717fa369844d34ff116ec",
  "0xd1505ee500791490de8642353ba6a5b92e3550f7",
  "0x9e1585d9ca64243ce43d42f7dd7333190f66ca09",
  "0xb1f950a51516a697e103aaa69e152d839182f6fe",
  "0x465aa62a82e220b331f5ecca697c20e89554b298",
  "0xf95eb8ec63d6059ba62b0a8a7f843c7d92f41de2",
  "0xb5eb779ce300024edb3df9b6c007e312584f6f4f",
  "0x7c09ff9b59baaebfd721cbda3676826aa6d7bae8",
  "0x87acdd9208f73bfc9207e1f6f0fde906bca95cc6",
  "0xf737c76d2b358619f7ef696cf3f94548fecec379",
  "0x955993df48b0458a01cfb5fd7df5f5dca6443550",
  "0xc657ac882fb2d6ccf521801da39e910f8519508d",
  "0x6d348f18c88d45243705d4fdeeb6538c6a9191f1",
  "0xb2da57e224949acdde173a5b8a8160c023ea86e6",
  "0xa2a855ac8d2a92e8a5a437690875261535c8320c",
  "0x2dc0420a736d1f40893b9481d8968e4d7424bc0b",
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
  "0xe78658a8acfe982fde841abb008e57e6545e38b3"];*/
  
  // Core Unit Transfers
  const coreUnitTransfers = async (addresses) => {
    const token = 'DAI';
    const headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + await getToken()
    };
    let data = [];
    let skip = 0;
    let response = null;
    let jsonData = null; // declare jsonData variable
    let apiCalls = 0;

    let countGov = 0;
    let countPe = 0;
    let countOra = 0;
  
    // loop through each address
    for (let i = 0; i < addresses.length; i++) {

      if(addresses[i] != '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73'){
      skip = 0; 

      const fromUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${addresses[i]}&skip=`;
      const toUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&to_address=${addresses[i]}&skip=`;
  
      // make the API call for from_address
      do {
        response = await fetch(fromUrl + skip, {
          method: 'GET',
          headers: headers
        });
        jsonData = await response.json(); // assign response to jsonData
  
        if (jsonData.detail === 'Could not validate credentials') {
          console.log('Error: Could not validate credentials');
          return data;
        }
        data = data.concat(jsonData);
        
        skip+=jsonData.length;
        
        apiCalls++;

        console.log(`Address ${i+1}: API call ${apiCalls} - from_address - fetching data...`);
        
      } while (jsonData.length !== 0);
  
      // reset skip and make the API call for to_address
      skip = 0;
      jsonData = null;
  
      do {
        response = await fetch(toUrl + skip, {
          method: 'GET',
          headers: headers
        });
        jsonData = await response.json(); // assign response to jsonData
  
        if (jsonData.detail === 'Could not validate credentials') {
          console.log('Error: Could not validate credentials');
          return data;
        }
        data = data.concat(jsonData);
        
        skip+=jsonData.length;
          
        apiCalls++;
        console.log(`Address ${i+1}: API call ${apiCalls} - to_address - fetching data...`);
      } while (jsonData.length !== 0);
      }

      if (addresses[i] === '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73'){
        
        skip = 0; 
        

      const fromUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${addresses[i]}&skip=`;
      const toUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&to_address=${addresses[i]}&skip=`;
  
      // make the API call for from_address
      do {
        response = await fetch(fromUrl + skip, {
          method: 'GET',
          headers: headers
        });
        jsonData = await response.json(); // assign response to jsonData
  
        if (jsonData.detail === 'Could not validate credentials') {
          console.log('Error: Could not validate credentials');
          return data;
        }
        data = data.concat(jsonData);
        
        skip+=jsonData.length;

        apiCalls++;
        

        console.log(`Address ${i+1}: API call ${apiCalls} - from_address - fetching data...`);
        
      } while (jsonData.length !== 0);
  
      // reset skip and make the API call for to_address
      skip = 0;
      jsonData = null;
  
      do {
        response = await fetch(toUrl + skip, {
          method: 'GET',
          headers: headers
        });
        jsonData = await response.json(); // assign response to jsonData
  
        if (jsonData.detail === 'Could not validate credentials') {
          console.log('Error: Could not validate credentials');
          return data;
        }
        data = data.concat(jsonData);
        
        skip+=jsonData.length;
        
        apiCalls++;
        console.log(`Address ${i+1}: API call ${apiCalls} - to_address - fetching data...`);
      } while (jsonData.length !== 0);
      }
    }
    console.log(`Total transaction length: ${data.length}`);
    return data;
  };

  // Check for existing SnapshotAccount entry
  const snapshotEntryCheck = async (account) => {

    const existingAccount = await db('SnapshotAccount')
      .select('SnapshotAccount.id')
      .join('Snapshot', 'Snapshot.id', '=', 'SnapshotAccount.snapshotId')
      .where({ 
        accountAddress: account
      });

    return existingAccount || null;
  };

  // Check for existing SnapshotAccount Protocol entry
  const snapshotProtocolEntryCheck = async (account, code) => {

    const existingAccount = await db('SnapshotAccount')
    .select('SnapshotAccount.id')
    .join('Snapshot', 'Snapshot.id', '=', 'SnapshotAccount.snapshotId')
    .join({ cu: 'CoreUnit' }, 'cu.id', '=', 'Snapshot.ownerId')
    .where({
      accountAddress: account,
      'cu.code': code
    });

    return existingAccount || null;
  };

  // Insert Snapshot data into the table
  const insertSnapshotData = async (data) => {

    //Reset gov transaction entries
    const govDeletedEntries = await db('SnapshotAccountTransaction')
  .whereIn('snapshotAccountId', function() {
    this.select('id')
      .from('SnapshotAccount')
      .where('accountAddress', '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73');
  })
  .del();

    console.log('Cleared '+govDeletedEntries+' GOV entries');
    
    for (let i = 0; i < data.length; i++) {
      const txData = data[i];
      const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
      const transactionTime = txData.timestamp;
      let code = txData.code;

      //Handle delegates
      if (txData.type === 'delegates') {
        await delWallet(txData);
        continue;
      }
      
      //Handle GOV
      if (account === '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73') {
        await govWallet(txData);
        continue;
      }
      

      // Check if the account already exists in the SnapshotAccount table
      const [existingAccount] = await snapshotEntryCheck(account);
      
      // Retrieve Snapshot ids - For Core Units
      const snapshots = await db
        .select('Snapshot.id')
        .from('Snapshot')
        .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
        .innerJoin('CoreUnit', 'Snapshot.ownerId', 'CoreUnit.id')
        .andWhere('CoreUnit.code', '=', code);

      
      let snapshotId;
      try {
        snapshotId = snapshots[0].id;
      } catch (error) {
        console.error(`Snapshot not found for account: ${account} and code: ${code}`);
        continue;
      }

      

      let accountId;
      if (existingAccount) {
        accountId = existingAccount.id;
      } else {
        // Insert a new account and retrieve the id
          
          if (snapshotId != null) {
            const insertedAccount = await db('SnapshotAccount')
              .insert({
                snapshotId: snapshotId,
                accountType: 'singular',
                accountAddress: account,
                accountLabel: code
              })
              .returning('id');
            accountCount++;
            accountId = insertedAccount[0].id;
          }
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
          .andWhere({counterParty: counterParty})
          .andWhere({timestamp: transactionTime})
          .andWhere({block: txData.block});
          

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

            const [existingAccountP] = await snapshotProtocolEntryCheck(counterParty, code);

            let accountIdProtocol;

            if (existingAccountP) {
              accountIdProtocol = existingAccountP.id;
            } else {
                if (snapshotId != null) {
                  let insertedAccountProtocol = await db('SnapshotAccount')
                    .insert({
                      snapshotId: snapshotId,
                      accountType: 'singular',
                      accountAddress: counterParty,
                      accountLabel: code
                    })
                    .returning('id');
                    accountIdProtocol = insertedAccountProtocol[0].id;
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

  //Handle delegate wallets
  const delWallet = async (txData) => {
      
        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
        const transactionTime = txData.timestamp;
        let code = txData.code;
        let label = txData.label;

        let owner = 'DEL';
  
        // Check if the account already exists in the SnapshotAccount table
        const [existingAccount] = await snapshotEntryCheck(account);
        
        // Retrieve Snapshot ids - For Core Units
        const snapshots = await db('Snapshot')
        .select('Snapshot.id')
        .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
        .where('Snapshot.ownerType', '=', 'DelegatesDraft');
      
        let snapshotId = snapshots[0].id;
  
        let accountId;
        
        if (existingAccount) {
          accountId = existingAccount.id;
        } else {
            if (snapshotId != null) {
              const insertedAccount = await db('SnapshotAccount')
                .insert({
                  snapshotId: snapshotId,
                  accountType: 'singular',
                  accountAddress: account,
                  accountLabel: label
                })
                .returning('id');
              accountCount++;
              accountId = insertedAccount[0].id;
            }
          };
        
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
            .andWhere({counterParty: counterParty})
            .andWhere({timestamp: transactionTime})
            .andWhere({block: txData.block});
            
  
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
  
  
              const [existingAccountP] = await db('Snapshot')
              .select('SnapshotAccount.id')
              .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
              .where('Snapshot.ownerType', '=', 'DelegatesDraft')
              .andWhere('SnapshotAccount.accountAddress', '=', counterParty);
            
              let accountIdProtocol;
  
              if (existingAccountP) {
                accountIdProtocol = existingAccountP.id;
              } else {
                  if (snapshotId != null) {
                    const insertedAccountProtocol = await db('SnapshotAccount')
                      .insert({
                        snapshotId: snapshotId,
                        accountType: 'singular',
                        accountAddress: counterParty,
                        accountLabel: owner
                      })
                      .returning('id');
                      accountPCount++;
                      accountIdProtocol = insertedAccountProtocol[0].id;
                  }
                };
                
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
      };

  //Handle spf wallets - TO DO 
  const spfWallet = async (txData) => {
      
    const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
    const transactionTime = txData.timestamp;
    let code = txData.code;
    let label = txData.label;

    let owner = 'DEL';

    // Check if the account already exists in the SnapshotAccount table
    const [existingAccount] = await snapshotEntryCheck(account);
    
    // Retrieve Snapshot ids - For Core Units
    const snapshots = await db('Snapshot')
    .select('Snapshot.id')
    .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
    .where('Snapshot.ownerType', '=', 'DelegatesDraft');
  
    let snapshotId = snapshots[0].id;

    let accountId;
    
    if (existingAccount) {
      accountId = existingAccount.id;
    } else {
        if (snapshotId != null) {
          const insertedAccount = await db('SnapshotAccount')
            .insert({
              snapshotId: snapshotId,
              accountType: 'singular',
              accountAddress: account,
              accountLabel: label
            })
            .returning('id');
          accountCount++;
          accountId = insertedAccount[0].id;
        }
      };
    
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
        .andWhere({counterParty: counterParty})
        .andWhere({timestamp: transactionTime})
        .andWhere({block: txData.block});
        

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


          const [existingAccountP] = await db('Snapshot')
          .select('SnapshotAccount.id')
          .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
          .where('Snapshot.ownerType', '=', 'DelegatesDraft')
          .andWhere('SnapshotAccount.accountAddress', '=', counterParty);
        
          let accountIdProtocol;

          if (existingAccountP) {
            accountIdProtocol = existingAccountP.id;
          } else {
              if (snapshotId != null) {
                const insertedAccountProtocol = await db('SnapshotAccount')
                  .insert({
                    snapshotId: snapshotId,
                    accountType: 'singular',
                    accountAddress: counterParty,
                    accountLabel: owner
                  })
                  .returning('id');
                  accountPCount++;
                  accountIdProtocol = insertedAccountProtocol[0].id;
              }
            };
            
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
  };


  //Handle GOV wallet
  const govWallet = async (txData) => {
    
      const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
      let code = txData.code;

      // Check if the account already exists in the SnapshotAccount table
      const existingAccount = await snapshotEntryCheck(account);
      
      // Retrieve Snapshot ids - For Core Units
      const snapshots = await db('Snapshot')
      .distinct('Snapshot.id')
      .leftJoin('SnapshotAccount', 'Snapshot.id', 'SnapshotAccount.snapshotId')
      .innerJoin('CoreUnit', 'Snapshot.ownerId', 'CoreUnit.id')
      .where('CoreUnit.code', '=', code);

      
      let snapshotId;

      try {
        snapshotId = snapshots[0].id;
      } catch (error) {
        console.error(`Snapshot not found for account: ${account}`);
      }

      let accountId;

      if (existingAccount) {
        accountId = existingAccount[0].id;
      } else {
        // Insert a new account and retrieve the id
          
          if (snapshotId != null) {
            const insertedAccount = await db('SnapshotAccount')
              .insert({
                snapshotId: snapshotId,
                accountType: 'singular',
                accountAddress: account,
                accountLabel: code
              })
              .returning('id');
            accountCount++;
            accountId = insertedAccount[0].id;
          }
        }

      // Insert the SnapshotAccountTransaction with the corresponding accountId
      const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
      const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

      //Drop records for same transaction hash for account (filter account + transaction hash)
      if (accountId) {
    
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


            const [existingAccountP] = await snapshotProtocolEntryCheck(counterParty, code);
            let accountIdProtocol;

            if (existingAccountP) {
              accountIdProtocol = existingAccountP.id;
            } else {
                if (snapshotId != null) {
                  let insertedAccountProtocol = await db('SnapshotAccount')
                    .insert({
                      snapshotId: snapshotId,
                      accountType: 'singular',
                      accountAddress: counterParty,
                      accountLabel: code
                    })
                    .returning('id');
                  accountIdProtocol = insertedAccountProtocol[0].id;
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
      };



  // Call the function to get the JSON response
  //const tokens = ['DAI', 'USDC', 'USDT', 'GUSD', 'TUSD', 'MKR', 'ETH', 'WETH', 'STETH', 'cDAI'];
  coreUnitTransfers(cuWallets).then(async (data) => {
    await insertSnapshotData(data);
    console.log('Data inserted successfully');
    process.exit(0);
  });