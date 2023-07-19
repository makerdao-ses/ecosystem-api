// Read the postgres connection string from the environment variables.
// Format: postgresql://user:password@host/dbname
if (!process.env.PG_CONNECTION_STRING) {
  console.error("ATTENTION: PG_CONNECTION_STRING not set! Run PG_CONNECTION_STRING=postgresql://makerdao:pwd@localhost/EcosystemApi or similar.");
} else {
  console.debug("PG_CONNECTION_STRING: " + process.env.PG_CONNECTION_STRING)
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
  },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
  },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
  },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
