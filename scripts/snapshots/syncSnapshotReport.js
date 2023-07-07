import getOwnerAndAccountsFromBudgetPath from './functions/getOwnerAndAccountsFromBudgetPath.js';
import getMonthInfo from './functions/getMonthInfo.js';
import getApiToken from './functions/getApiToken.js';
import getKnexInstance from './functions/getKnexInstance.js';
import createSnapshotReport from './functions/createSnapshotReport.js';
import fetchTransactionData from './functions/fetchTransactionData.js';
import insertAccountBalance from './functions/insertAccountBalance.js';
import finalizeReportAccounts from './functions/finalizeReportAccounts.js';
import insertMissingPaymentProcessorTransactions from './functions/insertMissingPaymentProcessorTransactions.js';
import setTxLabel from './functions/setTxLabel.js';
import getAccountInfoFromConfig from './functions/getAccountInfoFromConfig.js';
import createAccountFromTransactions from './functions/createAccountFromTransactions.js';

const PROTOCOL_PRIMARY_ADDRESS = '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb';
const PAYMENT_PROCESSOR_ADDRESS = '0x3c267dfc8ba8f7359af0d8afc45b43731173236d';

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

const createdAccounts = [];
let protocolTransactions = [];
let paymentProcessorTransactions = [];

for (let i=0; i<accounts.length; i++) {
    const transactions = await fetchTransactionData(accounts[i].address, owner.type, owner.id, apiToken, knex);

    if (transactions.length > 0) {
        const newAccount = await createAccountFromTransactions (
            snapshotReport.id, 
            getAccountInfoFromConfig(accounts[i].address),
            transactions, 
            monthInfo, 
            false, 
            knex
        );

        // Move collected protocol transactions for later processing
        protocolTransactions = protocolTransactions.concat(newAccount.protocolTransactions);
        delete newAccount.protocolTransactions;

        // Move collected payment processor transactions for later processing
        paymentProcessorTransactions = paymentProcessorTransactions.concat(newAccount.paymentProcessorTransactions);
        delete newAccount.paymentProcessorTransactions;

        // Keep track of the created accounts
        createdAccounts.push(newAccount);
    }
}

// Create the Maker Protocol account
const protocolAccount = await createAccountFromTransactions(
    snapshotReport.id,
    getAccountInfoFromConfig(PROTOCOL_PRIMARY_ADDRESS),
    protocolTransactions,
    monthInfo,
    true, 
    knex
);

createdAccounts.push(protocolAccount);

let paymentProcessorAccount = null;
if (paymentProcessorTransactions.length > 0) {
    // Create the Payment Processor account
    paymentProcessorAccount = await createAccountFromTransactions(
        snapshotReport.id,
        getAccountInfoFromConfig(PAYMENT_PROCESSOR_ADDRESS),
        paymentProcessorTransactions,
        monthInfo,
        true,
        knex
    );

    createdAccounts.push(paymentProcessorAccount); 
}

let allAccounts = await finalizeReportAccounts(snapshotReport, createdAccounts, protocolAccount.accountId, makerProtocolAddresses, knex);

await setTxLabel(allAccounts, knex);

await insertAccountBalance(allAccounts, knex);

if(paymentProcessorAccount){
    await insertMissingPaymentProcessorTransactions(paymentProcessorAccount.accountId, monthInfo, knex);
}

knex.destroy();

