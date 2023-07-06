import reportDatesSAS from "../data/blockNumbers-SAS.js";

const ownerMapping = {
  'CoreUnit': {
      '19': reportDatesSAS
  }
};


const createSnapshotReport = async (ownerType, ownerId, monthInfo, knex) => {

    console.log(`Creating snapshot report for ${ownerType} ${ownerId}, month ${monthInfo.month}`);

    let reportMonth = null;

    //If month report - ownerType (no draft)
    if(!monthInfo.month){
      ownerType = ownerType+'Draft';}

      console.log('OwnerType: ',ownerType);
    
    const existingSnapshots = await knex('Snapshot')
        .select('id')
        .where({
          ownerType: ownerType,
          ownerId,
        });
        
    existingSnapshots.forEach(s => {
      removeSnapshot(s.id, knex);
    });

      const newSnapshot = await knex('Snapshot')
        .insert({
          start: monthInfo.firstDay,
          end: monthInfo.lastDay,
          month: monthInfo.lastDay,
          ownerType: ownerType,
          ownerId,
        }).returning('id');

    return {
        id:newSnapshot[0].id
    };
};

const removeSnapshot = async (snapshotId, knex) => {

  const snapshotAccountIds = await knex('SnapshotAccount')
  .where('snapshotId', snapshotId)
  .select('id');

  console.log(`Removing Snapshot with id: ${snapshotId} with accounts`,snapshotAccountIds.map(r=>r.id));

  const deletedTransactions = await knex('SnapshotAccountTransaction')
  .whereIn('snapshotAccountId', snapshotAccountIds.map(r=>r.id))
  .del();

  console.log(deletedTransactions, `deleted transactions`);

  const deletedBalances = await knex('SnapshotAccountBalance')
  .whereIn('snapshotAccountId', snapshotAccountIds.map(r=>r.id))
  .del();

  console.log(deletedBalances, `deleted balances`);

  await knex('SnapshotAccount')
  .where('snapshotId', snapshotId)
  .update({
    groupAccountId: null,
    upstreamAccountId: null
  });

  const deletedAccounts = await knex('SnapshotAccount')
  .where('snapshotId', snapshotId)
  .del();

  console.log(deletedAccounts, 'deleted accounts');

  await knex('Snapshot')
  .where('id', snapshotId)
  .del();
};

function getStartAndEndDates(month) {
  
    // Get the year and month components from the provided date
    
    // Get the year and month components from the provided date
const year = month.getUTCFullYear();
const monthIndex = month.getUTCMonth();

// Create a new Date object for the first day of the month
const firstDay = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));

// Create a new Date object for the last day of the month
const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));


    return {
      firstDay,
      lastDay
    };
  }

  function convertMonthStringToDate(monthString) {
    // Split the month string into year and month parts
    const [year, month] = monthString.split('/');
  
    // Create a new Date object with the year and month values
    const date = new Date(year, parseInt(month) - 1, 1);
  
    return date;
  }
  
  
export default createSnapshotReport;