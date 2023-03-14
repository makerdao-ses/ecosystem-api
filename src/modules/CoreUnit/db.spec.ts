import initApi from "../../initApi";
import { CoreUnitModel } from "./db";

let authModel: CoreUnitModel;

beforeAll(async () => {
    const apiModules = await initApi({
        CoreUnit: { enabled: true }
    });
    authModel = apiModules.datasource.module<CoreUnitModel>("CoreUnit")
})

afterAll(async () => { await authModel.knex.destroy() })

it('returns list of CUs with and undefined params', async () => {
    const filter = { limit: 10, offset: 1 }
    const entry = await authModel.getCoreUnits(filter);
    const entry1 = await authModel.getCoreUnits({});
    const entry2 = await authModel.getCoreUnits({ filter: { shortCode: "SES" } });
    const entry3 = await authModel.getCoreUnits({ filter: { id: 1 } });
    const entry4 = await authModel.getCoreUnits({ filter: { code: "SES-001" } });
    const entry5 = await authModel.getCoreUnits({ filter: { name: "Example" } });
    expect(entry.length).toEqual(10);
    expect(entry1.length).toBeGreaterThan(0)
    expect(entry2[0].shortCode).toEqual('SES');
    expect(entry3[0].id).toEqual(1);
    expect(entry4[0].code).toEqual('SES-001');
    expect(entry5[0].name).toEqual('Example');
});

it('returns list of CuUpdates with and undefined params', async () => {
    const entry = await authModel.getCuUpdates({});
    const entry1 = await authModel.getCuUpdates({ id: 1 });
    const entry2 = await authModel.getCuUpdates({ cuId: 1 });
    const entry3 = await authModel.getCuUpdates({ updateTitle: '' });
    const entry4 = await authModel.getCuUpdates({ updateDate: '2022-01-01' });
    const entry5 = await authModel.getCuUpdates({ updateUrl: '' });
    expect(entry.length).toEqual(0);
});

it('returns list of socialMediaChannels with cuId or undefined params', async () => {
    const entry = await authModel.getSocialMediaChannels({});
    const entry1 = await authModel.getSocialMediaChannels({ id: 1 });
    const entry2 = await authModel.getSocialMediaChannels({ cuId: "1" });
    const entry3 = await authModel.getSocialMediaChannels({ forumTag: "" });
    const entry4 = await authModel.getSocialMediaChannels({ twitter: "1" });
    const entry5 = await authModel.getSocialMediaChannels({ youtube: "1" });
    const entry6 = await authModel.getSocialMediaChannels({ discord: "1" });
    const entry7 = await authModel.getSocialMediaChannels({ linkedIn: "1" });
    const entry8 = await authModel.getSocialMediaChannels({ website: "1" });
    const entry9 = await authModel.getSocialMediaChannels({ github: "1" });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry2.length).toBeGreaterThan(0);
});

it('returns contributor commitment with or no params', async () => {
    const entry0 = await authModel.getContributorCommitments({});
    const entry = await authModel.getContributorCommitments({ id: 1 });
    const entry1 = await authModel.getContributorCommitments({ cuId: 1 });
    const entry2 = await authModel.getContributorCommitments({ contributorId: 1 });
    const entry3 = await authModel.getContributorCommitments({ startDate: '2022-01-01' });
    const entry4 = await authModel.getContributorCommitments({ commitment: 'FullTime' });
    const entry5 = await authModel.getContributorCommitments({ cuCode: 'SES-001' });
    const entry6 = await authModel.getContributorCommitments({ jobTitle: 'supremeLord' });
    expect(entry1[0].cuId).toEqual(1)
});

it('returns list of cuGithubContributions with cuId and undefined params', async () => {
    const entry = await authModel.getCuGithubContributions(undefined);
    const entry1 = await authModel.getCuGithubContributions({ cuId: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of cuGithubContributions with and no params', async () => {
    const entry = await authModel.getCuGithubContributions({});
    const entry1 = await authModel.getCuGithubContributions({ id: 1 });
    const entry2 = await authModel.getCuGithubContributions({ cuId: 1 });
    const entry3 = await authModel.getCuGithubContributions({ orgId: 0 });
    const entry4 = await authModel.getCuGithubContributions({ repoId: 0 });
    expect(entry.length).toBeGreaterThan(0);
});

it('returns list of contributors with and no params', async () => {
    const entry = await authModel.getContributors({});
    const entry1 = await authModel.getContributors({ limit: 10, offset: 1 });
    const entry2 = await authModel.getContributors({ filter: { id: 1 } });
    const entry3 = await authModel.getContributors({ filter: { name: "Payton" } });
    const entry5 = await authModel.getContributors({ filter: { forumHandle: "@" } });
    const entry6 = await authModel.getContributors({ filter: { discordHandle: "@" } });
    const entry7 = await authModel.getContributors({ filter: { twitterHandle: "@" } });
    const entry8 = await authModel.getContributors({ filter: { email: "a@a.as" } });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of githubOrgs with and no params', async () => {
    const entry = await authModel.getGithubOrgs({});
    const entry1 = await authModel.getGithubOrgs({ id: 0 });
    const entry2 = await authModel.getGithubOrgs({ org: 'makerdao-ses' });
    const entry3 = await authModel.getGithubOrgs({ githubUrl: '' });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});


it('returns list of githubRepos with id and undefined params', async () => {
    const entry = await authModel.getGithubRepos({});
    const entry1 = await authModel.getGithubRepos({ id: 0 });
    const entry2 = await authModel.getGithubRepos({ repo: '' });
    const entry3 = await authModel.getGithubRepos({ githubUrl: '' });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of githubEcosystem with or no params', async () => {
    const entry = await authModel.getMakerGithubEcosystemAll();
    const entry1 = await authModel.getMakerGithubEcosystemAll({ id: 1 });
    const entry4 = await authModel.getMakerGithubEcosystemAll({ date: '2022-01-01' });
    const entry5 = await authModel.getMakerGithubEcosystemAll({ url: '' });
    const entry6 = await authModel.getMakerGithubEcosystemAll({ org: 1 });
    const entry7 = await authModel.getMakerGithubEcosystemAll({ repo: 1 });
    const entry8 = await authModel.getMakerGithubEcosystemAll({ uniqueContributors: 1 });
    const entry9 = await authModel.getMakerGithubEcosystemAll({ commits4w: 1 });
    const entry10 = await authModel.getMakerGithubEcosystemAll({ totalStars: 2 });
    expect(entry.length).toBe(0);
});