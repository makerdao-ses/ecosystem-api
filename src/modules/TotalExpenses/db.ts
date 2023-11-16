import { Knex } from "knex";

import { BudgetReportQueryEngine } from "../BudgetStatement/BudgetReportQueryEngine.js";
import { DaoResolver } from "../BudgetStatement/ReportResolvers/DaoResolver.js";
import { ContributorTeamsResolver } from "../BudgetStatement//ReportResolvers/ContributorTeamsResolver.js";
import { AccountsResolver } from "../BudgetStatement//ReportResolvers/AccountsResolver.js";
import { PeriodResolver } from "../BudgetStatement//ReportResolvers/PeriodResolver.js";
import { BudgetReportQuery } from "../BudgetStatement/BudgetReportQuery.js";
import { DelegatesResolver } from "../BudgetStatement/ReportResolvers/DelegatesResolver.js";
import { ResolverCache } from "../BudgetStatement/ResolverCache.js";

export class TotalExpensesModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async query(query: BudgetReportQuery) {
    const resolvers = [
      new PeriodResolver(this.knex),
      new DaoResolver(),
      new DelegatesResolver(this.knex),
      new ContributorTeamsResolver(this.knex, false),
      new ContributorTeamsResolver(this.knex, true),
      new AccountsResolver(this.knex),
    ];

    const engine = new BudgetReportQueryEngine(
      resolvers,
      "PeriodResolver",
      new ResolverCache(this.knex),
    );

    return engine.execute(query);
  }
}

export default (knex: Knex) => new TotalExpensesModel(knex);
