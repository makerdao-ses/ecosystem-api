import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {


  const nonAuditors = await db.raw(`SELECT cu.code, cu.id as cuid, bs.month, bsw.name, bs.id, bstr.id as bstrid, bsw.id as bswid
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
  WHERE auditors."resourceId" IS NULL AND cu.code != 'DECO-001' AND cu.code != 'DEL' AND bsw.id NOTNULL
  GROUP BY cu.code, cu.id, bs.id, bs.month, bsw.name, bstr.id, bsw.id
  ORDER BY cu.code, bs.month DESC`);

  const rows = nonAuditors.rows;

  // Create an empty array to hold the formatted results
  const formattedResult = [];



  // Loop through each row and format the result
  rows.forEach(row => {

    //Retrieve walletBalanceTimestamo
    const timestamp = new Date(Date.UTC(row.month.getFullYear(), row.month.getMonth() + 1, 0, 12));
    const walletBalanceTimestamp = timestamp.toLocaleString();

    const formattedRow = {
      code: row.code,
      walletId: row.bswid,
      transferRequestId: row.bstrid,
      targetAmount: null,
      targetDescription: `Core Unit ${row.code} currently does not work with an Core Unit Auditor to top up its operational wallet but streams funds directly from the Maker protocol.`,
      targetCalculation: 'N/A',
      walletBalanceTimestamp: walletBalanceTimestamp
    };

    formattedResult.push(formattedRow);
  });



  // Push the formattedResult array to the database
  console.log(`Adding ${formattedResult.length} values to the BudgetStatementTransferRequest table...`);

  const insertOrUpdate = async (row) => {
    if (row.transferRequestId !== null) {
      // Update existing row
      await db("BudgetStatementTransferRequest")
        .where({
          id: row.transferRequestId
        })
        .update({
          targetAmount: row.targetAmount,
          targetCalculation: row.targetCalculation,
          targetDescription: row.targetDescription,
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
        targetDescription: row.targetDescription,
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
