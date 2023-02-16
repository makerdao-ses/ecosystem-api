import { Knex } from "knex";

import { BudgetReportQueryEngine } from "../BudgetStatement/BudgetReportQueryEngine.js";
import { DaoResolver } from "../BudgetStatement/ReportResolvers/DaoResolver.js";
import { CoreUnitsResolver } from "../BudgetStatement//ReportResolvers/CoreUnitsResolver.js";
import { AccountsResolver } from "../BudgetStatement//ReportResolvers/AccountsResolver.js";
import { PeriodResolver } from "../BudgetStatement//ReportResolvers/PeriodResolver.js";
import { BudgetReportQuery } from "../BudgetStatement/BudgetReportQuery";

export class TotalExpensesModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async query(query:BudgetReportQuery) {
        const resolvers = [ 
            new PeriodResolver(this.knex),
            new DaoResolver(),
            new CoreUnitsResolver(this.knex),
            new AccountsResolver(this.knex)
        ];
    
        const engine = new BudgetReportQueryEngine(resolvers, 'PeriodResolver');

        return engine.execute(query);
    }
}

export default (knex: Knex) => new TotalExpensesModel(knex);