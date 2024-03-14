export async function up(knex) {
  await knex.raw(`
    ALTER TABLE "CoreUnit"
    ADD COLUMN status "MipStatus" DEFAULT 'Accepted'
`);

  // Populate status for specific rows
  const rows = await knex.raw(`
        SELECT DISTINCT cu.id, cu.code 
        FROM "CoreUnit" AS cu 
        JOIN "CuMip" AS mc ON mc."cuId" = cu.id 
        WHERE UPPER(mc."mipCode") LIKE '%MIP39C3%' OR cu.code = 'MKT-001'
    `);

  const obsoleteRows = rows.rows.map((row) => row.id);

  await knex("CoreUnit")
    .whereIn("id", obsoleteRows)
    .update("status", "Obsolete");
}

export async function down(knex) {
  await knex.schema.table("CoreUnit", function (table) {
    table.dropColumn("status");
  });
}
