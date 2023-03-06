import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
});

const getData = async () => {
    var bsCaps = await budgetStatementCapsCurrent();
    var mCaps = await mipCaps();
    
    var matched = await matchCategories(bsCaps, mCaps);
    var paymentTop = await paymentTopup();
    
    var bsFutCaps = await budgetStatementCapsFuture();
    var matchedFut = await matchCategoriesFut(bsFutCaps, mCaps);
    var paymentTopupFut = await paymentTopupFuture();


    var updateVals = await mapValue(paymentTop, matched);
    var updateValsFut = await mapValueFuture(paymentTopupFut, matchedFut);

    console.log("Update vals: ");
    console.table(updateVals);
    console.log("Update vals future: ");
    updateValsFut.sort((a, b) => a.bsId - b.bsId);
    console.table(updateValsFut);
    await writeToDb(updateVals);
    await writeToDb(updateValsFut);

    console.log("Updating payment topup budget cap values...");

    return process.exit(0);

};

const mipCaps = async () => {

    var results = [];

    var result = await db.select('cu.code', 'cumip.mipUrl', 'm4w.name', 'm4w.address', 'm4w.id', 'm4bp.budgetPeriodStart', 'm4bp.budgetPeriodEnd', db.raw('SUM(m4bl."budgetCap") AS total'))
        .from('public.CuMip AS cumip')
        .leftJoin('CoreUnit AS cu', 'cumip.cuId', 'cu.id')
        .innerJoin('Mip40 as m4', 'cumip.id', 'm4.cuMipId')
        .leftJoin('Mip40BudgetPeriod as m4bp', 'm4.id', 'm4bp.mip40Id')
        .leftJoin('Mip40Wallet AS m4w', 'm4.id', 'm4w.mip40Id')
        .leftJoin('Mip40BudgetLineItem AS m4bl', 'm4w.id', 'm4bl.mip40WalletId')
        .where({
            'm4.mkrOnly': null
        })
        .groupBy('m4w.id', 'm4w.name', 'm4w.address', 'cu.code', 'cumip.mipUrl', 'm4bp.budgetPeriodStart', 'm4bp.budgetPeriodEnd')
        .orderBy('m4bp.budgetPeriodEnd');


    for (var i = 0; i < result.length; i++) {
        let add = result[i].address;
        if (add != null) {
            var address = add.toLowerCase();
            var entry = {
                ownerCode: result[i].code,
                address: address,
                name: result[i].name,
                mipUrl: result[i].mipUrl,
                start: result[i].budgetPeriodStart,
                end: result[i].budgetPeriodEnd,
                total: result[i].total
            };
            results.push(entry);
        }
    }

    return results;

};

const paymentTopup = async () => {

    var result = await db.raw(`SELECT bsli.id as bsliid, bs.id as bsid, bsw.id as bswid, bsw.address, bs.month , bsli.month as "bsliMonth", bs."ownerCode", bsli."budgetCap" as "paymentTopupCap"
    FROM "BudgetStatement" AS bs
    LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
    LEFT OUTER JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId" AND bs.month = bsli.month AND bsli."budgetCategory" = 'payment topup'
    WHERE bs.month < CURRENT_DATE AND bsli.month notnull
    GROUP BY bsw.address, bs.month, "bsliMonth", bs."ownerCode", bsli."budgetCap", bsli.id, bs.id, bsw.id
    ORDER BY "paymentTopupCap" DESC`);

    const formattedResult = result.rows.map(row => ({
        bsliId: row.bsliid,
        bsId: row.bsid,
        bsWid: row.bswid,
        address: row.address,
        month: row.month,
        bsliMonth: row.bsliMonth,
        ownerCode: row.ownerCode,
        paymentTopupCap: row.paymentTopupCap
    }));

    return formattedResult;


};

