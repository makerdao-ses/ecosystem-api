import { SQLDataSource } from "datasource-sql";
import { Knex } from "knex";

const DEBUG_OUTPUT = true;

type DatabaseFactoryFn = {
    (knex: Knex, dependencies: {[key: string]: object}): object;
}

export default class EcosystemDatabase extends SQLDataSource {
    [k: string]: any;
    private modulesIndex: {[key: string]: object} = {};

    // Load the database object of an API module
    loadModule(moduleName:string, apiModule: DatabaseFactoryFn, dependencies:string[]): void {
        if (typeof apiModule !== 'function') {
            throw new Error(`The apiModule parameter for module ${moduleName} must be a function.`); 
        }

        if (DEBUG_OUTPUT) {
            console.log(`Loading database object for API module '${moduleName}' with dependencies [` + dependencies.join(', ') + ']');
        }

        // Collect the module's dependencies
        const collectedDependencies: Record<string, any> = {};
        dependencies.forEach((d:string) => {
            if (!this[d]) {
                throw Error(`Dependency ${d} not found while loading module '${moduleName}'`);
            }

            collectedDependencies[d] = this[d];
        });

        // Call the factory function
        this[moduleName] = apiModule(this.knex, collectedDependencies);
        this.modulesIndex[moduleName] = this[moduleName];
    }

    // Type-friendly way of retrieving a module.
    module<T>(moduleName: string): T {
        if (!this.modulesIndex.hasOwnProperty(moduleName)) {
            throw Error(`Database module ${moduleName} cannot be found.`);
        }

        return this.modulesIndex[moduleName] as T;
    }
}