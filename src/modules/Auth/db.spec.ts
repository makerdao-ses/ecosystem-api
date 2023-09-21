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

it('userId 1 can update resourceType CoreUnit and resourceId 64', async () => {
    const entry = await authModel.canUpdate(1, 'CoreUnit', 64);
    expect(parseInt(entry[0].count)).toBeGreaterThan(0);
});

it('userId 1 can updateCoreUnit Id 64', async () => {
    const entry = await authModel.canUpdateCoreUnit(1, 'CoreUnit', 64);
    expect(parseInt(entry[0].count)).toBeGreaterThan(0);
});

it('user can manage resourceType', async () => {
    const entry = await authModel.userCanManage({ id: 1 }, 'CoreUnit');
    const entry1 = await authModel.userCanManage(undefined, 'CoreUnit')
    expect(entry).toBeFalsy()
});

it('userId 0 can manage resourceType CoreUnit', async () => {
    const entry = await authModel.canManage(0, 'CoreUnit');
    expect(entry[0].count).toEqual("1");
});

it('user can audit', async () => {
    const entry = await authModel.can(1, 'Update', 'CoreUnit');
    expect(entry[0].resourceId).toEqual(64);
})

it('user can audit', async () => {
    const entry = await authModel.canAudit(4, 'CoreUnit');
    expect(entry[0].resourceId).toEqual(15)
})

it('create user and change password', async () => {
    const entry = await authModel.createUser('testUser', 'testpassword');
    const entry1 = await authModel.changeUserPassword('testUser', 'password');
    await authModel.setActiveFlag(entry.id, true)
    expect(entry.username).toEqual('testUser');
    expect(entry1[0].password).toEqual('password');
    await authModel.userDelete(entry.id)
})

it('get systemRoleMembers', async () => {
    const entry = await authModel.getSystemRoleMembers('CoreUnitFacilitator', 'CoreUnit', 45);
    const entry1 = await authModel.getSystemRoleMembers('CoreUnitAuditor', 'CoreUnit', null);
    expect(entry).toBeInstanceOf(Array)
})

it('gets all users with or without params', async () => {
    const entry = await authModel.getUsers(undefined, undefined);
    const entry1 = await authModel.getUsers('username', 'exampleName');
    expect(entry).toBeInstanceOf(Array);
    expect(entry1[0].username).toEqual('exampleName');
})

it('gets usersFiltered', async () => {
    const entry = await authModel.getUsersFiltered({ id: 1, active: true, rolesAndPermissions: false })
    const entry1 = await authModel.getUsersFiltered({ id: 2, active: true, rolesAndPermissions: true })
    const entry2 = await authModel.getUsersFiltered({ username: 'exampleName', active: true, rolesAndPermissions: true })
    const entry3 = await authModel.getUsersFiltered({ rolesAndPermissions: true, ids: [1, 2] })
    const entry4 = await authModel.getUsersFiltered({ username: "exampleName" })
    expect(entry[0].id).toEqual(1);
})