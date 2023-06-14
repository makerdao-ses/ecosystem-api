const processTransactions = async (snapshotAccount, transactions, knex) => {

    console.log(`Fetched ${transactions.length} transactions for ${snapshotAccount.accountAddress}`);
    let protocolTransactions = [];
    let addedTransactionsCount = 0;
    //AddedTransactionsCount

    //Handle GOV
    if (snapshotAccount.accountAddress.toLowerCase() === '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73') {
        const govFormat = await govWallet(snapshotAccount, transactions, knex);
        protocolTransactions = govFormat.protocolTransactions;
        addedTransactionsCount = govFormat.addedTransactionsCount;
    }
    //Handle CES
    if (snapshotAccount.accountAddress.toLowerCase() === '0xd740882b8616b50d0b317fdff17ec3f4f853f44f') {
        const cesFormat = await cesWallet(snapshotAccount, transactions, knex);
        protocolTransactions = cesFormat.protocolTransactions;
        addedTransactionsCount = cesFormat.addedTransactionsCount;
    }
    //Handle all else
    else {
        for (let i = 0; i < transactions.length; i++) {

            const txData = transactions[i];
            const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

                if (account === snapshotAccount.accountAddress) {

                    const transactionTime = txData.timestamp;
                    const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
                    const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

                    // Check if the transaction already exists
                    const [existingTransaction] = await knex('SnapshotAccountTransaction')
                        .where({
                            snapshotAccountId: snapshotAccount.id
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
                            snapshotAccountId: snapshotAccount.id,
                        });

                        addedTransactionsCount++;


                        //Check MakerProtocol addressses
                        if (counterParty.toLowerCase() === '0x0048fc4357db3c0f45adea433a07a20769ddb0cf' ||
                            counterParty.toLowerCase() === '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb' ||
                            counterParty.toLowerCase() === '0x0000000000000000000000000000000000000000') {
                            protocolTransactions.push(txData);
                        }
                    }
                }
        }
    }
    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions: protocolTransactions
    };
};


//Handle GOV wallet
const govWallet = async (snapshotAccount, transactions, knex) => {

    let govProtocolTransactions = [];
    let govAddedTransactionsCount = 0;

    //Reset gov transaction entries
    const govDeletedEntries = await knex('SnapshotAccountTransaction')
        .whereIn('snapshotAccountId', function () {
            this.select('id')
                .from('SnapshotAccount')
                .where('accountAddress', '0x01d26f8c5cc009868a4bf66e268c17b057ff7a73');
        })
        .del();

    console.log('Cleared ' + govDeletedEntries + ' GOV entries');

    for (let i = 0; i < transactions.length; i++) {
        
        const txData = transactions[i];

        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
        if (account === snapshotAccount.accountAddress) {

        // Insert the SnapshotAccountTransaction with the corresponding accountId
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

        govAddedTransactionsCount++;

        //Check MakerProtocol addressses
        if (counterParty.toLowerCase() === '0x0048fc4357db3c0f45adea433a07a20769ddb0cf' ||
            counterParty.toLowerCase() === '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb' ||
            counterParty.toLowerCase() === '0x0000000000000000000000000000000000000000') {

            govProtocolTransactions.push(txData);
        }
    }
}


    return {
        addedTransactionsCount: govAddedTransactionsCount,
        protocolTransactions: govProtocolTransactions
    };
};

//Handle GOV wallet
const cesWallet = async (snapshotAccount, transactions, knex) => {

    let cesProtocolTransactions = [];
    let cesAddedTransactionsCount = 0;

    //Reset gov transaction entries
    const cesDeletedEntries = await knex('SnapshotAccountTransaction')
        .whereIn('snapshotAccountId', function () {
            this.select('id')
                .from('SnapshotAccount')
                .where('accountAddress', '0xd740882b8616b50d0b317fdff17ec3f4f853f44f');
        })
        .del();

    console.log('Cleared ' + cesDeletedEntries + ' CES entries');

    for (let i = 0; i < transactions.length; i++) {
        
        const txData = transactions[i];

        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
        if (account === snapshotAccount.accountAddress) {

        // Insert the SnapshotAccountTransaction with the corresponding accountId
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

        cesAddedTransactionsCount++;

        //Check MakerProtocol addressses
        if (counterParty.toLowerCase() === '0x0048fc4357db3c0f45adea433a07a20769ddb0cf' ||
            counterParty.toLowerCase() === '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb' ||
            counterParty.toLowerCase() === '0x0000000000000000000000000000000000000000') {

            cesProtocolTransactions.push(txData);
        }
    }
}


    return {
        addedTransactionsCount: cesAddedTransactionsCount,
        protocolTransactions: cesProtocolTransactions
    };
};

export default processTransactions;