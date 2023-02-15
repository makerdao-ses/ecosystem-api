import { BudgetReportPeriod } from "./BudgetReportPeriod";
import { BudgetReportPath } from "./BudgetReportPath";

export interface BudgetReportQuery {
    start: BudgetReportPeriodInput,
    end: BudgetReportPeriodInput,
    granularity: BudgetReportGranularity,
    budgets: BudgetReportPathInput,
    categories: BudgetReportPathInput
}

export type BudgetReportPeriodInput =  BudgetReportPeriod | string | null;
export type BudgetReportPathInput = BudgetReportPath | string;

export enum BudgetReportGranularity {
    Total,
    Annual,
    Quarterly,
    Monthly
}
