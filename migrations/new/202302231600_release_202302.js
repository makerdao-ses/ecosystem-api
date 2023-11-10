//Up migration adds Delegates to ResourceType and adds the Role DelegatesAdmin
export async function up(knex) {
  console.log("Adding Delegates to ResourceType");
  await knex.schema.raw(`
  ALTER TYPE "ResourceType" ADD VALUE 'Delegates';
  COMMIT;
`);

  await knex("Role").insert({
    roleName: "DelegatesAdmin",
  });
}

//Down migration reverts the up migration change
export async function down(knex) {
  //Revert ResourceType to original values
  await knex.schema.raw(`
  CREATE TYPE new_ResourceType AS ENUM ('System', 'CoreUnit');

  ALTER TABLE "RolePermission" ALTER COLUMN resource TYPE new_ResourceType 
      USING resource::text::new_ResourceType;

  ALTER TABLE "UserRole" ALTER COLUMN resource TYPE new_ResourceType 
      USING resource::text::new_ResourceType;

  DROP TYPE "ResourceType";

  ALTER TYPE new_ResourceType RENAME TO "ResourceType";
  
`);

  await knex("Role").where("roleName", "=", "DelegatesAdmin").delete();
}
