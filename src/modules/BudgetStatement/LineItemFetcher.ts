import { Knex } from "knex";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";

export interface LineItemGroup {
    account: string,
    month: BudgetReportPeriod,
    latestReport: BudgetReportPeriod | null,
    hasActuals: boolean,
    fteCap: number | null,
    categories: LineItemCategory[],
}

export interface LineItemCategory {
    group: string | null,
    headcountExpense: boolean | null,
    category: string | null,
    numbers: LineItemNumbers,
    reports: Record<string, LineItemNumbers>,
    obsolete: boolean,
    hasError: boolean
}

export interface LineItemNumbers {
    actual: number,
    forecast: number,
    budgetCap: number,
    payment: number,
}

export interface CapNumbers {
    start: string,
    end: string,
    fteCap: number,
    budgetCap: number
}

export class LineItemFetcher {
    private _knex:Knex;

    public static lineItemGroupToString(lineItems: LineItemGroup): string {
        let result = `${lineItems.month.toString()} [${lineItems.account}]`;
        result += ` - latestReport:${lineItems.latestReport?.toString()} - hasActuals:${lineItems.hasActuals}`;
        result += ` - obsolete:${lineItems.categories.reduce((obs, cat) => obs + (cat.obsolete ? 1 : 0), 0)}`;
        result += ` - fteCap:${lineItems.fteCap === null ? '(not set)' : lineItems.fteCap}\n\n`;

        const totals: LineItemNumbers = {
            actual: 0.00,
            forecast: 0.00,
            budgetCap: 0.00,
            payment: 0.00
        };

        result += '   ' + LineItemFetcher._padString('GROUP', 15) + ' '
            + LineItemFetcher._padString('CATEGORY', 24, true) + ' '
            + LineItemFetcher._padString('ACTUALS', 15, true) 
            + LineItemFetcher._padString('FORECAST', 15, true) 
            + LineItemFetcher._padString('BUDGET CAP', 15, true) 
            + LineItemFetcher._padString('PAYMENTS', 15, true)
            + '     REPORTS\n';

        lineItems.categories.forEach(c => {
            result += c.obsolete ? '*' : ' ';
            result += c.hasError ? 'F ' : '  ';
            result += LineItemFetcher._padString(c.group || '-', 15) + ' ' 
            result += LineItemFetcher._padString(c.category || '-', 24, true) + ' ';
            result += LineItemFetcher._padNumber(c.numbers.actual, 15);
            result += LineItemFetcher._padNumber(c.numbers.forecast, 15);
            result += LineItemFetcher._padNumber(c.numbers.budgetCap, 15);
            result += LineItemFetcher._padNumber(c.numbers.payment, 15);
            result += '  << ' + Object.keys(c.reports).join(', ');
            result += '\n';

            totals.actual += c.numbers.actual;
            totals.forecast += c.numbers.forecast;
            totals.budgetCap += c.numbers.budgetCap;
            totals.payment += c.numbers.payment;
        });

        result += LineItemFetcher._padString('-----', 59, true);
        result += LineItemFetcher._padString('-----', 15, true);
        result += LineItemFetcher._padString('-----', 15, true);
        result += LineItemFetcher._padString('-----', 15, true) + '\n';

        result += LineItemFetcher._padNumber(totals.actual, 59);
        result += LineItemFetcher._padNumber(totals.forecast, 15);
        result += LineItemFetcher._padNumber(totals.budgetCap, 15);
        result += LineItemFetcher._padNumber(totals.payment, 15) + '\n';

        return result;
    }

    private static _padNumber(n:number, length:number) {
        const numberString = Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(n);
        return LineItemFetcher._padString(numberString, length, true);
    }

    private static _padString(s:string, length:number, rightAlign:boolean = false) {
        let result = s;

        if (result.length > length) {
            if (rightAlign) {
                result = '..' + result.slice(result.length - length + 2);
            } else {
                result = result.slice(0, length - 2) + '..';
            }
        }

        if (rightAlign) {
            result = result.padStart(length);
        } else {
            result = result.padEnd(length);
        }

        return result;
    }

    constructor(knex:Knex) {
        this._knex = knex;
    }

    public async getCaps(account:string, date:string): Promise<CapNumbers[]> {
        const query = this._knex
            .select(
                'MBP.budgetPeriodStart as start',
                'MBP.budgetPeriodEnd as end'
            )
            .max('MBP.ftes as fteCap')
            .sum('MBLI.budgetCap as budgetCap')

            .from('public.Mip40Wallet AS MW')
            .innerJoin('public.Mip40BudgetPeriod AS MBP', 'MBP.mip40Id', 'MW.mip40Id')
            .innerJoin('public.Mip40BudgetLineItem AS MBLI', 'MW.id', 'MBLI.mip40WalletId')
            
            .whereRaw('LOWER("MW"."address") = ?', account.toLowerCase())
            .whereRaw('"MBP"."budgetPeriodStart" <= ?', date)
            .whereRaw('"MBP"."budgetPeriodEnd" >= ?', date)
            
            .groupBy(
                'MW.address',
                'MBP.budgetPeriodStart',
                'MBP.budgetPeriodEnd'
            )
            
            // If there are overlapping periods, select the newest first
            .orderBy('MBP.budgetPeriodStart', 'DESC')
            .orderBy('MBP.budgetPeriodEnd', 'ASC');

        return (await query).map(r => ({
            start: r.start,
            end: r.end,
            fteCap: Number.parseFloat(r.fteCap),
            budgetCap: Number.parseFloat(r.budgetCap)
        }));
    }

