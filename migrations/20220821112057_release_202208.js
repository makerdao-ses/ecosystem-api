//Up migration creates Core Unit and all root tables

export function up(knex) {
  return knex.schema

    .createTable("CoreUnit", function (table) {
      console.log("Creating Core Unit table...");
      table.increments("id").primary();
      table.string("code").notNullable();
      table.string("shortCode").notNullable();
      table.string("name").notNullable();
      table.string("image");
      table.text("sentenceDescription");
      table.text("paragraphDescription");
      table.string("paragraphImage");
    })

    .createTable("CuMip", function (table) {
      console.log("Creating CUMip table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.string("mipCode").notNullable();
      table.string("mipTitle").notNullable();
      table.date("rfc");
      table.date("formalSubmission");
      table.date("accepted");
      table.date("rejected");
      table.date("obsolete");
      table
        .enu(
          "mipStatus",
          [
            "RFC",
            "Formal Submission",
            "Accepted",
            "Rejected",
            "Obsolete",
            "Withdrawn",
          ],
          {
            useNative: true,
            enumName: "MipStatus",
          },
        )
        .notNullable();
      table.string("mipUrl");
      table.string("forumUrl");
    })

    .createTable("BudgetStatement", function (table) {
      console.log("Creating BudgetStatement table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.date("month").notNullable();
      table.text("comments");
      table.string("publicationUrl");
      table.string("cuCode").notNullable();
      table.enu(
        "budgetStatus",
        ["Draft", "SubmittedToAuditor", "AwaitingCorrections", "Final"],
        {
          useNative: true,
          enumName: "BudgetStatus",
        },
      );
      table.decimal("mkrProgramLength", 4, 2);
    })

    .createTable("SocialMediaChannels", function (table) {
      console.log("Creating SocialMediaChannel table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.string("forumTag");
      table.string("twitter");
      table.string("youtube");
      table.string("discord");
      table.string("linkedin");
      table.string("website");
      table.string("github");
    })

    .createTable("Contributor", function (table) {
      console.log("Creating Contributor table...");
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("forumHandle").notNullable();
      table.string("discordHandle").notNullable();
      table.string("twitterHandle");
      table.string("email");
      table.string("githubUrl");
      table.string("facilitatorImage");
    })

    .createTable("ContributorCommitment", function (table) {
      console.log("Creating ContributorCommitment table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.integer("contributorId").notNullable();
      table
        .foreign("contributorId")
        .references("Contributor.id")
        .onDelete("CASCADE");
      table.date("startDate").notNullable();
      table
        .enu("commitment", ["FullTime", "PartTime", "Variable", "Inactive"], {
          useNative: true,
          enumName: "Commitment",
        })
        .notNullable();
      table.string("title").notNullable();
    })

    .createTable("Roadmap", function (table) {
      console.log("Creating Roadmap table...");
      table.increments("id").primary();
      table.integer("ownerCuId");
      table.foreign("ownerCuId").references("CoreUnit.id").onDelete("CASCADE");
      table.string("roadmapCode");
      table.string("roadmapName").notNullable();
      table
        .enu("roadmapStatus", ["ToDo", "InProgress", "Done"], {
          useNative: true,
          enumName: "RoadmapStatus",
        })
        .notNullable();
      table.text("roadmapSummary");
      table.boolean("strategicInitiative");
      table.text("comments");
    })

    .createTable("CuUpdate", function (table) {
      console.log("Creating CuUpdate table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.string("updateTitle").notNullable();
      table.date("updateDate").notNullable();
      table.string("updateUrl").notNullable();
    })

    .createTable("CuCategory", function (table) {
      console.log("Creating cuCategory table...");
      table.increments("id").primary();
      table.string("category").notNullable();
    })

    .createTable("CoreUnit_CuCategory", function (table) {
      console.log("Creating CoreUnit_CoreUnitCategory table...");
      table.increments("id").primary();
      table.integer("cuId").notNullable();
      table.foreign("cuId").references("CoreUnit.id").onDelete("CASCADE");
      table.integer("cuCategoryId").notNullable();
      table
        .foreign("cuCategoryId")
        .references("CuCategory.id")
        .onDelete("CASCADE");
    });
}

//Down migration deletes Core Unit and all root tables

export function down(knex) {
  console.log(
    "Dropping tables CoreUnit, CuMip, BudgetStatement, SocialMediaChannels, Contributor, ContributorCommitment, Roadmap, CuUpdate...",
  );

  return knex.schema

    .dropTable("CoreUnit_CuCategory")
    .dropTable("CuCategory")
    .dropTable("CuUpdate")
    .dropTable("Roadmap")
    .dropTable("ContributorCommitment")
    .dropTable("Contributor")
    .dropTable("SocialMediaChannels")
    .dropTable("BudgetStatement")
    .dropTable("CuMip")
    .dropTable("CoreUnit")
    .raw('DROP TYPE "BudgetStatus"')
    .raw('DROP TYPE "Commitment"')
    .raw('DROP TYPE "MipStatus"')
    .raw('DROP TYPE "RoadmapStatus"');
}
