import { gql } from "apollo-server-core";

export const typeDefs = [
  gql`
    type Project {
      id: ID!
      owner: Owner!
      code: String!
      title: String!
      abstract: String
      status: ProjectStatus!
      progress: Percentage
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
      progress: Progress
      owner: Owner!
      keyResults: [KeyResult]!
    }

    type KeyResult {
      id: ID!
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
      TODO
      IN_PROGRESS
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
  `,
];

export const resolvers = {
  Query: {
    projects: async (_: any, { filter }: any, { dataSources }: any) => {
      const projects = await dataSources.db.Projects.getProjects(filter);
      return projects;
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