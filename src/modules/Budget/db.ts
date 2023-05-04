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
}

export default (knex: Knex) => new BudgetModel(knex);