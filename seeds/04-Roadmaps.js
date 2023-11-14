/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("Stakeholder").del();
  await knex("StakeholderRole").del();
  await knex("RoadmapStakeholder").del();
  await knex("Output").del();
  await knex("OutputType").del();
  await knex("RoadmapOutput").del();
  await knex("Task").del();
  await knex("Review").del();
  await knex("Milestone").del();

  await knex("Stakeholder").insert([
    {
      name: "Colonel Sanders",
      stakeholderContributorId: 1,
      stakeholderCuId: 1,
    },
    { name: "Example", stakeholderContributorId: 2, stakeholderCuId: 0 },
  ]);

  await knex("StakeholderRole").insert([
    { stakeholderRoleName: "Captain of the Ship" },
    { stakeholderRoleName: "Facilitator" },
  ]);

  await knex("RoadmapStakeholder").insert([
    { stakeholderId: 1, roadmapId: 1, stakeholderRoleId: 1 },
    { stakeholderId: 2, roadmapId: 2, stakeholderRoleId: 2 },
  ]);

  await knex("Output").insert([
    {
      name: "Sample documentation",
      outputUrl: "www.google.com/docs",
      outputDate: "01-14-2022",
    },
    {
      name: "Folder of information",
      outputUrl: "www.google.com/folders",
      outputDate: "02-24-2019",
    },
  ]);

  await knex("OutputType").insert([
    { outputType: "status update" },
    { outputType: "presentation" },
  ]);

  await knex("RoadmapOutput").insert([
    { outputId: 1, outputTypeId: 1 },
    { outputId: 2, outputTypeId: 2 },
  ]);

  await knex("Task").insert([
    {
      taskName: "Write up the documentation",
      taskStatus: "Backlog",
      ownerStakeholderId: 1,
      startDate: "01-01-2001",
      position: 3,
      target: "01-01-2100",
      completedPercentage: 85,
      confidenceLevel: "High",
      comments: "I think this might be finished in time",
    },
    {
      parentId: 1,
      taskName: "Write up the documentation",
      taskStatus: "Backlog",
      ownerStakeholderId: 1,
      startDate: "01-01-2001",
      position: 3,
      target: "01-01-2100",
      completedPercentage: 85,
      confidenceLevel: "High",
      comments: "I think this might be finished in time",
    },
  ]);

  await knex("Review").insert([
    {
      taskId: 1,
      reviewDate: "01-05-2022",
      reviewOutcome: "Yellow",
      comments: "This is not up to scratch",
    },
    {
      taskId: 2,
      reviewDate: "01-08-2022",
      reviewOutcome: "Green",
      comments: "LGTM",
    },
  ]);

  await knex("Milestone").insert([
    { roadmapId: 1, taskId: 1 },
    { roadmapId: 1, taskId: 2 },
  ]);
}
