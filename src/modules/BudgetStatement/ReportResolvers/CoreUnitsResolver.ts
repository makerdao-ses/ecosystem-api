import { BudgetReportResolver, ResolverData } from "../BudgetReportQueryEngine";

export class CoreUnitsResolver implements BudgetReportResolver<ResolverData, ResolverData> {
    readonly name = 'CoreUnitsResolver';

    public async execute(query:ResolverData): Promise<Record<string, ResolverData[]>> {
        console.log(`CoreUnitsResolver is resolving ${query.budgetPath.toString()}`);
        return {
            AccountsResolver: [{
                budgetPath: query.budgetPath,
                categoryPath: query.categoryPath,
                periodRange: query.periodRange
            }]
        };
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
