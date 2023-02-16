import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportResolver.js";

const DEBUG_OUTPUT = false;

export class DaoResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'DaoResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`DaoResolver is resolving ${query.budgetPath.toString()}`);
        }

        return {
            nextResolversData: {
                CoreUnitsResolver: [{
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
