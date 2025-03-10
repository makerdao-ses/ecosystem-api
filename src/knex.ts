import knex, { Knex }  from "knex";
import pkg from "pg";
import { reviver } from "./modules/BudgetStatement/JsonSerializerTypes.js";

const { types } = pkg;

// Don't parse date values, leave as string
types.setTypeParser(1082, (val) => val);

// Parse JSON values with the reviver
types.setTypeParser(114, (val) => {
  return JSON.parse(val, reviver);
});

let instance: Knex | null = null;

export default () => {
  if (instance) {
    return instance;
  }

  const knexConfig = {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
  };

  instance = knex(knexConfig);
  return instance;
};
