import { Knex } from "knex";
import { getOwnerFromBudgetPath } from "./schema/utils.js";

export interface BudgetStatement {
  id: string;
  ownerId: number;
  ownerType: string;
  month: string;
  budgetStatus: string;
  publicationUrl: string;
  ownerCode: string;
  status: string;
  mkrProgramLength: number;
  auditReport: object;
  budgetStatementFTEs: object;
  budgetStatementMKRVest: object;
  budgetStatementWallet: object;
}

export interface AuditReport {
  id: string;
  budgetStatementId: string;
  auditStatus: string;
  reportUrl: string;
  timestamp: string;
}

export interface BudgetStatementFTEs {
  id: string;
  budgetStatementId: string;
  month: string;
  ftes: number;
}

export interface BudgetStatementMKRVest {
  id: string;
  budgetStatementId: string;
  vestingDate: string;
  mkrAmount: number;
  mkrAmountOld: number;
  comments: string;
}

export interface BudgetStatementWallet {
  id: string;
  budgetStatementId: string;
  name: string;
  address: string;
  currentBalance: number;
  topupTransfer: number;
  comments: string;
  budgetStatementLineItem: object;
  budgetStatementPayment: object;
  budgetStatementTransferRequest: object;
}

export interface BudgetStatementLineItem {
  id: string;
  budgetStatementWalletId: string;
  month: string;
  position: number;
  group: string;
  budgetCategory: string;
  forecast: number;
  actual: number;
  comments: string;
  canonicalBudgetCategory: object;
  headcountExpense: boolean;
  budgetCap: number;
  payment: number;
}

export interface BudgetStatementPayment {
  id: string;
  budgetStatementWalletId: string;
  transactionDate: string;
  transactionId: string;
  budgetStatementLineItemId: number;
  comments: string;
}

export interface BudgetStatementTransferRequest {
  id: string;
  budgetStatementWalletId: string;
  budgetStatementPaymentId: string;
  requestAmount: number;
  comments: string;
  walletBalance: number;
}

type lineItem = {
  id?: string;
  budgetStatementWalletId: string;
  month: string;
  position: number | string;
  group: string;
  budgetCategory: string;
  forecast: number | string;
  actual: number | string;
  comments: string;
  canonicalBudgetCategory: string;
  headcountExpense: boolean | string;
  budgetCap: number | string;
  payment: number | string;
};

type FTE = {
  id?: string;
  budgetStatementId: string;
  month: string;
  ftes: number;
};

export interface BudgetStatementComment {
  id: string;
  budgetStatementId: string;
  timestamp: string;
  comment: string;
  status: string;
}

export interface BudgetStatementCommentAuthor {
  id: string;
  name: string;
}

export interface BudgetStatementFilter {
  id?: number;
  ownerId?: number;
  ownerType?: string;
  month?: string;
  status?: string;
  ownerCode?: string;
  mkrProgramLength?: number;
  budgetPath?: string;
  lastModified?: boolean
}

export interface BudgetStatementWalletFilter {
  id?: number;
  budgetStatementId?: number;
  name?: string;
  address?: string;
  currentBalance?: number;
  topupTransfer?: number;
  comments?: string;
}

export interface AuditReportFilter {
  id?: number;
  budgetStatementId?: number;
  auditStatus?: string;
  reportUrl?: string;
  timestamp?: string;
}

export interface BudgetStatementFteFilter {
  id?: number;
  budgetStatementId?: number;
  month?: string;
  ftes?: number;
}

export interface BudgetStatementMKRVEstFilter {
  id?: number;
  budgetStatementId?: number;
  vestingDate?: string;
  mkrAmount?: number;
  mkrAmountOld?: number;
  comments?: string;
}

export interface BudgetStatementPaymentFilter {
  id?: number;
  budgetStatementWalletId?: number;
  transactionDate?: string;
  transactionId?: string;
  budgetStatementLineItemId?: number;
  comments?: string;
}

export interface BudgetStatementTransferRequestFilter {
  id?: number;
  budgetStatementWalletId?: number;
  budgetStatementPaymentId?: number;
  requestAmount?: number;
  walletBalance?: number;
}

export class BudgetStatementModel {
  knex: Knex;
  coreUnitModel: object;
  authModel: object;

