import { BudgetReportPath } from "./BudgetReportPath.js";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";
import { BudgetReportGranularity, BudgetReportPeriodInput } from "./BudgetReportQuery.js";

const DEBUG_OUTPUT = false;

export interface NamedResolver {
    readonly name: string;
}

export type SerializableKey = { toString():string };

export type CacheKeys = {
    resolver: string,
    keys: Record<string, SerializableKey|null>[]
};

export interface ResolverData {
    start: BudgetReportPeriodInput,
    end: BudgetReportPeriodInput,
    budgetPath: BudgetReportPath,
    categoryPath: BudgetReportPath,
    granularity: BudgetReportGranularity,
    groupPath: SerializableKey[],
}

export interface BudgetReportOutputGroup {
    keys: SerializableKey[];
    period: string;
    rows: BudgetReportOutputRow[];
}

export interface BudgetReportOutputRow {
    account: string,
    month: BudgetReportPeriod,
    
    group: string | null,
    headcountExpense: boolean | null,
    category: string | null,

    actual: number,
    forecast: number,
    prediction: number,
    budgetCap: number,
    payment: number,
    
    actualDiscontinued: number,
    forecastDiscontinued: number,
    predictionDiscontinued: number,
    budgetCapDiscontinued: number,
    paymentDiscontinued: number,
}

export interface ResolverOutput<TOutput> {
    nextResolversData: Record<string, TOutput[]>,
    output: BudgetReportOutputGroup[]
}

export interface BudgetReportResolver<TInput extends ResolverData, TOutput extends ResolverData> extends NamedResolver {
    execute(query:TInput): Promise<ResolverOutput<TOutput>>;
    processOutputRows(rows:BudgetReportOutputRow[], groupKeys:Record<string, SerializableKey>): BudgetReportOutputRow[];
    processOutputGroups(output:BudgetReportOutputGroup[]): BudgetReportOutputGroup[];
    supportsCaching(): boolean;
    getCacheKeys(query:TInput): Record<string, SerializableKey|null>;
}

export abstract class BudgetReportResolverBase<TInput extends ResolverData, TOutput extends ResolverData> 
    implements BudgetReportResolver<TInput, TOutput>
{
    abstract readonly name: string;
    abstract execute(query:TInput): Promise<ResolverOutput<TOutput>>;

    public processOutputRows(rows: BudgetReportOutputRow[], groupKeys:Record<string, any>): BudgetReportOutputRow[] {
        if (DEBUG_OUTPUT) {
            console.log(`${this.name} is processing ${rows.length} output rows(s).`);
        }
        
        return rows;
    }

    public processOutputGroups(groups:BudgetReportOutputGroup[]): BudgetReportOutputGroup[] {
        groups.forEach(g => {
            g.rows = this.processOutputRows(g.rows, g.keys);
        });

        return groups;
    }

    public supportsCaching(): boolean {
        return false;
    }

    public getCacheKeys(query: TInput): Record<string, SerializableKey|null> {
        return {};
    }
}