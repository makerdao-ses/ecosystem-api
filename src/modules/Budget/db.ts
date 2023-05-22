import { Knex } from "knex";

interface Budget {
    id: string | number;
    parentId: string | number | null;
    name: string;
    code: string | null;
    start: string | null;
    end: string | null;
    idPath?: string;
    codePath?: string;
}

interface IdOrCode {
    id?: number;
    code?: string;
}

export class BudgetModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };


    processBudgets(budgets: Budget[], depth: number, parentId: number | string | null = null, idOrCode: IdOrCode = {}) {
        const result = [] as any;

        if (depth === 0) {
            return result;
        }

        for (const budget of budgets) {
            if ((idOrCode.id && budget.id == idOrCode.id) || (idOrCode.code && budget.code == idOrCode.code)) {
                result.push(budget);
                result.push(... this.processBudgets(budgets, depth - 1, budget.id));
            }
            else if (budget.parentId == parentId && idOrCode.id === undefined && idOrCode.code === undefined) {
                result.push(budget);
                result.push(... this.processBudgets(budgets, depth - 1, budget.id));
            }
        }

        return result;
    }

    addBudgetPaths(budgets: Budget[], parentId: number | string | null, idPath: string, codePath: string) {
        for (const budget of budgets) {
            if (budget.parentId == parentId) {
                budget.idPath = idPath + budget.id;
                budget.codePath = codePath + (budget.code || budget.id);
                this.addBudgetPaths(budgets, budget.id, budget.idPath + '/', budget.codePath + '/');
            }
        }

    }

    async getBudgets(filter: { limit?: number, offset?: number, filter?: any }) {
        const baseQuery = this.knex
            .select('*')
            .from('Budget')
            .orderBy('id', 'asc');

        if (filter.limit || filter.offset) {
            return await baseQuery.limit(filter.limit as number).offset(filter.offset as number);
        } else {
            let start = filter.filter?.start;
            let end = filter.filter?.end;

            if (start && end) {
                baseQuery.where(b => b.whereNull('start').orWhere('start', '<', end))
                baseQuery.andWhere(b => b.whereNull('end').orWhere('end', '>', start))
            }
            let idOrCode = {
                id: filter.filter?.id,
                code: filter.filter?.code
            }
            let parentId = filter.filter?.parentId || null;
            let maxDepth = filter.filter?.maxDepth || Number.MAX_SAFE_INTEGER;

            let result = await baseQuery;
            this.addBudgetPaths(result, null, '', '');
            return this.processBudgets(result, maxDepth, parentId, idOrCode);
        }

    }

    async getBudgetCaps(budgetId: number | string) {
        return this.knex
            .select('*')
            .from('BudgetCap')
            .where('budgetId', budgetId);
    };

    async getExpenseCategories(id: number | string) {
        return this.knex
            .select('*')
            .from('ExpenseCategory')
            .where('id', id);
    };


    async getExpenseCategory(id: number, name: string, headcountExpense: boolean) {
        return this.knex
            .select('*')
            .from('ExpenseCategory')
            .where('id', id)
            .orWhere('name', name)
            .orWhere('headcountExpense', headcountExpense)
            .returning('*');
    };

    // create budget
    async createBudget(
        parentId: number | string | undefined,
        name: string,
        code: string,
        start: string,
        end: string,
        expenseCategoryId: number | string | undefined,
        amount: number,
        currency: string
    ) {
        const budget = await this.knex('Budget')
            .insert({
                parentId,
                name,
                code,
                start,
                end
            })
            .returning('*');
        const { id } = budget[0];
        await this.addBudgetCap(id, expenseCategoryId, amount, currency);
        return budget
    }

    async updateBudget(updatedFields: Partial<Budget>) {
        const { parentId, id } = updatedFields;
        if (parentId) {
            const budgets = await this.getBudgets({})
            const budget = budgets.find((b: Budget) => b.id == id);
            const idPath = budget.idPath.split('/');
            if (idPath.includes(parentId)) {
                throw new Error(`Can't change parentId to ${parentId} because it would create a circular dependency`);
            }
        }
        delete updatedFields.id;
        const [result] = await this.knex('Budget').where('id', id).update(updatedFields).returning('*');
        return result;
    }


    // add a budget cap
    async addBudgetCap(budgetId: number | string, expenseCategoryId: number | string | undefined, amount: number, currency: string) {
        return this.knex('BudgetCap')
            .insert({
                budgetId,
                expenseCategoryId,
                amount,
                currency
            })
            .returning('*');
    };

    //update a budget cap
    async updateBudgetCap(id: number | string, expenseCategoryId: number | string | undefined, amount: number, currency: string) {
        return this.knex('BudgetCap')
            .where('id', id)
            .update({
                expenseCategoryId,
                amount,
                currency
            })
            .returning('*');
    };

    // delete a budget cap
    async deleteBudgetCap(id: number | string) {
        return this.knex('BudgetCap')
            .where('id', id)
            .del();
    };

    // delete expense category (if no line items and caps exist)
    async deleteExpenseCategory(id: number | string) {
        const [{ name }] = await this.knex('ExpenseCategory').where('id', id).select('name');

        // check if any line items exist wtih this expense category
        // check if budget caps exist with this expense category
        const [lineItemCount] = await this.knex('BudgetStatementLineItem').where('canonicalBudgetCategory', name).count('canonicalBudgetCategory');
        const [budgetCapLineItemCount] = await this.knex('Mip40BudgetLineItem').where('canonicalBudgetCategory', name).count('canonicalBudgetCategory');
        console.log(lineItemCount.count, budgetCapLineItemCount.count);

        if (Number(lineItemCount.count) > 0 && Number(budgetCapLineItemCount.count) > 0) {
            throw new Error(`Cannot delete expense category ${name} with ID ${id} because it has line items`);
        } else {
            return this.knex('ExpenseCategory')
                .where('id', id)
                .del();
        }


    }
}

export default (knex: Knex) => new BudgetModel(knex);