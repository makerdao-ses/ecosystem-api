import knex from "knex";

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {
  var bsCaps = await budgetStatementCaps();
  var mCaps = await mipCaps();

  // Compare current budget statement caps and total mip caps per month and calculate the difference
  var matched = await matchCategories(bsCaps, mCaps);

  // Find the current payment topup value per budget statement (if it exists)
  var paymentTop = await paymentTopup();

  // Structure the values to be updated
  var updateVals = await mapValue(paymentTop, matched);

  // Write entries to the database
  await writeToDb(updateVals);

  console.log(
    "Updating " + updateVals.length + " payment topup budget cap values...",
  );

  // Close connection
  return process.exit(0);
};

const paymentTopup = async () => {
  // Retrieve current payment topup values
  var result = await db.raw(`
    SELECT
      bsli.id AS bsliid,
      bs.id AS bsid,
      bsw.id AS bswid,
      bsw.address,
      bs.month,
      bsli.month AS bslimonth,
      bs."ownerCode",
      bsli."budgetCap" AS "paymentTopupCap"
    FROM
      "BudgetStatement" AS bs
      LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
      LEFT OUTER JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId" AND bs.month != bsli.month AND bsli."budgetCategory" = 'payment topup'
    WHERE
      bs.month < CURRENT_DATE
      AND bsli.month NOTNULL
      AND bs."ownerCode" != 'DAIF-001'
    GROUP BY
      bsw.address,
      bs.month,
      bs."ownerCode",
      bsli."budgetCap",
      bsli.id,
      bs.id,
      bsw.id
    ORDER BY
      "paymentTopupCap" DESC
  `);

  const formattedResult = result.rows.map((row) => ({
    bsliId: row.bsliid,
    bsId: row.bsid,
    bsWid: row.bswid,
    address: row.address,
    month: row.month,
    bslimonth: row.bslimonth,
    ownerCode: row.ownerCode,
    paymentTopupCap: row.paymentTopupCap,
  }));

  return formattedResult;
};

const budgetStatementCaps = async () => {
  // Retrieve current BudgetStatement Budget Cap values
  var result = await db.raw(`
    SELECT
      bsw.address,
      bs.month,
      bs.id AS bsid,
      bsw.id AS bswid,
      bsli.month AS bslimonth,
      bs."ownerCode",
      SUM(bsli."budgetCap") AS "totalBudgetCap"
    FROM
      "BudgetStatement" AS bs
      LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
      LEFT JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId"
    WHERE
      bs.month != bsli.month
    GROUP BY
      bsw.address,
      bs.month,
      bs."ownerCode",
      bslimonth,
      bs.id,
      bsw.id
    ORDER BY
      bs."ownerCode"
  `);

  var results = [];

  for (var i = 0; i < result.rows.length; i++) {
    var entry = {
      ownerCode: result.rows[i].ownerCode,
      bsId: result.rows[i].bsid,
      bsWid: result.rows[i].bswid,
      address: result.rows[i].address,
      month: result.rows[i].month,
      bslimonth: result.rows[i].bslimonth,
      total: result.rows[i].totalBudgetCap,
    };
    results.push(entry);
  }

  return results;
};

const mipCaps = async () => {
  // Retrieve budget caps per the entries in the MIP tables
  var results = [];
  var result = await db.raw(`
    SELECT
      "cu"."code",
      "cumip"."mipUrl",
      "m4w"."name",
      "m4w"."address",
      "m4w"."id",
      "m4bp"."budgetPeriodStart",
      "m4bp"."budgetPeriodEnd",
      SUM("m4bl"."budgetCap") AS "total"
    FROM
      "public"."CuMip" AS "cumip"
      LEFT JOIN "CoreUnit" AS "cu" ON "cumip"."cuId" = "cu"."id"
      INNER JOIN "Mip40" AS "m4" ON "cumip"."id" = "m4"."cuMipId"
      LEFT JOIN "Mip40BudgetPeriod" AS "m4bp" ON "m4"."id" = "m4bp"."mip40Id"
      LEFT JOIN "Mip40Wallet" AS "m4w" ON "m4"."id" = "m4w"."mip40Id"
      LEFT JOIN "Mip40BudgetLineItem" AS "m4bl" ON "m4w"."id" = "m4bl"."mip40WalletId"
    WHERE
      "m4"."mkrOnly" IS NULL
    GROUP BY
      "m4w"."id",
      "m4w"."name",
      "m4w"."address",
      "cu"."code",
      "cumip"."mipUrl",
      "m4bp"."budgetPeriodStart",
      "m4bp"."budgetPeriodEnd"
    ORDER BY
      "m4bp"."budgetPeriodStart" DESC;
  `);

  for (var i = 0; i < result.rows.length; i++) {
    let add = result.rows[i].address;
    if (add != null) {
      var address = add.toLowerCase();
      var entry = {
        ownerCode: result.rows[i].code,
        address: address,
        name: result.rows[i].name,
        mipUrl: result.rows[i].mipUrl,
        start: result.rows[i].budgetPeriodStart,
        end: result.rows[i].budgetPeriodEnd,
        total: result.rows[i].total,
      };
      results.push(entry);
    }
  }

  return results;
};

