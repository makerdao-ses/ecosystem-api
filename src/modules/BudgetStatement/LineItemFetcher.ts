import { Knex } from "knex";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";

export interface LineItemGroup {
    account: string,
    month: BudgetReportPeriod,
    latestReport: BudgetReportPeriod | null,
    hasActuals: boolean,
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

export class LineItemFetcher {
    private _knex:Knex;

    public static lineItemGroupToString(lineItems: LineItemGroup): string {
        let result = `${lineItems.month.toString()} [${lineItems.account}]`;
        result += ` - latestReport:${lineItems.latestReport?.toString()} - hasActuals:${lineItems.hasActuals}`;
        result += ` - obsolete:${lineItems.categories.reduce((obs, cat) => obs + (cat.obsolete ? 1 : 0), 0)}\n\n`;

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
        const result: LineItemGroup = {
            account,
            month: this._parseDateStringAsMonthPeriod(month),
            latestReport: null,
            hasActuals: false,
            categories: []
        };

        let currentCategory: LineItemCategory | null = null;

        const records = await this.buildQuery(account, month);
        records.forEach((r: any) => {
            const group = (r.group == null || r.group.length < 1 ? null : r.group);
            const report = this._parseDateStringAsMonthPeriod(r.report);

            if (currentCategory === null 
                || currentCategory.category !== r.category
                || currentCategory.group !== group
            ) {
                currentCategory = {
                    group,
                    headcountExpense: r.headcountExpense,
                    category: r.category,
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

                if (r.actual && Number.parseFloat(r.actual) > 0.00) {
                    currentCategory.hasError = true;
                }

                if (r.payment && Number.parseFloat(r.payment) > 0.00) {
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

        if (result.latestReport !== null) {
            const latestReportKey = result.latestReport.toString();
            result.categories.forEach(c => {
                c.obsolete = (c.reports[latestReportKey] ? false : true);
            });
        }

        if (!includeObsolete) {
            result.categories = result.categories.filter(c => !c.obsolete);
        }

        return result;
    }

    private _parseDateStringAsMonthPeriod(date: string): BudgetReportPeriod {
        return BudgetReportPeriod.fromString(date.slice(0,4) + '/' + date.slice(5,7));
    }
}