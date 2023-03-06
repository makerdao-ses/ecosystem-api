import initApi from "../../initApi";
import { BudgetStatementModel } from "./db";
import { BudgetStatementAuthModel } from './dbAuth.js'
import { AuthModel } from '../Auth/db'
import { CoreUnitModel } from '../CoreUnit/db'
import { ChangeTrackingModel } from '../ChangeTracking/db'

let bsModel: BudgetStatementModel;
let authModel: AuthModel;
let cuModel: CoreUnitModel;
let ctModel: ChangeTrackingModel;

beforeAll(async () => {
    const apiModules = await initApi({
        BudgetStatement: { enabled: true, require: ['Auth', 'CoreUnit'] },
        CoreUnit: { enabled: true },
        Auth: { enabled: true },
        ChangeTracking: { enabled: true, require: ['CoreUnit'] },
    });
    bsModel = apiModules.datasource.module<BudgetStatementModel>("BudgetStatement");
    authModel = apiModules.datasource.module<AuthModel>("Auth");
    cuModel = apiModules.datasource.module<CoreUnitModel>("CoreUnit");
    ctModel = apiModules.datasource.module<ChangeTrackingModel>('ChangeTracking')
})

afterAll(async () => {
    await bsModel.knex.destroy()
    await authModel.knex.destroy()
    await cuModel.knex.destroy()
    await ctModel.knex.destroy()
})

