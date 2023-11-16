import knex from "knex";
//Migration sets the Core Unit Auditor Role System value to true

//Up migration creates the new table
export async function up(knex) {
  await knex("Role")
    .where("roleName", "CoreUnitAuditor")
    .update({ system: true });
}

//Down migration reverts the up migration change
export async function down(knex) {
  await knex("Role")
    .where("roleName", "CoreUnitAuditor")
    .update({ system: null });
}
