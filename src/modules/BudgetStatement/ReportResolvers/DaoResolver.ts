import { BudgetReportResolverBase, ResolverOutput } from "../BudgetReportResolver.js";
import { PeriodResolverData } from "./PeriodResolver.js";

const DEBUG_OUTPUT = false;

export class DaoResolver extends BudgetReportResolverBase<PeriodResolverData, PeriodResolverData> {
    readonly name = 'DaoResolver';

    public async execute(query:PeriodResolverData): Promise<ResolverOutput<PeriodResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`DaoResolver is resolving ${query.budgetPath.toString()}`);
        }

        return {
            nextResolversData: {
                CoreUnitsResolver: [{
                    start: query.start,
                    end: query.end,
                    periodRange: query.periodRange,
                    categoryPath: query.categoryPath,
                    budgetPath: query.budgetPath.reduce().reduce(),
                    granularity: query.granularity
                }]
            },
            output: []
        };
    }
}
