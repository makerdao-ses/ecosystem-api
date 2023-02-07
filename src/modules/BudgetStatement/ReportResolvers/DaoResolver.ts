import { BudgetReportResolver, ResolverData } from "../BudgetReportQueryEngine";

export class DaoResolver implements BudgetReportResolver<ResolverData, ResolverData> {
    readonly name = 'DaoResolver';

    public async execute(query:ResolverData): Promise<Record<string, ResolverData[]>> {
        console.log(`DaoResolver is resolving ${query.budgetPath.toString()}`);
        return {
            CoreUnitsResolver: [{
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
