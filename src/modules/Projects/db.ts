import { Knex } from "knex";
import { stubData } from "./stubData.js";
import projects from './projects.js';
import supportedProjects from "./supportedProjects.js";

export class ProjectsModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getSupportedProjects(filter: ProjectFilter) {
    if (!filter || Object.keys(filter).length === 0) {
      return supportedProjects;
    }
    return supportedProjects.filter(project => this.applyFilter(project, filter, 'projectOwner'));
  }

  async getProjects(filter: ProjectFilter) {
    if (!filter || Object.keys(filter).length === 0) {
      return projects;
    }
    return projects.filter(project => this.applyFilter(project, filter, 'owner'));
  }

  private applyFilter(project: any, filter: ProjectFilter, ownerField: string): boolean {
    return Object.keys(filter).every(key => {
      if (key === 'ownedBy') {
        return this.applyFilter(project[ownerField], filter.ownedBy as OwnerFilter, ownerField);
      }
      if (typeof filter[key as keyof ProjectFilter] === 'object') {
        return this.applyFilter(project[key], filter[key as keyof ProjectFilter] as any, ownerField);
      }
      return project[key] === filter[key as keyof ProjectFilter];
    });
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