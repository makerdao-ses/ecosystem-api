import { gql } from "graphql-tag";

export const typeDefs = [
  gql`
    type Project {
      id: ID!
      owner: Owner!
      code: String!
      title: String!
      abstract: String
      description: String
      status: String!
      progress: Progress
      imgUrl: String
      budgetType: String!
      deliverables: [Deliverable]
    }

    type SupportedProjects {
      id: ID!
      code: String
      title: String
      abstract: String
      description: String
      status: String
      budgetType: String
      progress: Progress
      projectOwner: Owner
      supportedDeliverables: [SupportedDeliverables]
    }

    type SupportedDeliverables {
      id: ID
      parentIdRef: ID
      code: String
      title: String
      description: String
      status: DeliverableStatus
      progress: Progress
      milestone: ID
      owner: Owner
      supportedKeyResults: [KeyResult]
    }

    type Owner {
      ref: String
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
      parentIdRef: ID!
      code: String
      title: String!
      description: String
      status: String!
      progress: Progress
      owner: Owner!
      keyResults: [KeyResult]!
      milestone: ID
    }

    type KeyResult {
      id: ID!
      parentIdRef: ID!
      title: String!
      link: String!
    }

    union Progress = StoryPoints | Percentage

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
      IN_PROGRESS
      FINISHED
    }

    enum DeliverableStatus {
      WONT_DO 
      DRAFT
      TODO
      BLOCKED
      IN_PROGRESS
      DELIVERED
      CANCELED
    }

    input OwnerFilter {
      id: ID
      name: String
      code: String
      ref: OwnerType
    }

    input ProjectFilter {
      id: ID
      status: ProjectStatus
      progress: Float
      ownedBy: OwnerFilter
      budgetType: BudgetType
    }

    type TeamProjectsQuery {
      teamProjects(filter: ProjectFilter): ProjectsAndSupportedProjects
      # projects(filter: ProjectFilter): [Project]
      # supportedProjects(filter: ProjectFilter): [SupportedProjects]
    }
    type ProjectsAndSupportedProjects {
      projects: [Project]
      supportedProjects: [SupportedProjects]
    }

    extend type Query {
      teamProjects(filter: ProjectFilter): ProjectsAndSupportedProjects
    }
    
  `,
];

export const resolvers = {
  Query: {
    teamProjects: async (_: any, { filter }: any, { dataSources }: any) => {
      const projects = await dataSources.db.Projects.getProjects(filter);
      const supportedProjects = await dataSources.db.Projects.getSupportedProjects(filter);
      return {
        projects,
        supportedProjects
      };
    },
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
};