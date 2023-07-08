import getAccountInfoFromConfig from "./getAccountInfoFromConfig.js";

const aliases = {
    // Maker Protocol primary account
    '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb': [
        // Addresses treated as Maker Protocol aliases 
        '0x0048fc4357db3c0f45adea433a07a20769ddb0cf',
        '0x0000000000000000000000000000000000000000',
    ]
};

const applyFlow = (txData, flow) => {
    let result = null;

    if (flow === 'outflow') {
        result = {
            accountAddress: txData.sender,
            counterPartyAddress: txData.receiver,
            amount: -txData.amount,
            counterPartyInfo: getAccountInfoFromConfig(txData.receiver)
        };

    } else {
        result = {
            accountAddress: txData.receiver,
            counterPartyAddress: txData.sender,
            amount: txData.amount,
            counterPartyInfo: getAccountInfoFromConfig(txData.sender)
        };
    }

    return result;
};

const processTransactions = async (snapshotAccount, transactions, monthInfo, invertFlows, knex) => {
    const protocolTransactions = [];
    const paymentProcessorTransactions = [];
    const initialBalanceByToken = {};
    const finalBalanceByToken = {};
    const timespan = { start: null, end: null };
    const invertedFlow = { inflow: 'outflow', outflow: 'inflow' };
    let addedTransactionsCount = 0;
    
    console.log(`\nProcessing ${transactions.length} transactions for account ${snapshotAccount.id}: ${snapshotAccount.accountLabel} (${snapshotAccount.accountAddress})`);
    console.log(` ...inverted flows: ${invertFlows ? 'YES' : 'no'}`);
    console.log(` ...block range [${monthInfo.blockNumberRange.initial}-${monthInfo.blockNumberRange.final}] for month:${monthInfo.month}`)
    
    for (let i = 0; i < transactions.length; i++) {
        const txData = transactions[i];
        const relativeTxData = applyFlow(txData, (invertFlows ? invertedFlow[txData.flow] : txData.flow));
        
        // Skip irrelevant transactions that belong to the counterparty wallet
        if (snapshotAccount.accountAddress !== relativeTxData.accountAddress) {
            if (!aliases[snapshotAccount.accountAddress] || 
                aliases[snapshotAccount.accountAddress].indexOf(relativeTxData.accountAddress) < 0
            ) {
                continue;
            } else {
                console.log(` ...keeping transaction of ${relativeTxData.accountAddress} because it's a known alias of ${snapshotAccount.accountLabel}`);
            }
        }

        // Ensure that the balances is properly initialized
        if (!finalBalanceByToken[txData.token]){
            finalBalanceByToken[txData.token] = 0;
            initialBalanceByToken[txData.token] = 0;
        }
        
        // A block range is set and we haven't reached the first block yet 
        //   => don't include the transaction yet, but increase the balances
        if (monthInfo.blockNumberRange.initial && txData.block < monthInfo.blockNumberRange.initial) {
            finalBalanceByToken[txData.token] += relativeTxData.amount;
            initialBalanceByToken[txData.token] += relativeTxData.amount;

        // No block range is set or we haven't hit the final block of the set range yet
        //   => include the transaction
        } else if (
            (monthInfo.blockNumberRange.final && txData.block < monthInfo.blockNumberRange.final)
            || !monthInfo.blockNumberRange.final
        ) {
            // Only add towards the final balance
            finalBalanceByToken[txData.token] += relativeTxData.amount;

            // Add the transaction to the selected account in the database
            await knex('SnapshotAccountTransaction').insert({
                snapshotAccountId: snapshotAccount.id,
                block: txData.block,
                timestamp: txData.timestamp,
                txHash: txData.tx_hash,
                token: txData.token,
                counterParty: relativeTxData.counterPartyAddress,
                counterPartyName: relativeTxData.counterPartyInfo.name,
                amount: relativeTxData.amount,
            });

            addedTransactionsCount++;

            // Keep track of the earliest and oldest timestamp
            if (!timespan.start || txData.timestamp < timespan.start) {
                timespan.start = txData.timestamp;
            }

            if (!timespan.end || txData.timestamp > timespan.end) {
                timespan.end = txData.timestamp;
            }
        }

        // Keep track of included payment processor transactions
        if (relativeTxData.counterPartyInfo.offChain) {
            paymentProcessorTransactions.push(txData);
        }
        
        // Keep track of included Maker Protocol transactions
        if (relativeTxData.counterPartyInfo.isProtocolAddress) {
            protocolTransactions.push(txData);
        }

    }

    console.log(` ...added ${addedTransactionsCount} transaction(s)`);

    if (addedTransactionsCount == 0) {
        console.log(transactions);
    };

    console.log(` ...detected ${protocolTransactions.length} transaction(s) with Protocol as counterparty`);
    console.log(` ...detected ${paymentProcessorTransactions.length} with Payment Processor as counterparty`);
    console.log(` ...calculated initial balance(s)`, initialBalanceByToken);
    console.log(` ...calculated final balance(s)`, finalBalanceByToken);
    console.log(` ...calculated timespan: ${timespan.start} => ${timespan.end}`);

    return {
        addedTransactions: addedTransactionsCount,
        protocolTransactions,
        paymentProcessorTransactions,
        initialBalanceByToken,
        finalBalanceByToken,
        timespan
    };
};

export default processTransactions;