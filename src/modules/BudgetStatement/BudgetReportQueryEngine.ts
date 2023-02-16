import { Knex } from "knex";
import { LineItemFetcher } from "./LineItemFetcher.js";
import { BudgetReportPath } from "./BudgetReportPath.js";
import { BudgetReportPeriod, BudgetReportPeriodType } from "./BudgetReportPeriod.js";
import { BudgetReportQuery, BudgetReportPeriodInput } from "./BudgetReportQuery.js";
import { NamedResolver, ResolverData, BudgetReportResolver, BudgetReportOutputGroup, ResolverOutput } from "./BudgetReportResolver.js";

const DEBUG_OUTPUT = false;

export class BudgetReportQueryEngine {
    get rootResolver() { return this._resolvers[this._rootResolver] as BudgetReportResolver<ResolverData, any>; }
    get resolvers() { return Object.values(this._resolvers); }

    private _lineItemFetcher: LineItemFetcher;
    private _resolvers: Record<string, NamedResolver>;
    private _rootResolver: string;

    constructor(knex:Knex, resolvers:NamedResolver[], rootResolver:string) {
        this._lineItemFetcher = new LineItemFetcher(knex);
        this._resolvers = {};
        resolvers.forEach(r => this._resolvers[r.name] = r);

        this._rootResolver = rootResolver;
        if (typeof this._resolvers[rootResolver] === 'undefined') {
            throw new Error(`Cannot find root resolver '${rootResolver}'`);
        }
    }

    public async execute(query:BudgetReportQuery): Promise<BudgetReportOutputGroup[]> {
        const periodRange = await this._resolvePeriodRange(query.start, query.end);
        if (periodRange[0].type !== BudgetReportPeriodType.Month) {
            throw new Error('Quarters and years are not allowed as query start or end values. Use the respective months instead.');
        }

        const budgetPath = typeof query.budgets == 'string' ? BudgetReportPath.fromString(query.budgets) : query.budgets;
        const categoryPath = typeof query.categories == 'string' ? BudgetReportPath.fromString(query.categories) : query.categories;

        if (DEBUG_OUTPUT) {
            console.log('QueryEngine is calling resolvers for query: ', query);
        }

        return this._callResolvers({periodRange, budgetPath, categoryPath, granularity:query.granularity});
    }

    private async _callResolvers(initialInput: ResolverData) {
        const input: Record<string, ResolverData[]> = {};
        input[this.rootResolver.name] = [ initialInput ];
        
        let collectedOutput:BudgetReportOutputGroup[] = [];
        const queue: Record<string, ResolverData[]>[] = [ input ];
        const resolverStack: string[] = [];
        
        while (queue.length > 0) {
            const nextResolverInputMap = queue.shift() as Record<string, ResolverData[]>;

            for (const name of Object.keys(nextResolverInputMap)) {
                if (DEBUG_OUTPUT) {
                    console.log (
                        '>> QueryEngine is calling ' + resolverStack.join(' > ') 
                        + (resolverStack.length > 0 ? ' > ' : '') 
                        + `${name} -- ${nextResolverInputMap[name].length} records such as `, nextResolverInputMap[name][0]
                    );
                }

                const nextResolver = this._resolvers[name] as BudgetReportResolver<ResolverData, ResolverData>;
                const output:ResolverOutput<ResolverData> = await nextResolver.executeBatch(nextResolverInputMap[name]);

                if (Object.keys(output.nextResolversData).length > 0) {
                    queue.push(output.nextResolversData);
                }

                if (resolverStack.indexOf(name) < 0) {
                    resolverStack.push(name);
                }
                
                collectedOutput = output.output.concat(collectedOutput);
            };
        }

        if (DEBUG_OUTPUT) {
            console.log('QueryEngine is processing output groups: ', collectedOutput.length, ' group(s)...');
        }

        while (resolverStack.length > 0) {
            const resolver = this._resolvers[resolverStack.pop() as string] as BudgetReportResolver<ResolverData, ResolverData>;
            const inputLength = collectedOutput.length;
            collectedOutput = resolver.processOutputGroups(collectedOutput);

            if (DEBUG_OUTPUT) {
                console.log('>> QueryEngine processed output through ' + resolver.name + ': ', inputLength, '>', collectedOutput.length, 'group(s) such as (keys, rows[0]):', collectedOutput[0].keys, collectedOutput[0].rows[0]);
            }
        }

        if (DEBUG_OUTPUT) {
            console.log('QueryEngine finished processing output groups');
        }

        return collectedOutput;
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
