import { Knex } from "knex";

export interface Roadmap {
  id: string;
  ownerCuId: string;
  roadmapCode: string;
  roadmapName: string;
  comments: string;
  roadmapStatus: object;
  strategicInitiative: boolean;
  roadmapSummary: string;
  roadmapStakeholder: object;
  roadmapOutput: object;
  milestone: object;
}

export interface RoadmapStakeholder {
  id: string;
  stakeholderId: string;
  roadmapId: string;
  stakeholderRoleId: string;
  stakeholderRole: object;
  stakeholder: object;
}

export interface StakeholderRole {
  id: string;
  stakeholderRoleName: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  stakeholderContributorId: string;
  stakeholderCuCode: string;
  roadmapStakeholder: object;
}

export interface RoadmapOutput {
  id: string;
  outputId: string;
  roadmapId: string;
  outputTypeId: string;
  output: object;
  outputType: object;
}

export interface Output {
  id: string;
  name: string;
  outputUrl: string;
  outputDate: string;
}

export interface OutputType {
  id: string;
  outputType: string;
}

export interface Milestone {
  id: string;
  roadmapId: string;
  taskId: string;
  task: object;
}

export interface Task {
  id: string;
  parentId: string;
  taskName: string;
  taskStatus: string;
  ownerStakeholderId: string;
  startDate: string;
  target: string;
  completedPercentage: number;
  confidenceLevel: string;
  comments: string;
  review: object;
}

export interface Review {
  id: string;
  taskId: string;
  reviewDate: string;
  reviewOutcome: string;
}

export class RoadmapModel {
  knex: Knex;
  coreUnitModel: object;

  constructor(knex: Knex, coreUnitModel: object) {
    this.knex = knex;
    this.coreUnitModel = coreUnitModel;
  }

  private validateColumn(paramName: string, allowedColumns: string[]): void {
    if (!allowedColumns.includes(paramName)) {
      throw new Error(`Invalid column name: ${paramName}`);
    }
  }

  async getRoadmaps(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Roadmap[]> {
    const baseQuery = this.knex.select("*").from("Roadmap").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'ownerCuId', 'roadmapCode', 'roadmapName', 'comments', 'roadmapStatus', 'strategicInitiative', 'roadmapSummary']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getRoadmapStakeholders(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<RoadmapStakeholder[]> {
    const baseQuery = this.knex
      .select("*")
      .from("RoadmapStakeholder")
      .orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'stakeholderId', 'roadmapId', 'stakeholderRoleId']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getStakeholderRoles(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<StakeholderRole[]> {
    const baseQuery = this.knex
      .select("*")
      .from("StakeholderRole")
      .orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'stakeholderRoleName']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getStakeholders(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Stakeholder[]> {
    const baseQuery = this.knex.select("*").from("Stakeholder").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'name', 'stakeholderContributorId', 'stakeholderCuCode']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getRoadmapOutputs(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<RoadmapOutput[]> {
    const baseQuery = this.knex.select("*").from("RoadmapOutput").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'outputId', 'roadmapId', 'outputTypeId']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getOutputs(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Output[]> {
    const baseQuery = this.knex.select("*").from("Output").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'name', 'outputUrl', 'outputDate']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getOutputTypes(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<OutputType[]> {
    const baseQuery = this.knex.select("*").from("OutputType").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'outputType']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getMilestones(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Milestone[]> {
    const baseQuery = this.knex.select("*").from("Milestone").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'roadmapId', 'taskId']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getTasks(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Task[]> {
    const baseQuery = this.knex.select("*").from("Task").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'parentId', 'taskName', 'taskStatus', 'ownerStakeholderId', 'startDate', 'target', 'completedPercentage', 'confidenceLevel', 'comments']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }

  async getReviews(
    paramName?: string | undefined,
    paramValue?: string | number | boolean | undefined,
  ): Promise<Review[]> {
    const baseQuery = this.knex.select("*").from("Review").orderBy("id");
    if (paramName !== undefined && paramValue !== undefined) {
      this.validateColumn(paramName, ['id', 'taskId', 'reviewDate', 'reviewOutcome']);
      return baseQuery.where(paramName, paramValue);
    } else {
      return baseQuery;
    }
  }
}

export default (knex: Knex, deps: { [key: string]: object }) =>
  new RoadmapModel(knex, deps["CoreUnit"]);
