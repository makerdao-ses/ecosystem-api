import xlsx from 'xlsx';
import pkg from 'pg';
const {
  Pool
} = pkg;

const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({
  connectionString: connectionString,
});

// Read data from the xlsx file
const workbook = xlsx.readFile(process.env.MKR_SCRIPT_PATH);
const mkrSheet = workbook.Sheets[workbook.SheetNames[0]];
const mkrData = xlsx.utils.sheet_to_json(mkrSheet, {
  raw: false
});
const transferSheet = workbook.Sheets[workbook.SheetNames[1]];
const transferData = xlsx.utils.sheet_to_json(transferSheet, {
  raw: false
});

//Initialise counters
let countTransfer = 0;
let countMkr = 0;

//Write data to the PostgreSQL database

mkrData.forEach(row => {

  //Transform the month value
  const monthValue = new Date(row.month).toLocaleDateString("en-US").slice(0, 10);

  //Retrieve the budget statement id
  pool.query(
    `SELECT id FROM "BudgetStatement" WHERE month  = '${monthValue}' AND "ownerCode" = '${row.ownerCode}'`, (err, res) => {
      if (err) {
        console.log(err);
      } else {

        //Check for existence of Budget Statement
        if (res.rows.length != 0) {
          const budgetStatementIdVal = res.rows[0].id;

          const vestDate = new Date(row.vestingDate);
          const vestDateIso = vestDate.toLocaleDateString("en-US").slice(0, 10);

          let comment = null;

          if (row.comments != undefined) {
            comment = row.comments;
            pool.query(
              `WITH new_values (budgetStatementId, vestingDate, mkrAmount, mkrAmountOld, comments) AS (
    VALUES (${budgetStatementIdVal}, '${vestDateIso}'::date, ${row.mkrAmount}, ${row.mkrAmountOld}, '${comment}')
)
INSERT INTO "BudgetStatementMkrVest" ("budgetStatementId", "vestingDate", "mkrAmount", "mkrAmountOld", "comments")
SELECT *
FROM new_values
WHERE NOT EXISTS (
    SELECT 1
    FROM "BudgetStatementMkrVest"
    WHERE "budgetStatementId" = new_values.budgetStatementId
    AND "vestingDate" = new_values.vestingDate
    AND "mkrAmount" = new_values.mkrAmount
    AND "mkrAmountOld" = new_values.mkrAmountOld
);
`,
              (err, res) => {
                countMkr++;
              });
          } else {
            pool.query(
              `WITH new_values (budgetStatementId, vestingDate, mkrAmount, mkrAmountOld, comments) AS (
    VALUES (${budgetStatementIdVal}, '${vestDateIso}'::date, ${row.mkrAmount}, ${row.mkrAmountOld}, ${comment})
)
INSERT INTO "BudgetStatementMkrVest" ("budgetStatementId", "vestingDate", "mkrAmount", "mkrAmountOld", "comments")
SELECT *
FROM new_values
WHERE NOT EXISTS (
    SELECT 1
    FROM "BudgetStatementMkrVest"
    WHERE "budgetStatementId" = new_values.budgetStatementId
    AND "vestingDate" = new_values.vestingDate
    AND "mkrAmount" = new_values.mkrAmount
    AND "mkrAmountOld" = new_values.mkrAmountOld
);
`,
              (err, res) => {
                countTransfer++;
                console.log(err ? err.stack : res.command + ' ' + countMkr + ' rows affected');
              });
          }
        }
      }
    }
  );
});

transferData.forEach(row => {

  //Transform the month value
  const monthValue = new Date(row.month).toLocaleDateString("en-US").slice(0, 10);
  let walletAdd = row.address;
  let walletAddLower = walletAdd.toLowerCase();

  const requestAmount = row.topupTransfer;
  const walletBalance = row.currentBalance;

  //Retrieve the budget statement id
  pool.query(
    `SELECT id FROM "BudgetStatement" WHERE month  = '${monthValue}' AND "ownerCode" = '${row.ownerCode}'`, (err, res) => {
      if (err) {
        console.log(err);
      } else {

        //Check for existence of Budget Statement
        if (res.rows.length != 0) {
          const budgetStatementIdVal = res.rows[0].id;
          pool.query(
            `SELECT id, name FROM "BudgetStatementWallet" WHERE "budgetStatementId"  = ${budgetStatementIdVal} AND LOWER("address") = '${walletAddLower}'`, (err1, res1) => {

              if (res1.rows.length != 0) {

                const walletId = res1.rows[0].id;
                //Update existing (used to rewrite decimals)
                /*pool.query(
                  `WITH new_values (budgetStatementWalletId, requestAmount, walletBalance) AS (
                    VALUES (${walletId}, ${requestAmount}, ${walletBalance})
                )
                UPDATE "BudgetStatementTransferRequest"
                SET "requestAmount" = new_values.requestAmount,
                    "walletBalance" = new_values.walletBalance
                FROM new_values
                WHERE "BudgetStatementTransferRequest"."budgetStatementWalletId" = new_values.budgetStatementWalletId;
                `,
                  (err, res) => {
                    countTransfer++;
                  });*/
                //Write new entries
                pool.query(
                  `WITH new_values (budgetStatementWalletId, requestAmount, walletBalance) AS (
                    VALUES (${walletId}, ${requestAmount}, ${walletBalance})
                )
                INSERT INTO "BudgetStatementTransferRequest" ("budgetStatementWalletId", "requestAmount", "walletBalance")
                SELECT *
                FROM new_values
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM "BudgetStatementTransferRequest"
                    WHERE "budgetStatementWalletId" = new_values.budgetStatementWalletId
                    AND "requestAmount" = new_values.requestAmount
                    AND "walletBalance" = new_values.walletBalance
                );`,
                  (err, res) => {
                    countTransfer++;
                    console.log(err ? err.stack : res.command + ' ' + countTransfer + ' rows affected');
                  });
              }
            });
        }
      }
    });
});