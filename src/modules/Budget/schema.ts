import { gql } from 'apollo-server-core';

export const typeDefs = [gql`

    type Budget { 
        id: ID
        parentId: ID
        name: String
        code: String
        start: DateTime
        end: DateTime
        idPath: String
        codePath: String
        budgetCap: [BudgetCap]
    }

    type BudgetCap {
        id: ID!
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
        id: ID
        maxDepth: Int
        path: Int
        parentId: ID
        code: String
        start: DateTime
        end: DateTime
    }

    input AddBudgetCapInput {
        budgetId: ID!
        expenseCategoryId: ID
        amount: Float!
        currency: String!
    }

    input UpdateBudgetCapInput {
        id: ID!
        expenseCategoryId: ID
        amount: Float
        currency: String
    }

    input CreateBudgetInput {
        parentId: ID
        name: String!
        code: String!
        start: DateTime!
        end: DateTime
        expenseCategoryId: ID
        amount: Float!
        currency: String!
    }

    input UpdateBudgetInput {
        id: ID!
        parentId: ID
        name: String
        code: String
        start: DateTime
        end: DateTime
    }

    extend type Query {
        budgets(limit: Int, offset: Int, filter: BudgetFilter): [Budget]
    }

    type Mutation {
        createBudget(input: CreateBudgetInput): [Budget]
        addBudgetCap(input: AddBudgetCapInput): [BudgetCap]
        updateBudgetCap(input: UpdateBudgetCapInput): [BudgetCap]
        updateBudget(input: UpdateBudgetInput): Budget
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
    },
    Mutation: {
        createBudget: async (_: any, { input }: any, { dataSources }: any) => {
            return await dataSources.db.Budget.createBudget(input.parentId, input.name, input.code, input.start, input.end, input.expenseCategoryId, input.amount, input.currency);
        },
        addBudgetCap: async (_: any, { input }: any, { dataSources }: any) => {
            return await dataSources.db.Budget.addBudgetCap(input.budgetId, input.expenseCategoryId, input.amount, input.currency);
        },
        updateBudgetCap: async (_: any, { input }: any, { dataSources }: any) => {
            return await dataSources.db.Budget.updateBudgetCap(input.id, input.expenseCategoryId, input.amount, input.currency);
        },
        updateBudget: async (_: any, { input }: any, { dataSources }: any) => {
            return await dataSources.db.Budget.updateBudget(input);
        }
    }
};