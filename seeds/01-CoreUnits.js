/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("CoreUnit").delete();
  await knex("CuMip").delete();
  await knex("BudgetStatement").delete();
  await knex("SocialMediaChannels").delete();
  await knex("Contributor").delete();
  await knex("ContributorCommitment").delete();
  await knex("Roadmap").delete();
  await knex("CuUpdate").delete();

  await knex("CoreUnit").insert([
    {
      id: 0,
      code: "EXA-001",
      shortCode: "EXA",
      name: "Example",
      image:
        "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/03/02/11/screen-shot-2018-03-02-at-12.23.53.png?quality=75&width=982&height=726&auto=webp",
      sentenceDescription: "This core unit is an example entry",
      paragraphDescription:
        "The core unit does example activities such as building examples",
      paragraphImage: "https://www.wikihow.com/Write-a-Paragraph",
    },
    {
      code: "WAR-001",
      shortCode: "WAR",
      name: "Warroom",
      image:
        "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/03/02/11/screen-shot-2018-03-02-at-12.23.53.png?quality=75&width=982&height=726&auto=webp",
      category: "{Technical, Operational}",
      sentenceDescription: "This core unit is an example entry",
      paragraphDescription:
        "The core unit does example activities such as building examples",
      paragraphImage: "https://www.wikihow.com/Write-a-Paragraph",
    },
  ]);

  await knex("CuMip").insert([
    {
      cuId: 0,
      mipCode: "MIP39c2SP1",
      mipTitle: "Adding RWF Core Unit",
      rfc: "08-07-2022",
      mipStatus: "RFC",
      mipUrl: "https://mips.makerdao.com/mips/details/MIP39c2SP1",
      forumUrl:
        "https://forum.makerdao.com/t/mip39c2-sp1-adding-core-unit-real-world-finance/6224",
    },
    {
      cuId: 1,
      mipCode: "MIP39c2SP1",
      mipTitle: "Adding War Core Unit",
      rfc: "08-07-2022",
      mipStatus: "RFC",
      mipUrl: "https://mips.makerdao.com/mips/details/MIP39c2SP1",
      forumUrl:
        "https://forum.makerdao.com/t/mip39c2-sp1-adding-core-unit-real-world-finance/6224",
    },
  ]);

  await knex("BudgetStatement").insert([
    {
      cuId: 0,
      cuCode: "EXA",
      month: "03-01-2022",
      comments: "This is the first budget statement for the Example Core Unit",
      budgetStatus: "Draft",
      publicationUrl: "https://mips.makerdao.com/mips/details/MIP39c2SP1",
      mkrProgramLength: 2,
    },
    {
      cuId: 1,
      cuCode: "WAR",
      month: "08-01-2022",
      comments: "This is the first budget statement for the Example Core Unit",
      budgetStatus: "SubmittedToAuditor",
      publicationUrl: "https://mips.makerdao.com/mips/details/MIP39c2SP1",
      mkrProgramLength: 3.5,
    },
  ]);

  await knex("SocialMediaChannels").insert([
    {
      cuId: 0,
      forumTag: "EXA-001",
      twitter: "",
      youtube: "",
      discord: "",
      linkedin: "https://linkedin.com/EXA",
      website: "www.example.com",
      github: "https://github.com/EXA",
    },
    {
      cuId: 1,
      forumTag: "WAR-001",
      twitter: "@WARroom",
      youtube: "https://youtube.com/TheWarrooms",
      discord: "",
      linkedin: "https://linkedin.com/WAR",
      website: "",
      github: "https://github.com/WAR",
    },
  ]);

  await knex("Contributor").insert([
    {
      name: "John Doe",
      forumHandle: "doeJohn",
      discordHandle: "doeJohn#2313",
      twitterHandle: "@doeJohn",
      email: "Johnathon@gmail.com",
      githubUrl: "https://github.com/EXA",
      facilitatorImage: "www.exampleImage.com",
    },
    {
      name: "Jane Deer",
      forumHandle: "deerJane",
      discordHandle: "deerJ#2411",
      twitterHandle: "@deerJ",
      email: "Jane@gmail.com",
      githubUrl: "https://github.com/EXA",
      facilitatorImage: "www.exampleImage.com",
    },
  ]);

  await knex("ContributorCommitment").insert([
    {
      cuId: 0,
      contributorId: 1,
      startDate: "01-01-2022",
      commitment: "FullTime",
      title: "Leader of the Examples",
    },
    {
      cuId: 1,
      contributorId: 2,
      startDate: "10-01-2022",
      commitment: "PartTime",
      title: "Subordinate of the war room",
    },
  ]);

  await knex("Roadmap").insert([
    {
      ownerCuId: 0,
      roadmapCode: "EXA-22-Q1-O1",
      roadmapName: "First objective of 2022 for Example CU",
      roadmapStatus: "ToDo",
      roadmapSummary: "An objective that aims to accomplish xyz through abc",
      strategicInitiative: false,
      comments: "",
    },
    {
      ownerCuId: 1,
      roadmapCode: "WAR-22-Q3-O1",
      roadmapName: "Takeover the periphery",
      roadmapStatus: "InProgress",
      roadmapSummary: "The aim is to overwhelm the enemy",
      strategicInitiative: true,
      comments: "",
    },
  ]);

  await knex("CuUpdate").insert([
    {
      cuId: 1,
      updateTitle: "Roadmap update for Q2 - EXA-001",
      updateDate: "04-01-2022",
      updateUrl:
        "https://forum.makerdao.com/t/monthly-core-unit-updates-july-2022/16954",
    },
    {
      cuId: 1,
      updateTitle: "Roadmap update for 2022 - WAR-001",
      updateDate: "01-12-2022",
      updateUrl:
        "https://forum.makerdao.com/t/monthly-core-unit-updates-july-2022/16954",
    },
  ]);

  await knex("CuCategory").insert([
    { category: "Technical" },
    { category: "Operational" },
    { category: "Business" },
    { category: "RWAs" },
    { category: "Growth" },
    { category: "Finance" },
    { category: "Legal" },
  ]);

  await knex("CoreUnit_CuCategory").insert([
    { cuId: 0, cuCategoryId: 1 },
    { cuId: 1, cuCategoryId: 1 },
    { cuId: 1, cuCategoryId: 2 },
  ]);
}
