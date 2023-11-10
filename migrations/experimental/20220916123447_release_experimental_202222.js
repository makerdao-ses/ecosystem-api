//Creation of the independent tables

export function up(knex) {
  return knex.schema

    .createTable("GitHubOrg", function (table) {
      console.log("Creating GitHubOrg table...");
      table.increments("id").primary();
      table.varchar("org").notNullable();
      table.varchar("gitHubUrl").notNullable();
    })

    .createTable("GitHubRepo", function (table) {
      console.log("Creating GitHubRepo table...");
      table.increments("id").primary();
      table.integer("orgId").notNullable();
      table.foreign("orgId").references("GitHubOrg.id").onDelete("CASCADE");
      table.varchar("repo").notNullable();
      table.varchar("gitHubUrl").notNullable();
    })

    .createTable("CUGithubContribution", function (table) {
      console.log("Creating CUGithubContribution table...");
      table.varchar("id").primary().notNullable();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.integer("orgId").notNullable();
      table.foreign("orgId").references("GitHubOrg.id").onDelete("CASCADE");
      table.integer("repoId").notNullable();
      table.foreign("repoId").references("GitHubRepo.id").onDelete("CASCADE");
    })

    .createTable("MakerGithubEcosystem", function (table) {
      console.log("Creating MakerGithubEcosystem table...");
      table.increments("id").primary();
      table.integer("gitHubRepoId").notNullable();
      table
        .foreign("gitHubRepoId")
        .references("GitHubRepo.id")
        .onDelete("CASCADE");
      table.date("date").notNullable();
      table.varchar("url").notNullable();
      table.varchar("org").notNullable();
      table.varchar("repo").notNullable();
      table.integer("uniqueContributors").notNullable();
      table.integer("commits4w").notNullable();
      table.integer("totalStars").notNullable();
    })

    .createTable("MakerDeveloperActivity", function (table) {
      console.log("Creating MakerDeveloperActivity table...");
      table.date("month").primary();
      table.integer("totalRepos").notNullable();
      table.integer("monthlyActiveDevs").notNullable();
      table.integer("monthlyCommits").notNullable();
      table.integer("totalContributors").notNullable();
      table.integer("totalStars").notNullable();
    })

    .createTable("EcosystemDevActivity", function (table) {
      console.log("Creating EcosystemDevActivity table...");
      table.increments("id").primary();
      table.varchar("project").notNullable();
      table.integer("averageMonthlyDevs").notNullable();
      table.float("tvl").notNullable();
    })

    .createTable("MonthlyDevActivity", function (table) {
      console.log("Creating MonthlyDevActivity table...");
      table.increments("id").primary();
      table.integer("ecosystemDevActivityId").notNullable();
      table
        .foreign("ecosystemDevActivityId")
        .references("EcosystemDevActivity.id")
        .onDelete("CASCADE");
      table.date("month").notNullable();
      table.integer("monthlyActiveDevs").notNullable();
      table.integer("commits4w").notNullable();
    })

    .createTable("RolePermission", function (table) {
      console.log("Creating RolePermission table...");
      table.increments("id").primary();
      table.integer("roleId").notNullable();
      table.foreign("roleId").references("Role.id").onDelete("CASCADE");
      table
        .enu("permission", ["Create", "Update", "Delete", "Audit", "Manage"], {
          useNative: true,
          enumName: "Permission",
        })
        .notNullable();
      table.integer("resourceId").notNullable();
    });
}

export function down(knex) {
  console.log("Dropping tables ViewDataCache and BudgetToolVersion tables...");

  return knex.schema

    .dropTable("RolePermission")
    .dropTable("UserRole")
    .dropTable("Role")
    .dropTable("User")
    .dropTable("BudgetToolVersion")
    .dropTable("ViewDataCache")
    .raw('DROP TYPE "Resource"')
    .raw('DROP TYPE "Permission"');
}
