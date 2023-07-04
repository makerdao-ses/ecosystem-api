const insertMissingPaymentProcessorTransactions = async (processorAccountId, month, knex) => {
    
    console.log(processorAccountId);

    const expectedNewBalance = await knex('SnapshotAccountBalance')
    .select(knex.raw('sum(inflow) as totalInflow'), 
    knex.raw('sum("SnapshotAccountBalance"."initialBalance") as initialBalance'))
    .where('token', '=', 'USD')
    .orWhere('token', '=', 'DAI')
    .andWhere('snapshotAccountId', processorAccountId)
    .groupBy('snapshotAccountId');
    

    const realNewBalance = await knex('SnapshotAccountBalance as sab')
    .select('id', 'sab.newBalance')
    .where('sab.token', '=', 'USD')
    .andWhere('sab.snapshotAccountId', processorAccountId);
    
    if(realNewBalance.length>0){
    const newBalance = realNewBalance[0].newBalance;
    const inflow = expectedNewBalance[0].totalinflow;
    const eNewBalance = expectedNewBalance[0].initialbalance + inflow;
    const dummyOutflowTransaction  = newBalance - eNewBalance;

    await knex('SnapshotAccountBalance')
    .insert({
        snapshotAccountId: processorAccountId,
        token: 'DAI',
        initialBalance: expectedNewBalance[0].initialbalance,
        newBalance: newBalance,
        inflow: inflow,
        outflow: dummyOutflowTransaction,
        includesOffChain: true
    });
    

    await knex('SnapshotAccountBalance')
    .where('snapshotAccountId', '=', processorAccountId)
    .andWhere('includesOffChain', '=', false)
    .orWhere('token', '=', 'USD')
    .del();


    console.log('ExpectedNewBalance: ',expectedNewBalance);
    console.log('RealNewBalance: ',realNewBalance);
    console.log(dummyOutflowTransaction);

    if(month){
        //Deal With month 
        
        /*
          const [monthValue, yearValue] = month.split('/');
        const lastDayOfPreviousMonth = new Date(yearValue, monthValue - 1, 0);
        const timestamp = lastDayOfPreviousMonth.toISOString();
        
        console.log(month);
        console.log(timestamp)

        await knex('SnapshotAccountTransaction')
        .insert({
        snapshotAccountId: processorAccountId,
        timestamp: ,
        amount: dummyOutflowTransaction,
        token: 'DAI',
        txLabel: 'Offchain payment(s)',
        counterPartyName: 'Unspecified Recipient(s)',
    })
*/}
else{
        const currentDate = new Date();
        const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const timestamp = lastDayOfPreviousMonth.toISOString();
        
        console.log(month);
        console.log(timestamp);
        
        await knex('SnapshotAccountTransaction')
        .insert({
        snapshotAccountId: processorAccountId,
        timestamp: timestamp,
        amount: dummyOutflowTransaction,
        token: 'DAI',
        txLabel: 'Offchain payment(s)',
        counterPartyName: 'Unspecified Recipient(s)',
        block: "Null",
        txHash: "Null",
        counterParty: "Null"
    });
}

    }};
    
export default insertMissingPaymentProcessorTransactions;