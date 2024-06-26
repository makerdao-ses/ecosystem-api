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

            let bsId = existingEntry.id;

            await removeSnapshotReport(knex, formattedDate, cuId)
            await removeBudgetStatement(knex, bsId)
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

const removeBudgetStatement = async (knex, bsId) => {
  try {
      // Start transaction
      await knex.transaction(async trx => {
          // 1. Find BudgetStatementWallet IDs related to the BudgetStatement
          const wallets = await trx('BudgetStatementWallet')
              .select('id')
              .where('budgetStatementId', bsId);

          const walletIds = wallets.map(wallet => wallet.id);

          // 2. Find BudgetStatementTransferRequest IDs related to BudgetStatementWallets
          const transferRequests = await trx('BudgetStatementTransferRequest')
              .whereIn('budgetStatementWalletId', walletIds);

          const transferRequestIds = transferRequests.map(request => request.id);

          // 3. Find BudgetStatementLineItem IDs related to BudgetStatementWallets
          const lineItems = await trx('BudgetStatementLineItem')
              .whereIn('budgetStatementWalletId', walletIds);

          const lineItemIds = lineItems.map(item => item.id);

          // 4. Check if all Transfer Requests have null or empty walletBalance
          const invalidTransferRequests = transferRequests.filter(request => request.walletBalance !== null && request.walletBalance !== '');

          if (invalidTransferRequests.length > 0) {
              console.error('Failed to remove BudgetStatement: Some Transfer Requests have non-null walletBalance.');
              return;
          }

          // 5. Check if all Line Items have null or empty actual
          const invalidLineItems = lineItems.filter(item => item.actual !== null && item.actual !== '');

          if (invalidLineItems.length > 0) {
              console.error('Failed to remove BudgetStatement: Some Line Items have non-null actual.');
              return;
          }

          // 6. Delete entries from BudgetStatementTransferRequest
          await trx('BudgetStatementTransferRequest')
              .whereIn('id', transferRequestIds)
              .delete();

          // 7. Delete entries from BudgetStatementLineItem
          await trx('BudgetStatementLineItem')
              .whereIn('id', lineItemIds)
              .delete();

          // 8. Delete entries from BudgetStatementWallet
          await trx('BudgetStatementWallet')
              .whereIn('id', walletIds)
              .delete();

          // 9. Delete entries from BudgetStatement
          await trx('BudgetStatement')
              .where('id', bsId)
              .delete();

      console.log(`BudgetStatement deleted for teamId: ${bsId}`);

    });
  } catch (error) {
      console.error('Failed to remove BudgetStatement:', error);
      // Consider appropriate handling here such as retry logic or escalation
  }
}





