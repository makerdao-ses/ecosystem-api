import { Knex } from "knex";
import { BudgetReportOutputGroup, CacheKeys } from "./BudgetReportResolver.js";
import stringify from "json-stringify-deterministic";
import xxhash from "xxhash-wasm";

const DEBUG_OUTPUT = false;

type HashFn = { (input: string, seed?: bigint): string };

type CacheStatistics = {
  [resolver: string]: {
    hits: number;
    misses: number;
    stores: number;
  };
};

export class ResolverCache {
  public get stats(): CacheStatistics {
    return this._stats;
  }

  private readonly _knex: Knex;
  private readonly _collectStats: boolean;
  private _h64?: HashFn;
  private _stats: CacheStatistics = {};

  constructor(knex: Knex, collectStats: boolean = true) {
    this._knex = knex;
    this._collectStats = collectStats;
  }

  public async emptyCache() {
    if (DEBUG_OUTPUT) {
      console.log(`ResolverCache is truncating the database table...`);
    }

    await this._knex("ResolverCache").truncate();
  }

  public async pruneCache(): Promise<number> {
    if (DEBUG_OUTPUT) {
      console.log(`ResolverCache is pruning the database table...`);
    }

    return await this._knex("ResolverCache")
      .whereRaw("CURRENT_TIMESTAMP > expiry")
      .delete();
  }

  public async load(
    keys: CacheKeys,
  ): Promise<BudgetReportOutputGroup[] | null> {
    const hash = await this.calculateHash(keys);

    if (DEBUG_OUTPUT) {
      console.log(
        `ResolverCache is loading entry with hash ${hash} from keys: ${stringify(
          keys,
        )}`,
      );
    }

    const query = this._knex("ResolverCache")
      .select("data")
      .where("hash", hash)
      .whereRaw('"public"."ResolverCache"."expiry" > CURRENT_TIMESTAMP');

    const result = await query;

    if (this._collectStats) {
      if (!this._stats[keys.resolver]) {
        this._stats[keys.resolver] = { hits: 0, misses: 0, stores: 0 };
      }

      this._stats[keys.resolver][result.length < 1 ? "misses" : "hits"]++;
    }

    return result.length < 1 ? null : result[0].data;
  }

  public async store(
    keys: CacheKeys,
    outputGroups: BudgetReportOutputGroup[],
    expirationInMinutes: number = 240,
  ) {
    const hash = await this.calculateHash(keys);

    if (DEBUG_OUTPUT) {
      console.log(
        `ResolverCache is using hash ${hash} to store ${outputGroups.length} output groups: `,
        outputGroups,
      );
    }

    await this._knex("ResolverCache")
      .insert({
        hash,
        expiry: this._knex.raw(
          "CURRENT_TIMESTAMP + make_interval(mins => ?)", [expirationInMinutes],
        ),
        data: JSON.stringify(outputGroups),
      })
      .onConflict("hash")
      .merge();

    if (this._collectStats) {
      if (!this._stats[keys.resolver]) {
        this._stats[keys.resolver] = { hits: 0, misses: 0, stores: 0 };
      }

      this._stats[keys.resolver]["stores"]++;
    }
  }

  public async calculateHash(keys: CacheKeys) {
    if (!this._h64) {
      this._h64 = (await xxhash()).h64ToString;
    }

    const string = stringify(keys);
    const hash = this._h64(string);

    return hash;
  }

  public clearStats() {
    this._stats = {};
  }
}
