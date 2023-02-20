import { BudgetReportPath } from "./BudgetReportPath.js";
import { BudgetReportQuery } from "./BudgetReportQuery.js";
import { NamedResolver, ResolverData, BudgetReportResolver, BudgetReportOutputGroup, ResolverOutput, CacheKeys } from "./BudgetReportResolver.js";
import { ResolverCache } from "./ResolverCache.js";

const DEBUG_OUTPUT = false;

export class BudgetReportQueryEngine {
    get rootResolver() { return this._resolvers[this._rootResolver] as BudgetReportResolver<ResolverData, any>; }
    get resolvers() { return Object.values(this._resolvers); }
    get resolverCache() { return this._resolverCache; }

    private readonly _resolvers: Record<string, NamedResolver>;
    private readonly _rootResolver: string;
    private readonly _resolverCache?: ResolverCache;

    constructor(resolvers:NamedResolver[], rootResolver:string, resolverCache?:ResolverCache) {
        this._resolvers = {};
        resolvers.forEach(r => this._resolvers[r.name] = r);

        this._rootResolver = rootResolver;
        if (typeof this._resolvers[rootResolver] === 'undefined') {
            throw new Error(`Cannot find root resolver '${rootResolver}'`);
        }

        if (resolverCache) {
            this._resolverCache = resolverCache;
        }
    }

    public async execute(query:BudgetReportQuery): Promise<BudgetReportOutputGroup[]> {
        const budgetPath = typeof query.budgets == 'string' ? BudgetReportPath.fromString(query.budgets) : query.budgets;
        const categoryPath = typeof query.categories == 'string' ? BudgetReportPath.fromString(query.categories) : query.categories;

        if (DEBUG_OUTPUT) {
            console.log('QueryEngine is calling resolvers for query: ', query);
        }

        return this._callResolvers({
            start: query.start, 
            end: query.end, 
            budgetPath, 
            categoryPath, 
            granularity: query.granularity,
            groupPath: []
        });
    }

    private async _callResolvers(rootResolverQuery: ResolverData): Promise<BudgetReportOutputGroup[]> {
        const rootResolverInputMap: Record<string, ResolverData[]> = {};
        rootResolverInputMap[this.rootResolver.name] = [ rootResolverQuery ];
        
        const resolverStack:ResolverStackElement[] = [{
            name: this.rootResolver.name,
            queries: [ rootResolverQuery ],
            state: ResolverStackState.ReadyForQuery
        }];

        const outputStack:OutputStackElement[] = [{preprocessed:false, output:[]}];

        while (resolverStack.length > 0) {
            if (DEBUG_OUTPUT) {
                console.log("\nBudgetReportQuery is handling next resolver stack element...\n" + this._visualizeResolverStack(resolverStack, outputStack));
            }

            const nextResolverElement = resolverStack.pop() as ResolverStackElement;
            
            // Get the resolver referenced by the nextResolverElement
            const resolver = this._resolvers[nextResolverElement.name] as BudgetReportResolver<ResolverData, ResolverData>;
            if (!resolver) {
                throw new Error(`Resolver '${nextResolverElement.name}' is selected as next resolver, but it cannot be found.`); 
            }

            if (nextResolverElement.state === ResolverStackState.ReadyForQuery) {
                // Put an entry on the stack for this resolver to process the collected results
                resolverStack.push({
                    name: nextResolverElement.name,
                    queries: nextResolverElement.queries,
                    state: ResolverStackState.ReadyForProcessing
                });

                // Execute the query batch
                const batchResult = await this._executeBatch(resolver, nextResolverElement.queries);
                outputStack.push({
                    preprocessed: batchResult.preprocessed,
                    output: batchResult.output
                });

                // Push the resolver children on the stack 
                Object.keys(batchResult.nextResolversData).forEach(name => {
                    resolverStack.push({
                        name,
                        queries: batchResult.nextResolversData[name],
                        state: ResolverStackState.ReadyForQuery
                    });
                });

            } else if (nextResolverElement.state === ResolverStackState.ReadyForProcessing) {
                // Grab the collected output of the subsequent resolvers for processing
                const batchResults = outputStack.pop();
                if (!batchResults) {
                    throw new Error(`Unexpected end of BudgetReportQueryEngine collected output stack.`); 
                }

                let processedOutput:BudgetReportOutputGroup[];
                
                if (batchResults.preprocessed) {
                    processedOutput = batchResults.output;
                    if (DEBUG_OUTPUT) {
                        console.log(` Skipping output group processing of ${resolver.name} since the output was preprocessed.`);
                    }

                } else {
                    // Process the collected output since it wasn't preprocessed
                    processedOutput = resolver.processOutputGroups(batchResults.output);

                    // Cache the result
                    if (this._resolverCache && resolver.supportsCaching()) {
                        if (DEBUG_OUTPUT) {
                            console.log('BudgetReportQuery is storing batch result with ', processedOutput.length, ' groups for ', JSON.stringify(this._getBatchCacheKeys(resolver, nextResolverElement.queries)).slice(0, 300));
                        }

                        await this._resolverCache.store(this._getBatchCacheKeys(resolver, nextResolverElement.queries), processedOutput);
                    }
                }

                // Merge the newly processed output with any previoulsy processed output 
                outputStack[outputStack.length-1].output = outputStack[outputStack.length-1].output.concat(processedOutput);
            }

            if (DEBUG_OUTPUT) {
                if (this._resolverCache) {
                    const stats = this._resolverCache.stats;
                    if (Object.keys(stats).length > 0) {
                        console.log (
                            ' Cache stats: \n  ' +
                            Object.keys(stats)
                            .map(res => `${res} [${stats[res].hits} hits | ${stats[res].misses} misses | ${stats[res].stores} stores]`)
                            .join("\n  ") + "\n"
                        );
                    }
    
                    this._resolverCache.clearStats();
                }
            }
        }

        if (DEBUG_OUTPUT) {
            console.log("\nBudgetReportQuery is done processing\n" + this._visualizeResolverStack(resolverStack, outputStack));
        }

        return outputStack[0].output;
    }
    
