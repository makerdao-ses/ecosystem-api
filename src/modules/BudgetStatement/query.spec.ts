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
  // testing successfull write
  server.config.context.user = { cuId: 45, username: 'exampleName' };
  server.config.context.auth = new Authorization(db, 1);
  const response = await server.executeOperation(query);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetStatementsBatchAdd[0]['ownerId']).toEqual('45');

  // testing for disabled account
  await db.knex('User').where('username', 'exampleName').update({ active: false });
  const response1 = await server.executeOperation(query);
  expect(response1.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');
  await db.knex('User').where('username', 'exampleName').update({ active: true });

  // testing wihtout input
  let noInputQuery = JSON.parse(JSON.stringify(query));
  noInputQuery.variables.input = [];
  const response2 = await server.executeOperation(noInputQuery);
  expect(response2.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');

  // testing without ownerType
  let noOwnerTypeQ = JSON.parse(JSON.stringify(query));
  let varsInput = JSON.parse(JSON.stringify(budgetStatementInput)) as any;
  delete varsInput.ownerType;
  noOwnerTypeQ.variables.input = [varsInput];
  const response3 = await server.executeOperation(noOwnerTypeQ);
  expect(response3.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');

  // testing for authorisation error
  server.config.context.user.cuId = 1;
  const response4 = await server.executeOperation(query);
  expect(response4.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');

  // testig for authentication error
  delete server.config.context.auth
  delete server.config.context.user
  const response5 = await server.executeOperation(query);
  expect(response5.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');
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

  // test without credentials
  const response0 = await server.executeOperation(query);
  expect(response0.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');

  server.config.context.user = { cuId: 1, username: 'exampleName' };
  server.config.context.auth = new Authorization(db, 1);

  // testing for authorisation error
  const response4 = await server.executeOperation(query);
  expect(response4.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');
  server.config.context.user.cuId = 45;

  // testing for disabled account
  await db.knex('User').where('username', 'exampleName').update({ active: false });
  const response1 = await server.executeOperation(query);
  expect(response1.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');
  await db.knex('User').where('username', 'exampleName').update({ active: true });

  // testing for disabled commenting
  const [wallet] = await db.knex('BudgetStatementWallet').where('id', 1070);
  const [bStatement] = await db.knex('BudgetStatement').where('id', wallet.budgetStatementId);
  await db.knex('BudgetStatement').where('id', bStatement.id).update({ status: 'Final' });
  const response2 = await server.executeOperation(query);
  expect(response2.errors[0]['extensions'].code).toEqual('UNAUTHENTICATED');
  await db.knex('BudgetStatement').where('id', bStatement.id).update({ status: 'Draft' });

  const response = await server.executeOperation(query);
  expect(response.errors).toBeUndefined();
  expect(response.data.budgetLineItemsBatchAdd[0]['budgetStatementWalletId']).toEqual('1070');
  await db.knex('BudgetStatementLineItem').where('id', response.data.budgetLineItemsBatchAdd[0]['id']).del();
});