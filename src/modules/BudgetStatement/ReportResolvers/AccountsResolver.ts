import { BudgetReportResolver, ResolverData } from "../BudgetReportQueryEngine";

export class AccountsResolver implements BudgetReportResolver<ResolverData, ResolverData> {
    readonly name = 'AccountsResolver';

    public async execute(query:ResolverData): Promise<Record<string, ResolverData[]>> {
        console.log(`AccountsResolver is resolving ${query.budgetPath.toString()}`);
        return {};
    }

    public async executeBatch(queries:ResolverData[]): Promise<Record<string, ResolverData[]>> {
        let result = {};
        queries.forEach(async (resolverData) => {
            const obj = await this.execute(resolverData);
            result = {...result, ...obj};
        });
        
        return result;
    }
}
