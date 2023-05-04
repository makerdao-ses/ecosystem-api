import { BudgetReportResolverBase, ResolverOutput } from "../BudgetReportResolver.js";
import { AccountsResolverData } from "./AccountsResolver.js";
import { Knex } from "knex";
import { BudgetReportPathSegment } from "../BudgetReportPath.js";
import { PeriodResolverData } from "./PeriodResolver.js";

const DEBUG_OUTPUT = false;

export class CoreUnitsResolver extends BudgetReportResolverBase<PeriodResolverData, AccountsResolverData> {
    readonly name = 'CoreUnitsResolver';

    private readonly _knex:Knex;

    constructor(knex:Knex) {
        super();
        this._knex = knex;
    }

    public async execute(query:PeriodResolverData): Promise<ResolverOutput<AccountsResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`CoreUnitsResolver is resolving ${query.budgetPath.toString()}`);
        }

        const pathInfo = {
            coreUnitPath: query.budgetPath,
            coreUnitSegment: query.budgetPath.nextSegment(),
            walletSegment: query.budgetPath.reduce().nextSegment(),
            groupSegment: query.budgetPath.reduce().reduce().nextSegment()
        };

        const attachCoreUnitPathSegment = (pathInfo.coreUnitSegment.groups === null);
        const attachWalletPathSegment = (pathInfo.walletSegment.groups === null);
        const keepLineItemGroupsSeparate = (pathInfo.groupSegment.groups === null);

        const coreUnitWallets = await this._buildCoreUnitWalletQuery(pathInfo.coreUnitSegment);
        const mip39c3s = await this._getMip39c3s();
        
        const resolverInput: AccountsResolverData[] = coreUnitWallets.map(cuw => {
            const result = {
                owner: cuw.coreUnitCode,
                account: cuw.account,
                discontinued: (mip39c3s[cuw.coreUnitCode] ? true : false),
                discontinuedSince: mip39c3s[cuw.coreUnitCode] || null, 
    
                start: query.start,
                end: query.end,
                period: query.period,
                categoryPath: query.categoryPath,
                budgetPath: query.budgetPath.reduce(),
                granularity: query.granularity,
                groupPath: query.groupPath.concat(),
                keepLineItemGroupsSeparate
            };

            if (attachCoreUnitPathSegment) {
                result.groupPath.push(cuw.coreUnitCode);
            }

            if (attachWalletPathSegment) {
                result.groupPath.push(cuw.account);
            }

            return result;
        });

        if (DEBUG_OUTPUT) { 
            console.log(resolverInput);
        }

        return {
            nextResolversData: {
                AccountsResolver: resolverInput
            },
            output: []
        };
    }

    private async _getMip39c3s(): Promise<Record<string, string>> {
        const records = await this._knex
            .select(
                'CU.code as code',
                'MIP.accepted as acceptedSince'
            )
            .from('public.CuMip as MIP')
            .leftJoin('public.CoreUnit as CU', 'CU.id', 'MIP.cuId')
            .whereRaw('"MIP"."mipCode" LIKE \'MIP39c3%\'')
            .where('MIP.mipStatus', 'Accepted');

        const result:Record<string, string> = {};
        records.forEach((r:any) => {
            result[r.code] = r.acceptedSince
        });

        return result;
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
                .leftJoin('public.BudgetStatement as BS', 'BS.ownerId', 'CU.id')
                .leftJoin('public.BudgetStatementWallet as BSW', 'BSW.budgetStatementId', 'BS.id')
            
            .whereNotNull('BSW.address')
            .whereNot('CU.code', 'DEL')
            .groupBy('coreUnitId', 'coreUnitCode', 'account')

            .orderBy('coreUnitCode');

        if (segment.filters !== null) {
            const cuList = segment.filters.map(f => f.toUpperCase().trim());
            query.whereIn('CU.code', cuList);
        }

        return query;
    }
}
