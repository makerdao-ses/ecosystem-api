import initApi from "../../initApi";
import { BudgetModel } from "./db";

let authModel: BudgetModel;

beforeAll(async () => {
  const apiModules = await initApi({
    Budget: { enabled: true },
  });
  authModel = apiModules.datasource.module<BudgetModel>("Budget");
});

afterAll(async () => {
  await authModel.knex.destroy();
});

it("returns list of Budgets", async () => {
  const result = await authModel.getBudgets({});
  const result1 = await authModel.getBudgets({ filter: { id: 5 } });
  const result2 = await authModel.getBudgets({ filter: { maxDepth: 4 } });
  const result3 = await authModel.getBudgets({ limit: 5, offset: 5 });
  const reuslt5 = await authModel.getBudgets({ filter: { code: "atlas" } });
  expect(result.length).toBeGreaterThan(0);
  expect(result1.length).toBeGreaterThan(0);
  expect(result2.length).toBeGreaterThan(0);
  expect(result3.length).toBeGreaterThan(0);
  expect(reuslt5.length).toBeGreaterThan(0);
});

it("returs list of budgetCaps", async () => {
  const result = await authModel.getBudgetCaps(57);
  expect(result.length).toBeGreaterThan(0);
});

it("returns list of expense categories", async () => {
  const result = await authModel.getExpenseCategory(3);
  expect(result.length).toBeGreaterThan(0);
  const result1 = await authModel.getExpenseCategory(
    2,
    "CompensationAndBenefits",
  );
  const result2 = await authModel.getExpenseCategory(
    2,
    "CompensationAndBenefits",
    true,
  );
  expect(result1.length).toBeGreaterThan(0);
  expect(result2.length).toBeGreaterThan(0);
});

it("creates a budget, updates and deletes it", async () => {
  const result = await authModel.createBudget(
    undefined,
    "test",
    "test",
    "2021-01-01",
    "2021-12-31",
    2,
    100,
    "USD",
  );
  expect(result.length).toBeGreaterThan(0);
  const updateResult = await authModel.updateBudget({
    id: result[0].id,
    parentId: 19,
  });
  expect(updateResult.parentId).toBe(19);
  const budgetCap = await authModel.getBudgetCaps(result[0].id);
  await authModel.deleteBudgetCap(budgetCap[0].id);
  const deleteResult = await authModel.deleteBudget(result[0].id);
  expect(deleteResult).toBe(1);
});

it("throws error when updating budget with circular dependency", async () => {
  const updateResult = authModel.updateBudget({ id: 19, parentId: 16 });
  await expect(updateResult).rejects.toThrowError();
});
