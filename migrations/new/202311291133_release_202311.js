// Set index in BudgetStatement Tables...

export async function up(knex) {

    console.log('Adding index in BudgetStatement table...');
    await knex.schema.alterTable("BudgetStatement", function (table) {
        table.index(["id"])
        table.index(["ownerId"])
        table.index(["month"])
        table.index(["publicationUrl"])
        table.index(["ownerCode"])
        table.index(["mkrProgramLength"])
        table.index(["status"])
        table.index(["ownerType"])
    });


    console.log('Adding index in BudgetStatementWallet table...');
    await knex.schema.alterTable("BudgetStatementWallet", function (table) {
        table.index(["id"])
        table.index(["budgetStatementId"])
        table.index(["name"])
        table.index(["address"])
        table.index(["currentBalance"])
        table.index(["topupTransfer"])
        table.index(["comments"])
    });

    console.log('Adding index in BudgetStatementLineItem table...');
    await knex.schema.alterTable("BudgetStatementLineItem", function (table) {
        table.index(["id"])
        table.index(["budgetStatementWalletId"])
        table.index(["month"])
        table.index(["position"])
        table.index(["group"])
        table.index(["budgetCategory"])
        table.index(["forecast"])
        table.index(["actual"])
        table.index(["comments"])
        table.index(["canonicalBudgetCategory"])
        table.index(["headcountExpense"])
        table.index(["budgetCap"])
        table.index(["payment"])
        table.index(["budgetId"])
        table.index(["currency"])
    });
}

export async function down(knex) {

    console.log('Dropping index in BudgetStatement table...');
    await knex.schema.alterTable("BudgetStatement", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["ownerId"])
        table.dropIndex(["month"])
        table.dropIndex(["publicationUrl"])
        table.dropIndex(["ownerCode"])
        table.dropIndex(["mkrProgramLength"])
        table.dropIndex(["status"])
        table.dropIndex(["ownerType"])
    });

    console.log('Dropping index in BudgetStatementWallet table...');
    await knex.schema.alterTable("BudgetStatementWallet", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["budgetStatementId"])
        table.dropIndex(["name"])
        table.dropIndex(["address"])
        table.dropIndex(["currentBalance"])
        table.dropIndex(["topupTransfer"])
        table.dropIndex(["comments"])
    });

    console.log('Dropping index in BudgetStatementLineItem table...');
    await knex.schema.alterTable("BudgetStatementLineItem", function (table) {
        table.dropIndex(["id"])
        table.dropIndex(["budgetStatementWalletId"])
        table.dropIndex(["month"])
        table.dropIndex(["position"])
        table.dropIndex(["group"])
        table.dropIndex(["budgetCategory"])
        table.dropIndex(["forecast"])
        table.dropIndex(["actual"])
        table.dropIndex(["comments"])
        table.dropIndex(["canonicalBudgetCategory"])
        table.dropIndex(["headcountExpense"])
        table.dropIndex(["budgetCap"])
        table.dropIndex(["payment"])
        table.dropIndex(["budgetId"])
        table.dropIndex(["currency"])
    });
}
