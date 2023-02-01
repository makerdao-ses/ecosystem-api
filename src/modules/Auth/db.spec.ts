import initApi from "../../initApi";
import { AuthModel } from "./db";

let authModel: AuthModel;

beforeAll(async () => {
    const apiModules = await initApi({
        Auth: { enabled: true }
    });
    authModel = apiModules.datasource.module<AuthModel>("Auth")
})

afterAll(async () => { await authModel.knex.destroy() })

it('returns user with username: exampleName', async () => {
    const entry = await authModel.getUser('username', 'exampleName');
    expect(entry[0].username).toEqual('exampleName')
});

it('returns resourceId with userId 1', async () => {
    const entry = await authModel.getResourceId(0);
    expect(entry[0].resourceId).toEqual(null);
});

it('userId 1 can update resourceType CoreUnit and resourceId 39', async () => {
    const entry = await authModel.canUpdate(1, 'CoreUnit', 39);
    expect(entry[0].count).toEqual("1");
});

it('userId 0 can manage resourceType CoreUnit', async () => {
    const entry = await authModel.canManage(0, 'CoreUnit');
    expect(entry[0].count).toEqual("1");
});