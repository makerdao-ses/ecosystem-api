import { Knex } from "knex";
import { LineItemFetcher } from "./BudgetReportFetcher";
import { BudgetReportPath, BudgetReportPathSegment } from "./BudgetReportPath";
import { BudgetReportPeriod, BudgetReportPeriodType } from "./BudgetReportPeriod";
import { BudgetReportQuery, BudgetReportPeriodInput } from "./BudgetReportQuery";

interface BudgetReportResolverBase {
    readonly name: string;
}

export interface ResolverData {
    periodRange: BudgetReportPeriod[],
    budgetPath: BudgetReportPath,
    categoryPath: BudgetReportPath
}

export interface BudgetReportResolver<TInput extends ResolverData, TOutput extends ResolverData> extends BudgetReportResolverBase {
    execute(query:TInput): Promise<Record<string, TOutput[]>>;
    executeBatch(queries:TInput[]): Promise<Record<string, TOutput[]>>;
}

export class BudgetReportQueryEngine {
    get rootResolver() { return this._resolvers[this._rootResolver] as BudgetReportResolver<ResolverData, any>; }
    get resolvers() { return Object.values(this._resolvers); }

    private _lineItemFetcher: LineItemFetcher;
    private _resolvers: Record<string, BudgetReportResolverBase>;
    private _rootResolver: string;

    constructor(knex:Knex, resolvers:BudgetReportResolverBase[], rootResolver:string) {
        this._lineItemFetcher = new LineItemFetcher(knex);
        this._resolvers = {};
        resolvers.forEach(r => this._resolvers[r.name] = r);

        this._rootResolver = rootResolver;
        if (typeof this._resolvers[rootResolver] === 'undefined') {
            throw new Error(`Cannot find root resolver '${rootResolver}'`);
        }
    }

    public async execute(query:BudgetReportQuery) {
        const periodRange = await this._resolvePeriodRange(query.start, query.end);
        if (periodRange[0].type !== BudgetReportPeriodType.Month) {
            throw new Error('Quarters and years are not allowed as query start or end values. Use the respective months instead.');
        }

        const budgetPath = typeof query.budgets == 'string' ? BudgetReportPath.fromString(query.budgets) : query.budgets;
        const categoryPath = typeof query.categories == 'string' ? BudgetReportPath.fromString(query.categories) : query.categories;

        return this._callResolvers({periodRange, budgetPath, categoryPath});
    }

    private async _callResolvers(initialInput: ResolverData) {
        const result = this.rootResolver.execute(initialInput);
        return result;
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
}
