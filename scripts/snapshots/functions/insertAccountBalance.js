const insertAccountBalances = async (allAccounts, offChainIncluded, knex) => {
    let formattedResponse = [];
    let offChainKey = (offChainIncluded ? 'offChainIncluded' : 'offChainExcluded');

    allAccounts = allAccounts.allAccounts;
    console.log('Updating account balances...');
    
    for (let i = 0; i < allAccounts.length; i++) {

        const idsList = allAccounts[i][offChainKey].internalIds.join(', ');
        const addressesList = "'" + allAccounts[i][offChainKey].internalAddresses.join("', '") + "'";

        if (idsList.length > 0) {

            const result = await knex.raw(`
                SELECT 
                    count(*),
                    round(sum(CASE WHEN sat.amount > 0 THEN sat.amount ELSE 0 END), 2) AS inflow,
                    round(sum(CASE WHEN sat.amount < 0 THEN sat.amount ELSE 0 END), 2) AS outflow
                
                FROM "SnapshotAccountTransaction" as sat
                
                WHERE 
                    sat."snapshotAccountId" in (${idsList})
                    AND NOT lower(sat."counterParty") in (${addressesList})
            `);


            console.log(allAccounts[i].label, result.rows, parseFloat(result.rows[0].inflow) + parseFloat(result.rows[0].outflow));

            if (result) {
                let initialBalance = 0;

                if(allAccounts[i][offChainKey].initialBalance && allAccounts[i][offChainKey].initialBalance.DAI){
                    initialBalance = allAccounts[i][offChainKey].initialBalance.DAI;
                }

                formattedResponse.push({
                    snapshotAccountId: allAccounts[i].accountId,
                    totalAmount: parseFloat(result.rows[0].outflow || 0) + parseFloat(result.rows[0].inflow || 0),
                    inflow: result.rows[0].inflow || 0.00,
                    outflow: result.rows[0].outflow || 0.00,
                    initialBalance
                });

            }
        }
    }

    await Promise.all(formattedResponse.map(async (resp) => {
        const query = knex('SnapshotAccountBalance').insert({
            snapshotAccountId: resp.snapshotAccountId,
            token: 'DAI',
            initialBalance: resp.initialBalance,
            newBalance: parseFloat(resp.initialBalance) + resp.totalAmount,
            inflow: resp.inflow,
            outflow: resp.outflow,
            includesOffChain: offChainIncluded
        });

        console.log(query.toString());
        return query;
    }));


    return formattedResponse;
};

export default insertAccountBalances;

/*
Allow for month input from the original terminal call
Add the protocol wallets
*/