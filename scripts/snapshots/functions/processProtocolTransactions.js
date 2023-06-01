  // Check for existing SnapshotAccount Protocol entry
  const snapshotProtocolEntryCheck = async (protocolAccount, snapshotReportId, knex) => {

      const existingAccount = await knex('SnapshotAccount')
          .select('SnapshotAccount.id')
          .join('Snapshot', 'Snapshot.id', '=', 'SnapshotAccount.snapshotId')
          .where({
              accountAddress: protocolAccount,
              'Snapshot.id': snapshotReportId
          });

      return existingAccount || null;
  };


  const processProtocolTransactions = async (snapshotReportId, protocolTransactions, knex) => {

      console.log(`Creating protocol account for snapshot report ${snapshotReportId} with ${protocolTransactions.length} transactions`);

      let accountIdProtocol;
      const protocolAccount = '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb';
        const [existingAccountP] = await snapshotProtocolEntryCheck(protocolAccount, snapshotReportId, knex);

      if (existingAccountP) {
        accountIdProtocol = existingAccountP.id;
    } else {
        if (snapshotReportId) {
            let insertedAccountProtocol = await knex('SnapshotAccount')
                .insert({
                    snapshotId: snapshotReportId,
                    accountType: 'singular',
                    accountAddress: protocolAccount,
                    accountLabel: 'Maker Protocol Wallet'
                })
                .returning('id');
            accountIdProtocol = insertedAccountProtocol[0].id;
        }
    }


      for (let i = 0; i < protocolTransactions.length; i++) {

          const txData = protocolTransactions[i];

          const counterParty = txData.flow === 'outflow' ? txData.sender : txData.receiver;
          const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

          const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

          if (accountIdProtocol) {
              // Check if the transaction already exists for the protocol counterParty
              const [existingProtocolTransaction] = await knex('SnapshotAccountTransaction')
                  .where({
                      snapshotAccountId: accountIdProtocol,
                  })
                  .andWhere({
                      tx_hash: txData.tx_hash
                  })
                  .andWhere({
                      amount: -amount
                  })
                  .andWhere({
                      counterParty: counterParty    
                  });

              if (!existingProtocolTransaction) {
                  // If the transaction does not exist, insert it
                  await knex('SnapshotAccountTransaction').insert({
                      block: txData.block,
                      timestamp: txData.timestamp,
                      tx_hash: txData.tx_hash,
                      token: txData.token,
                      counterParty: counterParty,
                      amount: -amount,
                      snapshotAccountId: accountIdProtocol,
                  });
              }
          }
      }

      return accountIdProtocol;
  };


  export default processProtocolTransactions;