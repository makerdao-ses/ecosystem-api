import initApi from "../../initApi";
import { CoreUnitModel } from "./db";

async function getCoreUnitModel(): Promise<CoreUnitModel> {
    const apiModule = await initApi({
        CoreUnit: { enabled: true }
    });

    const db = apiModule.datasource;
    return db.module<CoreUnitModel>('CoreUnit');
};

it('returns list of CUs with limit offset and undefined params', async () => {
    const model = await getCoreUnitModel();
    const filter = { limit: 10, offset: 1 }
    const entry = await model.getCoreUnits(filter);
    const entry1 = await model.getCoreUnits({});
    expect(entry.length).toEqual(10);
    expect(entry1.length).toBeGreaterThan(0)
});

it('return a coreUnit with shortCode SES', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getCoreUnit('shortCode', "SES");
    expect(entry[0].shortCode).toEqual('SES');
});

it('returns list of CuUpdates with cuId and undefined param', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getCuUpdates({});
    const entry1 = await model.getCuUpdates({ cuId: 39 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of socialMediaChannels with cuId or undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getSocialMediaChannels(undefined);
    const entry1 = await model.getSocialMediaChannels('1');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of contributor commitments widh cuId and undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getContributorCommitments(undefined);
    const entry1 = await model.getContributorCommitments('1')
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns contributor commitment with cu Id 1', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getContributorCommitment('cuId', '1');
    expect(entry[0].cuId).toEqual(1)
});

it('returns list of cuGithubContributions with cuId and undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getCuGithubContributions(undefined);
    const entry1 = await model.getCuGithubContributions('1');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of cuGithubContributions with orgId 0', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getCuGithubContribution('orgId', '0');
    expect(entry.length).toBeGreaterThan(0);
});

it('returns list of contributors with limit offset and undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getContributors(undefined, undefined);
    const entry1 = await model.getContributors(10, 1);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns contributor with name Jack', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getContributor('name', "Jack");
    expect(entry[0].name).toEqual('Jack');
});

it('returns list of githubOrgs with id and undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getGithubOrgs(undefined);
    const entry1 = await model.getGithubOrgs('0');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns githubOrg with org: makerdao-ses', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getGithubOrg('org', 'makerdao-ses');
    expect(entry[0].org).toEqual('makerdao-ses');
});

it('returns list of githubRepos with id and undefined params', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getGithubRepos(undefined);
    const entry1 = await model.getGithubRepos('0');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns githubRepo with name spreadsheet-to-md', async () => {
    const model = await getCoreUnitModel();
    const entry = await model.getGithubRepo('repo', 'spreadsheet-to-md');
    expect(entry[0].repo).toEqual('spreadsheet-to-md');
});

// TODO
// makergithubEcosystem, no DB input