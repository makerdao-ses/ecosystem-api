import linkApiModules from '../factory';
import EcosystemDatabase from '../EcosystemDatabase';
import initKnex from '../../initKnex';
import defaultSettings from '../default.config';
import { ApolloServer } from 'apollo-server-express';

// Queries to be executed in tests below
const budgetStatementsQuery = {
    query: `query BudgetStatements {
        budgetStatements {
            id
            ownerId
            month
        }
    }`
};

const bsWalletsQuery = {
    query: `query BudgetStatementWallets {
        budgetStatementWallets {
          id
          budgetStatementId
          name
        }
    }`
};

let bsLineItemsQuery = {
    query: `query BudgetStatementLineItems($filter: BudgetStatementLineItemFilter) {
        budgetStatementLineItems(filter: $filter) {
          id
          budgetStatementWalletId
          month
        }
      }`,
    variables: {
        filter: {
            budgetStatementWalletId: 100
        }
    }
} as any;

const coreUnitBStatementsQuery = {
    query: `query CoreUnits {
        coreUnits {
          id
          budgetStatements {
            id
            ownerId
          }
        }
    }`
};

const bsWithChildQuries = {
    query: `query BudgetStatements {
        budgetStatements {
          id
          activityFeed {
            id
          }
          auditReport {
            id
          }
          budgetStatementFTEs {
            id
          }
          budgetStatementMKRVest {
            id
          }
          budgetStatementWallet {
            id
          }
        }
    }`
};

const bsWalletWithChildQueries = {
    query: `query BudgetStatementWallets {
        budgetStatementWallets {
          id
          budgetStatementLineItem {
            id
          }
          budgetStatementPayment {
            id
          }
          budgetStatementTransferRequest {
            id
          }
        }
    }`
}

let server: any, db: any;

beforeAll(async () => {
    db = new EcosystemDatabase(initKnex());
    const { typeDefs, resolvers } = await linkApiModules(db, defaultSettings)
    server = new ApolloServer({ typeDefs, resolvers, dataSources: () => ({ db }) })
});

afterAll(async () => {
    await db.knex.destroy()
    await server.stop()
});

it('fetches budgetStatements', async () => {
    const response = await server.executeOperation(budgetStatementsQuery)
    expect(response.errors).toBeUndefined()
    expect(response.data.budgetStatements.length).toBeGreaterThan(0)
});

it('fetches bsWallets', async () => {
    const response = await server.executeOperation(bsWalletsQuery)
    expect(response.errors).toBeUndefined()
    expect(response.data.budgetStatementWallets.length).toBeGreaterThan(0)
});

it('fetches bsLineItems', async () => {
    const response1 = await server.executeOperation(bsLineItemsQuery)
    bsLineItemsQuery.variables.filter = {
        ...bsLineItemsQuery.variables.filter,
        month: '2022-01',
        position: 1,
    }
    const response2 = await server.executeOperation(bsLineItemsQuery);
    expect(response2.errors).toBeDefined()
    expect(response1.errors).toBeUndefined()
    expect(response1.data.budgetStatementLineItems.length).toBeGreaterThan(0)
});

it('fetches CoreUnits with budgetStatements', async () => {
    const response = await server.executeOperation(coreUnitBStatementsQuery);
    expect(response.errors).toBeUndefined();
    expect(response.data.coreUnits.length).toBeGreaterThan(0);
});

it('fetches budgetStatement with child queries', async () => {
    const response = await server.executeOperation(bsWithChildQuries);
    expect(response.errors).toBeUndefined();
    expect(response.data.budgetStatements.length).toBeGreaterThan(0);
});

it('fetched budgetStatementWallet with child queries', async () => {
    const response = await server.executeOperation(bsWalletWithChildQueries);
    expect(response.errors).toBeUndefined();
    expect(response.data.budgetStatementWallets.length).toBeGreaterThan(0);
});