    private _getBatchCacheKeys(resolver:BudgetReportResolver<ResolverData, ResolverData>, queries:ResolverData[]) {
        return {
            resolver: resolver.name + ':batch',
            keys: queries.map(q => resolver.getCacheKeys(q))
        };
    }

    private async _executeBatch(resolver: BudgetReportResolver<ResolverData, ResolverData>, queries:ResolverData[]): Promise<BatchOutput> {
        let cachedOutput:BudgetReportOutputGroup[]|null = null;
        const result: BatchOutput = { 
            nextResolversData:{}, 
            output:[],
            preprocessed: false
        };

        // Try reading the output from cache
        if (this._resolverCache && resolver.supportsCaching()) {
            cachedOutput = await this._resolverCache.load(this._getBatchCacheKeys(resolver, queries));
        }

        if (cachedOutput) {
            result.output = cachedOutput;
            result.preprocessed = true;

        } else {
            for (const query of queries) {
                const resolverOutput: ResolverOutput<ResolverData> = await this._executeQuery(resolver, query);
    
                Object.keys(resolverOutput.nextResolversData).forEach(k => {
                    if (!result.nextResolversData[k]) {
                        result.nextResolversData[k] = [];
                    }
    
                    result.nextResolversData[k] = result.nextResolversData[k].concat(resolverOutput.nextResolversData[k]);
                });
                
                result.output = result.output.concat(resolverOutput.output);
            }
        }

        if (DEBUG_OUTPUT) {
            if (result.output.length > 0) {
                console.log(' ',
                    result.output.length, 'resulting groups from', queries.length, resolver.name, 'execute calls, for example:\n', 
                    JSON.stringify(result.output[Math.floor(result.output.length / 2)]).slice(0, 300) + ' ...'
                );

            } else {
                console.log('  No results collected from', queries.length, resolver.name, 'execute calls.');
            }
        }
        
        return result;
    }

    private async _executeQuery(resolver: BudgetReportResolver<ResolverData, ResolverData>, query:ResolverData) {
        let cacheKeys:CacheKeys|null = null;
        let cachedOutput:BudgetReportOutputGroup[]|null = null;
        let result: ResolverOutput<ResolverData>|null = null;

        if (this._resolverCache && resolver.supportsCaching()) {
            cacheKeys = {
                resolver: resolver.name + ':query',
                keys: [resolver.getCacheKeys(query)]
            }

            const cacheResult = await this._resolverCache.load(cacheKeys);
            if (cacheResult) {
                cachedOutput = cacheResult;
            }
        }

        if (!cachedOutput) {
            result = await resolver.execute(query);
            const resultsAreComplete = Object.keys(result.nextResolversData).length < 1;

            // Only cache complete results for individual queries
            if (resultsAreComplete && cacheKeys) {
                this._resolverCache?.store(cacheKeys, result.output);
            }
        
        } else {
            result = {
                nextResolversData: {},
                output: cachedOutput
            }
        }

        return result;
    }

    private _visualizeResolverStack(resolverStack:ResolverStackElement[], collectedOutputStack:OutputStackElement[]):string {
        let result = "[ RESULT ] << ", waitingResolvers:string[] = [];

        resolverStack.forEach(rse => {
            if (rse.state === ResolverStackState.ReadyForProcessing) {
                if (waitingResolvers.length > 0) {
                    result += "(" + waitingResolvers.join(" | ") + ") ";
                    waitingResolvers = [];
                }
                
                result += rse.name + "[" + rse.queries.length + "] << ";
            
            } else {
                waitingResolvers.push(rse.name + "[" + rse.queries.length + "]");
            }
        });

        if (waitingResolvers.length > 0) {
            result += "(" + waitingResolvers.join(" | ") + ") << ";
        }

        if (resolverStack.length > 0) {
            if (resolverStack[resolverStack.length-1].state === ResolverStackState.ReadyForQuery) {
                result += "QRY\n" +
                    collectedOutputStack.map(outputElement => " " + outputElement.output.length + " groups ").join(" || ") + "\n";
            
            } else {
                result += "PROC\n" + 
                    collectedOutputStack.slice(0, -1).map(outputElement => " " + outputElement.output.length + " groups ").join(" || ") +
                    " <- " + collectedOutputStack.slice(-1)[0].output.length + " groups\n";
            }
            
        } else {
            result += "DONE\n " + collectedOutputStack[0].output.length + " groups\n";
        }

        return result;
    }
}

enum ResolverStackState {
    ReadyForQuery,
    ReadyForProcessing,
}

interface ResolverStackElement {
    name: string,
    queries: ResolverData[],
    state: ResolverStackState,
}

interface OutputStackElement {
    preprocessed: boolean, 
    output: BudgetReportOutputGroup[],
}

interface BatchOutput extends ResolverOutput<ResolverData> {
    preprocessed: boolean,
}