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

it('returns list of CUs with limit offset and undefined params', async () => {
    const filter = { limit: 10, offset: 1 }
    const entry = await authModel.getCoreUnits(filter);
    const entry1 = await authModel.getCoreUnits({});
    expect(entry.length).toEqual(10);
    expect(entry1.length).toBeGreaterThan(0)
});

it('return a coreUnit with shortCode SES', async () => {
    const entry = await authModel.getCoreUnits({ filter: { shortCode: "SES" } });
    expect(entry[0].shortCode).toEqual('SES');
});

it('returns list of CuUpdates with cuId and undefined param', async () => {
    const entry = await authModel.getCuUpdates({});
    expect(entry.length).toEqual(0);
});

it('returns list of socialMediaChannels with cuId or undefined params', async () => {
    const entry = await authModel.getSocialMediaChannels({});
    const entry1 = await authModel.getSocialMediaChannels({ cuId: "1" });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of contributor commitments widh cuId and undefined params', async () => {
    const entry = await authModel.getContributorCommitments({});
    const entry1 = await authModel.getContributorCommitments({ cuCode: "SES-001" })
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns contributor commitment with cu Id 1', async () => {
    const entry = await authModel.getContributorCommitments({ cuId: 1 });
    expect(entry[0].cuId).toEqual(1)
});

it('returns list of cuGithubContributions with cuId and undefined params', async () => {
    const entry = await authModel.getCuGithubContributions(undefined);
    const entry1 = await authModel.getCuGithubContributions({ cuId: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of cuGithubContributions with orgId 0', async () => {
    const entry = await authModel.getCuGithubContributions({ orgId: 0 });
    expect(entry.length).toBeGreaterThan(0);
});

it('returns list of contributors with limit offset and undefined params', async () => {
    const entry = await authModel.getContributors({});
    const entry1 = await authModel.getContributors({ limit: 10, offset: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns contributor with name Jack', async () => {
    const entry = await authModel.getContributors({ filter: { name: "Jack" } });
    expect(entry[0].name).toEqual('Jack');
});

it('returns list of githubOrgs with id and undefined params', async () => {
    const entry = await authModel.getGithubOrgs({});
    const entry1 = await authModel.getGithubOrgs({ id: 0 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns githubOrg with org: makerdao-ses', async () => {
    const entry = await authModel.getGithubOrgs({ org: 'makerdao-ses' });
    expect(entry[0].org).toEqual('makerdao-ses');
});

it('returns list of githubRepos with id and undefined params', async () => {
    const entry = await authModel.getGithubRepos({});
    const entry1 = await authModel.getGithubRepos({ id: 0 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns githubRepo with name spreadsheet-to-md', async () => {
    const entry = await authModel.getGithubRepo('repo', 'spreadsheet-to-md');
    expect(entry[0].repo).toEqual('spreadsheet-to-md');
});

// TODO
// makergithubEcosystem, no DB input