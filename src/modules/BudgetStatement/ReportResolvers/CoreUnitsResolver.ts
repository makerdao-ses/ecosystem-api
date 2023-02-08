import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";
import { AccountsResolverData } from "./AccountsResolver.js";

export class CoreUnitsResolver extends BudgetReportResolverBase<ResolverData, AccountsResolverData> {
    readonly name = 'CoreUnitsResolver';

    public async execute(query:ResolverData): Promise<ResolverOutput<AccountsResolverData>> {
        console.log(`CoreUnitsResolver is resolving ${query.budgetPath.toString()}`);

        const enhancedQuery = {
            account: '0x7c09ff9b59baaebfd721cbda3676826aa6d7bae8',
            periodRange: query.periodRange,
            categoryPath: query.categoryPath,
            budgetPath: query.budgetPath.reduce()
        }
        
        return {
            nextResolversData: {
                AccountsResolver: [enhancedQuery]
            },
            output: []
        };
    }
}
