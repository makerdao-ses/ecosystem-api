import xlsx from "xlsx";
import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.PG_CONNECTION_STRING;
const pool = new Pool({ connectionString });

// Read data from the xlsx file
const workbook = xlsx.readFile(process.env.MKR_SCRIPT_PATH);
const mkrSheet = workbook.Sheets[workbook.SheetNames[0]];
const transferSheet = workbook.Sheets[workbook.SheetNames[1]];

const getDataFromSheet = (sheet) =>
  xlsx.utils.sheet_to_json(sheet, { raw: false });

const mkrData = getDataFromSheet(mkrSheet);
const transferData = getDataFromSheet(transferSheet);

// Initialize counters
let countTransfer = 0;
let countMkr = 0;

//// Write data to the PostgreSQL database
async function processMkrRow(row) {

    const monthValue = new Date(row.month)
      .toLocaleDateString("en-US")
      .slice(0, 10);

    pool.query(
      `SELECT id FROM "BudgetStatement" WHERE month = '${monthValue}' AND "ownerCode" = '${row.ownerCode}'`,
      async (err, res) => {
        if (err) {
          console.error(err);
          return;
        }

        if (res.rows.length !== 0) {
          const budgetStatementIdVal = res.rows[0].id;
          const vestDateIso = new Date(row.vestingDate)
            .toLocaleDateString("en-US")
            .slice(0, 10);
          const comment = row.comments !== undefined ? row.comments : null;
          const mkrAmount = !isNaN(row.mkrAmount) ? parseFloat(row.mkrAmount) : null;
          const mkrAmountOld = !isNaN(row.mkrAmountOld) ? parseFloat(row.mkrAmountOld) : null;

          try {
            const result = await pool.query(
              `
              WITH new_values AS (
                SELECT $1::int AS "budgetStatementId", $2::date AS "vestingDate", $3::numeric AS "mkrAmount", $4::numeric AS "mkrAmountOld", $5 AS "comments"
              )
              INSERT INTO "BudgetStatementMkrVest" ("budgetStatementId", "vestingDate", "mkrAmount", "mkrAmountOld", "comments")
              SELECT nv."budgetStatementId", nv."vestingDate", nv."mkrAmount", nv."mkrAmountOld", nv."comments"
              FROM new_values nv
              WHERE NOT EXISTS (
                SELECT 1
                FROM "BudgetStatementMkrVest"
                WHERE "budgetStatementId" = nv."budgetStatementId"
                AND "vestingDate" = nv."vestingDate"
                AND "mkrAmount" = nv."mkrAmount"
                AND "mkrAmountOld" = nv."mkrAmountOld"
              );              
              `,
              [
                budgetStatementIdVal,
                vestDateIso,
                mkrAmount,
                mkrAmountOld,
                comment,
              ]
            );
          } catch (error) {
            console.error(error);
          }
          countMkr++
        }
      }
    );
};


async function processTransferData(row) {
  const monthValue = new Date(row.month)
    .toLocaleDateString("en-US")
    .slice(0, 10);
  const walletAddLower = row.address.toLowerCase();
  const { topupTransfer: requestAmount, currentBalance: walletBalance } = row;

  try {
    const res = await pool.query(
      `SELECT id FROM "BudgetStatement" WHERE month = '${monthValue}' AND "ownerCode" = '${row.ownerCode}'`,
    );

    if (res.rows.length !== 0) {
      const budgetStatementIdVal = res.rows[0].id;

      const res1 = await pool.query(
        `SELECT id, name FROM "BudgetStatementWallet" WHERE "budgetStatementId" = ${budgetStatementIdVal} AND LOWER("address") = '${walletAddLower}'`,
      );

      if (res1.rows.length !== 0) {
        const walletId = res1.rows[0].id;

        await pool.query(
          `
          WITH new_values (budgetStatementWalletId, requestAmount, walletBalance) AS (
            VALUES (${walletId}, ${requestAmount}, ${walletBalance})
          )
          INSERT INTO "BudgetStatementTransferRequest" ("budgetStatementWalletId", "requestAmount", "walletBalance")
          SELECT nv.budgetStatementWalletId, nv.requestAmount, nv.walletBalance
          FROM new_values nv
          WHERE NOT EXISTS (
            SELECT 1
            FROM "BudgetStatementTransferRequest" bs
            WHERE bs."budgetStatementWalletId" = nv.budgetStatementWalletId
          );

          WITH new_values (budgetStatementWalletId, requestAmount, walletBalance) AS (
            VALUES (${walletId}, ${requestAmount}, ${walletBalance})
          )
          UPDATE "BudgetStatementTransferRequest" bs
          SET "requestAmount" = nv.requestAmount,
              "walletBalance" = nv.walletBalance
          FROM new_values nv
          WHERE bs."budgetStatementWalletId" = nv.budgetStatementWalletId;
          `,
          (err, res) => {
            if (err) console.error(err);
    
          },
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
  countTransfer++;
}

// Process mkrData and transferData
const mkrPromises = mkrData.map(processMkrRow);
const transferPromises = transferData.map(processTransferData);

Promise.all([...mkrPromises, ...transferPromises])
  .then(() => {
    console.log('Mkr Transfers:', countMkr);
    console.log('Transfer Requests:', countTransfer);
  })
  .catch(error => {
    console.error('Error:', error);
  });
