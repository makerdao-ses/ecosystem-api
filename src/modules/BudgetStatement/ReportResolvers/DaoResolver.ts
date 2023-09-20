import { BudgetReportPath, BudgetReportPathSegment } from "../BudgetReportPath.js";
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
        if ((budgetCategories.filters || []).filter(f => !['core-units', 'ecosystem-actors', 'delegates'].includes(f)).length > 0) {
            throw new Error('Only budget categories \'core-units\', \'ecosystem-actors\', and \'delegates\' are supported.');
        }

        path = path.reduce();

        if (DEBUG_OUTPUT) {
            console.log(`DaoResolver is resolving budgets '${path.toString()}' from ${query.start?.toString()}-${query.end?.toString()} (DAO:${dao}; budgetCategory:${budgetCategories})`);
        }

        const result: ResolverOutput<PeriodResolverData> = {
            nextResolversData: {},
            output: []
        };

        if (budgetCategories.filters === null || budgetCategories.filters.includes('core-units')) {
            result.nextResolversData.CoreUnitsResolver = this._getCoreUnitsResolverData(query, path, dao, budgetCategories);
        }

        if (budgetCategories.filters === null || budgetCategories.filters.includes('ecosystem-actors')) {
            result.nextResolversData.EcosystemActorsResolver = this._getEcosystemActorsResolverData(query, path, dao, budgetCategories);
        }

        if (budgetCategories.filters === null || budgetCategories.filters.includes('delegates')) {
            result.nextResolversData.DelegatesResolver = this._getDelegatesResolverData(query, path, dao, budgetCategories);
        }

        return result;
    }

    private _getEcosystemActorsResolverData(query:PeriodResolverData, path:BudgetReportPath, dao:BudgetReportPathSegment, budgetCategories:BudgetReportPathSegment) {
        const groupPath = (budgetCategories.groups === null ? [dao, 'ecosystem-actors'] : [dao]);
        return [{
            start: query.start,
            end: query.end,
            period: query.period,
            categoryPath: query.categoryPath,
            budgetPath: path,
            granularity: query.granularity,
            groupPath
        }];
    }

    private _getCoreUnitsResolverData(query:PeriodResolverData, path:BudgetReportPath, dao:BudgetReportPathSegment, budgetCategories:BudgetReportPathSegment) {
        const groupPath = (budgetCategories.groups === null ? [dao, 'core-units'] : [dao]);
        return [{
            start: query.start,
            end: query.end,
            period: query.period,
            categoryPath: query.categoryPath,
            budgetPath: path,
            granularity: query.granularity,
            groupPath
        }];
    }

    private _getDelegatesResolverData(query:PeriodResolverData, path:BudgetReportPath, dao:BudgetReportPathSegment, budgetCategories:BudgetReportPathSegment) {
        const groupPath = (budgetCategories.groups === null ? [dao, 'delegates'] : [dao]);
        return [{
            start: query.start,
            end: query.end,
            period: query.period,
            categoryPath: query.categoryPath,
            budgetPath: path,
            granularity: query.granularity,
            groupPath
        }];
    }
}
