import { Knex } from "knex";

export type SnapshotFilter = {
    id?: number | string
    period?: string,
    ownerType?: string
    ownerId?: number
}

const get3Months = (month: string) => {
    const year = parseInt(month.slice(0, 4));
    const monthIndex = parseInt(month.slice(5, 7)) - 1;

    const dates = [
        new Date(year, monthIndex),
        new Date(year, monthIndex - 1),    
        new Date(year, monthIndex - 2),    
    ];

    return dates.map((d: Date) => {
        const isoString = d.toISOString();
        return isoString.slice(0, 4) + '/' + isoString.slice(5, 7);
    });
}

export class SnapshotModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getSnapshots(filter: { limit?: number, offset?: number, filter?: SnapshotFilter }) {
        const where: {
            id?: number
            ownerId?: number
            ownerType?: string
            month?: Date | null
        } = {};

        if (filter.filter?.id) {
            where.id = parseInt('' + filter.filter?.id);
        }

        if (filter.filter?.ownerId) {
            where.ownerId = filter.filter?.ownerId;
        }

        if (filter.filter?.ownerType) {
            where.ownerType = filter.filter?.ownerType;
        }

        if (filter.filter?.period) {
            if (!/^[0-9]{4}\/[0-9]{2}$/.test(filter.filter?.period)) {
                throw new Error(`Unsupported format for period filter: "${filter.filter?.period}". Use YYYY/MM or null.`);
            }

            where.month = new Date(
                parseInt(filter.filter?.period.slice(0, 4)),
                parseInt(filter.filter?.period.slice(5, 7)) - 1,
                1
            );

        } else if (filter.filter?.period === null) {
            where.month = null; 
        }

        const baseQuery = this.knex
            .select('*')
            .from('Snapshot')
            .where(where)
            .orderBy('id', 'desc');

        if (filter.limit !== undefined && filter.offset !== undefined) {
            baseQuery.limit(filter.limit).offset(filter.offset);
        } 
        
        const result = await baseQuery;
        for (let i=0; i<result.length; i++) {
            result[i].actualsComparison = await this.getActualsComparison(
                result[i].id, 
                result[i].month ? get3Months(result[i].month) : []
            );
        }

        return result;
    };

    async getActualsComparison(snapshotId: number, months: string[]) {
        return months.map(month => ({
            month,
            currency: 'DAI',
            reportedActuals: snapshotId * 10000,
            netExpenses: {
                onChainOnly: {
                    amount: snapshotId * 10000 + 1253,
                    difference: (snapshotId * 10000 + 1253) / (snapshotId * 10000)
                },
                offChainIncluded: {
                    amount: snapshotId * 10000 + 100,
                    difference: (snapshotId * 10000 + 100) / (snapshotId * 10000)
                }
            }
        }));
    }

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
            .where('snapshotAccountId', snapshotAccountId)
            .orderBy('id', 'desc');
    };

    async getSnapshotAccountBalances(snapshotAccountId: number | string) {
        return this.knex
            .select('*')
            .from('SnapshotAccountBalance')
            .where('snapshotAccountId', snapshotAccountId);
    };
};

export default (knex: Knex,) => new SnapshotModel(knex);