import getCounterPartyData from "./getCounterPartyData.js";

const processTransactions = async (snapshotAccount, transactions, makerProtocolAddresses, monthInfo, knex) => {

    console.log(`Fetched ${transactions.length} transactions for ${snapshotAccount.accountAddress}`);
    let protocolTransactions = [];
    let paymentProcessorTransactions = [];
    let addedTransactionsCount = 0;
    let initialBalance = {};

    console.log(`Processing transactions between block ${monthInfo.blockNumberRange.initial} and ${monthInfo.blockNumberRange.final}`);

    for (let i = 0; i < transactions.length; i++) {

        const txData = transactions[i];
        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
            if (account === snapshotAccount.accountAddress) {
            if(!initialBalance[txData.token]){
                initialBalance[txData.token] = 0;
            }

            const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;
            if(monthInfo.blockNumberRange.initial && txData.block < monthInfo.blockNumberRange.initial){
                console.log(`Adding ${amount} to initial balance`);
                initialBalance[txData.token] += amount;
            }
            else if ((monthInfo.blockNumberRange.final && txData.block < monthInfo.blockNumberRange.final) || !monthInfo.blockNumberRange.final){

                    const counterParty = txData.flow === 'inflow' ? txData.sender : txData.receiver;
                    const counterPartyResponse = getCounterPartyData(counterParty);
                    const counterPartyName = counterPartyResponse.name;

                    // If txData.block between initial block number and final block number THEN we do the insert
                    // Else IF txData.block < initial block number then add to inital balance += amount


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

                    if (counterPartyResponse.paymentProcessor) {
                        paymentProcessorTransactions.push(txData);
                    }
                    //Check MakerProtocol addressses
                    if (makerProtocolAddresses.indexOf(counterParty.toLowerCase()) > -1) {
                        protocolTransactions.push(txData);
                    }
                }
        }
    }
    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions: protocolTransactions,
        paymentProcessorTransactions: paymentProcessorTransactions,
        initialBalance: initialBalance,
    };
};



export default processTransactions;