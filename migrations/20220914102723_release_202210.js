//Creation of the BudgetStatement subtables

export function up(knex) {
  return knex.schema

    .createTable("AuditReport", function (table) {
      console.log("Creating AuditReport table...");
      table.increments("id").primary();
      table.integer("budgetStatementId").notNullable();
      table
        .foreign("budgetStatementId")
        .references("BudgetStatement.id")
        .onDelete("CASCADE");
      table.string("reportUrl").notNullable();
      table
        .enu(
          "auditStatus",
          [
            "Approved",
            "ApprovedWithComments",
            "NeedActionsBeforeApproval",
            "Escalated",
          ],
          {
            useNative: true,
            enumName: "AuditStatus",
          },
        )
        .notNullable();
      table.timestamp("timestamp").notNullable();
    })

    .createTable("BudgetStatementFtes", function (table) {
      console.log("Creating BudgetStatementFtes table...");
      table.increments("id").primary();
      table.integer("budgetStatementId").notNullable();
      table
        .foreign("budgetStatementId")
        .references("BudgetStatement.id")
        .onDelete("CASCADE");
      table.date("month").notNullable();
      table.decimal("ftes", 4, 2).notNullable();
    })

    .createTable("BudgetStatementMkrVest", function (table) {
      console.log("Creating BudgetStatementMkrVest table...");
      table.increments("id").primary();
      table.integer("budgetStatementId").notNullable();
      table
        .foreign("budgetStatementId")
        .references("BudgetStatement.id")
        .onDelete("CASCADE");
      table.date("vestingDate").notNullable();
      table.decimal("mkrAmount", 10, 2);
      table.decimal("mkrAmountOld", 10, 2);
      table.text("comments");
    })

    .createTable("BudgetStatementWallet", function (table) {
      console.log("Creating BudgetStatementWallet table...");
      table.increments("id").primary();
      table.integer("budgetStatementId").notNullable();
      table
        .foreign("budgetStatementId")
        .references("BudgetStatement.id")
        .onDelete("CASCADE");
      table.string("name").notNullable();
      table.string("address").notNullable();
      table.decimal("currentBalance", 14, 2);
      table.decimal("topupTransfer", 14, 2);
      table.text("comments");
    })

    .createTable("BudgetStatementLineItem", function (table) {
      console.log("Creating BudgetStatementLineItem table...");
      table.increments("id").primary();
      table.integer("budgetStatementWalletId").notNullable();
      table
        .foreign("budgetStatementWalletId")
        .references("BudgetStatementWallet.id")
        .onDelete("CASCADE");
      table.date("month").notNullable();
      table.integer("position");
      table.string("group");
      table.string("budgetCategory").notNullable();
      table.decimal("forecast", 14, 2);
      table.decimal("actual", 14, 2);
      table.text("comments");
      table.boolean("headcountExpense", 14, 2).notNullable();
      table.decimal("budgetCap", 14, 2);
      table.decimal("payment", 14, 2);
    })

    .createTable(
      "BudgetStatementLineItem_CanonicalBudgetCategory",
      function (table) {
        console.log("Creating BudgetStatementLineItem table...");
        table.increments("id").primary();
        table.integer("budgetStatementLineItemId").notNullable();
        table
          .foreign("budgetStatementLineItemId")
          .references("BudgetStatementLineItem.id")
          .onDelete("CASCADE");
        table.integer("canonicalBudgetCategoryId").notNullable();
        table
          .foreign("canonicalBudgetCategoryId")
          .references("CanonicalBudgetCategory.id")
          .onDelete("CASCADE");
      },
    )

    .createTable("BudgetStatementPayment", function (table) {
      console.log("Creating BudgetStatementPayment table...");
      table.increments("id").primary();
      table.integer("budgetStatementWalletId").notNullable();
      table
        .foreign("budgetStatementWalletId")
        .references("BudgetStatementWallet.id")
        .onDelete("CASCADE");
      table.date("transactionDate").notNullable();
      table.string("transactionId");
      table.integer("budgetStatementLineItemId");
      table
        .foreign("budgetStatementLineItemId")
        .references("BudgetStatementLineItem.id")
        .onDelete("CASCADE");
      table.text("comments");
    })

    .createTable("BudgetStatementTransferRequest", function (table) {
      console.log("Creating BudgetStatementTransferRequest table...");
      table.increments("id").primary();
      table.integer("budgetStatementWalletId").notNullable();
      table
        .foreign("budgetStatementWalletId")
        .references("BudgetStatementWallet.id")
        .onDelete("CASCADE");
      table.integer("budgetStatementPaymentId");
      table
        .foreign("budgetStatementPaymentId")
        .references("BudgetStatementLineItem.id")
        .onDelete("CASCADE");
      table.decimal("requestAmount", 14, 2).notNullable();
      table.text("comments");
    });
}

export function down(knex) {
  console.log("Dropping tables BudgetStatement subtables...");

  return knex.schema

    .dropTable("BudgetStatementLineItem_CanonicalBudgetCategory")
    .dropTable("BudgetStatementTransferRequest")
    .dropTable("BudgetStatementPayment")
    .dropTable("BudgetStatementLineItem")
    .dropTable("BudgetStatementWallet")
    .dropTable("BudgetStatementMkrVest")
    .dropTable("BudgetStatementFtes")
    .dropTable("AuditReport")
    .raw('DROP TYPE "AuditStatus"');
}
