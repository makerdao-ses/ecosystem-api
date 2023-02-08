import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";

export class DaoResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'DaoResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`DaoResolver is resolving ${query.budgetPath.toString()}`);
        return {
            nextResolversData: {
                CoreUnitsResolver: [{
                    periodRange: query.periodRange,
                    categoryPath: query.categoryPath,
                    budgetPath: query.budgetPath.reduce()
                }]
            },
            output: []
        };
    }
}
