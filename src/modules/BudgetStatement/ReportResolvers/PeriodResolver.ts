import { BudgetReportGranularity } from "../BudgetReportQuery.js";
import { BudgetReportOutputGroup, BudgetReportOutputRow, BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportResolver.js";

const DEBUG_OUTPUT = false;

export class PeriodResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'PeriodResolver';

    private _granularity = BudgetReportGranularity.Total; 

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`PeriodResolver is resolving ${query.budgetPath.toString()}`);
        }
        
        this._granularity = query.granularity;

        return {
            nextResolversData: {
                DaoResolver: [query]
            },
            output: []
        };
    }

    public processOutputGroups(groups: BudgetReportOutputGroup[]): BudgetReportOutputGroup[] {
        const result:Record<string, BudgetReportOutputGroup> = {};

        for (const group of groups) {
            group.rows.forEach(r => {
                const groupName = this._getGroupName(r, group.keys);
                if (typeof result[groupName] == 'undefined') {
                    result[groupName] = {
                        keys: { period: groupName },
                        rows: [{...r}]
                    }

                } else {
                    result[groupName].rows[0].actual += r.actual;
                    result[groupName].rows[0].forecast += r.forecast;
                    result[groupName].rows[0].budgetCap += r.budgetCap;
                    result[groupName].rows[0].payment += r.payment;
                    result[groupName].rows[0].prediction += r.prediction;

                    result[groupName].rows[0].actualDiscontinued += r.actualDiscontinued;
                    result[groupName].rows[0].forecastDiscontinued += r.forecastDiscontinued;
                    result[groupName].rows[0].budgetCapDiscontinued += r.budgetCapDiscontinued;
                    result[groupName].rows[0].paymentDiscontinued += r.paymentDiscontinued;
                    result[groupName].rows[0].predictionDiscontinued += r.predictionDiscontinued;
                }                
            });
        }        
        
        return Object.values(result);
    }

    private _getGroupName(row: BudgetReportOutputRow, keys: Record<string, any>): string {
        let result = 'total';

        if (this._granularity === BudgetReportGranularity.Annual) {
            result = '' + row.month.year;
        } else if (this._granularity === BudgetReportGranularity.Quarterly) {
            result = row.month.year + '/Q' + row.month.quarter;
        } else if (this._granularity === BudgetReportGranularity.Monthly) {
            result = row.month.year + '/' + (row.month.month as number < 10 ? '0' : '') + row.month.month;
        }

        return result;
    }
}
