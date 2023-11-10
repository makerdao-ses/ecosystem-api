//Up migration creates CuMip and subtables

export function up(knex) {
  return knex.schema

    .createTable("MipReplaces", function (table) {
      console.log("Creating MipReplaces table...");
      table.increments("id").primary();
      table.integer("newMipId").notNullable();
      table.foreign("newMipId").references("CuMip.id").onDelete("CASCADE");
      table.integer("replacedMipId").notNullable();
      table.foreign("replacedMipId").references("CuMip.id").onDelete("CASCADE");
    })

    .createTable("Mip39", function (table) {
      console.log("Creating Mip39 table...");
      table.increments("id").primary();
      table.integer("cuMipId").notNullable();
      table.foreign("cuMipId").references("CuMip.id").onDelete("CASCADE");
      table.integer("mip39Spn").notNullable();
      table.string("cuName").notNullable();
      table.text("sentenceSummary").notNullable();
      table.text("paragraphSummary").notNullable();
    })

    .createTable("Mip40", function (table) {
      console.log("Creating Mip40 table...");
      table.increments("id").primary();
      table.integer("cuMipId").notNullable();
      table.foreign("cuMipId").references("CuMip.id").onDelete("CASCADE");
      table.string("mip40Spn").notNullable();
      table.boolean("mkrOnly");
      table.decimal("mkrProgramLength", 4, 2).notNullable();
    })

    .createTable("Mip40BudgetPeriod", function (table) {
      console.log("Creating Mip40BudgetPeriod table...");
      table.increments("id").primary();
      table.integer("mip40Id").notNullable();
      table.foreign("mip40Id").references("Mip40.id").onDelete("CASCADE");
      table.date("budgetPeriodStart").notNullable();
      table.date("budgetPeriodEnd").notNullable();
      table.decimal("ftes", 4, 2).notNullable();
    })

    .createTable("Mip40Wallet", function (table) {
      console.log("Creating Mip40Wallet table...");
      table.increments("id").primary();
      table.integer("mip40Id").notNullable();
      table.foreign("mip40Id").references("Mip40.id").onDelete("CASCADE");
      table.string("address").notNullable();
      table.string("name").notNullable();
      table.integer("signersTotal").notNullable();
      table.integer("signersRequired").notNullable();
      table.decimal("clawbackLimit", 14, 2);
    })

    .createTable("CanonicalBudgetCategory", function (table) {
      console.log("Creating BudgetStatementLineItem table...");
      table.increments("id").primary();
      table.string("category").notNullable();
    })

    .createTable("Mip40BudgetLineItem", function (table) {
      console.log("Creating Mip40BudgetLineItem table...");
      table.increments("id").primary();
      table.integer("mip40WalletId").notNullable();
      table
        .foreign("mip40WalletId")
        .references("Mip40Wallet.id")
        .onDelete("CASCADE");
      table.integer("position");
      table.string("group");
      table.string("budgetCategory").notNullable();
      table.decimal("budgetCap", 14, 2).notNullable();
      table.boolean("headcountExpense").notNullable();
    })

    .createTable(
      "Mip40BudgetLineItem_CanonicalBudgetCategory",
      function (table) {
        console.log(
          "Creating Mip40BudgetLineItem_CanonicalBudgetCategory table...",
        );
        table.increments("id").primary();
        table.integer("mip40BudgetLineItemId").notNullable();
        table
          .foreign("mip40BudgetLineItemId")
          .references("Mip40BudgetLineItem.id")
          .onDelete("CASCADE");
        table.integer("canonicalBudgetCategoryId").notNullable();
        table
          .foreign("canonicalBudgetCategoryId")
          .references("CanonicalBudgetCategory.id")
          .onDelete("CASCADE");
      },
    )

    .createTable("Mip41", function (table) {
      console.log("Creating Mip41 table...");
      table.increments("id").primary();
      table.integer("cuMipId").notNullable();
      table.foreign("cuMipId").references("CuMip.id").onDelete("CASCADE");
      table.integer("contributorId").notNullable();
      table
        .foreign("contributorId")
        .references("Contributor.id")
        .onDelete("CASCADE");
    });
}

export function down(knex) {
  console.log("Dropping tables CuMip subtables...");

  return knex.schema

    .dropTable("Mip41")
    .dropTable("Mip40BudgetLineItem_CanonicalBudgetCategory")
    .dropTable("Mip40BudgetLineItem")
    .dropTable("CanonicalBudgetCategory")
    .dropTable("Mip40Wallet")
    .dropTable("Mip40BudgetPeriod")
    .dropTable("Mip40")
    .dropTable("Mip39")
    .dropTable("MipReplaces");
}
