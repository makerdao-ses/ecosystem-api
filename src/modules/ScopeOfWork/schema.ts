import { gql } from 'apollo-server-core';

export const typeDefs = [
    gql`
        type ScopeOfWorkState {
            roadmaps: [Roadmap]
        }

        type Roadmap {
            id: ID!
            slug: String
            title: String
            description: String
            milestones: [Milestone]
        }

        type Milestone {
            id: ID!
            sequenceCode: String
            code: String
            title: String
            abstract: String
            description: String
            targetDate: String
            scope: MScope
            coordinators: [MCoordinator]
            contributors: [MContributor]
        }

        type MCoordinator {
            id: ID!
            ref: String
            name: String
            code: String
            imageUrl: String
        }

        type MContributor {
            id: ID!
            ref: String
            name: String
            code: String
            imageUrl: String
        }

        type MScope {
            deliverables: [MDeliverable]
            status: String
            progress: Progress
            totalDeliverables: Int
            deliverablesCompleted: Int
        }

        type MDeliverable {
            id: ID!
            code: String
            title: String
            description: String
            status: String
            keyResults: [KeyResult]
            workProgress: Progress
            budgetAnchor: BudgetAnchor
            owner: MOwner
        }

        type KeyResult {
            id: ID!
            title: String
            link: String
        }

        type BudgetAnchor {
            project: BProject
            workUnitBudget: Float
            deliverableBudget: Float
        }

        type BProject {
            code: String
            title: String
        }

        type MOwner {
            id: ID!
            ref: String
            name: String
            code: String
            imageUrl: String
        }

        union Progress = StoryPoints | Percentage

        type StoryPoints {
            total: Int
            completed: Int
        }

        type Percentage {
            value: Float
        }

        extend type Query {
            scopeOfWorkState: ScopeOfWorkState
        }
    `,
];

export const resolvers = {
    Query: {
        scopeOfWorkState: async (_: any, { filter }: any, { dataSources }: any) => {
            const roadmaps = await dataSources.db.ScopeOfWork.getRoadmaps();
            return { roadmaps }
        }
    },
    Progress: {
        __resolveType: (obj: any) => {
            if (obj.total && obj.completed) {
                return "StoryPoints";
            } else if (obj.value) {
                return "Percentage";
            } else {
                throw new Error("Invalid value type");
            }
        },
    },
}