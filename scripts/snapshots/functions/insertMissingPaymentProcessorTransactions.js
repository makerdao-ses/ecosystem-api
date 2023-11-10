const insertMissingPaymentProcessorTransactions = async (
  processorAccountId,
  monthInfo,
  knex,
) => {
  let newBalance = 0;
  if (monthInfo.month && monthInfo.offChainBalances[monthInfo.month]) {
    const usdRecord = monthInfo.offChainBalances[monthInfo.month].filter(
      (b) => b.token === "USD",
    );
    if (usdRecord.length > 0) {
      console.log(`USD Record 1:`, usdRecord[0].newBalance);
      newBalance = usdRecord[0].newBalance;
    }
  } else {
    const months = Object.keys(monthInfo.offChainBalances);
    if (months.length > 0) {
      const usdRecord = monthInfo.offChainBalances[
        months[months.length - 1]
      ].filter((b) => b.token === "USD");
      if (usdRecord.length > 0) {
        console.log(`USD Record 2: ${usdRecord[0].newBalance}`);
        newBalance = usdRecord[0].newBalance;
      }
    }
  }
  console.log(processorAccountId);

  const expectedNewBalance = await knex("SnapshotAccountBalance")
    .select(
      knex.raw("sum(inflow) as totalInflow"),
      knex.raw(
        'sum("SnapshotAccountBalance"."initialBalance") as initialBalance',
      ),
    )
    .where("token", "=", "USD")
    .orWhere("token", "=", "DAI")
    .andWhere("snapshotAccountId", processorAccountId)
    .groupBy("snapshotAccountId");

  const inflow = expectedNewBalance[0].totalinflow;
  const eNewBalance = expectedNewBalance[0].initialbalance + inflow;
  const dummyOutflow = newBalance - eNewBalance;

  await knex("SnapshotAccountBalance").insert({
    snapshotAccountId: processorAccountId,
    token: "DAI",
    initialBalance: expectedNewBalance[0].initialbalance,
    newBalance: newBalance,
    inflow: inflow,
    outflow: dummyOutflow,
    includesOffChain: true,
  });

  await knex("SnapshotAccountBalance")
    .where("snapshotAccountId", "=", processorAccountId)
    .andWhere("includesOffChain", "=", false)
    .orWhere("token", "=", "USD")
    .del();

  console.log("ExpectedNewBalance: ", expectedNewBalance);
  console.log("newBalance: ", newBalance);
  console.log(dummyOutflow);

  /*    if(month){
            //Deal With month 
            
            
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
    }
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
    }*/
};

export default insertMissingPaymentProcessorTransactions;
