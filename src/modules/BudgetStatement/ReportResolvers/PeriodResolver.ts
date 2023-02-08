import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";

export class PeriodResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'PeriodResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`PeriodResolver is resolving ${query.budgetPath.toString()}`);
        return {
            nextResolversData: {
                DaoResolver: [query]
            },
            output: []
        };
    }
}
