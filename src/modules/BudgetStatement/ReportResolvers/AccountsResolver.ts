import { BudgetReportOutputRow, BudgetReportResolverBase, CacheKeys, ResolverData, ResolverOutput, SerializableKey } from "../BudgetReportResolver.js";
import { Knex } from "knex";
import { LineItemFetcher, LineItemGroup } from "../LineItemFetcher.js";
import { PeriodResolverData } from "./PeriodResolver.js";
import { BudgetReportPeriod } from "../BudgetReportPeriod.js";

const DEBUG_OUTPUT = false;

export interface AccountsResolverData extends PeriodResolverData {
    account: string;
    owner: string;
    discontinued: boolean;
    discontinuedSince: string | null;
}

export class AccountsResolver extends BudgetReportResolverBase<AccountsResolverData, ResolverData> {
    readonly name = 'AccountsResolver';

    private _lineItemFetcher: LineItemFetcher;

    constructor(knex:Knex) {
        super();
        this._lineItemFetcher = new LineItemFetcher(knex);
    }

    public supportsCaching(query: AccountsResolverData): boolean {
        return true;
    }

    public getCacheKeys(query: AccountsResolverData): CacheKeys {
        return {
            account: query.account,
            start: query.start,
            end: query.end
        };
    }

    public async execute(query:AccountsResolverData): Promise<ResolverOutput<ResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`AccountsResolver is resolving ${query.budgetPath.toString()}`);
        }
        
        const result:ResolverOutput<ResolverData> = {
            nextResolversData: {},
            output: [{
                keys: query.groupPath,
                period: query.period,
                rows: [],
                cacheKeys: this.getCacheKeys(query)
            }]
        };

        const range = BudgetReportPeriod.fillRange(
            query.start as BudgetReportPeriod, 
            query.end as BudgetReportPeriod
        );

        for (const month of range) {
            const lineItemGroup: LineItemGroup = await this._lineItemFetcher.getLineItems(query.account, month.startAsSqlDate());
            const outputRows:BudgetReportOutputRow[] = lineItemGroup.categories.map(c => {
                const actualsReported = lineItemGroup.hasActuals 
                    || (lineItemGroup.latestReport !== null && lineItemGroup.latestReport.equals(lineItemGroup.month));
                
                const prediction = actualsReported ? c.numbers.actual : c.numbers.forecast;

                return {
                    account: lineItemGroup.account,
                    month: lineItemGroup.month,

                    group: c.group,
                    headcountExpense: c.headcountExpense,
                    category: c.category,
                    
                    actual: c.numbers.actual,
                    forecast: c.numbers.forecast,
                    prediction: prediction,
                    budgetCap: c.numbers.budgetCap,
                    payment: c.numbers.payment,

                    actualDiscontinued: query.discontinued ? c.numbers.actual : 0.00,
                    forecastDiscontinued: query.discontinued ? c.numbers.forecast : 0.00,
                    predictionDiscontinued: query.discontinued ? prediction : 0.00,
                    budgetCapDiscontinued: query.discontinued ? c.numbers.budgetCap : 0.00,
                    paymentDiscontinued: query.discontinued ? c.numbers.payment : 0.00,
                }
            });

            result.output[0].rows = result.output[0].rows.concat(outputRows);
        }

        if (DEBUG_OUTPUT) {
            console.log(`AccountsResolver fetched ${range.length} months of ${query.owner}/${query.account}, returning 1 group with ${result.output[0].rows.length} record(s).`);
        }
        
        return result;
    }
}
