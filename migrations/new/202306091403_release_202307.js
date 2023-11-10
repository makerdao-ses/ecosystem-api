// Up migration that creates AlignemtScope and ContributorTeam_AlignementScope tables

export async function up(knex) {
  console.log(
    "Creating AlignmentScope and ContributorTeam_AlignmentScope tables...",
  );

  await knex.schema.createTable("AlignmentScope", (table) => {
    table.increments("id").primary();
    table.string("code").notNullable();
    table.string("name").notNullable();
  });

  await knex("AlignmentScope").insert([
    { code: "SUP", name: "Support Scope" },
    { code: "GOV", name: "Governance Scope" },
    { code: "STA", name: "Stability Scope" },
    { code: "ACC", name: "Accessibility Scope" },
    { code: "PRO", name: "Protocol Scope" },
  ]);

  await knex.schema.createTable("ContributorTeam_AlignmentScope", (table) => {
    table.increments("id").primary();
    table.integer("teamId").notNullable().references("id").inTable("CoreUnit");
    table
      .integer("scopeId")
      .notNullable()
      .references("id")
      .inTable("AlignmentScope");
  });
}

// Down migration that drops the AlignmentScope and ContributorTeam_AlignmentScope tables

export async function down(knex) {
  // Drop the ContributorTeam_AlignmentScope table
  await knex.schema.dropTable("ContributorTeam_AlignmentScope");

  // Drop the AlignmentScope table
  await knex.schema.dropTable("AlignmentScope");
}
