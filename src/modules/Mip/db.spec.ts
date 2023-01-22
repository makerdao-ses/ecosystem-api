import initApi from "../../initApi";
import { MipModel } from "./db";

async function getMipModel(): Promise<MipModel> {
    const apiModule = await initApi({
        Mip: { enabled: true, require: ['CoreUnit'] },
        CoreUnit: { enabled: true }
    });

    const db = apiModule.datasource;
    return db.module<MipModel>('Mip');
};

it('returns list of CuMips with CuId or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMips({});
    const entry1 = await model.getMips({ id: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns CuMips with MipStatus Accepted', async () => {
    const model = await getMipModel();
    const entry = await model.getMip('mipStatus', 'Accepted');
    expect(entry[0].mipStatus).toEqual('Accepted');
});

it('returns list of MipReplaces with newMip or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMipReplaces({});
    const entry1 = await model.getMipReplaces({ newMip: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns MipReplaces with ReplaceMip 41', async () => {
    const model = await getMipModel();
    const entry = await model.getMipReplace('replacedMip', '41');
    expect(entry[0].replacedMip).toEqual(41);
});

it('returns list of Mip39s with mipId or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip39s({});
    const entry1 = await model.getMip39s({ mipId: 0 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns Mip39 with mip39Spn 10', async () => {
    const model = await getMipModel();
    const entry = await model.getMip39('mip39Spn', '10');
    expect(entry[0].mip39Spn).toEqual(10);
});

it('returns list of Mip40s with mipId or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40s(undefined);
    const entry1 = await model.getMip40s({ cuMipId: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of Mip40s with mkrOnly true', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40('mkrOnly', true);
    expect(entry[0].mkrOnly).toEqual(true);
});

it('returns list of Mip40BudgetPeriods with mip40Id or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40BudgetPeriods({});
    const entry1 = await model.getMip40BudgetPeriods({ id: 0 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns Mip40BudgetPeriod with ftes 11.5', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40BudgetPeriod('ftes', 11.5);
    expect(entry[0].ftes).toEqual("11.5")
});

it('returns list of Mip40Wallets with mip40Id or undefined params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40Wallets(undefined);
    const entry1 = await model.getMip40Wallets('0');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns Mip40Wallet with signersRequired 2', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40Wallet('signersRequired', 2);
    expect(entry[0].signersRequired).toEqual(2);
});

it('returns list of Mip40BudgetLineItem with mip40WalletId or undefined as params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40BudgetLineItems({});
    const entry1 = await model.getMip40BudgetLineItems({ id: 1 });
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns list of Mip40BudgetLineItems with headcountExpense true', async () => {
    const model = await getMipModel();
    const entry = await model.getMip40BudgetLineItem('headcountExpense', true);
    expect(entry[0].headcountExpense).toEqual(true);
});

it('returns list of mip41s with cuMipId or undefined as params', async () => {
    const model = await getMipModel();
    const entry = await model.getMip41s(undefined);
    const entry1 = await model.getMip41s('2');
    expect(entry.length).toBeGreaterThan(0);
    expect(entry1.length).toBeGreaterThan(0);
});

it('returns mip41 with contributorId 4', async () => {
    const model = await getMipModel();
    const entry = await model.getMip41('contributorId', "4");
    expect(entry[0].contributorId).toEqual(4);
});