import { Knex } from "knex";

export interface Roadmap {
    id: string
    ownerCuId: string
    roadmapCode: string
    roadmapName: string
    comments: string
    roadmapStatus: object
    strategicInitiative: boolean
    roadmapSummary: string
    roadmapStakeholder: object
    roadmapOutput: object
    milestone: object
};

export interface RoadmapStakeholder {
    id: string
    stakeholderId: string
    roadmapId: string
    stakeholderRoleId: string
    stakeholderRole: object
    stakeholder: object
};

export interface StakeholderRole {
    id: string
    stakeholderRoleName: string
}

export interface Stakeholder {
    id: string
    name: string
    stakeholderContributorId: string
    stakeholderCuCode: string
    roadmapStakeholder: object
}

export interface RoadmapOutput {
    id: string
    outputId: string
    roadmapId: string
    outputTypeId: string
    output: object
    outputType: object
}

export interface Output {
    id: string
    name: string
    outputUrl: string
    outputDate: string
}

export interface OutputType {
    id: string
    outputType: string
}

export interface Milestone {
    id: string
    roadmapId: string
    taskId: string
    task: object
}

export interface Task {
    id: string
    parentId: string
    taskName: string
    taskStatus: string
    ownerStakeholderId: string
    startDate: string
    target: string
    completedPercentage: number
    confidenceLevel: string
    comments: string
    review: object
}

export interface Review {
    id: string
    taskId: string
    reviewDate: string
    reviewOutcome: string
}

export class RoadmapModel {
    knex: Knex;
    coreUnitModel: object

    constructor(knex: Knex, coreUnitModel: object) {
        this.knex = knex;
        this.coreUnitModel = coreUnitModel;
    };

    async getRoadmaps(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<Roadmap[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Roadmap')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getRoadmapStakeholders(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined): Promise<RoadmapStakeholder[]> {
        const baseQuery = this.knex
            .select('*')
            .from('RoadmapStakeholder')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getStakeholderRoles(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<StakeholderRole[]> {
        const baseQuery = this.knex
            .select('*')
            .from('StakeholderRole')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getStakeholders(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<Stakeholder[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Stakeholder')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getRoadmapOutputs(roadmapId: string | undefined): Promise<RoadmapOutput[]> {
        if (roadmapId === undefined) {
            return this.knex
                .select('*')
                .from('RoadmapOutput')
                .orderBy('id');
        } else {
            return this.knex('RoadmapOutput').where('roadmapId', roadmapId)
        }
    };

    async getRoadmapOutput(paramName: string, paramValue: string): Promise<RoadmapOutput[]> {
        return await this.knex('RoadmapOutput').where(`${paramName}`, paramValue)
    };

    async getOutputs(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<Output[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Output')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getOutputTypes(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<OutputType[]> {
        const baseQuery = this.knex
            .select('*')
            .from('OutputType')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getMilestones(
        paramName?: string | undefined,
        paramValue?: string | number | boolean | undefined
    ): Promise<Milestone[]> {
        const baseQuery = this.knex
            .select('*')
            .from('Milestone')
            .orderBy('id');
        if (paramName !== undefined && paramValue !== undefined) {
            return baseQuery.where(`${paramName}`, paramValue)
        } else {
            return baseQuery;
        }
    };

    async getMilestone(paramName: string, paramValue: string): Promise<Milestone[]> {
        return this.knex('Milestone').where(`${paramName}`, paramValue)
    };

    async getTasks(id: string | undefined): Promise<Task[]> {
        if (id === undefined) {
            return this.knex
                .select('*')
                .from('Task')
                .orderBy('id');
        } else {
            return this.knex('Task').where('id', id)
        }
    };

    async getTask(paramName: string, paramValue: string | number): Promise<Task[]> {
        return this.knex('Task').where(`${paramName}`, paramValue)
    };

    async getReviews(taskId: string | undefined): Promise<Review[]> {
        if (taskId === undefined) {
            return this.knex
                .select('*')
                .from('Review')
                .orderBy('id');
        } else {
            return this.knex('Review').where('taskId', taskId)
        }
    };

    async getReview(paramName: string, paramValue: string): Promise<Review[]> {
        return this.knex('Review').where(`${paramName}`, paramValue)
    };
}

export default (knex: Knex, deps: { [key: string]: object }) => new RoadmapModel(knex, deps['CoreUnit']);