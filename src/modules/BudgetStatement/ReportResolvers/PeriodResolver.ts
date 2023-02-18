import { Knex } from "knex";
import { LineItemFetcher } from "../LineItemFetcher.js";
import { BudgetReportPeriod, BudgetReportPeriodType } from "../BudgetReportPeriod.js";
import { BudgetReportGranularity, BudgetReportPeriodInput } from "../BudgetReportQuery.js";
import { BudgetReportOutputGroup, BudgetReportOutputRow, BudgetReportResolverBase, ResolverData, ResolverOutput, SerializableKey } from "../BudgetReportResolver.js";

const DEBUG_OUTPUT = false;

export interface PeriodResolverData extends ResolverData {
    period: string
}

export class PeriodResolver extends BudgetReportResolverBase<ResolverData, PeriodResolverData> {
    readonly name = 'PeriodResolver';

    private _lineItemFetcher: LineItemFetcher;
    private _granularity = BudgetReportGranularity.Total; 

    constructor(knex:Knex) {
        super();
        this._lineItemFetcher = new LineItemFetcher(knex);
    }

    public async execute(query:ResolverData): Promise<ResolverOutput<PeriodResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`PeriodResolver is resolving ${query.budgetPath.toString()}`);
        }
        
        const periodRange = await this._resolvePeriodRange(query.start, query.end);
        if (periodRange[0].type !== BudgetReportPeriodType.Month) {
            throw new Error('Quarters and years are not allowed as query start or end values. Use the respective months instead.');
        }

        this._granularity = query.granularity;

        const map = this._groupByGranularity(periodRange, query.granularity);
        const queries:PeriodResolverData[] = Object.keys(map).map(period => ({
            start: map[period][0],
            end: map[period][map[period].length-1],
            period: period,
            granularity: query.granularity,
            budgetPath: query.budgetPath,
            categoryPath: query.categoryPath,
            groupPath: []
        }));

        return {
            nextResolversData: { DaoResolver: queries },
            output: []
        };
    }

    public processOutputGroups(groups: BudgetReportOutputGroup[]): BudgetReportOutputGroup[] {
        const result:Record<string, BudgetReportOutputGroup> = {};

        if (DEBUG_OUTPUT) {
            console.log('PeriodResolver is processing groups', groups);
        }

        for (const group of groups) {
            group.rows.forEach(r => {
                const groupName = this._getGroupName(r, group.keys);
                if (typeof result[groupName] == 'undefined') {
                    result[groupName] = {
                        keys: group.keys,
                        period: group.period,
                        rows: [{...r}],
                        cacheKeys: null
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

    private _groupByGranularity(range:BudgetReportPeriod[], granularity:BudgetReportGranularity): Record<string,BudgetReportPeriod[]> {
        const map: Record<string, BudgetReportPeriod[]> = {};
        
        let getKey: {(p:BudgetReportPeriod):string};
        switch (granularity) {
            case BudgetReportGranularity.Monthly:
                getKey = (p:BudgetReportPeriod) => p.toString();
                break; 

            case BudgetReportGranularity.Quarterly:
                getKey = (p:BudgetReportPeriod) => `${p.year}/Q${p.quarter}`;
                break;

            case BudgetReportGranularity.Annual:
                getKey = (p:BudgetReportPeriod) => p.year.toString();
                break;

            case BudgetReportGranularity.Total:
                getKey = () => 'total';
                break;
        }

        range.forEach(period => {
            const key = getKey(period);
            if (!map[key]) {
                map[key] = [];
            }
            map[key].push(period);
        });

        return map;
    }

    private async _resolvePeriodRange(start:BudgetReportPeriodInput, end:BudgetReportPeriodInput): Promise<BudgetReportPeriod[]> {
        let first: BudgetReportPeriod, last:BudgetReportPeriod;

        if (start === null || end === null) {
            const availableMonths = await this._lineItemFetcher.getAvailableMonthsRange();

            first = availableMonths.first;
            if (start !== null) {
                first = (typeof start === 'string') ? BudgetReportPeriod.fromString(start) : start;
            }
            
            last = availableMonths.last;
            if (end !== null) {
                last = (typeof end === 'string') ? BudgetReportPeriod.fromString(end) : end;
            }

        } else {
            first = (typeof start === 'string') ? BudgetReportPeriod.fromString(start) : start;
            last = (typeof end === 'string') ? BudgetReportPeriod.fromString(end) : end;
        }

        return BudgetReportPeriod.fillRange(first, last);
    }

    private _getGroupName(row: BudgetReportOutputRow, keys: SerializableKey[]): string {
        let result = keys.join('/') + '/';

        if (this._granularity === BudgetReportGranularity.Annual) {
            result += row.month.year;
        } else if (this._granularity === BudgetReportGranularity.Quarterly) {
            result += row.month.year + '/Q' + row.month.quarter;
        } else if (this._granularity === BudgetReportGranularity.Monthly) {
            result += row.month.year + '/' + (row.month.month as number < 10 ? '0' : '') + row.month.month;
        }

        return result;
    }
}
