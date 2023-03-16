import linkApiModules from '../factory';
import EcosystemDatabase from '../EcosystemDatabase';
import initKnex from '../../initKnex';
import defaultSettings from '../default.config';
import { ApolloServer } from 'apollo-server-express';
import { Authorization } from '../Auth/authorization';

let server: any, db: any;

beforeAll(async () => {
  db = new EcosystemDatabase(initKnex());
  const { typeDefs, resolvers } = await linkApiModules(db, defaultSettings);
  const context = {
    dataSources: { db },
    user: { cuId: 45, username: 'exampleName' },
    auth: new Authorization(db, 1)
  }
  server = new ApolloServer({ typeDefs, resolvers, context })
});

afterAll(async () => {
  await server.stop()
  await db.knex.destroy()
});

it('fetches budgetStatements', async () => {
  const budgetStatementsQuery = {
    query: `query BudgetStatements {
          budgetStatements {
              id
              ownerId
              month
          }
      }`
  };
  const response = await server.executeOperation(budgetStatementsQuery)
  expect(response.errors).toBeUndefined()
  expect(response.data.budgetStatements.length).toBeGreaterThan(0)
});

it('fetches bsWallets', async () => {
  const bsWalletsQuery = {
    query: `query BudgetStatementWallets {
          budgetStatementWallets {
            id
            budgetStatementId
            name
          }
      }`
  };
  const response = await server.executeOperation(bsWalletsQuery)
  expect(response.errors).toBeUndefined()
  expect(response.data.budgetStatementWallets.length).toBeGreaterThan(0)
});

it('fetches bsLineItems', async () => {
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
  const response = await server.executeOperation(coreUnitBStatementsQuery);
  expect(response.errors).toBeUndefined();
  expect(response.data.coreUnits.length).toBeGreaterThan(0);
});

it('fetches budgetStatement with child queries', async () => {
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
  const response = await server.executeOperation(bsWithChildQuries);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetStatements.length).toBeGreaterThan(0);
});

it('fetched budgetStatementWallet with child queries', async () => {
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
  const response = await server.executeOperation(bsWalletWithChildQueries);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetStatementWallets.length).toBeGreaterThan(0);
});

it('adds budgetStatements', async () => {
  const budgetStatementInput = {
    ownerId: 45,
    month: '2023-03-01',
    status: 'Draft',
    ownerCode: 'EXA-001',
    ownerType: 'CoreUnit'
  };
  const query = {
    query: `mutation BudgetStatementsBatchAdd($input: [BudgetStatementBatchAddInput]) {
      budgetStatementsBatchAdd(input: $input) {
        id
        ownerId
      }
    }`,
    variables: {
      input: [budgetStatementInput]
    }
  };

  const response = await server.executeOperation(query);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetStatementsBatchAdd[0]['ownerId']).toEqual('45');
  await db.knex('BudgetStatement').where('id', response.data.budgetStatementsBatchAdd[0]['id']).del();
});

it('adds budgetLineItems', async () => {
  const lineItem = {
    budgetStatementWalletId: 1070,
    month: '2023-01-01',
    position: 1
  } as any;
  const inputArr = [lineItem];
  inputArr.push({ cuId: 45, ownerType: 'CoreUnit' });
  const query = {
    query: `mutation BudgetLineItemsBatchAdd($input: [LineItemsBatchAddInput]) {
      budgetLineItemsBatchAdd(input: $input) {
        id
        budgetStatementWalletId
      }
    }`,
    variables: {
      input: inputArr
    }
  };

  const response = await server.executeOperation(query);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetLineItemsBatchAdd[0]['budgetStatementWalletId']).toEqual('1070');
  await db.knex('BudgetStatementLineItem').where('id', response.data.budgetLineItemsBatchAdd[0]['id']).del();
})