const budgetStatementCapsCurrent = async () => {

    var result = await db.raw(`SELECT bsw.address, bs.month, bs."ownerCode", SUM(bsli."budgetCap") as "totalBudgetCap"
    FROM "BudgetStatement" AS bs
    LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
    LEFT JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId"
    WHERE bs.month = bsli.month
    GROUP BY bsw.address, bs.month, bs."ownerCode"`);

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
            if (bs[i].address == m[j].address && bs[i].month <= m[j].end && bs[i].month >= m[j].start) {

                if (bs[i].total == 0 || bs[i].total == null) {
                    empty++;
                    diff = m[j].total;
                } else if (bs[i].total == m[j].total) {
                    right++;
                } else if (bs[i].total != null || bs[i].total != 0) {
                    wrong++;
                    diff = m[j].total - bs[i].total;
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

    console.table(paymentTopupOutput);

    console.table(matchedCategoriesOutput[1]);

    paymentTopupOutput.forEach((payment) => {
        const matchedCategory = matchedCategoriesOutput.find(
            (category) =>
            category.code === payment.ownerCode &&
            payment.month.toISOString().slice(0, 10) === category.month.toISOString().slice(0, 10) &&
            payment.bsliMonth.toISOString().slice(0, 10) === category.month.toISOString().slice(0, 10) &&
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

const paymentTopupFuture = async () => {

    var result = await db.raw(`SELECT bsli.id as bsliid, bs.id as bsid, bsw.id as bswid, bsw.address, bs.month , bsli.month as "bsliMonth", bs."ownerCode", bsli."budgetCap" as "paymentTopupCap"
    FROM "BudgetStatement" AS bs
    LEFT JOIN "BudgetStatementWallet" AS bsw ON bs.id = bsw."budgetStatementId"
    LEFT JOIN "BudgetStatementLineItem" AS bsli ON bsw.id = bsli."budgetStatementWalletId" AND bsli."budgetCategory" = 'payment topup'
    WHERE bs.month < CURRENT_DATE AND bsli.month notnull AND bs.month != bsli.month
    GROUP BY bsw.address,  "bsliMonth", bs."ownerCode", bsli."budgetCap", bsli.id,  bsw.id, bs.id
    ORDER BY bs.month DESC`);

    const formattedResult = result.rows.map(row => ({
        bsliId: row.bsliid,
        bsId: row.bsid,
        bsWid: row.bswid,
        address: row.address,
        month: row.month,
        bsliMonth: row.bsliMonth,
        ownerCode: row.ownerCode,
        paymentTopupCap: row.paymentTopupCap
    }));
    

    return formattedResult;

};

const budgetStatementCapsFuture = async () => {

    var result = await db.raw(`SELECT bs.id, bs."ownerCode", bs.month as "bsMonth", bsli.month as "futureMonth", bsw.address, sum(bsli."budgetCap") as "totalBudgetCap"
    FROM public. "CoreUnit" as cu
    LEFT JOIN "BudgetStatement" as bs on bs."ownerId" = cu.id
    LEFT JOIN "BudgetStatementWallet" as bsw on bsw."budgetStatementId" = bs.id
    LEFT JOIN "BudgetStatementLineItem" as bsli on bsw.id = bsli."budgetStatementWalletId"
    WHERE bs.month != bsli.month
    GROUP BY bs.id, cu."code", bsli.month, bsw.address
    ORDER by cu."code"`);

    var results = [];

    for (var i = 0; i < result.rows.length; i++) {
        var entry = {
            bsId: result.rows[i].id,
            ownerCode: result.rows[i].ownerCode,
            address: result.rows[i].address,
            month: result.rows[i].futureMonth,
            total: result.rows[i].totalBudgetCap
        };
        results.push(entry);
    }

    return results;
};

const matchCategoriesFut = async (bs, m) => {
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
            if (bs[i].address == m[j].address && bs[i].month <= m[j].end && bs[i].month >= m[j].start) {

                if (bs[i].total == 0 || bs[i].total == null) {
                    empty++;
                    diff = m[j].total;
                } else if (bs[i].total == m[j].total) {
                    right++;
                } else if (bs[i].total != null || bs[i].total != 0) {
                    wrong++;
                    diff = m[j].total - bs[i].total;
                }
                matchFound = true;

                // push values into matched array
                matched.push({
                    address: bs[i].address,
                    month: bs[i].month,
                    code: bs[i].ownerCode,
                    bsId: bs[i].bsId,
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
                    bsId: bs[i].bsId,
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

const mapValueFuture = async (paymentTopupOutput, matchedCategoriesOutput) => {
    const outputList = [];

    console.log('Payment:');
    console.table(paymentTopupOutput[1]);
    console.log('Category:');
    console.table(matchedCategoriesOutput[1]);

    paymentTopupOutput.forEach((payment) => {
        const matchedCategory = matchedCategoriesOutput.find(
            (category) =>
            category.code === payment.ownerCode &&
            payment.bsId === category.bsId &&
            payment.bsliMonth.toISOString().slice(0, 10) === category.month.toISOString().slice(0, 10) &&
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
            await db('BudgetStatementLineItem')
                .where('id', item.bsliId)
                .update('budgetCap', db.raw('"budgetCap" + ?', [item.diff]));
        } else {
            // Create a new BudgetStatementLineItem entry
            const {
                bsliId
            } = console.log(await db('BudgetStatementLineItem').insert({
                budgetStatementWalletId: item.bsWid,
                month: item.month,
                budgetCategory: 'payment topup',
                budgetCap: item.diff,
                position: 0
            }));

            item.bsliId = bsliId; // Update the bsliId in the output list
        }
    }
};


getData();