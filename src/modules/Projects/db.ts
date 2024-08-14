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
    return supportedProjects.filter(project => this.applyFilter(project, filter));
  }

  async getProjects(filter: ProjectFilter) {
    return projects.filter(project => this.applyFilter(project, filter));
  }

  private applyFilter(project: any, filter: ProjectFilter): boolean {
    if (filter.id && project.id !== filter.id) return false;
    if (filter.status && project.status !== filter.status) return false;
    if (filter.progress && project.progress !== filter.progress) return false;
    if (filter.ownedBy) {
      if (filter.ownedBy.id && project.ownedBy.id !== filter.ownedBy.id) return false;
      if (filter.ownedBy.name && project.ownedBy.name !== filter.ownedBy.name) return false;
      if (filter.ownedBy.code && project.ownedBy.code !== filter.ownedBy.code) return false;
      if (filter.ownedBy.ref && project.ownedBy.ref !== filter.ownedBy.ref) return false;
    }
    if (filter.budgetType && project.budgetType !== filter.budgetType) return false;
    return true;
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