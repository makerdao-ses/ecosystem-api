import knex from "knex";
// Connect to database selected in the .env file
const getKnexInstance = () => {
  return knex({
    client: "pg",
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    },
    idleTimeoutMillis: 0,
  });
};

export default getKnexInstance;
