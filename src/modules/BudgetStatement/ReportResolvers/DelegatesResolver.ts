import { BudgetReportPeriod } from "../BudgetReportPeriod.js";
import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportResolver.js";
import { AccountsResolverData } from "./AccountsResolver.js";
import delegatesData from "./DelegatesResolverData.js";

const DEBUG_OUTPUT = false;

interface DelegateRecord {
    account: string;
    month: string;
    group: string;
    headcountExpense: boolean;
    category: string;
    actual: number;
    forecast: number;
    prediction: number;
    payment: number;
}

export class DelegatesResolver extends BudgetReportResolverBase<AccountsResolverData, ResolverData> {
    readonly name = 'DelegatesResolver';

    private _delegateNumbersByMonth: Record<string, DelegateRecord[]>;

    constructor() {
        super();
        this._delegateNumbersByMonth = {};

        delegatesData.forEach(d => {
            if (!this._delegateNumbersByMonth[d.month]) {
                this._delegateNumbersByMonth[d.month] = [];
            }

            this._delegateNumbersByMonth[d.month].push(d);
        });
    }
    
    public async execute(query: AccountsResolverData): Promise<ResolverOutput<ResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`DelegatesResolver is resolving ${query.budgetPath.toString()}`);
        }
        
        const result:ResolverOutput<ResolverData> = {
            nextResolversData: {},
            output: [{
                keys: query.groupPath,
                period: query.period,
                rows: [],
                cacheKeys: null
            }]
        };

        const range = BudgetReportPeriod.fillRange(
            query.start as BudgetReportPeriod, 
            query.end as BudgetReportPeriod
        );

        for (const month of range) {
            const delegateNumbers = this._delegateNumbersByMonth[month.toString()] || [];
            result.output[0].rows = result.output[0].rows.concat(delegateNumbers.map(d => ({
                account: d.account,
                month: BudgetReportPeriod.fromString(d.month),

                group: d.group,
                headcountExpense: d.headcountExpense,
                category: d.category,
                
                actual: d.actual,
                forecast: d.forecast,
                prediction: d.prediction,
                budgetCap: 0.00,
                payment: d.payment,

                actualDiscontinued: 0.00,
                forecastDiscontinued: 0.00,
                predictionDiscontinued: 0.00,
                budgetCapDiscontinued: 0.00,
                paymentDiscontinued: 0.00
            })));
        }

        if (DEBUG_OUTPUT) {
            console.log(`DelegatesResolver fetched ${range.length} months of delegates information, returning 1 group with ${result.output[0].rows.length} record(s).`);
        }
        
        return result;
    }
}