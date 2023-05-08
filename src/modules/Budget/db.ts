import { Knex } from "knex";

export class BudgetModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getBudgets(filter: { limit?: number, offset?: number, filter?: any }) {
        const baseQuery = this.knex
            .select('*')
            .from('Budget')
            .orderBy('id', 'desc');
        if (filter.limit !== undefined && filter.offset !== undefined) {
            return baseQuery.limit(filter.limit).offset(filter.offset);
        } else if (filter.filter?.id !== undefined) {
            return baseQuery.where('id', filter.filter.id);
        } else if (filter.filter?.parentId !== undefined) {
            return baseQuery.where('parentId', filter.filter.parentId);
        } else if (filter.filter?.name !== undefined) {
            return baseQuery.where('name', filter.filter.name);
        } else if (filter.filter?.code !== undefined) {
            return baseQuery.where('code', filter.filter.code);
        } else if (filter.filter?.start !== undefined) {
            return baseQuery.where('start', filter.filter.start);
        } else if (filter.filter?.end !== undefined) {
            return baseQuery.where('end', filter.filter.end);
        } else {
            return baseQuery;
        };
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
        // check if any line items exist wtih this expense category


        // check if budget caps exist with this expense category


        // return this.knex('ExpenseCategory')
        //     .where('id', id)
        //     .del();
    }
}

export default (knex: Knex) => new BudgetModel(knex);