const matchCategories = async (bs, m) => {
  //Check for consistency by comparing BudgetStatement BudgetCap to MIP BudgetCap

  var empty = 0;
  var wrong = 0;
  var right = 0;
  var missing = [];
  var matched = [];

  console.log("Number of Budget Statements: " + bs.length);

  var today = new Date().getTime();

  for (var i = 0; i < bs.length; i++) {
    var matchFound = false;
    for (var j = 0; j < m.length; j++) {
      var diff = 0;
      let bsTotal = parseFloat(bs[i].total).toFixed(2);
      let mTotal = parseFloat(m[j].total).toFixed(2);
      if (
        bs[i].address == m[j].address &&
        bs[i].bslimonth <= m[j].end &&
        bs[i].bslimonth >= m[j].start
      ) {
        if (
          bsTotal == mTotal ||
          ((bsTotal == null || bsTotal == 0) &&
            (mTotal == null || mTotal == 0 || isNaN(mTotal)))
        ) {
          right++;
        } else if (bsTotal == 0 || bsTotal == null) {
          empty++;
          diff = mTotal;
        } else if (bsTotal != null || bsTotal != 0) {
          wrong++;
          diff = mTotal - bsTotal;
        }
        matchFound = true;

        // push values into matched array
        matched.push({
          bsId: bs[i].bsId,
          bsWid: bs[i].bsWid,
          address: bs[i].address,
          month: bs[i].month,
          bslimonth: bs[i].bslimonth,
          ownerCode: bs[i].ownerCode,
          diff: diff,
        });

        break;
      }
    }
    if (!matchFound) {
      if (bs[i].month < today) {
        missing.push({
          month: bs[i].month,
          ownerCode: bs[i].ownerCode,
          address: bs[i].address,
          bsTotal: bs[i].total,
        });
      }
    }
  }

  console.log("Empty Count: " + empty);
  console.log("Wrong Count: " + wrong);
  console.log("Right Count: " + right);
  var cnm = bs.length - empty - wrong - right;
  console.log("Could not match: " + cnm);

  missing.sort((a, b) => a.month - b.month);

  return matched;
};

const mapValue = async (p, m) => {
  const newArray = [];

  m.forEach((row1) => {
    let found = false;

    p.forEach((row2) => {
      if (
        row1.bsId === row2.bsId &&
        row1.bsWid === row2.bsWid &&
        row1.address === row2.address &&
        row1.month === row2.month &&
        row1.bslimonth === row2.bslimonth &&
        row1.ownerCode === row2.ownerCode
      ) {
        newArray.push({
          bsliId: row2.bsliId,
          bsId: row2.bsId,
          bsWid: row2.bsWid,
          address: row2.address,
          month: row2.month,
          bslimonth: row2.bslimonth,
          ownerCode: row2.ownerCode,
          diff: row2.paymentTopupCap + row1.diff,
        });

        found = true;
      }
    });

    if (!found) {
      newArray.push({
        bsliId: null,
        bsId: row1.bsId,
        bsWid: row1.bsWid,
        address: row1.address,
        month: row1.month,
        bslimonth: row1.bslimonth,
        ownerCode: row1.ownerCode,
        diff: row1.diff,
      });
    }
  });

  //console.log(newArray);

  return newArray;
};

const writeToDb = async (updateVals) => {
  //console.log(updateVals);

  for (const item of updateVals) {
    if (item.bsliId) {
      // Update the budget cap in the BudgetStatementLineItem table
      await db.raw(`
            UPDATE "BudgetStatementLineItem"
            SET "budgetCap" = COALESCE("budgetCap", 0) + ${item.diff}
            WHERE "id" = ${item.bsliId}
          `);
    } else if (item.bslimonth && item.bsWid) {
      // Check if a 'payment topup' entry already exists for the given month and wallet
      const existingEntry = await db("BudgetStatementLineItem")
        .where({
          month: item.bslimonth,
          budgetCategory: "payment topup",
          budgetStatementWalletId: item.bsWid,
        })
        .first();

      if (existingEntry) {
        // Update the budget cap in the existing entry

        await db.raw(`
                    UPDATE "BudgetStatementLineItem"
                    SET "budgetCap" = COALESCE("budgetCap", 0) + ${item.diff}
                    WHERE "id" = ${existingEntry.id}
                  `);
      } else {
        // Create a new BudgetStatementLineItem entry
        const { bsliId } = await db("BudgetStatementLineItem").insert({
          budgetStatementWalletId: item.bsWid,
          month: item.bslimonth,
          budgetCategory: "payment topup",
          budgetCap: item.diff,
          position: 0,
        });
      }
    } else {
      // Do nothing if bsliId is not present and bslimonth and bsWid are not both present
    }
  }
};

getData();
