const processTransactions = async (snapshotAccount, transactions, knex) => {

    console.log(`Fetched ${transactions.length} transactions for ${snapshotAccount.accountData.accountAddress}`);
    let protocolTransactions = [];
    let addedTransactions = 0;
    

    for (let i = 0; i < transactions.length; i++) {
        
        const txData = transactions[i];

        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

        if(account === snapshotAccount.accountData.accountAddress){
        
        const transactionTime = txData.timestamp;
        const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
        const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

        // Check if the transaction already exists
        const [existingTransaction] = await knex('SnapshotAccountTransaction')
            .where({
                snapshotAccountId: snapshotAccount.accountData.id
            })
            .andWhere({
                tx_hash: txData.tx_hash
            })
            .andWhere({
                amount: amount
            })
            .andWhere({
                counterParty: counterParty
            })
            .andWhere({
                timestamp: transactionTime
            })
            .andWhere({
                block: txData.block
            });


        if (!existingTransaction) {
            
            // If the transaction does not exist, insert it
            
            await knex('SnapshotAccountTransaction').insert({
                block: txData.block,
                timestamp: txData.timestamp,
                tx_hash: txData.tx_hash,
                token: txData.token,
                counterParty: counterParty,
                amount: amount,
                snapshotAccountId: snapshotAccount.accountData.id,
            });

            addedTransactions++;


            //Check MakerProtocol addressses
            if (counterParty.toLowerCase() === '0x0048fc4357db3c0f45adea433a07a20769ddb0cf' ||
                counterParty.toLowerCase() === '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb' ||
                counterParty.toLowerCase() === '0x0000000000000000000000000000000000000000') {
                protocolTransactions.push(txData);
            }
        }
    }
}
    

    return {
        addedTransactions: addedTransactions,
        protocolTransactions: protocolTransactions
    };
};

export default processTransactions;