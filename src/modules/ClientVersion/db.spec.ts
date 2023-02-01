import initApi from "../../initApi";
import { ClientVersionModel } from "./db";

let authModel: ClientVersionModel;

beforeAll(async () => {
    const apiModules = await initApi({
        ClientVersion: { enabled: true }
    });
    authModel = apiModules.datasource.module<ClientVersionModel>("ClientVersion")
})

afterAll(async () => { await authModel.knex.destroy() })

it('returns the last budget tool version', async () => {
    const entry = await authModel.getLatestBudgetToolVersion();
    expect(entry[0]['version'].length).toBe(5);
});

it('returns an array of budget tool version objects', async () => {
    const entry = await authModel.getBudgetToolVersions();
    expect(entry.length).toBeGreaterThan(0)
})
