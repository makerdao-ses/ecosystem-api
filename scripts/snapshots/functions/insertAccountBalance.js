const insertAccountBalanceExcludingOffChain = async (allAccounts, knex) => {

    let formattedResponse = [];

    console.log(allAccounts);

    for (let i = 0; i < allAccounts.length; i++) {

        const idsList = allAccounts[i].internalIds.join(', ');
        const addressesList = "'" + allAccounts[i].internalAddresses.join("', '") + "'";

        const result = await knex.raw(`
        SELECT 
 		count(*),
        round(sum(CASE WHEN sat.amount > 0 THEN sat.amount ELSE 0 END), 2) AS inflow,
		round(sum(CASE WHEN sat.amount < 0 THEN sat.amount ELSE 0 END), 2) AS outflow
        FROM 
		"SnapshotAccountTransaction" as sat
        WHERE 
        sat."snapshotAccountId" in (${idsList})
        AND
        NOT lower(sat."counterParty") in (${addressesList})
        `);

        console.log(result.rows);

        if (result) {

            formattedResponse.push({
                snapshotAccountId: allAccounts[i].id,
                totalAmount: (parseFloat(result.rows[0].outflow || 0) + parseFloat(result.rows[0].inflow || 0)).toFixed(2),
                inflow: result.rows[0].inflow || 0,
                outflow: result.rows[0].outflow || 0
            });

        }
    }
    await Promise.all(formattedResponse.map(async (resp) => {
        const exists = await knex('SnapshotAccountBalance')
            .where({
                snapshotAccountId: resp.snapshotAccountId,
                token: 'DAI',
                initialBalance: 0,
                newBalance: resp.totalAmount,
                inflow: resp.inflow,
                outflow: resp.outflow,
                includesOffChain: true
            })
            .first();

        if (!exists) {
            await knex('SnapshotAccountBalance').insert({
                snapshotAccountId: resp.snapshotAccountId,
                token: 'DAI',
                initialBalance: 0,
                newBalance: resp.totalAmount,
                inflow: resp.inflow,
                outflow: resp.outflow,
                includesOffChain: true
            });
        }
        //if exists - update
    }));


    return formattedResponse;
};


//ExcludingOffChain - Filter out payment processor ^^

//InlcudingOffChain(T) - Include payment processor from internal address and internal id



const insertAccountBalanceIncludingOffChain = async (allAccounts, knex) => {

    let formattedResponse = [];

    allAccounts = allAccounts.allAccounts;
    
    for (let i = 0; i < allAccounts.length; i++) {

        const idsList = allAccounts[i].internalIds.join(', ');
        const addressesList = "'" + allAccounts[i].internalAddresses.join("', '") + "'";

        const result = await knex.raw(`
        SELECT 
 		count(*),
        round(sum(CASE WHEN sat.amount > 0 THEN sat.amount ELSE 0 END), 2) AS inflow,
		round(sum(CASE WHEN sat.amount < 0 THEN sat.amount ELSE 0 END), 2) AS outflow
        FROM 
		"SnapshotAccountTransaction" as sat
        WHERE 
        sat."snapshotAccountId" in (${idsList})
        AND
        NOT lower(sat."counterParty") in (${addressesList})
        `);

        console.log(result.rows);

        if (result) {

            formattedResponse.push({
                snapshotAccountId: allAccounts[i].id,
                totalAmount: (parseFloat(result.rows[0].outflow || 0) + parseFloat(result.rows[0].inflow || 0)).toFixed(2),
                inflow: result.rows[0].inflow || 0,
                outflow: result.rows[0].outflow || 0
            });

        }
    }
    await Promise.all(formattedResponse.map(async (resp) => {
        const exists = await knex('SnapshotAccountBalance')
            .where({
                snapshotAccountId: resp.snapshotAccountId,
                token: 'DAI',
            })
            .del();

        
            await knex('SnapshotAccountBalance').insert({
                snapshotAccountId: resp.snapshotAccountId,
                token: 'DAI',
                initialBalance: 0,
                newBalance: resp.totalAmount,
                inflow: resp.inflow,
                outflow: resp.outflow,
                includesOffChain: false
            });

        
        //if exists - update
    }));


    return formattedResponse;
};

export default insertAccountBalanceIncludingOffChain;



/*
Allow for month input from the original terminal call
Add the protocol wallets
*/