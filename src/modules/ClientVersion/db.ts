import { Knex } from "knex";

export interface BudgetToolVersion {
  id: string;
  version: string;
  link: string;
}

export class ClientVersionModel {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getBudgetToolVersions(): Promise<BudgetToolVersion[]> {
    return await this.knex("BudgetToolVersion").orderBy("id", "desc");
  }

  async getLatestBudgetToolVersion(): Promise<BudgetToolVersion[]> {
    return await this.knex("BudgetToolVersion").orderBy("id", "desc").limit(1);
  }
}

export default (knex: Knex) => new ClientVersionModel(knex);
