import { Knex } from "knex";

export interface SnapshotFilter {
    id?: number | string
    start?: string
    end?: string
    ownerType?: string
    ownerId?: number
}

export class SnapshotModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getSnapshots(filter: { limit?: number, offset?: number, filter?: SnapshotFilter }) {
        const baseQuery = this.knex
            .select('*')
            .from('Snapshot')
            .orderBy('id', 'desc');
        if (filter.limit !== undefined && filter.offset !== undefined) {
            return baseQuery.limit(filter.limit).offset(filter.offset);
        } else if (filter.filter?.id !== undefined) {
            return baseQuery.where('id', filter.filter.id);
        } else if (filter.filter?.start !== undefined) {
            return baseQuery.where('start', filter.filter.start);
        } else if (filter.filter?.end !== undefined) {
            return baseQuery.where('end', filter.filter.end);
        } else if (filter.filter?.ownerType !== undefined) {
            return baseQuery.where('ownerType', filter.filter.ownerType);
        } else if (filter.filter?.ownerId !== undefined) {
            return baseQuery.where('ownerId', filter.filter.ownerId);
        } else {
            return baseQuery;
        };
    };

    async getSnapshotAccounts(snapshotId: number | string) {
        return this.knex
            .select('*')
            .from('SnapshotAccount')
            .where('snapshotId', snapshotId);
    };

    async getSnapshotAccountTransactions(snapshotAccountId: number | string) {
        return this.knex
            .select('*')
            .from('SnapshotAccountTransaction')
            .where('snapshotAccountId', snapshotAccountId);
    };

    async getSnapshotAccountBalances(snapshotAccountId: number | string) {
        return this.knex
            .select('*')
            .from('SnapshotAccountBalance')
            .where('snapshotAccountId', snapshotAccountId);
    };
};

export default (knex: Knex,) => new SnapshotModel(knex);