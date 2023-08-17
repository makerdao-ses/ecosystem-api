import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {

  const auditorCusQuery = await db.raw(`
  SELECT
    cu.code,
    cu.id AS cuid,
    bs.month,
    bsw.name,
    bs.id,
    bstr.id AS bstrid,
    bsw.id AS bswid,
    (
      SELECT SUM(bsli2.forecast)
      FROM "BudgetStatementLineItem" AS bsli2
      WHERE bsw.id = bsli2."budgetStatementWalletId"
        AND bs.month != bsli2.month
    ) AS sum_of_forecast
  FROM
    public."CoreUnit" AS cu
  LEFT JOIN
    (
      SELECT DISTINCT ur."resourceId"
      FROM "UserRole" AS ur
      LEFT JOIN "Role" AS r ON r.id = ur."roleId"
      WHERE r."roleName" = 'CoreUnitAuditor'
    ) AS auditors ON auditors."resourceId" = cu.id
  LEFT JOIN
    "BudgetStatement" AS bs ON bs."ownerId" = cu.id
  LEFT JOIN
    "BudgetStatementWallet" AS bsw ON bsw."budgetStatementId" = bs.id
  LEFT JOIN
    "BudgetStatementTransferRequest" AS bstr ON bstr."budgetStatementWalletId" = bsw.id
  LEFT JOIN
    "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId"
  WHERE
    auditors."resourceId" IS NOT NULL
    AND cu.code != 'DECO-001'
    AND bs.month IS NOT NULL
    AND bs.month > '2022-01-01'
  GROUP BY
    cu.code,
    cu.id,
    bs.id,
    bs.month,
    bsw.name,
    bstr.id,
    bsw.id
  ORDER BY
    cu.code,
    bs.month DESC;
`);

const rows = auditorCusQuery.rows;


// Create an empty array to hold the formatted results
const formattedResult = [];

// Loop through each row and format the result
rows.forEach(row => {

  //Format date string (targetCalculation)
const currentMonth = row.month.getMonth();
const months = [(currentMonth + 1) % 12, (currentMonth + 2) % 12, (currentMonth + 3) % 12];
const monthNames = months.map(m => new Date(row.month.getFullYear(), m, 1).toLocaleString('en-us', { month: 'short' }));
const targetCalculation = `${monthNames.join(' + ')} forecast`;


  //Retrieve walletBalanceTimestamo
  const timestamp = new Date(Date.UTC(row.month.getFullYear(), row.month.getMonth() + 1, 0, 12));
  const walletBalanceTimestamp = timestamp.toLocaleString();

  
  const adjustedDate = new Date(row.month);
  adjustedDate.setMinutes(row.month.getMinutes() - row.month.getTimezoneOffset());


  const formattedRow = {
    code: row.code,
    month: adjustedDate,
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
    walletBalanceTimestamp: walletBalanceTimestamp
  };
  

  formattedResult.push(formattedRow);


});





// Push the formattedResult array to the database
console.log(`Adding ${formattedResult.length} values to the BudgetStatementTransferRequest table...`);

const insertOrUpdate = async (row) => {
  
  if (row.transferRequestId) {
    // Update existing row
    await db("BudgetStatementTransferRequest")
      .where({ id: row.transferRequestId })
      .update({
        targetAmount: row.targetAmount,
        targetCalculation: row.targetCalculation,
        targetDescription: `Core Unit ${row.code} works with a Core Unit Auditor for topping up their operational wallet to a runway of 3 months of forecasted expenses, after approval of their latest expense report.`,
        targetSourceCode: null,
        targetSourceUrl: null,
        targetSourceTitle: null,
        walletBalanceTimestamp: row.walletBalanceTimestamp
      });
  } else {
    // Insert new row
    await db("BudgetStatementTransferRequest").insert({
      budgetStatementWalletId: row.walletId, 
      targetAmount: row.targetAmount,
      targetCalculation: row.targetCalculation,
      targetDescription: `Core Unit ${row.code} works with a Core Unit Auditor for topping up their operational wallet to a runway of 3 months of forecasted expenses, after approval of their latest expense report.`,
      targetSourceCode: null,
      targetSourceUrl: null,
      targetSourceTitle: null,
      walletBalanceTimestamp: row.walletBalanceTimestamp
    });
  }
};

// Loop through each row and insert/update the data
await Promise.all(formattedResult.map(insertOrUpdate));
return process.exit(0);
};

getData();


