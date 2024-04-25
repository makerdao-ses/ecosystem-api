import xlsx from "xlsx";

export async function seed(knex) {
  try {
    const workbook = xlsx.readFile(process.env.UPDATE_BS_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });

    rows.shift(); // Skip the header row

    for (const row of rows) {
      let [team, date, status] = row;

      // Parse the date string
      const parsedDate = new Date(date);
      team = team.trim()

      // Format the date as YYYY-MM-DD
      const formattedDate = parsedDate.toISOString().split("T")[0];

      //console.log(team, formattedDate, status);

      // Fetch 'id' from CoreUnit where "shortCode" = code
      const coreUnit = await knex('CoreUnit').select('id').where('shortCode', team).andWhere('type', "CoreUnit").first();
      if (!coreUnit) {
        console.error(`CoreUnit with shortCode ${team} not found.`);
        continue; // Skip to the next row if CoreUnit not found
      }
      const cuId = coreUnit.id;
      if (status === 'Final' || status === 'Remove') {
        console.log(team, status);
        
        // Perform a select query to check if the entry exists
        const existingEntry = await knex('BudgetStatement')
          .select('id')
          .where({
            ownerId: cuId,
            month: formattedDate // Use the formatted date for comparison
          })
          .first();
  
        if (!existingEntry) {
          if (status === 'Remove') {
            await removeSnapshotReport(knex, formattedDate, cuId)
          }
          console.error(`No BudgetStatement entry found for ownerId: ${coreUnit.id} and month: ${formattedDate}.`);
          continue; // Skip to the next row if no entry found
        }
  
        console.log(`Found BudgetStatement entry for ownerId: ${coreUnit.id} and month: ${formattedDate}.`);
  
        try {
          // Remove the entry if status is 'Remove'
          if (status === 'Remove') {

            await removeSnapshotReport(knex, formattedDate, cuId)

            await knex('BudgetStatement')
              .where({
                id: existingEntry.id
              })
              .del();
            console.log(`BudgetStatement entry removed for ownerId: ${coreUnit.id} and month: ${formattedDate}.`);
          }
  
          // Update status to 'Final' if status is 'Final'
          if (status === 'Final') {
            await knex('BudgetStatement')
              .where({
                id: existingEntry.id
              })
              .update({
                status: 'Final'
              });
            console.log(`BudgetStatement status updated to 'Final' for ownerId: ${coreUnit.id} and month: ${formattedDate}.`);
          }
        }
         catch (error) {
          console.error(`Error removing BudgetStatement entry: ${error.message}`);
          continue; // Continue to the next iteration if an error occurs
        }
      } 
    else {
        console.error(`Invalid status: ${status}`);
      }
    }
  }
  catch(error) {
    console.error(`Error removing BudgetStatement entry: ${error.message}`);
  }
}

const removeSnapshotReport = async (knex, formattedDate, cuId) => {
  try {
      // Start transaction
      await knex.transaction(async trx => {
          // 1. Find the Snapshot ID to delete based on ownerId and month
          const snapshot = await trx('Snapshot')
              .select('id')
              .where({
                  ownerId: cuId,
                  month: formattedDate
              })
              .first();  // Ensures there is only one or none

          if (!snapshot) {
              console.log(`No snapshot found for teamId: ${cuId}, month: ${formattedDate}.`);
              return;  // Exit if no snapshot found
          }

          // 2. Find SnapshotAccount IDs related to the snapshot
          const accounts = await trx('SnapshotAccount')
              .select('id')
              .where('snapshotId', snapshot.id);

          const accountIds = accounts.map(account => account.id);

          // 3. Delete entries from SnapshotAccountTransaction
          await trx('SnapshotAccountTransaction')
              .whereIn('snapshotAccountId', accountIds)
              .delete();

          // 4. Delete entries from SnapshotAccountBalance
          await trx('SnapshotAccountBalance')
              .whereIn('snapshotAccountId', accountIds)
              .delete();

          // 5. Delete entries from SnapshotAccount
          await trx('SnapshotAccount')
              .whereIn('id', accountIds)
              .delete();

          // 6. Delete the SnapshotReport
          await trx('Snapshot')
              .where('id', snapshot.id)
              .delete();
      });

      console.log(`Snapshot deleted for teamId: ${cuId}, month: ${formattedDate}`);
  } catch (error) {
      console.error('Failed to remove snapshot report:', error);
      // Consider appropriate handling here such as retry logic or escalation
  }
}




