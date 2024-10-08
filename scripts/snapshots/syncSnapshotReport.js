import getOwnerAndAccountsFromBudgetPath from "./functions/getOwnerAndAccountsFromBudgetPath.js";
import getMonthInfo from "./functions/getMonthInfo.js";
import getApiToken from "./functions/getApiToken.js";
import getKnexInstance from "./functions/getKnexInstance.js";
import createSnapshotReport from "./functions/createSnapshotReport.js";
import fetchTransactionData from "./functions/fetchTransactionData.js";
import createAccountsHierarchy from "./functions/createAccountsHierarchy.js";
import setTransactionLabels from "./functions/setTransactionLabels.js";
import getAccountInfoFromConfig from "./functions/getAccountInfoFromConfig.js";
import { createAccountFromTransactions } from "./functions/createAccountFromTransactions.js";
import insertAccountBalances from "./functions/insertAccountBalance.js";

const PROTOCOL_PRIMARY_ADDRESS = "0xbe8e3e3618f7474f8cb1d074a26affef007e98fb";
const PAYMENT_PROCESSOR_ADDRESSES = [
  "0x3c267dfc8ba8f7359af0d8afc45b43731173236d",
  "0x62DAd9169Cd0D553fe876B6aa6566Ebb6CcdB8B2"
].map((a) => a.toLowerCase());;
const makerProtocolAddresses = [
  "0x0048fc4357db3c0f45adea433a07a20769ddb0cf",
  "0xbe8e3e3618f7474f8cb1d074a26affef007e98fb",
  "0x0000000000000000000000000000000000000000",
  "0x3C5142F28567E6a0F172fd0BaaF1f2847f49D02F" //launch project
].map((a) => a.toLowerCase());

const budgetPath = process.argv[2] || null;
const month = process.argv[3] || null;
const endBlockNo = process.argv[4] || null;

console.log(
  `Syncing the ${month || "draft"} snapshot report for ${
    budgetPath || "all budgets"
  }`,
);

const knex = getKnexInstance();
const apiToken = await getApiToken();
const { owner, accounts } = await getOwnerAndAccountsFromBudgetPath(
  budgetPath,
  knex,
);
const monthInfo = getMonthInfo(owner, month, endBlockNo);

// Add this check
if (!monthInfo) {
  console.log("No month info available. Exiting script.");
  process.exit(0);
}

const snapshotReport = await createSnapshotReport(
  owner.type,
  owner.id,
  monthInfo.month,
  knex,
);

const createdAccounts = [];
let protocolTransactions = [];
let paymentProcessorTransactions = [];

for (let i = 0; i < accounts.length; i++) {
  const transactions = await fetchTransactionData(
    accounts[i].address,
    owner.type,
    owner.id,
    apiToken
  );

  if (transactions.length > 0) {
    const newAccount = await createAccountFromTransactions(
      snapshotReport.id,
      getAccountInfoFromConfig(accounts[i].address),
      transactions,
      monthInfo,
      false,
      knex,
    );

    // Move collected protocol transactions for later processing
    protocolTransactions = protocolTransactions.concat(
      newAccount.protocolTransactions,
    );
    delete newAccount.protocolTransactions;

    // Move collected payment processor transactions for later processing
    paymentProcessorTransactions = paymentProcessorTransactions.concat(
      newAccount.paymentProcessorTransactions,
    );
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
  knex,
);

createdAccounts.push(protocolAccount);

// Update the createAccountFromTransactions call for payment processor
let paymentProcessorAccounts = [];
for (const address of PAYMENT_PROCESSOR_ADDRESSES) {
  const filteredTransactions = paymentProcessorTransactions.filter(tx => 
    (tx.sender && tx.sender.toLowerCase() === address.toLowerCase()) || 
    (tx.receiver && tx.receiver.toLowerCase() === address.toLowerCase())
  );
  
  if (filteredTransactions.length > 0) {
    const paymentProcessorAccount = await createAccountFromTransactions(
      snapshotReport.id,
      getAccountInfoFromConfig(address),
      filteredTransactions,
      monthInfo,
      true,
      knex,
    );

    paymentProcessorAccounts.push(paymentProcessorAccount);
    createdAccounts.push(paymentProcessorAccount);
  }
}

const { allAccounts, upstreamDownstreamMap } = await createAccountsHierarchy(
  snapshotReport,
  createdAccounts,
  protocolAccount.accountId,
  makerProtocolAddresses,
  knex,
);

console.log("\nAll accounts:", ...allAccounts);
console.log("\nUp/downstream map:", upstreamDownstreamMap);

// Update snapshot report start and end dates
const rootAccount = allAccounts.filter((a) => a.type === "Root")[0];
await knex("Snapshot")
  .update({
    start: rootAccount.timespan.start,
    end: rootAccount.timespan.end,
  })
  .where({
    id: snapshotReport.id,
  });

// Update transaction labeling
await setTransactionLabels(allAccounts, upstreamDownstreamMap, knex);

// Save account balances for offChain included/excluded
await insertAccountBalances(allAccounts, true, knex);
await insertAccountBalances(allAccounts, false, knex);

knex.destroy();
