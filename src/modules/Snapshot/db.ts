import { Knex } from "knex";
import CoreUnitModel from "../CoreUnit/db.js";
import { measureQueryPerformance } from "../../utils/logWrapper.js";
import { AnalyticsModel, queryFilter } from "@powerhousedao/analytics-engine-graphql";
import getAnalytics from "../../analytics.js";

export type SnapshotFilter = {
  id?: number | string;
  period?: string;
  ownerType?: string;
  ownerId?: number;
};

const get3Months = (month: string) => {
  const year = parseInt(month.slice(0, 4));
  const monthIndex = parseInt(month.slice(5, 7)) - 1;

  const dates = [
    new Date(year, monthIndex),
    new Date(year, monthIndex - 1),
    new Date(year, monthIndex - 2),
  ];

  return dates.map((d: Date) => {
    const isoString = d.toISOString();
    return isoString.slice(0, 4) + "/" + isoString.slice(5, 7);
  });
};

export class SnapshotModel {
  knex: Knex;
  coreunit: any;
  analyticsModel: AnalyticsModel;

  constructor(knex: Knex, analytics: AnalyticsModel) {
    this.knex = knex;
    this.coreunit = CoreUnitModel(knex);
    this.analyticsModel = analytics;
  }

  async getSnapshots(filter: {
    limit?: number;
    offset?: number;
    filter?: SnapshotFilter;
  }) {
    const where: {
      id?: number;
      ownerId?: number;
      ownerType?: string;
      month?: Date | null;
    } = {};

    if (filter.filter?.id) {
      where.id = parseInt("" + filter.filter?.id);
    }

    if (filter.filter?.ownerId) {
      where.ownerId = filter.filter?.ownerId;
    }

    if (filter.filter?.ownerType) {
      where.ownerType = filter.filter?.ownerType;
    }

    if (filter.filter?.period) {
      if (!/^[0-9]{4}\/[0-9]{2}$/.test(filter.filter?.period)) {
        throw new Error(
          `Unsupported format for period filter: "${filter.filter?.period}". Use YYYY/MM or null.`,
        );
      }

      where.month = new Date(
        parseInt(filter.filter?.period.slice(0, 4)),
        parseInt(filter.filter?.period.slice(5, 7)) - 1,
        1,
      );
    } else if (filter.filter?.period === null) {
      where.month = null;
    }

    const baseQuery = this.knex
      .select("*")
      .from("Snapshot")
      .where(where)
      .orderBy("id", "desc");

    if (filter.limit !== undefined && filter.offset !== undefined) {
      baseQuery.limit(filter.limit).offset(filter.offset);
    }

    const result = await measureQueryPerformance('getSnapshots', 'snapshots', baseQuery);

    for (let i = 0; i < result.length; i++) {
      result[i].actualsComparison = await this.getActualsComparison(
        result[i].id,
        result[i].month ? get3Months(result[i].month) : [],
        result[i].ownerType,
        result[i].ownerId,
        result[i].end
      );
    }

    return result;
  }

  // Legacy on demand analytics calculation. To be kept for testing purposes when things go wrong. 

  // async getActualsComparison(snapshotId: number, months: string[], ownerType: string, ownerId: number, snapShotEnd: string) {
  //   if (months.length < 1) return [];
  //   const analytics = await this.getAnalytics(months[months.length - 1], snapShotEnd, ownerType, ownerId);
  //   if (analytics.length < 1) return [];
  //   return months.map((month) => ({
  //     month,
  //     currency: "DAI",
  //     reportedActuals: analytics.find((a: any) => a.period == month)?.actuals,
  //     netExpenses: {
  //       onChainOnly: {
  //         amount: analytics.find((a: any) => a.period == month)?.paymentsOnChain,
  //         difference: this.calcDifference(analytics.find((a: any) => a.period == month)?.paymentsOnChain, analytics.find((a: any) => a.period == month)?.actuals),
  //       },
  //       offChainIncluded: {
  //         amount: analytics.find((a: any) => a.period == month)?.paymentsOffChain,
  //         difference: this.calcDifference(analytics.find((a: any) => a.period == month)?.paymentsOffChain, analytics.find((a: any) => a.period == month)?.actuals),
  //       },
  //     },
  //   }));
  // }

  async getActualsComparison(snapshotId: number, months: string[], ownerType: string, ownerId: number, snapShotEnd: string) {
    if (months.length < 1) return [];
    const result = months.map(async (month) => {
      const [monthData] = await this.knex('BudgetStatementCacheValues').where('ownerId', ownerId).andWhere('month', month);
      return {
        month,
        currency: "DAI",
        reportedActuals: monthData?.reportedActuals,
        netExpenses: {
          onChainOnly: {
            amount: monthData?.onChainOnlyAmount,
            difference: monthData?.onChainOnlyDifference,
          },
          offChainIncluded: {
            amount: monthData?.offChainIncludedAmount,
            difference: monthData?.offChainIncludedDifference,
          },
        },
      }
    });
    return await Promise.all(result);
  }

  getSnapshotAccounts(snapshotId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccount")
      .where("snapshotId", snapshotId);
  }

  getSnapshotAccountTransactions(snapshotAccountId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccountTransaction")
      .where("snapshotAccountId", snapshotAccountId)
      .orderBy("id", "desc");
  }

  getSnapshotAccountBalances(snapshotAccountId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccountBalance")
      .where("snapshotAccountId", snapshotAccountId);
  }

  async getAnalytics(start: string, end: string, ownerType: string, ownerId: number) {

    // if end is null then set it to the start month + 2
    if (!end) {
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 2);
      end = endDate.toISOString().slice(0, 7);
    }

    const endDate = new Date(end);
    endDate.setMonth(endDate.getMonth() + 1);
    end = endDate.toISOString().slice(0, 7);

    const filter:queryFilter = {
      start,
      end: end,
      granularity: 'total',
      metrics: ['Actuals', 'PaymentsOnChain', 'PaymentsOffChainIncluded'],
      dimensions: [
        { name: 'report', select: `atlas/${ownerType}/${ownerId}`, lod: "5" }
      ],
      currency: 'DAI'
    }

    const queryEngine = this.analyticsModel
    const results = await queryEngine.query(filter);

    if (!results || results.length < 1) return [];

    const result: any = results[0]?.rows.reduce((acc: any, r: any) => {
      const period = r.dimensions.report.path.split('/').slice(-2).join('/'); // Extracts '2023/07' from 'atlas/CoreUnit/1/2023/07'
      if (!acc[period]) {
        acc[period] = {
          period,
          actuals: null,
          paymentsOnChain: null,
          paymentsOffChain: null,
        };
      }
      if (r.metric == 'Actuals') acc[period].actuals = r.value;
      if (r.metric == 'PaymentsOnChain') acc[period].paymentsOnChain = r.value;
      if (r.metric == 'PaymentsOffChainIncluded') acc[period].paymentsOffChain = r.value;
      return acc;
    }, {});

    const finalResult: any = Object.values(result);

    return finalResult;
  }

  calcDifference = (a: number, b: number) => {
    if (!a || !b) return 0;
    return (Math.abs(a) / Math.abs(b)) - 1;
  }

}

export default (knex: Knex) => new SnapshotModel(knex, getAnalytics(knex));
