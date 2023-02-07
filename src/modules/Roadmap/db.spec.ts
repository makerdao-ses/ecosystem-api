import initApi from "../../initApi";
import { RoadmapModel } from "./db";

let authModel: RoadmapModel;

beforeAll(async () => {
    const apiModules = await initApi({
        Roadmap: { enabled: true, require: ['CoreUnit'] },
        CoreUnit: { enabled: true },
    });
    authModel = apiModules.datasource.module<RoadmapModel>("Roadmap")
})

afterAll(async () => { await authModel.knex.destroy() })


it('return a list of roadmaps', async () => {
    const entry = await authModel.getRoadmaps(undefined);
    expect(entry.length).toBeGreaterThan(0);
});

it('returns a list of roadmaps under a coreUnit id', async () => {
    const entry = await authModel.getRoadmaps('ownerCuId', 1);
    expect(entry.length).toBeGreaterThan(0);
})

it('returns a list of roadmapStakeholders', async () => {
    const entry = await authModel.getRoadmapStakeholders(undefined);
    expect(entry.length).toBeGreaterThan(0);
});

it('returns a list of roadmapStakeholders with roadmapId', async () => {
    const entry = await authModel.getRoadmapStakeholders('roadmapId', 0);
    expect(entry.length).toBeGreaterThan(0);
});

it('returns a list of stakeholderRoles', async () => {
    const entry = await authModel.getStakeholderRoles(undefined);
    expect(entry.length).toBeGreaterThan(0)
});

it('returns stakeholder role searched by ID or by name', async () => {
    const entry = await authModel.getStakeholderRoles('id', 0);
    const entry1 = await authModel.getStakeholderRoles('stakeholderRoleName', 'Facilitator');
    expect(entry.length).toBeGreaterThan(0)
    expect(entry1.length).toBeGreaterThan(0)
});

it('returns list of stakeholders with and without ID param', async () => {
    const entry = await authModel.getStakeholders(undefined);
    const entry1 = await authModel.getStakeholders('id', 1);
    expect(entry.length).toBeGreaterThan(0)
    expect(entry1.length).toBeGreaterThan(0)
});

it('returns list of roadmapOutputs with ID and undefined param', async () => {
    const entry = await authModel.getRoadmapOutputs(undefined);
    const entry1 = await authModel.getRoadmapOutputs('0');
    expect(entry.length).toBeGreaterThan(0)
    expect(entry1.length).toBeGreaterThan(0)
});

it('returns list of roadmapOutputs with outputId', async () => {
    const entry = await authModel.getRoadmapOutput('outputId', '0');
    expect(entry.length).toBeGreaterThan(0);
});

it('returns list of outputs with id or undefined param', async () => {
    const entry = await authModel.getOutputs(undefined);
    const entry1 = await authModel.getOutputs('id', 0);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of outputTypes with ID or undefined params', async () => {
    const entry = await authModel.getOutputTypes(undefined);
    const entry1 = await authModel.getOutputTypes('id', 0);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of milestones with id or undefined param', async () => {
    const entry = await authModel.getMilestones(undefined);
    const entry1 = await authModel.getMilestones('roadmapId', 0);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of tasks with ID or undefined param', async () => {
    const entry = await authModel.getTasks(undefined);
    const entry1 = await authModel.getTasks('id', 0);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of tasks with completedPercentage 100', async () => {
    const entry = await authModel.getTasks('completedPercentage', 100);
    expect(entry[0].completedPercentage).toEqual("100");
});

it('returns list of reviews with taskId or undefined params', async () => {
    const entry = await authModel.getReviews(undefined);
    const entry1 = await authModel.getReviews('0');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns a review by reviewOutcome green', async () => {
    const entry = await authModel.getReview('reviewOutcome', 'Green');
    expect(entry[0].reviewOutcome).toEqual("Green");
});