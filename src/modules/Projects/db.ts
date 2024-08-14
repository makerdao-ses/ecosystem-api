import { Knex } from "knex";
import { stubData } from "./stubData.js";
import projects from './projects.js'
import supportedProjects from "./supportedProjects.js";

export class ProjectsModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getSupportedProjects(filter: ProjectFilter) {
    return supportedProjects
  }

  async getProjects(filter: ProjectFilter) {
    return projects;
  }

}

export default (knex: Knex) => new ProjectsModel(knex);

// Define the filter types
type OwnerFilter = {
  id?: string;
  name?: string;
  code?: string;
  ref?: string;
};

type ProjectFilter = {
  id?: string;
  status?: string;
  progress?: number;
  ownedBy?: OwnerFilter;
  budgetType?: string;
};