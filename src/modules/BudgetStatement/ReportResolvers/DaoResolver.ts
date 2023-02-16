import { BudgetReportResolverBase, ResolverOutput } from "../BudgetReportResolver.js";
import { PeriodResolverData } from "./PeriodResolver.js";

const DEBUG_OUTPUT = false;

export class DaoResolver extends BudgetReportResolverBase<PeriodResolverData, PeriodResolverData> {
    readonly name = 'DaoResolver';

    public async execute(query:PeriodResolverData): Promise<ResolverOutput<PeriodResolverData>> {
        let path = query.budgetPath;

        const dao = path.nextSegment();
        if (dao.toString() != 'makerdao') {
            throw new Error('Only makerdao supported for now.');
        }

        path = path.reduce();        
        const budgetCategories = path.nextSegment();
        if (budgetCategories.toString() != 'core-units') {
            throw new Error('Only budget category core-units supported for now.');
        }

        path = path.reduce();

        if (DEBUG_OUTPUT) {
            console.log(`DaoResolver is resolving budgets '${path.toString()}' from ${query.start?.toString()}-${query.end?.toString()} (DAO:${dao}; budgetCategory:${budgetCategories})`);
        }

        return {
            nextResolversData: {
                CoreUnitsResolver: [{
                    start: query.start,
                    end: query.end,
                    period: query.period,
                    categoryPath: query.categoryPath,
                    budgetPath: path,
                    granularity: query.granularity,
                    groupPath: [dao, budgetCategories]
                }]
            },
            output: []
        };
    }
}
