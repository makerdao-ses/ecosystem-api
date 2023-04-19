import { Knex } from "knex";


export class Delegates {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }


}

export default (knex: Knex) => new Delegates(knex);