import { Knex } from "knex";
import stubData from "./stubData.js";

export class ScopeOfWorkModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    }

    async getRoadmaps() {
        return stubData;
    }
}

export default (knex: Knex) => new ScopeOfWorkModel(knex);
