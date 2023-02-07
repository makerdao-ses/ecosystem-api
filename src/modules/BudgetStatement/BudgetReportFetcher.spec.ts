import initKnex from "../../initKnex.js";
import { Knex } from "knex";
import { LineItemFetcher } from "./BudgetReportFetcher";

let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('fetches reasonable line items', async () => {
    const fetcher = new LineItemFetcher(knex);
    const account = '0x7c09Ff9b59BAAebfd721cbDA3676826aA6d7BaE8'.toLowerCase();
    const lineItems = await fetcher.getLineItems(account, '2022-10-01');

    lineItems.forEach(li => {
        expect(li.account.toLowerCase()).toEqual(account);
        expect(li.month.toString()).toEqual('2022/10');
        expect(['2022/10', '2022/09', '2022/08', '2022/07']).toContainEqual(li.report.toString())
    });
});