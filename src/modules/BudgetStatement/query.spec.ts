import linkApiModules from '../factory';
import EcosystemDatabase from '../EcosystemDatabase';
import initKnex from '../../initKnex';
import defaultSettings from '../default.config';
import { ApolloServer } from 'apollo-server-express';


const queryData = {
    query: `query BudgetStatements {
        budgetStatements {
            id
            ownerId
            month
        }
    }`
}

let server: any, db: any;

beforeAll(async () => {
    db = new EcosystemDatabase(initKnex());
    const { typeDefs, resolvers } = await linkApiModules(db, defaultSettings)
    server = new ApolloServer({ typeDefs, resolvers, dataSources: () => ({ db }) })
})

afterAll(async () => {
    await db.knex.destroy()
    await server.stop()
})

it('fetches budgetStatements', async () => {
    const response = await server.executeOperation(queryData)
    expect(response.errors).toBeUndefined()
    expect(response.data.budgetStatements.length).toBeGreaterThan(0)
})