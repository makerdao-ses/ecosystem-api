

const getCounterPartyName = async (snapshotAccount, counterParty, amount, knex) => {

  const upstreamResult = await knex('SnapshotAccount')
  .where('id', snapshotAccount.upstreamAccountId)
  .andWhere('accountAddress', counterParty)
  .select('*')
  .first();
  
  if (await upstreamResult && amount > 0) {
  return "Top-up";
  }
  if (await upstreamResult && amount < 0) {
    return "Return of Excess Funds";
  }

  const downstreamResult = await knex('SnapshotAccount')
  .where('upstreamAccountId', snapshotAccount.id)
  .andWhere('accountAddress', counterParty)
  .select('*')
  .first();

  if(await downstreamResult && amount < 0){
  return  "Top-up";
}
if(await downstreamResult && amount > 0){
  return "Return of Excess Funds";
}
  
};

  export default getCounterPartyName;