import initApi from "../../initApi";
import { AuthModel } from "./db";

async function getAuthModel(): Promise<AuthModel> {
    const apiModules = await initApi({
        Auth: { enabled: true }
    });

    const db = apiModules.datasource;
    return db.module<AuthModel>('Auth');
};

it('returns user with username: exampleName', async () => {
    const model = await getAuthModel();
    const entry = await model.getUser('username', 'exampleName');
    expect(entry[0].username).toEqual('exampleName')
});

it('returns resourceId with userId 1', async () => {
    const model = await getAuthModel();
    const entry = await model.getResourceId(1);
    expect(entry[0].resourceId).toEqual(39);
});

it('userId 39 can update resourceType CoreUnit and resourceId 39', async () => {
    const model = await getAuthModel();
    const entry = await model.canUpdate(1, 'CoreUnit', 39);
    expect(entry[0].count).toEqual("1");
});

it('userId 0 can manage resourceType CoreUnit', async () => {
    const model = await getAuthModel();
    const entry = await model.canManage(0, 'CoreUnit');
    expect(entry[0].count).toEqual("1");
});