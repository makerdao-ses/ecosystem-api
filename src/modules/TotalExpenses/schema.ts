import { gql } from 'apollo-server-core';
import { BudgetReportGranularity, BudgetReportQuery } from '../BudgetStatement/BudgetReportQuery.js';

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
        quarterly,
        annual,
        total
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
            filter.granularity = filter.granularity || 'monthly';

            let granularity: BudgetReportGranularity;
            switch(filter.granularity) {
                case 'monthly':
                    granularity = BudgetReportGranularity.Monthly;
                    break;

                case 'quarterly':
                    granularity = BudgetReportGranularity.Quarterly;
                    break;

                case 'annual':
                    granularity = BudgetReportGranularity.Annual;
                    break;
                
                case 'total':
                    granularity = BudgetReportGranularity.Total;
                    break;

                default:
                    throw new Error('Invalid value for granularity: should be "monthly", "quarterly", "annual", or "total"'); 
            }

            const query:BudgetReportQuery = {
                start: null,
                end: null,
                granularity,
                budgets: 'makerdao/core-units/*',
                categories: '*'
            };

            const result = await dataSources.db.TotalExpenses.query(query);

            const expenses = result
                .map((group:any) => ({
                    period: group.keys.period.replace('/', '-'),
                    budget: "/makerdao/core-units",
                    prediction: Math.round(group.rows[0].prediction * 100.00) / 100.00,
                    actuals: Math.round(group.rows[0].actual * 100.00) / 100.00,
                    discontinued: Math.round(group.rows[0].actualDiscontinued * 100.00) / 100.00,
                    budgetCap: Math.round(group.rows[0].budgetCap * 100.00) / 100.00
                }))
                .sort((a:any,b:any) => (a.period > b.period) ? 1 : ((b.period > a.period) ? -1 : 0));

            return {
                reports: { expenses }
            }
        },

    }
}