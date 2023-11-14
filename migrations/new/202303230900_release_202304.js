//Up migration drops the foreign key relationship in BudgetStatment
export async function up(knex) {
  const auditorCusQuery = await knex.raw(`
  SELECT cu.code, cu.id as cuid, bs.month, bsw.name, bs.id, bstr.id as bstrid, bsw.id as bswid,
  (SELECT SUM(bsli2.forecast) FROM "BudgetStatementLineItem" as bsli2 WHERE bsw.id = bsli2."budgetStatementWalletId" AND bs.month != bsli2.month) AS sum_of_forecast

FROM public."CoreUnit" as cu
LEFT JOIN (
  SELECT DISTINCT ur."resourceId"
  FROM "UserRole" as ur
  LEFT JOIN "Role" as r ON r.id = ur."roleId"
  WHERE r."roleName" = 'CoreUnitAuditor' 
) AS auditors ON auditors."resourceId" = cu.id
LEFT JOIN "BudgetStatement" as bs ON bs."ownerId" = cu.id
LEFT JOIN "BudgetStatementWallet" as bsw ON bsw."budgetStatementId" = bs.id
LEFT JOIN "BudgetStatementTransferRequest" as bstr ON bstr."budgetStatementWalletId" = bsw.id
LEFT JOIN "BudgetStatementLineItem" as bsli ON bsw.id = bsli."budgetStatementWalletId"
WHERE auditors."resourceId" IS NOT NULL AND cu.code != 'DECO-001' AND bs.month NOTNULL
GROUP BY cu.code, cu.id, bs.id, bs.month, bsw.name, bstr.id, bsw.id
ORDER BY cu.code, bs.month DESC
`);

  const rows = auditorCusQuery.rows;

  // Create an empty array to hold the formatted results
  const formattedResult = [];

  // Loop through each row and format the result
  rows.forEach((row) => {
    //Format date string (targetCalculation)
    const months = [
      (row.month.getMonth() + 1) % 12,
      (row.month.getMonth() + 2) % 12,
      (row.month.getMonth() + 3) % 12,
    ];
    const monthNames = months.map((m) =>
      new Date(2022, m, 1).toLocaleString("en-us", { month: "short" }),
    );
    const targetCalculation = `${monthNames.join(" + ")} forecast`;

    //Retrieve walletBalanceTimestamo
    const timestamp = new Date(
      Date.UTC(row.month.getFullYear(), row.month.getMonth() + 1, 0, 12),
    );
    const walletBalanceTimestamp = timestamp.toLocaleString();

    const formattedRow = {
      code: row.code,
      month: row.month,
      walletName: row.name,
      walletId: row.bswid,
      statementId: row.id,
      transferRequestId: row.bstrid,
      targetAmount: row.sum_of_forecast,
      targetCalculation: targetCalculation,
      targetDescription: `Core Unit ${row.code} works with a Core Unit Auditor for topping up their operational wallet to a runway of 3 months of forecasted expenses, after approval of their latest expense report.`,
      targetSourceCode: null,
      targetSourceUrl: null,
      targetSourceTitle: null,
      walletBalanceTimestamp: walletBalanceTimestamp,
    };

    formattedResult.push(formattedRow);
  });

  // Push the formattedResult array to the database
  console.log(
    `Adding ${formattedResult.length} values to the BudgetStatementTransferRequest table...`,
  );

  const insertOrUpdate = async (row) => {
    if (row.transferRequestId !== null) {
      // Update existing row
      await knex("BudgetStatementTransferRequest")
        .where({ id: row.transferRequestId })
        .update({
          targetAmount: row.targetAmount,
          targetCalculation: row.targetCalculation,
          targetDescription: `Core Unit ${row.code} works with a Core Unit Auditor for topping up their operational wallet to a runway of 3 months of forecasted expenses, after approval of their latest expense report.`,
          targetSourceCode: null,
          targetSourceUrl: null,
          targetSourceTitle: null,
          walletBalanceTimestamp: row.walletBalanceTimestamp,
        });
    } else {
      // Insert new row
      await knex("BudgetStatementTransferRequest").insert({
        budgetStatementWalletId: row.walletId,
        targetAmount: row.targetAmount,
        targetCalculation: row.targetCalculation,
        targetDescription: `Core Unit ${row.code} works with a Core Unit Auditor for topping up their operational wallet to a runway of 3 months of forecasted expenses, after approval of their latest expense report.`,
        targetSourceCode: null,
        targetSourceUrl: null,
        targetSourceTitle: null,
        walletBalanceTimestamp: row.walletBalanceTimestamp,
      });
    }
  };

  // Loop through each row and insert/update the data
  formattedResult.forEach(insertOrUpdate);
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log("Setting target values to null...");

  await knex("BudgetStatementTransferRequest").update({
    targetAmount: null,
    targetCalculation: null,
    targetDescription: null,
    targetSourceCode: null,
    targetSourceUrl: null,
    targetSourceTitle: null,
    walletBalanceTimestamp: null,
  });
}
