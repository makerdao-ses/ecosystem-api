import initApi from "../../initApi";
import { BudgetStatementModel } from "./db";

async function getBudgetStatementModel(): Promise<BudgetStatementModel> {
    const apiModules = await initApi({
        BudgetStatement: { enabled: true, require: ['CoreUnit', 'Auth'] },
        CoreUnit: { enabled: true },
        Auth: { enabled: true }
    });

    const db = apiModules.datasource;
    return db.module<BudgetStatementModel>('BudgetStatement')
};

it('returns list of budgetStatements with limit offset and undefined', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatements({});
    const entry1 = await model.getBudgetStatements({ offset: 10, limit: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns budgetStatements with cuId 39', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatement('cuId', '39', undefined, undefined);
    expect(entry[0].cuId).toEqual(39);
});

it('returns budgetStatements with cuId 39 and month 2022-05-01', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatement('cuId', '39', 'month', '2022-05-01');
    expect(entry[0].cuId).toEqual(39);
    expect(entry[0].month).toEqual('2022-05-01');
});

it('returns list of auditReports with budgetStatmentId or undefined params', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getAuditReports(undefined);
    const entry1 = await model.getAuditReports('399');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns auditReport with AuditStatus Approved', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getAuditReport('auditStatus', 'Approved');
    expect(entry[0].auditStatus).toEqual('Approved');
});

it('returns list of ftes with budgetStatementId or undefined params', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementFTEs('409');
    const entry1 = await model.getBudgetStatementFTEs(undefined);
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of BudgetStatementFtes with fte number 10', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementFTE('ftes', 10);
    expect(entry[0].ftes).toEqual('10');
});

it('returns list of bstatementMKRVest with bstatemntID or undefined as params', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementMKRVests(undefined);
    const entry1 = await model.getBudgetStatementMKRVests('300');
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns mkrVest statement with mkrAmount 100', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementMKRVest('mkrAmount', 100);
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetStatemntWallets with bstatementid or undefined as params', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementWallets(undefined);
    const entry1 = await model.getBudgetStatementWallets({ budgetStatementId: 399 })
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns budgetSTatementWallet with topUp 0', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementWallet('topupTransfer', 0);
    expect(entry).toBeInstanceOf(Array);
});

it('returns lineItems with offset limit and undefined params', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementLineItems(undefined, undefined);
    const entry1 = await model.getBudgetStatementLineItems(10, 1);
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns lineItems with headCountexpense true', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementLineItem('headcountExpense', true, undefined, undefined);
    expect(entry).toBeInstanceOf(Array);
});

it('returns list of budgetSTatementPayments', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementPayments(undefined);
    const entry1 = await model.getBudgetStatementPayments('741');
    expect(entry).toBeInstanceOf(Array);
    expect(entry1).toBeInstanceOf(Array);
});

it('returns budgetStatementPayment with walletId 741', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBudgetStatementPayment('budgetStatementWalletId', '741');
    expect(entry).toBeInstanceOf(Array);
});

it('returns bsComment_bsCommentAuthor with bsCommentId 13', async () => {
    const model = await getBudgetStatementModel();
    const entry = await model.getBsComment_BsAuthor('13');
    expect(entry[0].bsCommentAuthorId).toEqual(1)
})