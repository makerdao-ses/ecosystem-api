import getAccountInfoFromConfig from "./getAccountInfoFromConfig.js";

const processTransactions = async (snapshotAccount, transactions, monthInfo, knex) => {
    const protocolTransactions = [];
    const paymentProcessorTransactions = [];
    const initialBalanceByToken = {};
    const timespan = {
        start: null,
        end: null
    };
    let addedTransactionsCount = 0;
    
    console.log(`\nProcessing ${transactions.length} transactions for account ${snapshotAccount.id}: ${snapshotAccount.accountLabel} (${snapshotAccount.accountAddress})`);
    console.log(` ...block range [${monthInfo.blockNumberRange.initial}-${monthInfo.blockNumberRange.final}] for month:${monthInfo.month}`)
    
    for (let i = 0; i < transactions.length; i++) {
        const txData = transactions[i];
        const account = txData.flow === 'outflow' ? txData.sender : txData.receiver;
        const amount = txData.flow === 'outflow' ? -txData.amount : txData.amount;

        // Skip irrelevant transactions that belong to the counterparty wallet
        if (account !== snapshotAccount.accountAddress) {
            continue;
        }

        // Ensure that the initial balance is properly initialized
        if (!initialBalanceByToken[txData.token]){
            initialBalanceByToken[txData.token] = 0;
        }
        
        // A block range is set and we haven't reached the first block yet 
        //   => don't include the transaction yet, but increase the initial balance
        if (monthInfo.blockNumberRange.initial && txData.block < monthInfo.blockNumberRange.initial) {
            initialBalanceByToken[txData.token] += amount;

        // No block range is set or we haven't hit the final block of the set range yet
        //   => include the transaction
        } else if (
            (monthInfo.blockNumberRange.final && txData.block < monthInfo.blockNumberRange.final)
            || !monthInfo.blockNumberRange.final
        ) {
            const counterPartyAddress = txData.flow === 'inflow' ? txData.sender : txData.receiver;
            const counterPartyInfo = getAccountInfoFromConfig(counterPartyAddress);

            // Add the transaction to the selected account in the database
            await knex('SnapshotAccountTransaction').insert({
                snapshotAccountId: snapshotAccount.id,
                block: txData.block,
                timestamp: txData.timestamp,
                txHash: txData.tx_hash,
                token: txData.token,
                counterParty: counterPartyAddress,
                counterPartyName: counterPartyInfo.name,
                amount: amount,
            });

            addedTransactionsCount++;

            // Keep track of included payment processor transactions
            if (counterPartyInfo.offChain) {
                paymentProcessorTransactions.push(txData);
            }
            
            // Keep track of included Maker Protocol transactions
            if (counterPartyInfo.isProtocolAddress) {
                protocolTransactions.push(txData);
            }

            // Keep track of the earliest and oldest timestamp
            if (!timespan.start || txData.timestamp < timespan.start) {
                timespan.start = txData.timestamp;
            }

            if (!timespan.end || txData.timestamp > timespan.end) {
                timespan.end = txData.timestamp;
            }
        }
    }

    console.log(` ...added ${addedTransactionsCount} transaction(s)`);
    console.log(` ...detected ${protocolTransactions.length} protocol transaction(s)`);
    console.log(` ...detected ${paymentProcessorTransactions.length} payment processor transaction(s)`);
    console.log(` ...calculated initial balance(s)`, initialBalanceByToken);
    console.log(` ...calculated timespan: ${timespan.start} => ${timespan.end}`);

    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions,
        paymentProcessorTransactions,
        initialBalance: initialBalanceByToken,
        timespan
    };
};

export default processTransactions;