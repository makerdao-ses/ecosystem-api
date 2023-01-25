import { Knex } from "knex";


export class TotalExpensesModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }



}

export default (knex: Knex) => new TotalExpensesModel(knex);