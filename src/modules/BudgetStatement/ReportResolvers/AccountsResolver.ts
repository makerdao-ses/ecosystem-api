import { BudgetReportResolverBase, ResolverData, ResolverOutput } from "../BudgetReportQueryEngine";
import { Knex } from "knex";
import { LineItemFetcher } from "../BudgetReportFetcher";
export class AccountsResolver extends BudgetReportResolverBase<AccountsResolverData, ResolverData> {
    readonly name = 'AccountsResolver';

    private _lineItemFetcher: LineItemFetcher;

    constructor(knex:Knex) {
        super();
        this._lineItemFetcher = new LineItemFetcher(knex);
    }

    public async execute(query:AccountsResolverData): Promise<ResolverOutput<ResolverData>> {
        console.log(`AccountsResolver is resolving ${query.budgetPath.toString()}`);

        const result = {
            nextResolversData: {},
            output: []
        } as ResolverOutput<ResolverData>;

        for (const month of query.periodRange) {
            const records = await this._lineItemFetcher.getLineItems(query.account, month.startAsSqlDate());
            result.output = result.output.concat(records);
        }

        console.log(`AccountsResolver fetched ${query.periodRange.length} months of ${query.owner}/${query.account}, returning ${result.output.length} record(s).`);
        return result;
    }
}

export interface AccountsResolverData extends ResolverData {
    account: string;
    owner: string;
    discontinued: boolean;
}
