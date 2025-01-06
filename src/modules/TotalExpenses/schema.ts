import { gql } from "graphql-tag";
import { BudgetReportPath } from "../BudgetStatement/BudgetReportPath.js";
import {
  BudgetReportGranularity,
  BudgetReportQuery,
} from "../BudgetStatement/BudgetReportQuery.js";
import {
  BudgetReportOutputGroup,
  getCategoryGroupName,
} from "../BudgetStatement/BudgetReportResolver.js";

export const typeDefs = [
  gql`
    type TotalQuarterlyExpenses {
      reports: Expenses
    }

    type Expenses {
      expenses: [Expense]
    }

    type Expense {
      period: String
      budget: String
      category: String
      prediction: Float
      actuals: Float
      discontinued: Float
      budgetCap: Float
    }

    enum Granularity {
      monthly
      quarterly
      annual
      total
    }

    input AggregateExpensesFilter {
      granularity: Granularity
      budgets: String
      categories: String
      start: String
      end: String
    }

    extend type Query {
      totalQuarterlyExpenses(
        filter: AggregateExpensesFilter
      ): TotalQuarterlyExpenses
    }
  `,
];

export const resolvers = {
  Query: {
    totalQuarterlyExpenses: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      // Granularity parameter
      filter.granularity = filter.granularity || "monthly";
      let granularity: BudgetReportGranularity;
      switch (filter.granularity) {
        case "monthly":
          granularity = BudgetReportGranularity.Monthly;
          break;

        case "quarterly":
          granularity = BudgetReportGranularity.Quarterly;
          break;

        case "annual":
          granularity = BudgetReportGranularity.Annual;
          break;

        case "total":
          granularity = BudgetReportGranularity.Total;
          break;

        default:
          throw new Error(
            'Invalid value for granularity: should be "monthly", "quarterly", "annual", or "total"',
          );
      }

      // Budgets parameter
      filter.budgets = filter.budgets || "makerdao/*:*";
      if (filter.budgets.length > 0 && filter.budgets[0] === "/") {
        filter.budgets = filter.budgets.slice(1) + ":*";
      }

      // Categories parameter
      filter.categories = filter.categories || "*";

      // Time parameters
      filter.start = filter.start || null;
      filter.end = filter.end || null;

      // Construct the query
      const query: BudgetReportQuery = {
        start: filter.start,
        end: filter.end,
        granularity,
        budgets: BudgetReportPath.fromString(filter.budgets),
        categories: BudgetReportPath.fromString(filter.categories),
      };

      // Fetch and format the results
      const result = await dataSources.db.TotalExpenses.query(query);
      const expenses = result
        .map((group: BudgetReportOutputGroup) => ({
          period: group.period.replace("/", "-"),
          budget: group.keys.join("/"),
          category:
            getCategoryGroupName(
              group.rows[0],
              query.categories as BudgetReportPath,
              false,
            ) || "*",
          prediction: Math.round(group.rows[0].prediction * 100.0) / 100.0,
          actuals: Math.round(group.rows[0].actual * 100.0) / 100.0,
          discontinued:
            Math.round(group.rows[0].actualDiscontinued * 100.0) / 100.0,
          budgetCap: Math.round(group.rows[0].budgetCap * 100.0) / 100.0,
        }))
        .sort((a: any, b: any) =>
          a.period > b.period ? 1 : b.period > a.period ? -1 : 0,
        );

      //
      return {
        reports: { expenses },
      };
    },
  },
};