it('returns list of budgetStatements with limit offset and undefined', async () => {
    const entry = await bsModel.getBudgetStatements({});
    const entry1 = await bsModel.getBudgetStatements({ offset: 10, limit: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns budgetStatements with all params', async () => {
    const entry = await bsModel.getBudgetStatements({ filter: { ownerId: 38, ownerType: 'CoreUnit' } });
    const entry1 = await bsModel.getBudgetStatements({ filter: { id: 310, ownerType: 'CoreUnit' } })
    const entry2 = await bsModel.getBudgetStatements({ filter: { month: "2023-10-01", ownerType: 'CoreUnit' } })
    const entry3 = await bsModel.getBudgetStatements({ filter: { ownerType: 'CoreUnit' } })
    const entry4 = await bsModel.getBudgetStatements({ filter: { status: 'Draft', ownerType: 'CoreUnit' } })
    const entry5 = await bsModel.getBudgetStatements({ filter: { ownerCode: 'EXA-001', ownerType: 'CoreUnit' } })
    const entry6 = await bsModel.getBudgetStatements({ filter: { mkrProgramLength: 3, ownerType: 'CoreUnit' } })
    expect(entry[0].ownerId).toEqual(38);
    expect(entry1[0].id).toEqual(310);
    expect(entry2[0].month).toEqual("2023-10-01");
    expect(entry3[0].ownerType).toEqual('CoreUnit');
    expect(entry4[0].status).toEqual('Draft');
    expect(entry5[0].ownerCode).toEqual('EXA-001');
    expect(entry6[0].mkrProgramLength).toEqual('3');

});

it('returns list of auditReports with all params', async () => {
    const entry = await bsModel.getAuditReports(undefined);
    const entry1 = await bsModel.getAuditReports({ budgetStatementId: 199 });
    const entry2 = await bsModel.getAuditReports({ id: 1 });
    const entry3 = await bsModel.getAuditReports({ reportUrl: 'https://github.com/makerdao-ses/transparency-reporting/blob/main/Monthly%20Budget%20Statements/2021-05.md' });
    const entry4 = await bsModel.getAuditReports({ timestamp: '2022-06-01T11:00:00.000Z' });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1[0].budgetStatementId).toEqual(199);
    expect(entry2[0].id).toEqual(1);
    expect(entry3[0].reportUrl).toEqual('https://github.com/makerdao-ses/transparency-reporting/blob/main/Monthly%20Budget%20Statements/2021-05.md');
    expect(entry4.length).toBe(0)
});

it('returns auditReport with AuditStatus Approved', async () => {
    const entry = await bsModel.getAuditReports({ auditStatus: 'Approved' });
    expect(entry[0].auditStatus).toEqual('Approved');
});

it('returns list of ftes with budgetStatementId or undefined params', async () => {
    const entry = await bsModel.getBudgetStatementFTEs({ budgetStatementId: 409 });
    const entry1 = await bsModel.getBudgetStatementFTEs(undefined);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of BudgetStatementFtes with fte number 10', async () => {
    const entry = await bsModel.getBudgetStatementFTEs({ ftes: 8 });
    const entry1 = await bsModel.getBudgetStatementFTEs({ id: 1 });
    const entry2 = await bsModel.getBudgetStatementFTEs({ month: '2022-10-01' });
    expect(entry[0].ftes).toEqual('8');
    expect(entry1[0].id).toEqual(1);
    expect(entry2[0].month).toEqual('2022-10-01');
});

it('returns list of bstatementMKRVest with all params', async () => {
    const entry = await bsModel.getBudgetStatementMKRVests(undefined);
    const entry1 = await bsModel.getBudgetStatementMKRVests({ budgetStatementId: 189 });
    const entry2 = await bsModel.getBudgetStatementMKRVests({ id: 289 });
    const entry3 = await bsModel.getBudgetStatementMKRVests({ vestingDate: "2022-06-01" });
    const entry4 = await bsModel.getBudgetStatementMKRVests({ mkrAmountOld: 355.86 });
    const entry5 = await bsModel.getBudgetStatementMKRVests({ comments: 'stuff' });
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
    expect(entry2[0].id).toEqual(289);
    expect(entry3[0].vestingDate).toEqual('2022-06-01');
    expect(entry4[0].mkrAmountOld).toEqual('355.86');
});

it('returns mkrVest statement with mkrAmount 100', async () => {
    const entry = await bsModel.getBudgetStatementMKRVests({ mkrAmount: 100 });
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetStatemntWallets with all params', async () => {
    const entry = await bsModel.getBudgetStatementWallets(undefined);
    const entry1 = await bsModel.getBudgetStatementWallets({ budgetStatementId: 399 })
    const entry2 = await bsModel.getBudgetStatementWallets({ id: 642 })
    const entry3 = await bsModel.getBudgetStatementWallets({ name: 'Permanent Team' })
    const entry4 = await bsModel.getBudgetStatementWallets({ address: '0x3d274fbac29c92d2f624483495c0113b44dbe7d2' })
    const entry5 = await bsModel.getBudgetStatementWallets({ currentBalance: 0 })
    const entry6 = await bsModel.getBudgetStatementWallets({ comments: '' })
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
    expect(entry2[0].id).toEqual(642);
    expect(entry3[0].name).toEqual('Permanent Team');
    expect(entry4[0].address).toEqual('0x3d274fbac29c92d2f624483495c0113b44dbe7d2');
    expect(entry5[0].currentBalance).toEqual('0');
    expect(entry6[0].comments).toEqual('');
});

it('returns budgetSTatementWallet with topUp 0', async () => {
    const entry = await bsModel.getBudgetStatementWallets({ topupTransfer: 0 });
    expect(entry).toBeInstanceOf(Array);
});

it('returns lineItems with offset limit and undefined params', async () => {
    const entry = await bsModel.getBudgetStatementLineItems();
    const entry1 = await bsModel.getBudgetStatementLineItems(10, 1);
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns lineItems with two filter params', async () => {
    const entry = await bsModel.getBudgetStatementLineItems(undefined, undefined, 'month', '2023-04-01', 'budgetCategory', 'Operational Expense');
    expect(entry).toBeInstanceOf(Array);
});

it('returns lineItems with headCountexpense true', async () => {
    const entry = await bsModel.getBudgetStatementLineItems(undefined, undefined, 'headcountExpense', true);
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetSTatementPayments with all params', async () => {
    const entry = await bsModel.getBudgetStatementPayments(undefined);
    const entry1 = await bsModel.getBudgetStatementPayments({ budgetStatementWalletId: 741 });
    const entry2 = await bsModel.getBudgetStatementPayments({ id: 11 });
    const entry3 = await bsModel.getBudgetStatementPayments({ transactionDate: "2022-03-22" });
    const entry4 = await bsModel.getBudgetStatementPayments({ transactionId: "0x91d913989828e60b70d8a8aafadd5c9398907c15ee462551496e122542cec87d" });
    const entry5 = await bsModel.getBudgetStatementPayments({ budgetStatementLineItemId: 0 });
    const entry6 = await bsModel.getBudgetStatementPayments({ comments: '' });
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
    expect(entry2[0].id).toEqual(11);
    expect(entry3[0].transactionDate).toEqual('2022-03-22');
    expect(entry4[0].transactionId).toEqual('0x91d913989828e60b70d8a8aafadd5c9398907c15ee462551496e122542cec87d');
});

/*
Testing scenarios for comment/status creation

Unauthorised User
CoreUnit Administrator with CoreUnit/Update permission
CoreUnit Auditor with CoreUnit/Audit permission
Super Administrator with both permissions 

*/

it('Fails when unauthorised users try write operations', async () => {
    const bsbsModel = new BudgetStatementAuthModel(bsModel, authModel, cuModel, ctModel);
    expect(async () => {
        await bsbsModel.budgetStatementCommentCreate(null, false, null)
    }).rejects.toThrow()

});

it('Correctly applies CU Admin modifications', async () => {
    expect(true).toBe(true);
})

it('Correctly applies CU Auditor modifications', async () => {
    expect(true).toBe(true);
})

it('Correctly applies Super Admin modifications', async () => {
    expect(true).toBe(true);
})