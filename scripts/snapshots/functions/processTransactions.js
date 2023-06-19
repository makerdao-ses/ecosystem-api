const processTransactions = async (snapshotAccount, transactions, makerProtocolAddresses, knex) => {

    console.log(`Fetched ${transactions.length} transactions for ${snapshotAccount.accountAddress}`);
    let protocolTransactions = [];
    let addedTransactionsCount = 0;

    //clear existing transactions
    const deletedEntries = await knex('SnapshotAccountTransaction')
        .whereIn('snapshotAccountId', function () {
            this.select('id')
                .from('SnapshotAccount')
                .where('accountAddress', snapshotAccount.accountAddress)
                .andWhere('snapshotAccountId', snapshotAccount.id);
        })
        .del();

    console.log('Cleared ' + deletedEntries + ' entries');


    for (let i = 0; i < transactions.length; i++) {

        const txData = transactions[i];
        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

        if (account === snapshotAccount.accountAddress) {

            const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
            const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

            await knex('SnapshotAccountTransaction').insert({
                block: txData.block,
                timestamp: txData.timestamp,
                tx_hash: txData.tx_hash,
                token: txData.token,
                counterParty: counterParty,
                amount: amount,
                snapshotAccountId: snapshotAccount.id,
            });

            addedTransactionsCount++;


            //Check MakerProtocol addressses
            if (makerProtocolAddresses.indexOf(counterParty.toLowerCase()) > -1) {
                protocolTransactions.push(txData);
            }
        }
    }
    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions: protocolTransactions
    };
};


export default processTransactions;