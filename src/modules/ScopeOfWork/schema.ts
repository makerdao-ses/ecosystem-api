import { gql } from "apollo-server-core";

export const typeDefs = [
  gql`
    type ScopeOfWorkQuery{
      projects(filter: ProjectFilter): [Project]
      roadmaps(filter: RoadmapFilter): [Roadmap]
      milestones(filter: MilestoneFilter): [Milestone]
      deliverables(filter: DeliverableFilter): [Deliverable]
    }

    type Roadmap {
      id: ID! 
      slug: String! 
      milestones: [Milestone!]!
      title: String!
      description: String!
    }

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
      budget: Float
      deliverables: [Deliverable!]
    }

    type Owner {
      ref: OwnerType!
      id: ID!
      imgUrl: String
      name: String
      code: String
    }

    type Deliverable { 
      id: ID!
      title: String!
      status: DeliverableStatus!
      workProgress: Progress
      workUnitBudget: Float!
      deliverableBudget: Float!
      owner: Owner!
      description: String! 
      keyResults: [KeyResult!]!
      project: Project! 
    }

    type KeyResult {
      id: ID!
      deliverable: ID! 
      title: String!
      link: String!
    }

    type PercentageProgress {
      status: ProjectStatus!
      indication: Progress
    }

    union Progress = StoryPoints | Percentage | DeliverablesCompleted

    type StoryPoints {
      total: Int!
      completed: Int!
    }

    type Percentage {
      value: Float!
    }

    type DeliverablesCompleted {
      total: Int!
      completed: Int!
    }

    type Milestone {
      id: ID!
      code: String!
      title: String!
      description: String!
      progress: MilestoneProgress 
      targetDate: String
      estimatedBudgetCap: Float! 
      budgetExpenditure: BudgetExpenditure!
      coordinators: [Coordinator!]! 
      contributorTeams: [ContributorTeam!]!
      deliverables: [Deliverable!]
    }

    type MilestoneProgress {
      status: MilestoneStatus!
      indication: Progress
    }

    type BudgetExpenditure {
      percentage: Float!
      actuals: Float!
      cap: Float!
    }

    type Coordinator {
      ref: String!
      id: ID!
      name: String
      code: String
    }

    type ContributorTeam {
      ref: String!
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

    enum ProjectStatus {
      TODO
      IN_PROGRESS
      FINISHED
    }

    enum DeliverableStatus {
      TODO
      IN_PROGRESS
      DELIVERED
      BLOCKED
      WONT_DO
    }

    enum MilestoneStatus {
      TODO
      IN_PROGRESS
      FINISHED
    }

    enum CoordinatorType {
      EcosystemActor
      ScopeFacilitator
      ActiveMKRHolder
    }

    enum BudgetType {
      CONTINGENCY
      OPEX
      CAPEX
      OVERHEAD
    }

    input OwnerFilter {
      id: ID
      ref: OwnerType
      name: String
      code: String
    }

    input ProjectFilter {
      id: ID
      code: String
      title: String
      progress: ProgressInput
      budgetType: BudgetType
      budget: Float
      status: ProjectStatus
      ownedBy: OwnerFilter
      supportedBy: OwnerFilter
    }

    input RoadmapFilter {
      id: ID
      slug: String
      title: String
    }

    input DeliverableFilter {
      id: ID
      title: String
      status: DeliverableStatus
      workProgress: ProgressFilter
      workUnitBudget: Float
      deliverableBudget: Float
      owner: OwnerFilter
      project: ProjectFilter
    }

    input ProgressFilter {
      status: ProjectStatus
      indication: ProgressInput
    }

    input ProgressInput {
      total: Int
      completed: Int
      value: Float
    }

    input MilestoneFilter {
      id: ID
      code: String
      title: String
      progress: MilestoneProgressFilter
      targetDate: String
      estimatedBudgetCap: Float
      budgetExpenditure: BudgetExpenditureFilter
    }

    input MilestoneProgressFilter {
      status: MilestoneStatus
      indication: ProgressInput
    }

    input BudgetExpenditureFilter {
      percentage: Float
      actuals: Float
      cap: Float
    }

    extend type Query {
      scopeOfWork: ScopeOfWorkQuery
    }
  `,
];

export const resolvers = {
  Query: {
    scopeOfWork: (_: any, __: any, { dataSources }: any) => {
      return {};
    }
  },

  ScopeOfWorkQuery: {
    projects: async (_: any, { filter }: any, { dataSources }: any) => {
      const projects = await dataSources.db.ScopeOfWork.getProjects(filter);
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
