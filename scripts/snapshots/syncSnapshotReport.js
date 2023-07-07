import getOwnerAndAccountsFromBudgetPath from './functions/getOwnerAndAccountsFromBudgetPath.js';
import getMonthInfo from './functions/getMonthInfo.js';
import getApiToken from './functions/getApiToken.js';
import getKnexInstance from './functions/getKnexInstance.js';
import createSnapshotReport from './functions/createSnapshotReport.js';
import fetchTransactionData from './functions/fetchTransactionData.js';
import createSnapshotAccount from './functions/createSnapshotAccount.js';
import processTransactions from './functions/processTransactions.js';
import processProtocolTransactions from './functions/processProtocolTransactions.js';
import insertAccountBalance from './functions/insertAccountBalance.js';
import finalizeReportAccounts from './functions/finalizeReportAccounts.js';
import createOffChainAccounts from './functions/createOffChainAccounts.js';
import processPaymentProcessorTransactions from './functions/processPaymentProcessorTransactions.js';
import insertMissingPaymentProcessorTransactions from './functions/insertMissingPaymentProcessorTransactions.js';
import setTxLabel from './functions/setTxLabel.js';

const makerProtocolAddresses = [
    '0x0048fc4357db3c0f45adea433a07a20769ddb0cf',
    '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb',
    '0x0000000000000000000000000000000000000000',
].map(a => a.toLowerCase());

const budgetPath = process.argv[2] || null;
const month = process.argv[3] || null;

console.log(`Syncing the ${month||"draft"} snapshot report for ${budgetPath||'all budgets'}`);

const knex = getKnexInstance();
const apiToken = await getApiToken();
const { owner, accounts } = await getOwnerAndAccountsFromBudgetPath(budgetPath, knex);
const monthInfo = getMonthInfo(owner, month);

const snapshotReport = await createSnapshotReport(owner.type, owner.id, monthInfo.month, knex);

let protocolTransactions = [];
let paymentProcessorTransactions = [];
let timespan = {
    start: null,
    end: null
};

for (let i=0; i<accounts.length; i++) {
    const transactions = await fetchTransactionData(accounts[i].address, owner.type, owner.id, apiToken, knex);

    if (transactions.length > 0) {
        // Create snapshot account
        const snapshotAccount = await createSnapshotAccount(snapshotReport.id, accounts[i], false, knex);
        accounts[i].accountId = snapshotAccount.id;

        // Add the transactions based on the selected month(s) and collect relevant info
        let txsProcessingInfo = await processTransactions(snapshotAccount, transactions, monthInfo, knex);
        accounts[i].initialBalance = txsProcessingInfo.initialBalance;
        accounts[i].addedTransactions = txsProcessingInfo.addedTransactions;
        
        // Keep track of protocol and payment processor transactions
        protocolTransactions = protocolTransactions.concat(txsProcessingInfo.protocolTransactions);
        paymentProcessorTransactions = paymentProcessorTransactions.concat(txsProcessingInfo.paymentProcessorTransactions);

        // Keep track of the earliest and last inlcuded transaction timestamp
        if (!timespan.start || txsProcessingInfo.timespan.start < timespan.start) {
            timespan.start = txsProcessingInfo.timespan.start;
        }

        if (!timespan.end || txsProcessingInfo.timespan.end > timespan.end) {
            timespan.end = txsProcessingInfo.timespan.end;
        }
    }
}


//Rewrite protocol transactions - overwrites the address in current logic
let protocolAccountId = await processProtocolTransactions(snapshotReport.id, protocolTransactions, knex);
const singularAccounts = accounts.concat(await createOffChainAccounts(snapshotReport.id, owner.type, owner.id, month, knex));

let paymentProcessorId;
if(paymentProcessorTransactions.length>0 && singularAccounts){
    paymentProcessorId = await processPaymentProcessorTransactions(snapshotReport.id, paymentProcessorTransactions, knex);
}
let allAccounts = await finalizeReportAccounts(snapshotReport, singularAccounts, protocolAccountId, makerProtocolAddresses, knex);

await setTxLabel(allAccounts, knex);

await insertAccountBalance(allAccounts, knex);

if(paymentProcessorId){
    await insertMissingPaymentProcessorTransactions(paymentProcessorId, monthInfo, knex);
}

knex.destroy();