    public async getAvailableMonthsRange() {
        const result = await this
            ._knex('public.BudgetStatementLineItem as BSLI')
            .select(this._knex.raw('CURRENT_DATE as "now"'))
            .min('BSLI.month as first')
            .max('BSLI.month as last');

        return {
            first: this._parseDateStringAsMonthPeriod(result[0].first),
            now: this._parseDateStringAsMonthPeriod(result[0].now),
            last: this._parseDateStringAsMonthPeriod(result[0].last)
        };
    }

    public buildQuery(account:string, month:string) {
        return this._knex
            .select(
                'BSW.address as account',
                'BSLI.month as month',
                'BSLI.group as group',

                'BSLI.headcountExpense as headcountExpense',
                'BSLI.canonicalBudgetCategory as category',
                
                'BS.month as report',
                'BSLI.actual as actual',
                'BSLI.forecast as forecast',
                'BSLI.budgetCap as budgetCap',
                'BSLI.payment as payment',
            )

            .from('public.BudgetStatement as BS')
                .leftJoin('public.BudgetStatementWallet as BSW', 'BSW.budgetStatementId', 'BS.id')
                .leftJoin('public.BudgetStatementLineItem as BSLI', 'BSLI.budgetStatementWalletId', 'BSW.id')

            .whereRaw('LOWER("BSW"."address") = LOWER(?)', account)
            .whereRaw('"BSLI"."month" = ?', month)

            .orderBy('group', 'ASC', 'first')
            .orderBy('headcountExpense', 'DESC', 'last')
            .orderBy('category', 'ASC', 'last')
            .orderBy('report', 'ASC');
    }

    public async getLineItems(account:string, month:string, includeObsolete:boolean=false): Promise<LineItemGroup> {
        const result = await this._readLineItemRecords(account, month);
        
        if (!includeObsolete) {
            result.categories = result.categories.filter(c => !c.obsolete);
        }

        // Fill out the budget caps and FTE numbers
        const capNumbers = await this.getCaps(account, result.month.startAsSqlDate());
        if (capNumbers.length > 0) {
            result.fteCap = capNumbers[0].fteCap;

            // Calculate the total budget cap number already covered by the line items
            const budgetCapTotal = result.categories.reduce((total, category) => total + (category.numbers.budgetCap || 0.00), 0.00);
            const remainderCap = capNumbers[0].budgetCap - budgetCapTotal;

            if (remainderCap > 0.00 || remainderCap < 0.00) {
                // Select the NULL category or create one if needed
                let nullCategory: LineItemCategory|null = null;
                            
                result.categories
                    .filter(c => c.category === null && c.group === null)
                    .forEach(c => nullCategory = c);

                if (nullCategory === null) {
                    nullCategory = this._newCategory(null, null, null);
                    result.categories.push(nullCategory);
                }

                // 
                nullCategory.numbers.budgetCap += remainderCap;
                nullCategory.hasError = nullCategory.hasError || (remainderCap < 0);
            }
        }
            
        return result;
    }

    private async _readLineItemRecords(account:string, month:string): Promise<LineItemGroup> {
        const result: LineItemGroup = {
            account,
            month: this._parseDateStringAsMonthPeriod(month),
            latestReport: null,
            hasActuals: false,
            fteCap: null,
            categories: []
        };

        const records = await this.buildQuery(account, month);
        let currentCategory: LineItemCategory | null = null;

        records.forEach((r: any) => {
            const group = (r.group == null || r.group.length < 1 ? null : r.group);
            const report = this._parseDateStringAsMonthPeriod(r.report);

            if (currentCategory === null 
                || currentCategory.category !== r.category
                || currentCategory.group !== group
            ) {
                currentCategory = this._newCategory(group, r.headcountExpense, r.category);
                result.categories.push(currentCategory);
            }

            if (report.comesBefore(result.month)) {
                // Disregard actuals and payments reported on future months
                currentCategory.numbers = {
                    actual: 0.00,
                    forecast: Number.parseFloat(r.forecast) || 0.00,
                    budgetCap: Number.parseFloat(r.budgetCap) || 0.00,
                    payment: 0.00
                };

                if (this._hasActualsOrPayments(r)) {
                    currentCategory.hasError = true;
                }

            } else {
                currentCategory.numbers = {
                    actual: Number.parseFloat(r.actual) || 0.00,
                    forecast: Number.parseFloat(r.forecast) || 0.00,
                    budgetCap: Number.parseFloat(r.budgetCap) || 0.00,
                    payment: Number.parseFloat(r.payment) || 0.00
                };
            }

            currentCategory.reports[report.toString()] = currentCategory.numbers;

            if (result.latestReport === null || result.latestReport.comesBefore(report)) {
                result.latestReport = report;
            }

            result.hasActuals = result.hasActuals || currentCategory.numbers.actual > 0.00;
        });

        // Set obsolete values
        if (result.latestReport !== null) {
            const latestReportKey = result.latestReport.toString();
            result.categories.forEach(c => {
                c.obsolete = (c.reports[latestReportKey] ? false : true);
            });
        }

        return result;
    }

    private _hasActualsOrPayments(record:any): boolean {
        return (record.actual && Number.parseFloat(record.actual) > 0.00) 
            || (record.payment && Number.parseFloat(record.payment) > 0.00);
    }

    private _newCategory(group:string|null, headcountExpense:boolean|null, category:string|null): LineItemCategory {
        return {
            group,
            headcountExpense,
            category,
            numbers: {
                actual: 0.00,
                forecast: 0.00,
                budgetCap: 0.00,
                payment: 0.00,
            },
            reports: {},
            obsolete: false,
            hasError: false
        };
    }

    private _parseDateStringAsMonthPeriod(date: string): BudgetReportPeriod {
        return BudgetReportPeriod.fromString(date.slice(0,4) + '/' + date.slice(5,7));
    }
}