import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";
import { AccountsResolverData } from "./AccountsResolver.js";
import { Knex } from "knex";
import { BudgetReportPathSegment } from "../BudgetReportPath";

const DEBUG_OUTPUT = false;

export class CoreUnitsResolver extends BudgetReportResolverBase<ResolverData, AccountsResolverData> {
    readonly name = 'CoreUnitsResolver';

    private readonly _knex:Knex;

    constructor(knex:Knex) {
        super();
        this._knex = knex;
    }

    public async execute(query:ResolverData): Promise<ResolverOutput<AccountsResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`CoreUnitsResolver is resolving ${query.budgetPath.toString()}`);
        }

        const coreUnitWallets = await this._buildCoreUnitWalletQuery(query.budgetPath.nextSegment());
        
        const resolverInput: AccountsResolverData[] = coreUnitWallets.map(cuw => ({
            owner: cuw.coreUnitCode,
            account: cuw.account,
            // TODO: replace by the proper condition
            discontinued: ['EVENTS-001', 'COM-001', 'RWF-001', 'SH-001'].indexOf(cuw.coreUnitCode) > -1,

            periodRange: query.periodRange,
            categoryPath: query.categoryPath,
            budgetPath: query.budgetPath.reduce(),
            granularity: query.granularity
        }));

        return {
            nextResolversData: {
                AccountsResolver: resolverInput
            },
            output: []
        };
    }

    private _buildCoreUnitWalletQuery(segment: BudgetReportPathSegment) {
        const query = this._knex
            .select(
                'CU.id as coreUnitId',
                'CU.code as coreUnitCode',
                this._knex.raw('LOWER("BSW"."address") as "account"'),
                this._knex.raw('STRING_AGG(DISTINCT "BSW"."name", \';\' ORDER BY "BSW"."name" ASC) as "accountNames"')
            )
            .min('BS.month as firstReport')
            .max('BS.month as latestReport')

            .from('public.CoreUnit as CU')
                .leftJoin('public.BudgetStatement as BS', 'BS.cuId', 'CU.id')
                .leftJoin('public.BudgetStatementWallet as BSW', 'BSW.budgetStatementId', 'BS.id')
            
            .whereNotNull('BSW.address')
            .groupBy('coreUnitId', 'coreUnitCode', 'account')

            .orderBy('coreUnitCode');

        if (segment.filters !== null) {
            const cuList = segment.filters.map(f => f.toUpperCase().trim());
            query.whereIn('CU.code', cuList);
        }

        return query;
    }
}
