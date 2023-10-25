import { Knex } from 'knex';

export class ProjectsModel {
    knex: Knex;

    constructor(knex: Knex) {
        this.knex = knex;
    };

    async getProjects() {
        
    }

}

export default (knex: Knex) => new ProjectsModel(knex);