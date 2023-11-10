import knex from "knex";

export async function up(knex) {
  await knex.schema
    // The ResolverCache table will store the results of expensive reporting queries
    .createTable("ResolverCache", function (table) {
      console.log("Creating the ResolverCache table...");
      // Hash of the cache keys
      table
        .string("hash", "59a01e18efab5552".length)
        .unique({ indexName: "resolvercache_unique_hash" });
      // When the cache entry expires
      table.timestamp("expiry", { useTz: false });
      // The cached data
      table.json("data");
    });
}

//Down migration reverts the up migration change
export async function down(knex) {
  console.log("Dropping the ResolverCache table... ");
  await knex.schema.dropTable("ResolverCache");
}
