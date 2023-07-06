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

let budgetPath = process.argv[2]||null;
let month = process.argv[3]||null;

console.log(`Syncing the ${month||"draft"} snapshot report for ${budgetPath||'all budgets'}`);

let knex = getKnexInstance();
let apiToken = await getApiToken();
let owner = await getOwnerAndAccountsFromBudgetPath(budgetPath, knex);
const monthInfo = getMonthInfo(owner, month);
let snapshotReport = await createSnapshotReport(owner.type, owner.id, monthInfo, knex);
let protocolTransactions = [];
let paymentProcessorTransactions = [];



for(let i = 0; i < owner.accounts.length; i++){

    let transactions = await fetchTransactionData(owner.accounts[i].address, owner.type, owner.id, month, apiToken, knex);
    if (transactions.length > 0){
        let snapshotAccount = await createSnapshotAccount(snapshotReport.id, owner.accounts[i], false, knex);
        owner.accounts[i].accountId = snapshotAccount.id;
        let output = await processTransactions(snapshotAccount, transactions, makerProtocolAddresses, monthInfo, knex);
        console.log(output);
        owner.accounts[i].initialBalance = output.initialBalance;
        //if(output.snapshotStart || output.snapshotEnd){updateSnapshotReport(start, end)}
        protocolTransactions = protocolTransactions.concat(output.protocolTransactions);
        paymentProcessorTransactions = paymentProcessorTransactions.concat(output.paymentProcessorTransactions);
        owner.accounts[i].addedTransactions = output.addedTransactions;
    }
}


let protocolAccountId = await processProtocolTransactions(snapshotReport.id, protocolTransactions, knex);
const singularAccounts = owner.accounts.concat(await createOffChainAccounts(snapshotReport.id, owner.type, owner.id, month, knex));

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