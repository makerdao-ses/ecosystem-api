import { Knex } from "knex";
import { stubData } from "./stubData.js";

export class ProjectsModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getProjects() {
    return stubData;
  }
}

export default (knex: Knex) => new ProjectsModel(knex);