import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";

export class AccountsResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'AccountsResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`AccountsResolver is resolving ${query.budgetPath.toString()}`);
        return {
            nextResolversData: {},
            output: [
                { actuals: 100.00 },
                { actuals: 200.00 },
            ]
        };
    }
}
