//Up migration adds data for non-auditor Core Units
export async function up(knex) {


  const nonAuditors = await knex.raw(`SELECT cu.code, cu.id as cuid, bs.month, bsw.name, bs.id, bstr.id as bstrid, bsw.id as bswid
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
    const walletBalanceTimestamp = new Date(row.month).toISOString();

    const formattedRow = {
      code: row.code,
      walletId: row.bswid,
      transferRequestId: row.bstrid,
      targetAmount: null,
      targetDescription: `Core Unit ${row.code} currently does not work with an Core Unit Auditor to top up its operational wallet but streams funds directly from the Maker protocol.`,
      targetCalculation: 'N/A',
      walletBalanceTimestamp
    };

    formattedResult.push(formattedRow);
  });



  // Push the formattedResult array to the database
  console.log(`Adding ${formattedResult.length} values to the BudgetStatementTransferRequest table...`);

  const insertOrUpdate = async (row) => {
    if (row.transferRequestId !== null) {
      // Update existing row
      await knex("BudgetStatementTransferRequest")
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
      await knex("BudgetStatementTransferRequest").insert({
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
  formattedResult.forEach(insertOrUpdate);


}


//Down migration reverts the up migration change
export async function down(knex) {

  console.log('Setting target values to null...');

  await knex("BudgetStatementTransferRequest").update({
    targetAmount: null,
    targetCalculation: null,
    targetDescription: null,
    targetSourceCode: null,
    targetSourceUrl: null,
    targetSourceTitle: null,
    walletBalanceTimestamp: null
  });


}