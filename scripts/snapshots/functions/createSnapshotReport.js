import reportDatesSAS from "../data/reportDates-SAS.js";

const ownerMapping = {
  'CoreUnit': {
      '19': reportDatesSAS
  }
};


const createSnapshotReport = async (ownerType, ownerId, month, knex) => {

    console.log(`Creating snapshot report for ${ownerType} ${ownerId}, month ${month}`);


    let start = null;
    let end = null;
    let reportMonth = null;

    //If month report - ownerType (no draft)

    if(month) {
      let monthDate = convertMonthStringToDate(month);
      const startAndEnd = getStartAndEndDates(monthDate);
      start = startAndEnd.firstDay;
      end =  startAndEnd.lastDay;

      const [m, y] = month.split('/');
      const dateObject = new Date(y, m);
      const keyMonthString = `${y}/${m}`;
      console.log(keyMonthString);

      const dateFile = ownerMapping[ownerType][ownerId];
      const startHash = dateFile[0][keyMonthString];
      const endHash = dateFile[0][indexOf];
      console.log(dateFile);
      console.log(startHash);
      reportMonth = dateObject;
    }
    else {
      ownerType = ownerType+'Draft';
    }

    

    
    const existingSnapshots = await knex('Snapshot')
        .select('id')
        .where({
          start: start,
          end: end,
          ownerType: ownerType,
          ownerId,
        });
        

        

    
    existingSnapshots.forEach(s => {
      removeSnapshot(s.id, knex);
    });

      const newSnapshot = await knex('Snapshot')
        .insert({
          start: start,
          end: end,
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