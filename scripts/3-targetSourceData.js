import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {
  console.log(
    "Adding targetSource data to the BudgetStatementTransferRequest...",
  );

  const bstrQuery =
    await db.raw(`SELECT cu.id as cuid, cu.code, bs.month, bstr.id as bstrid, cumip."mipCode", cumip."mipUrl", cumip."mipTitle"
FROM public."CoreUnit" as cu
LEFT JOIN "BudgetStatement" as bs on bs."ownerId" = cu.id
LEFT JOIN "BudgetStatementWallet" as bsw on bsw."budgetStatementId" = bs.id
LEFT JOIN "BudgetStatementTransferRequest" as bstr on bstr."budgetStatementWalletId" = bsw.id
LEFT JOIN LATERAL (
    SELECT cumip."mipCode", cumip."mipUrl", cumip."mipTitle", m4bp."budgetPeriodStart", m4bp."budgetPeriodEnd"
    FROM "CuMip" as cumip
    LEFT JOIN "Mip40" as m4 on m4."cuMipId" = cumip.id
    LEFT JOIN "Mip40BudgetPeriod" as m4bp on m4bp."mip40Id" = m4.id
    WHERE cumip."cuId" = cu.id AND bs.month BETWEEN m4bp."budgetPeriodStart" AND m4bp."budgetPeriodEnd" AND cumip."accepted" IS NOT NULL
    ORDER BY m4bp."budgetPeriodStart" DESC
    LIMIT 1
) as cumip on true
WHERE cumip."mipCode" IS NOT NULL AND cu.id IS NOT NULL AND bstr.id NOTNULL
GROUP BY cuid, bs.month, bstrid, cumip."mipCode", cumip."mipUrl", cumip."mipTitle"
ORDER BY bstrid;
`);

  const rows = bstrQuery.rows;

  // Create an empty array to hold the formatted results
  const formattedResult = [];

  rows.forEach((row) => {
    const formattedRow = {
      bstrid: row.bstrid,
      targetSourceCode: row.mipCode,
      targetSourceUrl: row.mipUrl,
      targetSourceTitle: row.mipTitle,
    };
    formattedResult.push(formattedRow);
  });

  const insert = async (row) => {
    // Update existing row
    await db("BudgetStatementTransferRequest")
      .where({
        id: row.bstrid,
      })
      .update({
        targetSourceCode: row.targetSourceCode,
        targetSourceUrl: row.targetSourceUrl,
        targetSourceTitle: row.targetSourceTitle,
      });
  };

  // Loop through each row and insert/update the data
  await Promise.all(formattedResult.map(insert));
  return process.exit(0);
};

getData();
