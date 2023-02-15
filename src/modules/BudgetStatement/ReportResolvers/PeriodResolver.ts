import { BudgetReportGranularity } from "../BudgetReportQuery";
import { BudgetReportOutputGroup, BudgetReportOutputRow, BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";

export class PeriodResolver extends BudgetReportResolverBase<ResolverData, ResolverData> {
    readonly name = 'PeriodResolver';

    private _granularity = BudgetReportGranularity.Total; 

    public async execute(query:ResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`PeriodResolver is resolving ${query.budgetPath.toString()}`);
        
        this._granularity = query.granularity;

        return {
            nextResolversData: {
                DaoResolver: [query]
            },
            output: []
        };
    }

    public processOutputGroups(groups: BudgetReportOutputGroup[]): BudgetReportOutputGroup[] {
        /*
        groups.forEach(g => {
            g.rows = this.processOutputRows(g.rows, g.keys);
        });
        */

        let i=0;
        //let fs = require('fs');

        const result:Record<string, BudgetReportOutputGroup> = {};
        for (const group of groups) {
            
            const debugOutput = group.rows.map(r => ({
                groupName: this._getGroupName(r, group.keys),
                category: r.category,
                month: r.month.toString(),
                actual: r.actual,
                forecast: r.forecast,
                budgetCap: r.budgetCap,
                payment: r.payment,
                prediction: r.prediction
            }));
        
            /*fs.writeFile(group.keys.account + "-data.json", JSON.stringify(debugOutput), function(err:any) {
                if (err) {
                    console.log(err);
                }
            });*/
            

            group.rows.forEach(r => {
                const groupName = this._getGroupName(r, group.keys);

                if (typeof result[groupName] == 'undefined') {
                    result[groupName] = {
                        keys: { period: groupName },
                        rows: [{...r}]
                    }

                    //console.log("New group: ", groupName, result[groupName]);
                
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

                
                if (groupName.slice(0,7) == "2021/06" && i++ < 3) {
                    //console.log(group.keys, r, this._granularity, this._getGroupName(r, group.keys));
                }
                
            });
        }

        
        Object.values(result).filter(r => r.keys.period.slice(0,7) == '2021/06').forEach(r => {
            //console.log(r.keys.period, r.rows[0]);
        });
        
        
        return Object.values(result);
    }

    private _getGroupName(row: BudgetReportOutputRow, keys: Record<string, any>): string {
        let result = 'totals';

        if (this._granularity === BudgetReportGranularity.Annual) {
            result = '' + row.month.year;
        } else if (this._granularity === BudgetReportGranularity.Quarterly) {
            result = row.month.year + '/Q' + row.month.quarter;
        } else if (this._granularity === BudgetReportGranularity.Monthly) {
            result = row.month.year + '/' + (row.month.month as number < 10 ? '0' : '') + row.month.month;
        }

        //return row.account.slice(0,6) + '/' + result;
        return result /*+ '/' + keys.owner*/;
    }
}
