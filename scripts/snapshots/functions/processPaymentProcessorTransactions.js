import getCounterPartyName from "./getCounterPartyName.js";

const processPaymentProcessorTransactions = async (snapshotReportId, ppTransactions, knex) => {

    console.log(`Creating ${ppTransactions.length} transactions for the payment processor account`);

    let processorAccount;
    let processorAccountId;
    let processorAccountIds = [];

    for (let i = 0; i < ppTransactions.length; i++) {

        const txData = ppTransactions[i];

        const amount = txData.flow === 'inflow' ? txData.amount : -txData.amount;
        const account = txData.flow === 'inflow' ? txData.sender : txData.receiver;
        const counterParty = txData.flow === 'outflow' ? txData.sender : txData.receiver;
        const counterPartyResp = getCounterPartyName(counterParty);
        const counterPartyName = counterPartyResp.name;

        if (!processorAccountId || processorAccount != account) {
            console.log(processorAccount)
            console.log(processorAccountId)

            const result = await knex('SnapshotAccount')
                .select('id')
                .where({
                    snapshotId: snapshotReportId
                })
                .andWhere({
                    accountAddress: account
                })
                .first();

            processorAccountId = result.id;
            processorAccount = account;
            processorAccountIds.push(processorAccountId);
        
        }

        if (processorAccountId) {

            await knex('SnapshotAccountTransaction').insert({
                block: txData.block,
                timestamp: txData.timestamp,
                txHash: txData.tx_hash,
                token: txData.token,
                counterPartyName: counterPartyName,
                counterParty: counterParty,
                amount: -amount,
                snapshotAccountId: processorAccountId,
            });
        }
    }
    return processorAccountId;
};


export default processPaymentProcessorTransactions;