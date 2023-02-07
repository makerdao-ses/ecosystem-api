import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";

export class CoreUnitsResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'CoreUnitsResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`CoreUnitsResolver is resolving ${query.budgetPath.toString()}`);
        return {
            nextResolversData: {
                AccountsResolver: [query]
            },
            output: [
                { actuals: 300.00 }
            ]
        };
    }
}
