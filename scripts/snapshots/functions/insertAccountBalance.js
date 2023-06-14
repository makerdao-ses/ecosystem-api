

const insertAccountBalance = async (accounts, knex) => {

    let formattedResponse = [];

    for(let i = 0; i < accounts.length; i++){

        let address = ''+accounts[i].address;
        console.log(address);
    
        const result = await knex.raw(`SELECT 
        sa.id, 
        sa."accountLabel", 
        sa."accountAddress", 
        round(sum(sat.amount), 2) AS total_amount,
        round(sum(CASE WHEN sat.amount > 0 THEN sat.amount ELSE 0 END), 2) AS inflow,
        round(sum(CASE WHEN sat.amount < 0 THEN sat.amount ELSE 0 END), 2) AS outflow
    FROM 
        "Snapshot" as s
        LEFT JOIN "SnapshotAccount" as sa on s.id = sa."snapshotId"
        LEFT JOIN "SnapshotAccountTransaction" as sat on sat."snapshotAccountId" = sa.id
        LEFT JOIN "CoreUnit" as cu on cu.id = s."ownerId"
    WHERE 
        sa."accountAddress" = '${address}'
    GROUP BY 
        sa."accountAddress", sa."accountLabel", cu.code, sa.id
    `);

    if(result){
        
    formattedResponse.push({
        snapshotAccountId: result.rows[0].id,
        totalAmount: result.rows[0].total_amount,
        inflow: result.rows[0].inflow,
        outflow: result.rows[0].outflow
    });

    }
}
formattedResponse.forEach(async (resp) => {

    console.log('resp');
    console.log(resp);
    await knex('SnapshotAccountBalance').insert({
        snapshotAccountId: resp.snapshotAccountId,
        token: 'DAI',
        initialBalance: 0,
        newBalance: resp.totalAmount,
        inflow: resp.inflow,
        outflow: resp.outflow
    });
});

return; 
};

export default insertAccountBalance;