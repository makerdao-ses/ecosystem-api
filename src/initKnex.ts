import knex from "knex";
import pkg from 'pg';

const { types } = pkg;
types.setTypeParser(1082, val => val);

export default () => {
    const knexConfig = {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
    };

    return knex(knexConfig);
}