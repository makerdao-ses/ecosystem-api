import { gql } from 'apollo-server-core';
import { quarterlyExpenses, monthlyExpenses } from './stubData.js';

export const typeDefs = [gql`

    type TotalQuarterlyExpenses {
        reports: Expenses
    }

    type Expenses {
        expenses: [Expense]
    }

    type Expense {
        period: String,
        budget: String, 
        prediction: Float,
        actuals: Float, 
        discontinued: Float
        budgetCap: Float
    }

    enum Granularity {
        monthly, 
        quarterly
    }

    input AggregateExpensesFilter {
        granularity: Granularity,
        budgets: String
    }

    extend type Query {
        totalQuarterlyExpenses(filter: AggregateExpensesFilter): TotalQuarterlyExpenses
    }

`]

export const resolvers = {
    Query: {
        totalQuarterlyExpenses: async (_: any, { filter }: any, { dataSources }: any) => {
            if (filter.granularity === 'monthly') {
                const reports = {
                    expenses: monthlyExpenses
                }
                return { reports }
            } else if (filter.granularity === 'quarterly') {
                const reports = {
                    expenses: quarterlyExpenses
                }
                return { reports }

            }
            return null;
        },

    }
}