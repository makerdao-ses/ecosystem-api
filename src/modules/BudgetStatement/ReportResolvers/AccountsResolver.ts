import {
  BudgetReportOutputRow,
  BudgetReportResolverBase,
  CacheKeys,
  ResolverData,
  ResolverOutput,
  SerializableKey,
} from "../BudgetReportResolver.js";
import { Knex } from "knex";
import { LineItemFetcher, LineItemGroup } from "../LineItemFetcher.js";
import { PeriodResolverData } from "./PeriodResolver.js";
import { BudgetReportPeriod } from "../BudgetReportPeriod.js";
import { BudgetReportPathSegment } from "../BudgetReportPath.js";

const DEBUG_OUTPUT = false;

export interface AccountsResolverData extends PeriodResolverData {
  account: string;
  owner: string;
  discontinued: boolean;
  discontinuedSince: string | null;
}

export class AccountsResolver extends BudgetReportResolverBase<
  AccountsResolverData,
  ResolverData
> {
  readonly name = "AccountsResolver";

  private _lineItemFetcher: LineItemFetcher;

  constructor(knex: Knex) {
    super();
    this._lineItemFetcher = new LineItemFetcher(knex);
  }

  public supportsCaching(): boolean {
    return true;
  }

  public getCacheKeys(
    query: AccountsResolverData,
  ): Record<string, SerializableKey | null> {
    return {
      account: query.account,
      start: query.start,
      end: query.end,
      groupPath: query.groupPath,
      keepLineItemsSeparate: query.budgetPath.nextSegment().groups === null,
      period: query.period,
    };
  }

  public async execute(
    query: AccountsResolverData,
  ): Promise<ResolverOutput<ResolverData>> {
    if (DEBUG_OUTPUT) {
      console.log(
        `AccountsResolver is resolving ${query.budgetPath.toString()}`,
      );
    }

    const pathInfo = {
      accountPath: query.budgetPath,
      groupSegment: query.budgetPath.nextSegment(),
    };

    const keepLineItemGroupsSeparate = pathInfo.groupSegment.groups === null;

    const result: ResolverOutput<ResolverData> = {
      nextResolversData: {},
      output: [
        {
          keys: query.groupPath,
          period: query.period,
          rows: [],
        },
      ],
    };

    const range = BudgetReportPeriod.fillRange(
      query.start as BudgetReportPeriod,
      query.end as BudgetReportPeriod,
    );

    for (const month of range) {
      const lineItemGroup: LineItemGroup =
        await this._lineItemFetcher.getLineItems(
          query.owner,
          query.account,
          month.startAsSqlDate(),
        );

      const outputRows: BudgetReportOutputRow[] = lineItemGroup.categories.map(
        (c) => {
          const actualsReported =
            lineItemGroup.hasActuals ||
            (lineItemGroup.latestReport !== null &&
              lineItemGroup.latestReport.equals(lineItemGroup.month));

          const prediction = actualsReported
            ? c.numbers.actual
            : c.numbers.forecast;

          return {
            account: lineItemGroup.account,
            month: lineItemGroup.month,

            group: c.group,
            headcountExpense: c.headcountExpense,
            category: c.category,

            actual: c.numbers.actual,
            forecast: c.numbers.forecast,
            prediction: prediction,
            budgetCap: c.numbers.budgetCap,
            payment: c.numbers.payment,

            actualDiscontinued: query.discontinued ? c.numbers.actual : 0.0,
            forecastDiscontinued: query.discontinued ? c.numbers.forecast : 0.0,
            predictionDiscontinued: query.discontinued ? prediction : 0.0,
            budgetCapDiscontinued: query.discontinued
              ? c.numbers.budgetCap
              : 0.0,
            paymentDiscontinued: query.discontinued ? c.numbers.payment : 0.0,
          };
        },
      );

      for (const row of outputRows) {
        const keys = [...query.groupPath];
        if (row.group && keepLineItemGroupsSeparate) {
          keys.push(BudgetReportPathSegment.escape(row.group));
        }

        result.output.push({
          keys,
          period: query.period,
          rows: [row],
        });
      }
    }

    if (DEBUG_OUTPUT) {
      console.log(
        `AccountsResolver fetched ${range.length} months of ${query.owner}/${query.account}, returning ${result.output.length} groups with 1 record.`,
      );
    }

    return result;
  }
}