  constructor(knex: Knex, coreUnitModel: object, authModel: object) {
    this.knex = knex;
    this.coreUnitModel = coreUnitModel;
    this.authModel = authModel;
  }

  async getAllBsEvents() {
    const arr = await this.knex
      .select(this.knex.raw("DISTINCT(params->>'budgetStatementId') as id"), "created_at")
      .from("ChangeTrackingEvents")
      .whereRaw("params->>'budgetStatementId' IS NOT NULL")
      .orderBy("ChangeTrackingEvents.created_at", "desc");

    const result = arr.reduce((acc, current) => {
      const x = acc.find((item: any) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }

  async getBudgetStatements(filter: {
    limit?: number;
    offset?: number;
    filter?: BudgetStatementFilter;
  }): Promise<BudgetStatement[]> {
    let query = this.knex
      .select("*")
      .from("BudgetStatement")
      .orderBy("month", "desc");




    if (filter?.limit !== undefined && filter?.offset !== undefined) {
      query = query.limit(filter.limit).offset(filter.offset);
    }

    if (filter.filter?.budgetPath !== undefined) {
      const { ownerType, ownerId } = await getOwnerFromBudgetPath(filter.filter.budgetPath, this.knex);
      if (ownerType && ownerId) {
        filter.filter.ownerType = ownerType;
        filter.filter.ownerId = ownerId;
      }
    }

    if (filter.filter) {
      if (filter.filter.ownerType !== undefined) {
        query = query.where("ownerType", filter.filter.ownerType);
      }

      if (filter.filter.id !== undefined) {
        query = query.andWhere("id", filter.filter.id);
      }

      if (filter.filter.ownerId !== undefined) {
        query = query.andWhere("ownerId", filter.filter.ownerId);
      }

      if (filter.filter.month !== undefined) {
        query = query.andWhere("month", filter.filter.month);
      }

      if (filter.filter.status !== undefined) {
        query = query.andWhere('status', 'in', filter.filter.status);
      }

      if (filter.filter.ownerCode !== undefined) {
        query = query.andWhere("ownerCode", filter.filter.ownerCode);
      }

      if (filter.filter.mkrProgramLength !== undefined) {
        query = query.andWhere("mkrProgramLength", filter.filter.mkrProgramLength);
      }
    }

    if (filter?.filter?.lastModified) {
      const budgetStatementsIds = await this.getAllBsEvents();
      const ids = budgetStatementsIds.map((item: any) => item.id);
      query = query.whereIn("id", ids);
      // sort result by last modified
      query = query.orderByRaw(`position(id::text in '${ids.join(",")}')`);
    }

    return await query;
  }

  async getBSOwnerType(id: number | string) {
    return this.knex
      .select("ownerType")
      .from("BudgetStatement")
      .where("id", id);
  }

  async getAuditReports(filter?: AuditReportFilter): Promise<AuditReport[]> {
    const baseQuery = this.knex.select("*").from("AuditReport").orderBy("id");
    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementId !== undefined) {
      return baseQuery.where("budgetStatementId", filter.budgetStatementId);
    } else if (filter?.auditStatus !== undefined) {
      return baseQuery.where("auditStatus", filter.auditStatus);
    } else if (filter?.reportUrl !== undefined) {
      return baseQuery.where("reportUrl", filter.reportUrl);
    } else if (filter?.timestamp !== undefined) {
      return baseQuery.where("timestamp", filter.timestamp);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementFTEs(
    filter?: BudgetStatementFteFilter,
  ): Promise<BudgetStatementFTEs[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementFtes")
      .orderBy("id");
    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementId !== undefined) {
      return baseQuery.where("budgetStatementId", filter.budgetStatementId);
    } else if (filter?.month !== undefined) {
      return baseQuery.where("month", filter.month);
    } else if (filter?.ftes !== undefined) {
      return baseQuery.where("ftes", filter.ftes);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementMKRVests(
    filter?: BudgetStatementMKRVEstFilter,
  ): Promise<BudgetStatementMKRVest[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementMkrVest")
      .orderBy("id");
    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementId !== undefined) {
      return baseQuery.where("budgetStatementId", filter.budgetStatementId);
    } else if (filter?.vestingDate !== undefined) {
      return baseQuery.where("vestingDate", filter.vestingDate);
    } else if (filter?.mkrAmount !== undefined) {
      return baseQuery.where("mkrAmount", filter.mkrAmount);
    } else if (filter?.mkrAmountOld !== undefined) {
      return baseQuery.where("mkrAmountOld", filter.mkrAmountOld);
    } else if (filter?.comments !== undefined) {
      return baseQuery.where("comments", filter.comments);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementWallets(
    filter?: BudgetStatementWalletFilter,
  ): Promise<BudgetStatementWallet[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementWallet")
      .orderBy("id");

    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementId !== undefined) {
      return baseQuery.where("budgetStatementId", filter.budgetStatementId);
    } else if (filter?.name !== undefined) {
      return baseQuery.where("name", filter.name);
    } else if (filter?.address !== undefined) {
      return baseQuery.where("address", filter.address);
    } else if (filter?.currentBalance !== undefined) {
      return baseQuery.where("currentBalance", filter.currentBalance);
    } else if (filter?.topupTransfer !== undefined) {
      return baseQuery.where("topupTransfer", filter.topupTransfer);
    } else if (filter?.comments !== undefined) {
      return baseQuery.where("comments", filter.comments);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementLineItems(
    limit?: number | undefined,
    offset?: number | undefined,
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
    secondParamName?: string | undefined,
    secondParamValue?: string | number | boolean | undefined,
  ): Promise<BudgetStatementLineItem[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementLineItem")
      .orderBy("month", "desc");
    if (offset != undefined && limit != undefined) {
      return baseQuery.limit(limit).offset(offset);
    } else if (
      paramName !== undefined &&
      paramValue !== undefined &&
      secondParamName === undefined &&
      secondParamValue === undefined
    ) {
      return baseQuery.where(`${paramName}`, paramValue);
    } else if (
      paramName !== undefined &&
      paramValue !== undefined &&
      secondParamName !== undefined &&
      secondParamValue !== undefined
    ) {
      return baseQuery
        .where(`${paramName}`, paramValue)
        .andWhere(`${secondParamName}`, secondParamValue);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementPayments(
    filter?: BudgetStatementPaymentFilter,
  ): Promise<BudgetStatementPayment[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementPayment")
      .orderBy("id");

    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementWalletId !== undefined) {
      return baseQuery.where(
        "budgetStatementWalletId",
        filter.budgetStatementWalletId,
      );
    } else if (filter?.transactionDate !== undefined) {
      return baseQuery.where("transactionDate", filter.transactionDate);
    } else if (filter?.transactionId !== undefined) {
      return baseQuery.where("transactionId", filter.transactionId);
    } else if (filter?.budgetStatementLineItemId !== undefined) {
      return baseQuery.where(
        "budgetStatementLineItemId",
        filter.budgetStatementLineItemId,
      );
    } else if (filter?.comments !== undefined) {
      return baseQuery.where("comments", filter.comments);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementTransferRequests(
    filter?: BudgetStatementTransferRequestFilter,
  ): Promise<BudgetStatementTransferRequest[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementTransferRequest")
      .orderBy("id");
    if (filter?.id !== undefined) {
      return baseQuery.where("id", filter.id);
    } else if (filter?.budgetStatementWalletId !== undefined) {
      return baseQuery.where(
        "budgetStatementWalletId",
        filter.budgetStatementWalletId,
      );
    } else if (filter?.budgetStatementPaymentId !== undefined) {
      return baseQuery.where(
        "budgetStatementPaymentId",
        filter.budgetStatementPaymentId,
      );
    } else if (filter?.requestAmount !== undefined) {
      return baseQuery.where("requestAmount", filter.requestAmount);
    } else if (filter?.walletBalance !== undefined) {
      return baseQuery.where("walletBalance", filter.walletBalance);
    } else {
      return baseQuery;
    }
  }

  async getBudgetStatementComments(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
    secondParamName?: string | undefined,
    secondParamValue?: string | number | boolean | undefined,
  ): Promise<BudgetStatementComment[]> {
    const baseQuery = this.knex
      .select("*")
      .from("BudgetStatementComment")
      .orderBy("id");
    if (
      paramName !== undefined &&
      paramValue !== undefined &&
      secondParamName === undefined &&
      secondParamValue === undefined
    ) {
      return baseQuery.where(`${paramName}`, paramValue);
    } else if (
      paramName !== undefined &&
      paramValue !== undefined &&
      secondParamName !== undefined &&
      secondParamValue !== undefined
    ) {
      return baseQuery
        .where(`${paramName}`, paramValue)
        .andWhere(`${secondParamName}`, secondParamValue);
    } else {
      return baseQuery;
    }
  }

  // ------------------- Adding data --------------------------------

  async addBatchLineItems(rows: object[]) {
    const chunkSize = rows.length;
    return this.knex
      .batchInsert("BudgetStatementLineItem", rows, chunkSize)
      .returning("*");
  }

  async addBatchBudgetStatements(rows: object[]) {
    const chunkSize = rows.length;
    return this.knex
      .batchInsert("BudgetStatement", rows, chunkSize)
      .returning("*");
  }

  async addBudgetStatementWallets(rows: object[]) {
    const chunkSize = rows.length;
    return this.knex
      .batchInsert("BudgetStatementWallet", rows, chunkSize)
      .returning("*");
  }

  async addBudgetStatementFTE(input: FTE) {
    return this.knex("BudgetStatementFtes")
      .insert({
        budgetStatementId: input.budgetStatementId,
        month: input.month,
        ftes: input.ftes,
      })
      .returning("*");
  }

  async addBudgetStatementComment(
    authorId: number,
    budgetStatementId: number,
    comment: string,
    status: string | undefined | null,
  ): Promise<BudgetStatementComment[]> {
    const [statement] = await this.knex("BudgetStatement").where(
      "id",
      budgetStatementId,
    );
    if (
      status !== undefined &&
      status !== null &&
      status !== statement.status
    ) {
      await this.knex("BudgetStatement")
        .where("id", budgetStatementId)
        .update({ status });
      return this.knex("BudgetStatementComment")
        .insert({
          authorId,
          budgetStatementId,
          timestamp: new Date().toISOString(),
          comment,
          status,
        })
        .returning("*");
    } else {
      return this.knex("BudgetStatementComment")
        .insert({
          authorId,
          budgetStatementId,
          timestamp: new Date().toISOString(),
          comment,
          status: statement.status,
        })
        .returning("*");
    }
  }

  // ------------------- Updating data --------------------------------

  async updateLineItem(lineItem: lineItem) {
    const id = lineItem.id;
    delete lineItem.id;
    return this.knex("BudgetStatementLineItem")
      .where("id", id)
      .update(lineItem)
      .returning("*");
  }

  async updateBudgetStatementFTE(input: FTE) {
    const id = input.id;
    delete input.id;
    return this.knex("BudgetStatementFtes")
      .where("id", id)
      .update(input)
      .returning("*");
  }

  async batchUpdateLineItems(lineItems: lineItem[]) {
    const trx = await this.knex.transaction();
    try {
      const result = await Promise.all(
        lineItems.map((lineItem) => {
          const id = lineItem.id;
          delete lineItem.id;
          return this.knex("BudgetStatementLineItem")
            .where("id", id)
            .update(lineItem)
            .transacting(trx)
            .returning("*");
        }),
      );
      await trx.commit();
      return result.flat();
    } catch (error) {
      await trx.rollback();
    }
  }

  async batchDeleteLineItems(lineItems: lineItem[]) {
    const trx = await this.knex.transaction();
    try {
      const result = await Promise.all(
        lineItems.map((lineItem) => {
          const id = lineItem.id;
          delete lineItem.id;
          return this.knex("BudgetStatementLineItem")
            .where("id", id)
            .del(lineItem as any)
            .transacting(trx)
            .returning("*");
        }),
      );
      await trx.commit();
      return result.flat();
    } catch (error) {
      await trx.rollback();
    }
  }

  async budgetStatementCommentDelete(commentId: number) {
    return await this.knex("BudgetStatementComment")
      .where("id", commentId)
      .del()
      .returning("*");
  }
}

export default (knex: Knex, deps: { [key: string]: object }) =>
  new BudgetStatementModel(knex, deps["CoreUnit"], deps["Auth"]);
