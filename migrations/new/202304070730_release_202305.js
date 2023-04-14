//Up migration adds the renames DelegatesAudit and alters system value...
export async function up(knex) {

  console.log("Updating system value for DelegatesAudit role...");

  // Rename DelegatesAudit role to DelegatesAuditor
  await knex('Role').where({ roleName: 'DelegatesAudit' }).update({ roleName: 'DelegatesAuditor' });
  // Set system value to true for DelegatesAuditor role
  await knex('Role').where({ roleName: 'DelegatesAuditor' }).update({ system: true });
}

//Down migration reverts the up migration change
export async function down(knex) {

  console.log('Reverting the change made DelegatesAudit role...');

  // Set system value to false for DelegatesAuditor role
  await knex('Role').where({ roleName: 'DelegatesAuditor' }).update({ system: false });
  // Rename DelegatesAuditor role back to DelegatesAudit
  await knex('Role').where({ roleName: 'DelegatesAuditor' }).update({ roleName: 'DelegatesAudit' });

}