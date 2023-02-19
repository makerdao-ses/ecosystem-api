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

    private _visualizeResolverStack(resolverStack:ResolverStackElement[], collectedOutputStack:BudgetReportOutputGroup[][]):string {
        let result = "[  ROOT  ] << ", waitingResolvers:string[] = [];

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
            result += resolverStack[resolverStack.length-1].state === ResolverStackState.ReadyForProcessing ? "PROC" : "QRY";
        } else {
            result += "DONE";
        }

        return result + "\n" + collectedOutputStack.map(groupsArray => " " + groupsArray.length + " groups ").join(" || ");
    }

    private async _callResolvers(rootResolverQuery: ResolverData) {
        const rootResolverInputMap: Record<string, ResolverData[]> = {};
        rootResolverInputMap[this.rootResolver.name] = [ rootResolverQuery ];
        
        const resolverStack:ResolverStackElement[] = [{
            name: this.rootResolver.name,
            queries: [ rootResolverQuery ],
            state: ResolverStackState.ReadyForQuery
        }];

        const collectedOutputStack:BudgetReportOutputGroup[][] = [[]];

        while (resolverStack.length > 0) {
            if (DEBUG_OUTPUT) {
                console.log("\nBudgetReportQuery is processing...\n" + this._visualizeResolverStack(resolverStack, collectedOutputStack));
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
                const toBeProcessed = await this.executeBatch(resolver, nextResolverElement.queries);
                collectedOutputStack.push(toBeProcessed.output);

                // Push the resolver children on the stack 
                Object.keys(toBeProcessed.nextResolversData).forEach(name => {
                    resolverStack.push({
                        name,
                        queries: toBeProcessed.nextResolversData[name],
                        state: ResolverStackState.ReadyForQuery
                    });
                });

            } else if (nextResolverElement.state === ResolverStackState.ReadyForProcessing) {
                // Grab the collected output of the subsequent resolvers for processing
                const outputToBeProcessed = collectedOutputStack.pop();
                if (!outputToBeProcessed) {
                    throw new Error(`Unexpected end of BudgetReportQueryEngine collected output stack.`); 
                }

                // Process the collected output
                const processedOutput = resolver.processOutputGroups(outputToBeProcessed);

                // Merge the newly processed output with any previoulsy processed output 
                collectedOutputStack[collectedOutputStack.length-1] = collectedOutputStack[collectedOutputStack.length-1].concat(processedOutput);
            }
        }

        if (DEBUG_OUTPUT) {
            console.log("\nBudgetReportQuery is done processing\n" + this._visualizeResolverStack(resolverStack, collectedOutputStack));
        }

        return collectedOutputStack[0];
    }

    public async executeBatch(resolver: BudgetReportResolver<ResolverData, ResolverData>, queries:ResolverData[]) {
        const result:ResolverOutput<ResolverData> = { 
            nextResolversData:{}, 
            output:[]
        };

        for (const query of queries) {
            const resolverOutput: ResolverOutput<ResolverData> = await this.executeQuery(resolver, query);

            Object.keys(resolverOutput.nextResolversData).forEach(k => {
                if (!result.nextResolversData[k]) {
                    result.nextResolversData[k] = [];
                }

                result.nextResolversData[k] = result.nextResolversData[k].concat(resolverOutput.nextResolversData[k]);
            });
            
            result.output = result.output.concat(resolverOutput.output);
        }

        if (DEBUG_OUTPUT) {
            console.log('Concatenated results from ', queries.length, 'execute calls, such as:', result.output[0]);
        }
        
        return result;
    }

    public async executeQuery(resolver: BudgetReportResolver<ResolverData, ResolverData>, query:ResolverData) {
        let cacheKeys:CacheKeys|null = null;
        let cachedOutput:BudgetReportOutputGroup[]|null = null;
        let result: ResolverOutput<ResolverData>|null = null;

        if (this._resolverCache && resolver.supportsCaching(query)) {
            cacheKeys = resolver.getCacheKeys(query);
            if (cacheKeys) {
                const cacheResult = await this._resolverCache.load(await this._resolverCache.calculateHash(cacheKeys));
                if (cacheResult) {
                    cachedOutput = cacheResult[1];
                }
            }
        }

        if (!cachedOutput) {
            result = await resolver.execute(query);
            if (this._resolverCache && cacheKeys) {
                if (DEBUG_OUTPUT) {
                    console.log('Cache MISS with keys: ', cacheKeys);
                }

                this._resolverCache.store(cacheKeys, result.output);
            }
        
        } else {
            if (DEBUG_OUTPUT) {
                console.log('Cache HIT with keys: ', cacheKeys, cachedOutput);
            }
            
            result = {
                nextResolversData: {},
                output: cachedOutput
            }
        }

        return result;
    }
}

enum ResolverStackState {
    ReadyForQuery,
    ReadyForProcessing
}

interface ResolverStackElement {
    name: string,
    queries: ResolverData[],
    state: ResolverStackState,
}