import { BudgetReportResolverBase, ResolverOutput } from "../BudgetReportResolver.js";
import { AccountsResolverData } from "./AccountsResolver.js";
import { Knex } from "knex";
import { PeriodResolverData } from "./PeriodResolver.js";

const DEBUG_OUTPUT = false;

export class DelegatesResolver extends BudgetReportResolverBase<PeriodResolverData, AccountsResolverData> {
    readonly name = 'DelegatesResolver';

    private readonly _knex:Knex;

    constructor(knex:Knex) {
        super();
        this._knex = knex;
    }

    public async execute(query:PeriodResolverData): Promise<ResolverOutput<AccountsResolverData>> {
        if (DEBUG_OUTPUT) {
            console.log(`DelegatesResolver is resolving ${query.budgetPath.toString()}`);
        }

        const pathInfo = {
            delegatesPath: query.budgetPath,
            walletSegment: query.budgetPath.nextSegment()
        };

        const attachWalletPathSegment = (pathInfo.walletSegment.groups === null);
        const delegatesWallets = await this._buildDelegatesWalletQuery();
        
        const resolverInput: AccountsResolverData[] = delegatesWallets.map(wallet => {
            const result = {
                owner: "Delegates",
                account: wallet.account,
                discontinued: true,
                discontinuedSince: "2023/04", 

                start: query.start,
                end: query.end,
                period: query.period,
                categoryPath: query.categoryPath,
                budgetPath: query.budgetPath.reduce(),
                granularity: query.granularity,
                groupPath: [...query.groupPath]
            };

            if (attachWalletPathSegment) {
                result.groupPath.push(wallet.account);
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

    private _buildDelegatesWalletQuery() {
        const query = this._knex
            .select(
                this._knex.raw('LOWER("BSW"."address") as "account"'),
                this._knex.raw('STRING_AGG(DISTINCT "BSW"."name", \';\' ORDER BY "BSW"."name" ASC) as "accountNames"')
            )
            .min('BS.month as firstReport')
            .max('BS.month as latestReport')

            .from('public.BudgetStatement as BS')
            .join('public.BudgetStatementWallet as BSW', 'BSW.budgetStatementId', 'BS.id')
            .groupBy('account')

            .where('BS.ownerType', 'Delegates')
            ;

        return query;
    }
}
