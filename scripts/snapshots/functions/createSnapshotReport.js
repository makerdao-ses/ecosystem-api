const createSnapshotReport = async (ownerType, ownerId, month, knex) => {

    console.log(`Creating snapshot report for ${ownerType} ${ownerId}, month ${month}`);

    let start = null;
    let end = null;

    //If month report - ownerType (no draft)

    if(month) {
      let monthDate = convertMonthStringToDate(month);
      const startAndEnd = getStartAndEndDates(monthDate);
      start = startAndEnd.firstDay;
      end =  startAndEnd.lastDay;
    }
    else {
      ownerType = ownerType+'Draft';
    }

    let snapshotId;

    const existingSnapshot = await knex('Snapshot')
        .select('id')
        .where({
          start: start,
          end: end,
          ownerType: ownerType,
          ownerId,
        })
        .first();

    
    try {
      snapshotId = existingSnapshot.id; 
    }
    catch {

      if (!snapshotId) {
  
      const newSnapshot = await knex('Snapshot')
        .insert({
          start: start,
          end: end,
          ownerType: ownerType,
          ownerId,
        }).returning('id');

        snapshotId = await newSnapshot[0].id;
    }
  }

    return {
        id:snapshotId
    };
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