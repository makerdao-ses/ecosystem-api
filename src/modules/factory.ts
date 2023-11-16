import _ from "lodash";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import {
  typeDefs as baseTypes,
  resolvers as baseTypeResolvers,
} from "./base.schema.js";
import defaultSettings from "./default.config.js";
import { ModulesConfig } from "./ModulesConfig";
import EcosystemDatabase from "./EcosystemDatabase.js";
import { DocumentNode } from "graphql";

const DEBUG_OUTPUT = false;

export interface ApiModules {
  typeDefs: DocumentNode[];
  resolvers: { [key: string]: any };
  datasource: EcosystemDatabase;
}

// Load the GraphQL schema (type definitions + resolvers) and database object of each module
export default async function linkApiModules(
  datasource: EcosystemDatabase,
  settings: ModulesConfig = defaultSettings,
): Promise<ApiModules> {
  const schema = await linkSchemas(settings);

  return {
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    datasource: await linkDataModules(datasource, settings),
  };
}

// Load the GraphQL schema (type definitions + resolvers) of each module
export async function linkSchemas(settings: ModulesConfig = defaultSettings) {
  const enabledModules = Object.keys(settings).filter(
    (m) => settings[m].enabled,
  );
  const moduleTypeDefs: any[] = [],
    moduleResolvers = {};

  for (const moduleName of enabledModules) {
    if (DEBUG_OUTPUT) {
      console.log(`Importing GraphQL schema for API module '${moduleName}'...`);
    }

    const schemaJs = await import(`./${moduleName}/schema.js`);
    moduleTypeDefs.push(...schemaJs.typeDefs);
    _.merge(moduleResolvers, schemaJs.resolvers);
  }

  const typeDefs = [...scalarTypeDefs, baseTypes, ...moduleTypeDefs];

  const resolvers = _.merge(
    scalarResolvers,
    baseTypeResolvers,
    moduleResolvers,
  );

  return { typeDefs, resolvers };
}

// Load the database object of each module
export async function linkDataModules(
  datasource: EcosystemDatabase,
  settings: ModulesConfig = defaultSettings,
) {
  const enabledModules = Object.keys(settings).filter(
    (m) => settings[m].enabled,
  );

  for (const moduleName of sortDependencyTree(enabledModules, settings)) {
    const moduleDataSource = await import(`./${moduleName}/db.js`);
    const dependencies = settings[moduleName].require || [];

    datasource.loadModule(moduleName, moduleDataSource.default, dependencies);
  }

  return datasource;
}

// Sort the list of modules so we're guaranteed to load all dependencies before we're loading the dependent module.
function sortDependencyTree(modules: string[], settings: ModulesConfig) {
  // Modules will be added to result in the order they get resolved.
  const result: string[] = [];

  // Build an index that keeps track of whether the module has been resolved, and its depenedencies.
  const index = modules.reduce(
    (index, module) => {
      // Normalized array of dependencies.
      const deps = settings[module].require || [];

      if (deps.length < 1) {
        // If the module has no dependencies, resolve it right away.
        result.push(module);
        index[module] = { resolved: true, deps };
      } else {
        // If the modules has at least one dependency, we'll resolve it later.
        index[module] = { resolved: false, deps };
      }

      return index;
    },
    {} as {
      [key: string]: {
        resolved: boolean;
        deps: string[];
      };
    },
  );

  // Keep going until all modules have been resolved
  while (result.length < modules.length) {
    let resolvedNoNewModules = true;

    // Take all the modules that (1) have not been resolved, but (2) have all their dependencies already resolved
    modules
      .filter(
        (m) =>
          !index[m].resolved && index[m].deps.every((d) => index[d].resolved),
      )

      // Resolve the selected modules
      .forEach((m) => {
        resolvedNoNewModules = false;
        result.push(m);
        index[m].resolved = true;
      });

    // If no additional module was resolved this iteration, we're stuck with a missing or circular dependency
    if (resolvedNoNewModules) {
      throw Error(
        "Missing or circular dependencies exist for API modules in [" +
          modules.filter((m) => !index[m].resolved).join(", ") +
          "]",
      );
    }
  }

  return result;
}
