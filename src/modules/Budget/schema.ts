import { gql } from 'apollo-server-core';

export const typeDefs = [gql`

    type Budget { 
        id: ID!
        parentId: ID
        name: String
        code: String
        start: DateTime
        end: DateTime
        budgetCap: [BudgetCap]
    }

    type BudgetCap {
        id: ID!
        budgetId: ID
        expenseCategoryId: ID
        amount: Float
        currency: String
        expenseCategory: [ExpenseCategory]
    }

    type ExpenseCategory {
        id: ID
        name: String
        headcountExpense: Boolean
        order: Int
    }

    input BudgetFilter {
        parentId: ID
        name: String
        code: String
        start: DateTime
        end: DateTime
    }

    extend type Query {
        budgets(limit: Int, offset: Int, filter: BudgetFilter): [Budget]
    }

`];

export const resolvers = {
    Query: {
        // schema object: (parent, args, context, info) => {}
        budgets: async (_: any, filter: any, { dataSources }: any) => {
            return await dataSources.db.Budget.getBudgets(filter);
        }
    },

    Budget: {
        budgetCap: async (parent: any, _: any, { dataSources }: any) => {
            return await dataSources.db.Budget.getBudgetCaps(parent.id);
        }
    },
    BudgetCap: {
        expenseCategory: async (parent: any, _: any, { dataSources }: any) => {
            return await dataSources.db.Budget.getExpenseCategories(parent.expenseCategoryId);
        }
    }
};