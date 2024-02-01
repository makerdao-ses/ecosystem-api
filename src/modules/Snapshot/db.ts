import { Knex } from "knex";
import CoreUnitModel from "../CoreUnit/db.js";
import AnalyticsModel from "../Analytics/db.js";

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
  analyticsModel: any;

  constructor(knex: Knex) {
    this.knex = knex;
    this.coreunit = CoreUnitModel(knex);
    this.analyticsModel = AnalyticsModel(knex);
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

    const result = await baseQuery;

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

  async getActualsComparison(snapshotId: number, months: string[], ownerType: string, ownerId: number, snapShotEnd: string) {
    if (months.length < 1) return [];

    const monthsToReturn = await Promise.all(months.map(async (month: string) => {
      const monthAnalytics = await this.getAnalytics(month, ownerType, ownerId);
      return {
        month,
        currency: "DAI",
        reportedActuals: monthAnalytics[0]?.actuals,
        netExpenses: {
          onChainOnly: {
            amount: this.convertToPositive(monthAnalytics[0]?.paymentsOnChain),
            difference: this.calcDifference(monthAnalytics[0]?.paymentsOnChain, monthAnalytics[0]?.actuals),
          },
          offChainIncluded: {
            amount: this.convertToPositive(monthAnalytics[0]?.paymentsOffChain),
            difference: this.calcDifference(monthAnalytics[0]?.paymentsOffChain, monthAnalytics[0]?.actuals),
          },
        },
      }
    }));

    return monthsToReturn;
  }

  async getSnapshotAccounts(snapshotId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccount")
      .where("snapshotId", snapshotId);
  }

  async getSnapshotAccountTransactions(snapshotAccountId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccountTransaction")
      .where("snapshotAccountId", snapshotAccountId)
      .orderBy("id", "desc");
  }

  async getSnapshotAccountBalances(snapshotAccountId: number | string) {
    return this.knex
      .select("*")
      .from("SnapshotAccountBalance")
      .where("snapshotAccountId", snapshotAccountId);
  }

  async getAnalytics(reportMonth: string, ownerType: string, ownerId: number) {

    const filter = {
      start: "2020/01",
      end: "2100/01",
      granularity: 'total',
      metrics: ['Actuals', 'PaymentsOnChain', 'PaymentsOffChainIncluded'],
      dimensions: [
        { name: 'report', select: `atlas/${ownerType}/${ownerId}/${reportMonth}`, lod: 5 }
      ],
      currency: 'DAI'
    }

    const queryEngine = this.analyticsModel
    const results = await queryEngine.query(filter);

    const result = results.map((s: any) => ({
      period: reportMonth,
      actuals: s.rows.find((r: any) => r.metric == 'Actuals')?.value,
      paymentsOnChain: s.rows.find((r: any) => r.metric == 'PaymentsOnChain')?.value,
      paymentsOffChain: s.rows.find((r: any) => r.metric == 'PaymentsOffChainIncluded')?.value,
    }));

    return result;
  }

  calcDifference = (a: number, b: number) => {
    if (!a || !b) return 0;
    return (Math.abs(a) / Math.abs(b)) - 1;
  }

  convertToPositive = (a: number) => {
    if (!a) return 0;
    return Math.abs(a);
  }

}

export default (knex: Knex) => new SnapshotModel(knex);
