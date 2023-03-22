import initApi from "../../initApi";
import { ChangeTrackingModel } from "./db";

let authModel: ChangeTrackingModel;

beforeAll(async () => {
    const apiModules = await initApi({
        ChangeTracking: { enabled: true, require: ['CoreUnit'] },
        CoreUnit: { enabled: true }
    });
    authModel = apiModules.datasource.module<ChangeTrackingModel>("ChangeTracking")
})

afterAll(async () => { await authModel.knex.destroy() })

it('returns a change tracking event as last activity of a core unit', async () => {
    const entry = await authModel.getCoreUnitLastActivity('11');

    expect(entry?.event).toMatch(/CU_BUDGET_STATEMENT/);
});

it('returns a string ID for Core Unit-related events', async () => {
    const entry = await authModel.getCoreUnitLastActivity('11');

    expect(entry?.event).toMatch(/CU_BUDGET_STATEMENT/);
    expect(typeof (entry?.params as any).coreUnit.id).toBe('number');
});

it('get bsEvent', async () => {
    const entry = await authModel.getBsEvents('1');
    expect(entry[0].params.budgetStatementId).toEqual(1)
});

it('creates budgetStatementCreated event', async () => {
    const [cu] = await authModel.knex('CoreUnit').where('shortCode', 'EXA');
    const [bs] = await authModel.knex('BudgetStatement').where('ownerId', cu.id).limit(1)
    await authModel.coreUnitBudgetStatementCreated(cu.id, cu.cuCode, cu.shortCode, bs.id, bs.month)
    const [activity] = await authModel.knex('ChangeTrackingEvents').orderBy('id', 'desc').limit(1);
    await authModel.knex('ChangeTrackingEvents').where('id', activity?.id).del()
    await authModel.knex('ChangeTrackingEvents_Index').where('eventId', activity?.id).del()
});

it('creates budgetStatementUpdated event', async () => {
    const [cu] = await authModel.knex('CoreUnit').where('shortCode', 'EXA');
    const [bs] = await authModel.knex('BudgetStatement').where('ownerId', cu.id).limit(1);
    await authModel.coreUnitBudgetStatementUpdated(cu.id, cu.cuCode, cu.shortCode, bs.id, bs.month);
    const [activity] = await authModel.knex('ChangeTrackingEvents').orderBy('id', 'desc').limit(1);
    await authModel.knex('ChangeTrackingEvents').where('id', activity?.id).del();
    await authModel.knex('ChangeTrackingEvents_Index').where('eventId', activity?.id).del();
    expect(activity.params.coreUnit.id).toEqual(cu.id);
});

it('creates budgetStatementCommentUpdate event', async () => {
    const [bsEvent] = await authModel.getBsEvents('1');
    await authModel.budgetStatementCommentUpdate(
        'test description',
        bsEvent.params.coreUnit.id,
        bsEvent.params.coreUnit.code,
        bsEvent.params.coreUnit.shortCode,
        bsEvent.params.budgetStatementId,
        bsEvent.params.month,
        '1',
        'exampleName',
        bsEvent.params.commentId,
        bsEvent.params.status.old,
        bsEvent.params.status.old,
    );
    const [activity] = await authModel.knex('ChangeTrackingEvents').orderBy('id', 'desc').limit(1);
    await authModel.knex('ChangeTrackingEvents').where('id', activity?.id).del();
    await authModel.knex('ChangeTrackingEvents_Index').where('eventId', activity?.id).del();
    expect(activity.description).toEqual('test description');
});

it('gets userActivity with and no params', async () => {
    const entry = await authModel.getUserActivity(undefined, undefined, undefined, undefined);
    const entry1 = await authModel.getUserActivity('id', 1, undefined, undefined);
    const entry2 = await authModel.getUserActivity('userId', 2, "collection", 'BudgetStatement(230).comments');
    expect(entry2[0].userId).toEqual(2);
});

it('creates userActivity', async () => {
    const input = {
        userId: '1',
        collection: 'BudgetStatement(538).comments',
        data: undefined,
        timestamp: new Date().toISOString()
    };
    const userActivity = await authModel.userActivityCreate(input);
    expect(userActivity[0].userId).toEqual(1);
    await authModel.knex('UserActivity').where('id', userActivity[0].id).del();
});