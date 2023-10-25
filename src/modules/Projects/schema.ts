import { gql } from 'apollo-server-core';
import { ProjectsModel } from './db.js';

export const typeDefs = [gql`

    type Project { 
        id: ID!
        owner: Owner!
        code: String!
        title: String! 
        abstract: String
        status: ProjectStatus! 
        progress: Progress
        imgUrl: String
        budgetType: BudgetType!
        deliverables: [Deliverable]
    }

    type Owner {
        ref: OwnerType!
        id: ID!
        imgUrl: String
        name: String
        code: String
        
    }

    enum OwnerType {
        CoreUnit
        Delegates
        SpecialPurposeFund
        Project
        EcosystemActor
        AlignedDelegates
        Keepers
    }
        
    type Deliverable {
        id: ID!
        title: String!
        status: DeliverableStatus!
        owner: Owner!
        keyResults: [KeyResult]!
    }

    type KeyResult {
        id: ID!
        title: String!
        link: String!
    }


    type Progress {
        status: DeliverableStatus!
        indication: Indication
    }
    union Indication = InProgress | StoryPoints | Percentage

    type InProgress {
        description: String
    }

    type StoryPoints {
        total: Int!
        completed: Int!
    }

    type Percentage {
        value: Float!
    }
    

    enum BudgetType {
        CONTINGENCY
        OPEX
        CAPEX
        OVERHEAD
    }

    enum ProjectStatus {
        TODO
        INPROGRESS
        FINISHED
    }

    enum DeliverableStatus {
        TODO
        INPROGRESS
        DELIVERED
    }

    input OwnerFilter {
        id: ID
        ref: OwnerType
    }

    input ProjectFilter {
        id: ID
        code: String
        status: ProjectStatus
        ownedBy: OwnerFilter
        supportedBy: OwnerFilter
    }

    extend type Query {
        projects(filter: ProjectFilter): [Project]
    }

`];

export const resolvers = {
    Query: {
        projects: async (_: any, { filter }: any, { dataSources }: any) => {
            const projects = await dataSources.projects.getProjects(filter);
            return projects;
        }
    },
}