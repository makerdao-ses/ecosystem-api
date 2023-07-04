import getCounterPartyName from "./getCounterPartyName.js";

const processTransactions = async (snapshotAccount, transactions, makerProtocolAddresses, knex, snapshotId) => {

    console.log(`Fetched ${transactions.length} transactions for ${snapshotAccount.accountAddress}`);
    let protocolTransactions = [];
    let paymentProcessorTransactions = [];
    let addedTransactionsCount = 0;
    let initialBalance = 0;
    let snapshotStart = null;
    let snapshotEnd = null;

    for (let i = 0; i < transactions.length; i++) {

        const txData = transactions[i];
        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;

        if (account === snapshotAccount.accountAddress) {

            const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
            const counterPartyResp = getCounterPartyName(counterParty);
            const counterPartyName = counterPartyResp.name;
            const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;

            // If txData.block between initial block number and final block number THEN we do the insert
            // Else IF txData.block < initial block number then add to inital balance += amount
            // If txData.block = initialBlockNumber THEN remember SnapshotStart
            // If txData.block = finalBlockNumber THEN remember SnapshotEnd


            await knex('SnapshotAccountTransaction').insert({
                block: txData.block,
                timestamp: txData.timestamp,
                txHash: txData.tx_hash,
                token: txData.token,
                counterParty: counterParty,
                counterPartyName: counterPartyName,
                amount: amount,
                snapshotAccountId: snapshotAccount.id,
            });

            addedTransactionsCount++;

            if (counterPartyResp.paymentProcessor) {
                paymentProcessorTransactions.push(txData);
            }
            //Check MakerProtocol addressses
            if (makerProtocolAddresses.indexOf(counterParty.toLowerCase()) > -1) {
                protocolTransactions.push(txData);
            }
        }
    }
    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions: protocolTransactions,
        paymentProcessorTransactions: paymentProcessorTransactions,
        initialBalance: initialBalance,
        snapshotStart: snapshotStart,
        snapshotEnd: snapshotEnd
    };
};



export default processTransactions;