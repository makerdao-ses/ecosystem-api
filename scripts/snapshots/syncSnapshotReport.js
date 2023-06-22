import getOwnerAndAccountsFromBudgetPath from './functions/getOwnerAndAccountsFromBudgetPath.js';
import getApiToken from './functions/getApiToken.js'
import getKnexInstance from './functions/getKnexInstance.js';
import createSnapshotReport from './functions/createSnapshotReport.js';
import fetchTransactionData from './functions/fetchTransactionData.js';
import createSnapshotAccount from './functions/createSnapshotAccount.js';
import processTransactions from './functions/processTransactions.js';
import processProtocolTransactions from './functions/processProtocolTransactions.js';
import insertAccountBalance from './functions/insertAccountBalance.js';
import finalizeReportAccounts from './functions/finalizeReportAccounts.js';

const makerProtocolAddresses = [
    '0x0048fc4357db3c0f45adea433a07a20769ddb0cf',
    '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb',
    '0x0000000000000000000000000000000000000000',
    //SES Auditor Wallet:
    '0x87acdd9208f73bfc9207e1f6f0fde906bca95cc6'
].map(a => a.toLowerCase());

let budgetPath = process.argv[2]||null;
let month = process.argv[3]||null;

console.log(`Syncing the ${month||"draft"} snapshot report for ${budgetPath||'all budgets'}`);

let knex = getKnexInstance();
let apiToken = await getApiToken();
let owner = await getOwnerAndAccountsFromBudgetPath(budgetPath, knex);
let snapshotReport = await createSnapshotReport(owner.type, owner.id, month, knex);
let protocolTransactions = [];

for(let i = 0; i < owner.accounts.length; i++){

    let transactions = await fetchTransactionData(owner.accounts[i].address, owner.type, owner.id, month, apiToken, knex);
    if (transactions.length > 0){
        let snapshotAccount = await createSnapshotAccount(snapshotReport.id, owner.accounts[i], false, knex);
        owner.accounts[i].accountId = snapshotAccount.id;
        let output = await processTransactions(snapshotAccount, transactions, makerProtocolAddresses, knex);
        protocolTransactions = protocolTransactions.concat(output.protocolTransactions);
        owner.accounts[i].addedTransactions = output.addedTransactions;
    }
}

let protocolAccountId = await processProtocolTransactions(snapshotReport.id, protocolTransactions, knex);

let allAccounts = await finalizeReportAccounts(snapshotReport, owner.accounts, protocolAccountId, makerProtocolAddresses, knex);



await insertAccountBalance(allAccounts, knex);



knex.destroy();