import { Knex } from "knex";
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

    if (filter.ownedBy) {
      return supportedProjects.filter(project => {
        const projectDeliverables = project.supportedDeliverables.filter(d => {
          const ownerId = filter.ownedBy?.id;
          const ownerName = filter.ownedBy?.name;
          const ownerCode = filter.ownedBy?.code;
          const ownerRef = filter.ownedBy?.ref;

          return (
            (ownerId && d.owner.id === ownerId) ||
            (ownerName && d.owner.name === ownerName) ||
            (ownerCode && d.owner.code === ownerCode) ||
            (ownerRef && d.owner.ref === ownerRef)
          );
        });
        return projectDeliverables.length > 0;
      });
    }

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