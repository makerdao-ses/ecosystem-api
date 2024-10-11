import { ApolloServer, AuthenticationError } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
} from "apollo-server-core";
import express from "express";
import compression from "compression";
import http from "http";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Authorization } from "./modules/Auth/authorization.js";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import initApi from "./initApi.js";
import { Algorithm } from "jsonwebtoken";
import { ListenOptions } from "net";
import { ApiModules } from "./modules/factory.js";
import { createDataLoaders } from "./utils/dataLoaderFactory.js";
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { updateQueryCache, warmUpQueryCache } from "./utils/logWrapper.js";
import { closeRedis } from "./utils/logWrapper.js";

const startupTime = new Date();
function buildExpressApp() {
  if (typeof process.env.SECRET === "undefined") {
    throw Error(
      "SECRET not set. SECRET needs to be defined in the environment variables for JWT.",
    );
  }

  const jwtConfig = {
    secret: process.env.SECRET,
    algorithms: ["HS256"] as Algorithm[],
    credentialsRequired: false,
  };

  const app = express();
  app.use(compression());
  app.use(expressjwt(jwtConfig));
  app.get('/healthz', async (_req, res) => {
    return res.json({
      status: 'healthy',
      time: new Date(),
      startupTime
    });
  });
  app.get('/update-cache', async (_req, res) => {
    if (_req.headers['refresh-cache'] !== process.env.REFRESH_CACHE_SECRET) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }
    const { maxConcurrency, maxQueries } = _req.query;
    updateQueryCache(maxConcurrency ? Number(maxConcurrency) : undefined, maxQueries ? Number(maxQueries) : undefined);
    return res.json({
      status: 'ok',
    });
  });

  return app;
}

async function startApolloServer(
  app: express.Express,
  apiModules: ApiModules,
  options: ListenOptions,
) {
  const httpServer = http.createServer(app);
  httpServer.on('close', () => {
    closeRedis;
  });

  const schema = makeExecutableSchema({
    typeDefs: apiModules.typeDefs,
    resolvers: apiModules.resolvers,
  });

  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer }), (responseCachePlugin as any).default()];

  const server = new ApolloServer({
    schema,
    plugins,
    persistedQueries: {
      cache: new InMemoryLRUCache({
        maxSize: 1000,
      }),
    },
    context: ({ req }) => {
      try {
        const user = (req as any).auth || null;
        const noCache = req.headers['no-cache'] === 'true' ? true : false;
        const refreshCache = req.headers['refresh-cache'] === process.env.REFRESH_CACHE_SECRET ? true : false;

        const loaders = createDataLoaders(apiModules.datasource);
        if (user) {
          const auth = new Authorization(apiModules.datasource, user.id);
          return { user, auth, loaders, refreshCache };
        }
        if (noCache) {
          return { noCache, loaders, refreshCache };
        }
        return { loaders, refreshCache };
      } catch (error: any) {
        throw new AuthenticationError(error.message);
      }
    },
    dataSources: () => ({ db: apiModules.datasource }),
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen(options, resolve));
  console.log(
    `Server ready at http://localhost:${options.port}${server.graphqlPath}`,
  );
}

dotenv.config();
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 4000;
export const apiModules = await initApi();

startApolloServer(buildExpressApp(), apiModules, { port });
await warmUpQueryCache();
