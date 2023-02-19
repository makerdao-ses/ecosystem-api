import { Knex } from "knex";
import { BudgetReportOutputGroup, CacheKeys } from "./BudgetReportResolver.js";
import stringify from "json-stringify-deterministic";
import xxhash from "xxhash-wasm";

const DEBUG_OUTPUT = false;

type HashFn = { (input: string, seed?: bigint): string };

export class ResolverCache {
    private readonly _knex:Knex;
    private _h64?: HashFn;

    constructor(knex:Knex) {
        this._knex = knex;
    }

    public async emptyCache() {
        if (DEBUG_OUTPUT) {
            console.log(`ResolverCache is truncating the database table...`);
        }

        await this._knex('ResolverCache').truncate();
    }

    public async pruneCache(): Promise<number> {
        if (DEBUG_OUTPUT) {
            console.log(`ResolverCache is pruning the database table...`);
        }

        return await this._knex('ResolverCache').whereRaw('CURRENT_TIMESTAMP > expiry').delete();
    }

    public async load(hash: string): Promise<BudgetReportOutputGroup | null> {
        if (DEBUG_OUTPUT) {
            console.log(`ResolverCache is loading output groups with hash: ${hash}`);
        }

        const query = this._knex('ResolverCache')
            .select('data')
            .where('hash', hash)
            .whereRaw('"public"."ResolverCache"."expiry" > CURRENT_TIMESTAMP');

        const result = await query;
        return result.length < 1 ? null : {
            cacheKeys: result[0].data[0],
            period: result[0].data[1],
            keys: result[0].data[2],
            rows: result[0].data[3],
        };
    }

    public async store(outputGroups: BudgetReportOutputGroup[], expirationInMinutes:number = 240) {
        if (DEBUG_OUTPUT) {
            console.log(`ResolverCache is storing ${outputGroups.length} output groups: `, outputGroups);
        }

        for (const group of outputGroups.filter(g => g.cacheKeys !== null)) {
            const hash = await this.calculateHash(group.cacheKeys as CacheKeys);
            await this._knex('ResolverCache')
                .insert({
                    hash,
                    expiry: this._knex.raw('CURRENT_TIMESTAMP + interval \'' + expirationInMinutes + ' minutes\''),
                    data: JSON.stringify([group.cacheKeys, group.period, group.keys, group.rows])
                })
                .onConflict('hash')
                .merge();
        }
    }

    public async calculateHash(keys: CacheKeys) {
        if (!this._h64) {
            this._h64 = (await xxhash()).h64ToString;
        }

        const string = stringify(keys);
        const hash = this._h64(string);
        
        if (DEBUG_OUTPUT) {
            console.log(`Hashing: [ ${string} ] => [ ${hash} ]`);
        }

        return hash;
    }
}