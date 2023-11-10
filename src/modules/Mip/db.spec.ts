import initApi from "../../initApi";
import { MipModel } from "./db";

let authModel: MipModel;

beforeAll(async () => {
  const apiModules = await initApi({
    Mip: { enabled: true, require: ["CoreUnit"] },
    CoreUnit: { enabled: true },
  });
  authModel = apiModules.datasource.module<MipModel>("Mip");
});

afterAll(async () => {
  await authModel.knex.destroy();
});

it("returns list of CuMips with CuId or undefined params", async () => {
  const entry = await authModel.getMips({});
  const entry1 = await authModel.getMips({ id: 1 });
  const entry2 = await authModel.getMips({ mipCode: "" });
  const entry3 = await authModel.getMips({ cuId: 1 });
  const entry4 = await authModel.getMips({ rfc: "2022-05-01" });
  const entry5 = await authModel.getMips({ formalSubmission: "2022-05-01" });
  const entry6 = await authModel.getMips({ accepted: "2022-05-01" });
  const entry7 = await authModel.getMips({ rejected: "2022-05-01" });
  const entry8 = await authModel.getMips({ obsolete: "2022-05-01" });
  const entry9 = await authModel.getMips({ mipStatus: "Accepted" });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});

it("returns list of MipReplaces with newMip or undefined params", async () => {
  const entry = await authModel.getMipReplaces({});
  const entry0 = await authModel.getMipReplaces({ id: 1 });
  const entry1 = await authModel.getMipReplaces({ newMip: 1 });
  const entry2 = await authModel.getMipReplaces({ replacedMip: 1 });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});

it("returns list of Mip39s with and no params", async () => {
  const entry = await authModel.getMip39s({});
  const entry1 = await authModel.getMip39s({ id: 1 });
  const entry2 = await authModel.getMip39s({ mipId: 0 });
  const entry3 = await authModel.getMip39s({ mip39Spn: 0 });
  const entry4 = await authModel.getMip39s({ mipCode: "" });
  const entry5 = await authModel.getMip39s({ cuName: "" });
  const entry6 = await authModel.getMip39s({ sentenceSummary: "" });
  const entry7 = await authModel.getMip39s({ paragraphSummary: "0" });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry2.length).toBeGreaterThan(0);
});

it("returns list of Mip40s with or no params", async () => {
  const entry = await authModel.getMip40s(undefined);
  const entry1 = await authModel.getMip40s({ id: 1 });
  const entry2 = await authModel.getMip40s({ cuMipId: 1 });
  const entry3 = await authModel.getMip40s({ mip40Spn: "" });
  const entry4 = await authModel.getMip40s({ mkrOnly: true });
  const entry5 = await authModel.getMip40s({ mkrProgramLength: 1 });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry2.length).toBeGreaterThan(0);
});

it("returns list of Mip40BudgetPeriods with or no params", async () => {
  const entry = await authModel.getMip40BudgetPeriods({});
  const entry1 = await authModel.getMip40BudgetPeriods({ id: 0 });
  const entry2 = await authModel.getMip40BudgetPeriods({ mip40Id: 0 });
  const entry3 = await authModel.getMip40BudgetPeriods({
    budgetPeriodStart: "2022-01-01",
  });
  const entry4 = await authModel.getMip40BudgetPeriods({
    budgetPeriodEnd: "2022-01-01",
  });
  const entry5 = await authModel.getMip40BudgetPeriods({ ftes: 0 });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});

it("returns list of Mip40Wallets with or undefined params", async () => {
  const entry = await authModel.getMip40Wallets({});
  const entry1 = await authModel.getMip40Wallets({ id: 0 });
  const entry2 = await authModel.getMip40Wallets({ mip40Id: 0 });
  const entry3 = await authModel.getMip40Wallets({ address: "" });
  const entry4 = await authModel.getMip40Wallets({ name: "" });
  const entry5 = await authModel.getMip40Wallets({ signersTotal: 0 });
  const entry6 = await authModel.getMip40Wallets({ signersRequired: 0 });
  const entry7 = await authModel.getMip40Wallets({ clawbackLimit: 0 });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});

it("returns list of Mip40BudgetLineItem with mip40WalletId or undefined as params", async () => {
  const entry = await authModel.getMip40BudgetLineItems({});
  const entry1 = await authModel.getMip40BudgetLineItems({ id: 1 });
  const entry2 = await authModel.getMip40BudgetLineItems({ mip40WalletId: 1 });
  const entry3 = await authModel.getMip40BudgetLineItems({ position: 1 });
  const entry4 = await authModel.getMip40BudgetLineItems({
    budgetCategory: "",
  });
  const entry5 = await authModel.getMip40BudgetLineItems({ budgetCap: 1 });
  const entry6 = await authModel.getMip40BudgetLineItems({
    canonicalBudgetCategory: "GasExpense",
  });
  const entry7 = await authModel.getMip40BudgetLineItems({ group: "" });
  const entry8 = await authModel.getMip40BudgetLineItems({
    headcountExpense: true,
  });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});

it("returns list of mip41s with or no params", async () => {
  const entry = await authModel.getMip41s({});
  const entry1 = await authModel.getMip41s({ id: 2 });
  const entry2 = await authModel.getMip41s({ cuMipId: 1 });
  const entry3 = await authModel.getMip41s({ contributorId: 2 });
  expect(entry.length).toBeGreaterThan(0);
  expect(entry1.length).toBeGreaterThan(0);
});
