import initKnex from "../../initKnex.js";
import { Knex } from "knex";
import { LineItemFetcher, LineItemGroup, LineItemNumbers } from "./LineItemFetcher";

const DEBUG_OUTPUT = false;
let knex:Knex;

beforeAll(async () => {
    knex = initKnex()
});

afterAll(async () => {
    knex.destroy();
});

it ('correctly fetches available months range', async() => {
    const fetcher = new LineItemFetcher(knex);
    const monthsRange = await fetcher.getAvailableMonthsRange();
    expect(monthsRange.last.comesAfter(monthsRange.first)).toBe(true);
    expect(monthsRange.now.comesAfter(monthsRange.last)).toBe(false);
    expect(monthsRange.now.comesBefore(monthsRange.first)).toBe(false);
    expect(monthsRange.first.toString()).toEqual('2021/06');
});

it ('fetches correct line items for permanent team wallet', async () => {
    const fetcher = new LineItemFetcher(knex);
    const account = '0xb5eb779ce300024edb3df9b6c007e312584f6f4f'.toLowerCase();
    const lineItems = await fetcher.getLineItems(account, '2022-10-01');
    
    const lineItemsString = LineItemFetcher.lineItemGroupToString(lineItems);
    if (DEBUG_OUTPUT) {
        console.log(lineItemsString);
    }

    expect(lineItems.account.toLowerCase()).toEqual(account);
    expect(lineItems.month.toString()).toEqual('2022/10');
    expect(lineItems.fteCap).toBeCloseTo(11.5);
    expect(lineItems.hasActuals).toBe(true);

    const totals = groupTotals(lineItems);
    expect(totals.actual).toBeCloseTo(115368.25);
    expect(totals.forecast).toBeCloseTo(132574.07);
    expect(totals.budgetCap).toBeCloseTo(172870.00);
    expect(totals.payment).toBeCloseTo(97403.93);

    lineItems.categories.forEach(c => {
        Object.keys(c.reports).forEach(k => {
            expect(['2022/10', '2022/09', '2022/08', '2022/07']).toContainEqual(k);
        });
    });
});

it ('fetches correct line items for incubation program wallet', async () => {
    const fetcher = new LineItemFetcher(knex);
    const account = '0x7c09Ff9b59BAAebfd721cbDA3676826aA6d7BaE8'.toLowerCase();
    const lineItems = await fetcher.getLineItems(account, '2022-10-01', false);

    const lineItemsString = LineItemFetcher.lineItemGroupToString(lineItems);
    if (DEBUG_OUTPUT) {
        console.log(lineItemsString);
    }

    expect(lineItems.account.toLowerCase()).toEqual(account);
    expect(lineItems.month.toString()).toEqual('2022/10');
    expect(lineItems.fteCap).toBeCloseTo(11.5);
    expect(lineItems.hasActuals).toBe(true);

    const totals = groupTotals(lineItems);
    expect(totals.actual).toBeCloseTo(99445.26);
    expect(totals.forecast).toBeCloseTo(99426.33);
    expect(totals.budgetCap).toBeCloseTo(250000.00);
    expect(totals.payment).toBeCloseTo(99365.46);

    lineItems.categories.forEach(c => {
        Object.keys(c.reports).forEach(k => {
            expect(['2022/10', '2022/09', '2022/08', '2022/07']).toContainEqual(k);
        });
    });
});

it ('fetches correct line items for grants program wallet', async () => {
    const fetcher = new LineItemFetcher(knex);
    const account = '0xf95eB8eC63D6059bA62b0A8A7F843c7D92f41de2'.toLowerCase();
    const lineItems = await fetcher.getLineItems(account, '2022-10-01', true);

    const lineItemsString = LineItemFetcher.lineItemGroupToString(lineItems);
    if (DEBUG_OUTPUT) {
        console.log(lineItemsString);
    }

    expect(lineItems.account.toLowerCase()).toEqual(account);
    expect(lineItems.month.toString()).toEqual('2022/10');
    expect(lineItems.fteCap).toBeCloseTo(11.5);
    expect(lineItems.hasActuals).toBe(true);

    const totals = groupTotals(lineItems);
    expect(totals.actual).toBeCloseTo(15038.30);
    expect(totals.forecast).toBeCloseTo(55000.00);
    expect(totals.budgetCap).toBeCloseTo(60000.00);
    expect(totals.payment).toBeCloseTo(15038.30);

    lineItems.categories.forEach(c => {
        Object.keys(c.reports).forEach(k => {
            expect(['2022/10', '2022/09', '2022/08', '2022/07']).toContainEqual(k);
        });
    });
});

function groupTotals(lineItems: LineItemGroup): LineItemNumbers {
    const totals = {
        actual: 0.00,
        forecast: 0.00,
        budgetCap: 0.00,
        payment: 0.00
    }

    lineItems.categories.forEach(c => {
        totals.actual += c.numbers.actual; 
        totals.forecast += c.numbers.forecast; 
        totals.budgetCap += c.numbers.budgetCap; 
        totals.payment += c.numbers.payment;
    });

    return totals;
}