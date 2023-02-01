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