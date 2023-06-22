import getCounterPartyName from "./getCounterPartyName.js";

  const processProtocolTransactions = async (snapshotReportId, protocolTransactions, knex) => {

      console.log(`Creating protocol account for snapshot report ${snapshotReportId} with ${protocolTransactions.length} transactions`);

      let accountIdProtocol;
      //Rewrite protocol account logic
      const protocolAccount = '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb';
       
            let insertedAccountProtocol = await knex('SnapshotAccount')
                .insert({
                    snapshotId: snapshotReportId,
                    accountType: 'singular',
                    accountAddress: protocolAccount,
                    accountLabel: 'Maker Protocol Wallet',
                    offChain: false
                })
                .returning('id');
            accountIdProtocol = insertedAccountProtocol[0].id;
       

      for (let i = 0; i < protocolTransactions.length; i++) {

          const txData = protocolTransactions[i];

          const counterParty = txData.flow === 'outflow' ? txData.sender : txData.receiver;
          const counterPartyName = getCounterPartyName(counterParty);
          const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

          const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

          if (accountIdProtocol) {
             
             
                  // If the transaction does not exist, insert it
                  await knex('SnapshotAccountTransaction').insert({
                      block: txData.block,
                      timestamp: txData.timestamp,
                      txHash: txData.tx_hash,
                      token: txData.token,
                      counterPartyName: counterPartyName,
                      counterParty: counterParty,
                      amount: -amount,
                      snapshotAccountId: accountIdProtocol,
                  });
              }
          }
      

      return accountIdProtocol;
  };


  export default processProtocolTransactions;