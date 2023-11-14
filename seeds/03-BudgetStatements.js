/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("AuditReport").del();
  await knex("BudgetStatementTransferRequest").del();
  await knex("BudgetStatementPayment").del();
  await knex("BudgetStatementLineItem").del();
  await knex("BudgetStatementWallet").del();
  await knex("BudgetStatementMkrVest").del();
  await knex("BudgetStatementFtes").del();

  await knex("AuditReport").insert([
    {
      budgetStatementId: 1,
      auditStatus: "Approved",
      timestamp: "2022-01-01 19:10:25-07",
      reportUrl: "www.github.com/auditReport2",
    },
    {
      budgetStatementId: 2,
      auditStatus: "NeedActionsBeforeApproval",
      timestamp: "2022-09-19 16:40:25-07",
      reportUrl: "www.github.com/auditReport3",
    },
  ]);

  await knex("BudgetStatementFtes").insert([
    { id: 1, budgetStatementId: 1, month: "03-01-2022", ftes: 12 },
    { id: 2, budgetStatementId: 2, month: "08-01-2022", ftes: 4.4 },
  ]);

  await knex("BudgetStatementMkrVest").insert([
    {
      budgetStatementId: 1,
      vestingDate: "01-12-2022",
      mkrAmount: 300,
      mkrAmountOld: 250,
      comments: "Addition of 2 FTEs",
    },
    {
      budgetStatementId: 1,
      vestingDate: "01-01-2023",
      mkrAmount: 200,
      mkrAmountOld: 250,
      comments: "Removal of 1 FTE",
    },
  ]);

  await knex("BudgetStatementWallet").insert([
    {
      budgetStatementId: 1,
      address: "0x4862733B5FdDFd35f35ea8CCf08F5045e57388B3",
      name: "Permanent Team Wallet",
      currentBalance: 3250000,
      topupTransfer: 100000,
    },
    {
      budgetStatementId: 2,
      address: "0x4862733B5FdDFd35f35ea8CCf08F5045e57388B3",
      name: "The War Chest",
      currentBalance: 37,
      topupTransfer: 3,
    },
  ]);

  await knex("BudgetStatementLineItem").insert([
    {
      budgetStatementWalletId: 1,
      month: "03-01-2022",
      budgetCategory: "Salaries and Wages",
      actual: 90000,
      forecast: 95000,
      budgetCap: 100000,
      payment: 90000,
      headcountExpense: true,
    },
    {
      budgetStatementWalletId: 1,
      month: "03-01-2022",
      budgetCategory: "Admin Expenses",
      actual: 8000,
      forecast: 9000,
      budgetCap: 10000,
      payment: 9000,
      headcountExpense: false,
    },
    {
      budgetStatementWalletId: 1,
      month: "03-01-2022",
      budgetCategory: "Flights and Taxis",
      actual: 2000,
      forecast: 2000,
      budgetCap: 2500,
      payment: 1800,
      headcountExpense: true,
    },
    {
      budgetStatementWalletId: 1,
      month: "03-01-2022",
      budgetCategory: "Legal Costs",
      actual: 3000,
      forecast: 3000,
      budgetCap: 3100,
      payment: 3000,
      headcountExpense: false,
    },
    {
      budgetStatementWalletId: 1,
      month: "03-01-2022",
      budgetCategory: "Software Subscriptions",
      actual: 2100,
      forecast: 2000,
      budgetCap: 2000,
      payment: 2100,
      headcountExpense: false,
    },
    {
      budgetStatementWalletId: 2,
      month: "08-01-2022",
      budgetCategory: "Salaries and Wages",
      actual: 110000,
      forecast: 110000,
      budgetCap: 110000,
      payment: 110000,
      headcountExpense: true,
    },
    {
      budgetStatementWalletId: 2,
      month: "08-01-2022",
      budgetCategory: "Admin Expenses",
      actual: 90000,
      forecast: 95000,
      budgetCap: 30000,
      payment: 90000,
      headcountExpense: false,
    },
    {
      budgetStatementWalletId: 2,
      month: "08-01-2022",
      budgetCategory: "Flights and Taxis",
      actual: 50,
      forecast: 50,
      budgetCap: 100,
      payment: 50,
      headcountExpense: true,
    },
    {
      budgetStatementWalletId: 2,
      month: "08-01-2022",
      budgetCategory: "Legal Costs",
      actual: 4000,
      forecast: 4000,
      budgetCap: 5000,
      payment: 4000,
      headcountExpense: false,
    },
    {
      budgetStatementWalletId: 2,
      month: "08-01-2022",
      budgetCategory: "Software Subscriptions",
      actual: 18000,
      forecast: 20000,
      budgetCap: 21000,
      payment: 18000,
      headcountExpense: false,
    },
  ]);

  await knex("BudgetStatementLineItem_CanonicalBudgetCategory").insert([
    {
      budgetStatementLineItemId: 1,
      canonicalBudgetCategoryId: 2,
    },
    {
      budgetStatementLineItemId: 2,
      canonicalBudgetCategoryId: 5,
    },
    {
      budgetStatementLineItemId: 3,
      canonicalBudgetCategoryId: 3,
    },
    {
      budgetStatementLineItemId: 4,
      canonicalBudgetCategoryId: 10,
    },
    {
      budgetStatementLineItemId: 5,
      canonicalBudgetCategoryId: 12,
    },
    {
      budgetStatementLineItemId: 6,
      canonicalBudgetCategoryId: 1,
    },
    {
      budgetStatementLineItemId: 7,
      canonicalBudgetCategoryId: 4,
    },
    {
      budgetStatementLineItemId: 8,
      canonicalBudgetCategoryId: 3,
    },
    {
      budgetStatementLineItemId: 9,
      canonicalBudgetCategoryId: 10,
    },
    {
      budgetStatementLineItemId: 10,
      canonicalBudgetCategoryId: 12,
    },
  ]);

  await knex("BudgetStatementPayment").insert([
    {
      budgetStatementWalletId: 1,
      transactionDate: "SEP-15-2022",
      transactionId:
        "0xec9db5bfbcd30ad2e3070b626ed4f78abce88687c5d1eb23464242be5edcb537",
    },
    {
      budgetStatementWalletId: 2,
      transactionDate: "SEP-15-2022",
      transactionId:
        "0xec9db5bfbcd30ad2e3070b626ed4f78abce88687c5d1eb23464242be5edcb537",
    },
  ]);

  await knex("BudgetStatementTransferRequest").insert([
    {
      budgetStatementWalletId: 1,
      budgetStatementPaymentId: 1,
      requestAmount: 400000,
    },
    {
      budgetStatementWalletId: 2,
      budgetStatementPaymentId: 2,
      requestAmount: 400000,
    },
  ]);
}
