//Script that updates the budget caps in line with the relevant MIP - only where bs.month = bsli.month

import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {
    var bsCaps = await getBudgetStatementBudgetCaps();
    var mCaps = await getMipBudgetCaps();

    //Compare current budget statement caps and total mip caps per month and calculate the difference
    var matched = await matchCategories(bsCaps, mCaps);

    //Find the current payment topup value per budget statement (if it exists)
    var paymentTop = await paymentTopup();

    var updateVals = await mapValue(paymentTop, matched);

    await writeToDb(updateVals);

    console.log("Updating " + updateVals.length + " payment topup budget cap values...");

    return process.exit(0);

};

const getBudgetStatementBudgetCaps = async () => {

    var result = await db.raw(`
    SELECT 
        bsw.address, 
        bs.month, 
        bs."ownerCode", 
        SUM(bsli."budgetCap") as "totalBudgetCap"
    FROM 
        "BudgetStatement" AS bs
    LEFT JOIN 
        "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
    LEFT JOIN 
        "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId"
    WHERE 
        bs.month = bsli.month
    AND 
        bs."ownerCode" != 'DAIF-001'
    AND 
        bs."ownerType" = 'CoreUnit'
    GROUP BY 
        bsw.address, 
        bs.month, 
        bs."ownerCode"
    ORDER BY bs."ownerCode"`);

    var results = [];

    for (var i = 0; i < result.rows.length; i++) {
        var entry = {
            ownerCode: result.rows[i].ownerCode,
            address: result.rows[i].address,
            month: result.rows[i].month,
            total: result.rows[i].totalBudgetCap
        };
        results.push(entry);
    }

    return results;
};

const getMipBudgetCaps = async () => {

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
    LEFT JOIN 
        "CoreUnit" AS "cu" ON "cumip"."cuId" = "cu"."id"
    INNER JOIN 
        "Mip40" AS "m4" ON "cumip"."id" = "m4"."cuMipId"
    LEFT JOIN 
        "Mip40BudgetPeriod" AS "m4bp" ON "m4"."id" = "m4bp"."mip40Id"
    LEFT JOIN 
        "Mip40Wallet" AS "m4w" ON "m4"."id" = "m4w"."mip40Id"
    LEFT JOIN 
        "Mip40BudgetLineItem" AS "m4bl" ON "m4w"."id" = "m4bl"."mip40WalletId"
    WHERE 
        "m4"."mkrOnly" IS NULL
    GROUP BY 
        "m4w"."id", "m4w"."name", "m4w"."address", "cu"."code", "cumip"."mipUrl", "m4bp"."budgetPeriodStart", "m4bp"."budgetPeriodEnd"
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
                total: result.rows[i].total
            };
            results.push(entry);
        }
    }

    return results;

};

const paymentTopup = async () => {

    var result = await db.raw(`SELECT bsli.id as bsliid, bs.id as bsid, bsw.id as bswid, bsw.address, bs.month, bs."ownerCode", bsli."budgetCap" as "paymentTopupCap"
    FROM "BudgetStatement" AS bs
    LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
    LEFT OUTER JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId" AND bs.month = bsli.month AND bsli."budgetCategory" = 'payment topup'
    WHERE bs.month < CURRENT_DATE
    GROUP BY bsw.address, bs.month, bs."ownerCode", bsli."budgetCap", bsli.id, bs.id, bsw.id
    ORDER BY "paymentTopupCap" DESC`);

    const formattedResult = result.rows.map(row => ({
        bsliId: row.bsliid,
        bsId: row.bsid,
        bsWid: row.bswid,
        address: row.address,
        month: row.month,
        ownerCode: row.ownerCode,
        paymentTopupCap: row.paymentTopupCap
    }));

    return formattedResult;

};


const matchCategories = async (bs, m) => {
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
            
            if (bs[i].address == m[j].address && bs[i].month <= m[j].end && bs[i].month >= m[j].start) {

                if (bsTotal == mTotal || ((bsTotal == null || bsTotal == 0) && (mTotal == null || mTotal == 0 || isNaN(mTotal)))) {
                    right++;
                } else if (bsTotal == 0 || bsTotal == null) {
                    empty++;
                    diff = mTotal;
                } else if (bsTotal != null || bsTotal != 0) {
                    wrong++;
                    console.log('Mip:',m[j]);
                    console.log('Budget Statement: ',(bs[i]));
                    diff = mTotal - bsTotal;
                }
                matchFound = true;

                // push values into matched array
                matched.push({
                    address: bs[i].address,
                    month: bs[i].month,
                    code: bs[i].ownerCode,
                    diff: diff
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



    console.log('Empty Count: ' + empty);
    console.log('Wrong Count: ' + wrong);
    console.log('Right Count: ' + right);
    var cnm = bs.length - empty - wrong - right;
    console.log('Could not match: ' + cnm);

    missing.sort((a, b) => a.month - b.month);

    return matched;
};




const mapValue = async (paymentTopupOutput, matchedCategoriesOutput) => {
    const outputList = [];

    paymentTopupOutput.forEach((payment) => {
        const matchedCategory = matchedCategoriesOutput.find(
            (category) =>
            category.code === payment.ownerCode &&
            payment.month.toISOString().slice(0, 10) === category.month.toISOString().slice(0, 10) &&
            payment.address === category.address
        );

        if (matchedCategory) {
            outputList.push({
                ownerCode: payment.ownerCode,
                month: payment.month,
                bsId: payment.bsId,
                bsWid: payment.bsWid,
                bsliId: payment.bsliId,
                diff: matchedCategory.diff, // set diff to category.diff
            });
        }
    });

    return outputList;
};

const writeToDb = async (updateVals) => {

    for (const item of updateVals) {
        if (item.bsliId) {
            // Update the budget cap in the BudgetStatementLineItem table
            await db.raw(`
            UPDATE "BudgetStatementLineItem"
            SET "budgetCap" = COALESCE("budgetCap", 0) + ${item.diff}
            WHERE "id" = ${item.bsliId}
          `);
        } else if (item.month && item.bsWid) {
            // Check if a 'payment topup' entry already exists for the given month and wallet
            const existingEntry = await db('BudgetStatementLineItem')
                .where({
                    month: item.month,
                    budgetCategory: 'payment topup',
                    budgetStatementWalletId: item.bsWid
                })
                .first();

            if (existingEntry) {
                // Update the budget cap in the existing entry
                await db('BudgetStatementLineItem')
                    .where('id', existingEntry.id)
                    .update('budgetCap', db.raw('"budgetCap" + ?', [item.diff]));

            } else {
                // Create a new BudgetStatementLineItem entry
                const {
                    bsliId
                } = await db('BudgetStatementLineItem').insert({
                    budgetStatementWalletId: item.bsWid,
                    month: item.month,
                    budgetCategory: 'payment topup',
                    budgetCap: item.diff,
                    position: 0
                });
            }
        }
    }
};

getData();