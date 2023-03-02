import knex from "knex";
import pkg from 'pg';
import { reviver } from "./modules/BudgetStatement/JsonSerializerTypes.js";

const { types } = pkg;

// Don't parse date values, leave as string
types.setTypeParser(1082, val => val);

// Parse JSON values with the reviver
types.setTypeParser(114, val => {
    return JSON.parse(val, reviver);
});

export default () => {
    const knexConfig = {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
    };

    return knex(knexConfig);
}