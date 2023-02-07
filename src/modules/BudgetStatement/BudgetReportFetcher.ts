import { Knex } from "knex";
import { BudgetReportPeriod } from "./BudgetReportPeriod";

export interface LineItemRecord {
    account: string,
    report: BudgetReportPeriod,
    month: BudgetReportPeriod,
    group: string | null,
    headcountExpense: boolean | null,
    category: string | null,
    actual: number,
    forecast: number,
    budgetCap: number,
    payment: number
}

export class LineItemFetcher {
    private _knex:Knex;

    constructor(knex:Knex) {
        this._knex = knex;
    }

    public buildQuery(account:string, month:string) {
        return this._knex
            .select(
                'BSW.address as account',
                'BS.month as report',
                'BSLI.month as month',
                'BSLI.group as group',
                'BSLI.headcountExpense as headcountExpense',
                'BSLI.canonicalBudgetCategory as category',
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

            .orderBy('headcountExpense', 'DESC', 'last')
            .orderBy('category', 'ASC')
            .orderBy('report', 'ASC');
    }

    public async getLineItems(account:string, month:string): Promise<LineItemRecord[]> {
        const result = await this.buildQuery(account, month);
        
        return result.map((r:any) => ({
            account: r.account,
            report: BudgetReportPeriod.fromString(r.report.slice(0,4) + '/' + r.report.slice(5,7)),
            month: BudgetReportPeriod.fromString(r.month.slice(0,4) + '/' + r.month.slice(5,7)),
            group: (r.group == null || r.group.length < 1 ? null : r.group),
            headcountExpense: r.headcountExpense,
            category: r.category,
            actual: Number.parseFloat(r.actual),
            forecast: Number.parseFloat(r.forecast),
            budgetCap: Number.parseFloat(r.budgetCap),
            payment: Number.parseFloat(r.payment)
        }));
    }
}