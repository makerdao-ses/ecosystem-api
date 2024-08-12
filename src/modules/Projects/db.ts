import { Knex } from "knex";
import { stubData } from "./stubData.js";
import projects from './projects.js'
import supportedProjects from "./supportedProjects.js";

export class ProjectsModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getSupportedProjects() {
    return supportedProjects;
  }

  async getProjects() {
    return projects;
  }
}

export default (knex: Knex) => new ProjectsModel(knex);
