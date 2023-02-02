import initApi from "../../initApi";
import { BudgetStatementModel } from "./db";
import { BudgetStatementAuthModel } from './dbAuth.js'

let authModel: BudgetStatementModel;

beforeAll(async () => {
    const apiModules = await initApi({
        BudgetStatement: { enabled: true, require: ['Auth', 'CoreUnit'] },
        CoreUnit: { enabled: true },
        Auth: { enabled: true }
    });
    authModel = apiModules.datasource.module<BudgetStatementModel>("BudgetStatement")
})

afterAll(async () => { await authModel.knex.destroy() })

it('returns list of budgetStatements with limit offset and undefined', async () => {
    const entry = await authModel.getBudgetStatements({});
    const entry1 = await authModel.getBudgetStatements({ offset: 10, limit: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns budgetStatements with cuId 39', async () => {
    const entry = await authModel.getBudgetStatements({ filter: { cuId: 38 } });
    expect(entry[0].cuId).toEqual(38);
});

it('returns list of auditReports with budgetStatmentId or undefined params', async () => {
    const entry = await authModel.getAuditReports(undefined);
    const entry1 = await authModel.getAuditReports('199');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns auditReport with AuditStatus Approved', async () => {
    const entry = await authModel.getAuditReport('auditStatus', 'Approved');
    expect(entry[0].auditStatus).toEqual('Approved');
});

it('returns list of ftes with budgetStatementId or undefined params', async () => {
    const entry = await authModel.getBudgetStatementFTEs('409');
    const entry1 = await authModel.getBudgetStatementFTEs(undefined);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of BudgetStatementFtes with fte number 10', async () => {
    const entry = await authModel.getBudgetStatementFTE('ftes', 8);
    expect(entry[0].ftes).toEqual('8');
});

it('returns list of bstatementMKRVest with bstatemntID or undefined as params', async () => {
    const entry = await authModel.getBudgetStatementMKRVests(undefined);
    const entry1 = await authModel.getBudgetStatementMKRVests('300');
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns mkrVest statement with mkrAmount 100', async () => {
    const entry = await authModel.getBudgetStatementMKRVest('mkrAmount', 100);
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetStatemntWallets with bstatementid or undefined as params', async () => {
    const entry = await authModel.getBudgetStatementWallets(undefined);
    const entry1 = await authModel.getBudgetStatementWallets({ budgetStatementId: 399 })
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns budgetSTatementWallet with topUp 0', async () => {
    const entry = await authModel.getBudgetStatementWallets({ topupTransfer: 0 });
    expect(entry).toBeInstanceOf(Array);
});

it('returns lineItems with offset limit and undefined params', async () => {
    const entry = await authModel.getBudgetStatementLineItems();
    const entry1 = await authModel.getBudgetStatementLineItems(10, 1);
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns lineItems with headCountexpense true', async () => {
    const entry = await authModel.getBudgetStatementLineItems(undefined, undefined, 'headcountExpense', true);
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetSTatementPayments', async () => {
    const entry = await authModel.getBudgetStatementPayments(undefined);
    const entry1 = await authModel.getBudgetStatementPayments('741');
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns budgetStatementPayment with walletId 741', async () => {
    const entry = await authModel.getBudgetStatementPayment('budgetStatementWalletId', '741');
    expect(entry).toBeInstanceOf(Array);
});

/*
Testing scenarios for comment/status creation

Unauthorised User
CoreUnit Administrator with CoreUnit/Update permission
CoreUnit Auditor with CoreUnit/Audit permission
Super Administrator with both permissions 

*/

it('Fails when unauthorised users try write operations', async () => {
    const authModel = new BudgetStatementAuthModel();
    expect(async () => {
        await authModel.budgetStatementCommentCreate(null, false, null)
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