import linkApiModules from "../factory";
import EcosystemDatabase from "../EcosystemDatabase";
import getKnex from "../../knex.js";
import defaultSettings from "../default.config";
import { ApolloServer } from "@apollo/server";
import { Authorization } from "../Auth/authorization";
import { startStandaloneServer } from "@apollo/server/standalone";

let server: any, db: any;

beforeAll(async () => {
  db = new EcosystemDatabase(getKnex());
  const { typeDefs, resolvers } = await linkApiModules(db, defaultSettings);
  const context = {
    dataSources: { db },
    user: { cuId: 46, username: "exampleName" },
    auth: new Authorization(db, 1),
  };
  server = new ApolloServer({ typeDefs, resolvers });
  await startStandaloneServer(server, {
    context: async () => context,
    listen: { port: 4000 },
  })
});

afterAll(async () => {
  await server.stop();
  await db.knex.destroy();
});

it("fetches snapshots", async () => {
  const snapshotsQuery = {
    query: `query Snapshots {
            snapshots {
              id
              period
              snapshotAccount {
                id
                accountLabel
                accountType
                snapshotAccountTransaction {
                  id
                  block
                }
                snapshotAccountBalance {
                  id
                }
              }
            }
          }
        `,
  };
  const response = await server.executeOperation(snapshotsQuery);
  expect(response.errors).toBeUndefined();
  expect(response.data.snapshots.length).toBeGreaterThan(0);
});
