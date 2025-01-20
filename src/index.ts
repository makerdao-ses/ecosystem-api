import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import express from "express";
import http from "http";
import cors from "cors";

import compression from "compression";
import dotenv from "dotenv";

import { expressjwt } from "express-jwt";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Authorization } from "./modules/Auth/authorization.js";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import initApi from "./initApi.js";
import { Algorithm } from "jsonwebtoken";
import { ListenOptions } from "net";
import { ApiModules } from "./modules/factory.js";
import { createDataLoaders } from "./utils/dataLoaderFactory.js";
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { updateQueryCache, warmUpQueryCache } from "./utils/logWrapper.js";
import { closeRedis } from "./utils/logWrapper.js";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

const graphqlPath = '/graphql';

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
    closeRedis();
  });

  const schema = makeExecutableSchema({
    typeDefs: apiModules.typeDefs,
    resolvers: apiModules.resolvers,
  });

  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer }), responseCachePlugin()];
  const server = new ApolloServer({
    schema,
    plugins,
    persistedQueries: {
      cache: new InMemoryLRUCache({
        maxSize: 1000,
      }),
    },
  });

  await server.start();

  app.use(graphqlPath,
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const ctx: {
          dataSources: { db: any };
          user?: any;
          auth?: Authorization;
          loaders?: ReturnType<typeof createDataLoaders>;
          noCache?: boolean;
          refreshCache?: boolean;
        } = {
          dataSources: { db: apiModules.datasource },
          user: (req as any).auth || null,
          noCache: req.headers['no-cache'] === 'true' ? true : false,
          refreshCache: req.headers['refresh-cache'] === process.env.REFRESH_CACHE_SECRET ? true : false,
        };

        try {
          ctx.loaders = createDataLoaders(apiModules.datasource);
          if (ctx.user) {
            ctx.auth = new Authorization(apiModules.datasource, ctx.user.id);
            
            return ctx;
          }

          return ctx;
        } catch (error: any) {
          console.log(`Error in context: ${error.message}.`);

          throw new GraphQLError(error.message, {
            extensions: {
              code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            },
          });
        }
      },
    })
  );

  await new Promise<void>((resolve) => httpServer.listen(options, resolve));

  console.log(
    `Server ready at http://localhost:${options.port}${graphqlPath}`,
  );
}

dotenv.config();
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 4000;
export const apiModules = await initApi();

startApolloServer(buildExpressApp(), apiModules, { port });
if (process.env.CACHE_DISABLED !== 'true') {
    await warmUpQueryCache();
}
