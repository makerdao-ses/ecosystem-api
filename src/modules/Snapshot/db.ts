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
      );
    }

    return result;
  }

  async getActualsComparison(snapshotId: number, months: string[], ownerType: string, ownerId: number) {
    if (months.length < 1) return [];
    const analytics = await this.getAnalytics(months[months.length - 1], months[0], ownerType, ownerId)
    return months.map((month) => ({
      month,
      currency: "DAI",
      reportedActuals: analytics.find((a: any) => a.period == month)?.actuals,
      netExpenses: {
        onChainOnly: {
          amount: analytics.find((a: any) => a.period == month)?.paymentsOnChain,
          difference: this.calcDifference(analytics.find((a: any) => a.period == month)?.paymentsOnChain, analytics.find((a: any) => a.period == month)?.actuals),
        },
        offChainIncluded: {
          amount: snapshotId * 10000 + 100,
          difference: (snapshotId * 10000 + 100) / (snapshotId * 10000),
        },
      },
    }));
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

  // helper functions
  addOneMonth(dateString: any) {
    const [year, month] = dateString.split('/');
    let nextYear = parseInt(year);
    let nextMonth = parseInt(month);

    // Add a month
    nextMonth += 1;

    // If the next month is 13 (January of the next year), reset it to 1 and increment the year
    if (nextMonth === 13) {
      nextMonth = 1;
      nextYear += 1;
    }

    // Format the date as 'YYYY/MM'
    const formattedDate = `${nextYear}/${nextMonth.toString().padStart(2, '0')}`;

    return formattedDate;
  }

  async getAnalytics(start: string, end: string, ownerType: string, ownerId: number) {
    const path = await this.getPath(ownerType, ownerId);

    const filter = {
      start,
      end: this.addOneMonth(end),
      granularity: 'monthly',
      metrics: ['Actuals', 'PaymentsOnChain'],
      dimensions: [
        { name: 'budget', select: path, lod: 5 }
      ],
      currency: 'DAI'
    }
    const queryEngine = this.analyticsModel
    const results = await queryEngine.query(filter);
    const result = results.map((s: any) => ({
      period: s.period,
      actuals: s.rows.find((r: any) => r.metric == 'Actuals')?.value,
      paymentsOnChain: s.rows.find((r: any) => r.metric == 'PaymentsOnChain')?.value,
    }))
    return result;
  }

  private getPath = async (ownerType: string, ownerId: number | null) => {
    switch (ownerType) {
      case 'CoreUnit':
        const team = await this.coreunit.getTeams({ filter: { id: ownerId, type: ownerType } });
        return `atlas/legacy/core-units/${team[0].code}`;
      case 'Delegates':
        return 'atlas/legacy/recognized-delegates';
      case 'EcosystemActor':
        const teamCode = await this.coreunit.getTeams({ filter: { id: ownerId, type: ownerType } });
        return `atlas/scopes/SUP/incubation/${teamCode[0].code}`;
      case 'Keepers':
        return 'atlas/legacy/keespers';
      case 'SpecialPurposeFund':
        return 'atlas/legacy/spfs';
      case 'AlignedDelegates':
        return 'atlas/immutable/ads';
      default:
        return 'atlas/core-units';
    }
  };

  calcDifference = (a: number, b: number) => {
    if (!a || !b) return null;
    return Math.abs(a) / Math.abs(b);
  }

}

export default (knex: Knex) => new SnapshotModel(knex);
