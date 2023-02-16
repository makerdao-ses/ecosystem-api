import { BudgetReportPath } from "./BudgetReportPath.js";
import { BudgetReportPeriod } from "./BudgetReportPeriod.js";
import { BudgetReportGranularity } from "./BudgetReportQuery.js";

const DEBUG_OUTPUT = false;

export interface NamedResolver {
    readonly name: string;
}

export interface ResolverData {
    periodRange: BudgetReportPeriod[],
    budgetPath: BudgetReportPath,
    categoryPath: BudgetReportPath,
    granularity: BudgetReportGranularity
}

export interface BudgetReportOutputGroup {
    keys: Record<string, any>;
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
    executeBatch(queries:TInput[]): Promise<ResolverOutput<TOutput>>;
    processOutputRows(rows:BudgetReportOutputRow[], groupKeys:Record<string, any>): BudgetReportOutputRow[];
    processOutputGroups(output:BudgetReportOutputGroup[]): BudgetReportOutputGroup[];
}

export abstract class BudgetReportResolverBase<TInput extends ResolverData, TOutput extends ResolverData> 
    implements BudgetReportResolver<TInput, TOutput>
{
    abstract readonly name: string;
    abstract execute(query:TInput): Promise<ResolverOutput<TOutput>>;

    public async executeBatch(queries:TInput[]): Promise<ResolverOutput<TOutput>> {
        const result = { nextResolversData: {}, output: [] } as ResolverOutput<TOutput>;

        for (const resolverData of queries) {
            const queryOutput = await this.execute(resolverData);
            
            result.nextResolversData = {
                ...result.nextResolversData,
                ...queryOutput.nextResolversData
            }
            
            result.output = queryOutput.output.concat(result.output);
        }

        return result;
    }

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
}