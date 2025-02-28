import { gql } from "graphql-tag";
import { AuthenticationError } from "../../utils/AuthenticationError.js";
import { measureQueryPerformance } from "../../utils/logWrapper.js";

export const typeDefs = [
  gql`
    type ChangeTrackingEvent {
      "Automatically generated ID"
      id: ID!
      "Timestamp of the event"
      created_at: DateTime!
      "Type of event"
      event: String!
      "JSON object containing more context on the event"
      params: JSON!
      "Written description of the event"
      description: String!
    }

    type UserActivity {
      "Automatically generated ID"
      id: ID!
      "The ID of the relevant User"
      userId: ID!
      "String containing details of the collection to which the user activity corresponds"
      collection: String
      "Optional JSON object with providing further information on the user activity"
      data: JSON
      "If applicable - reference information on the previous user activity"
      lastVisit: DateTime
    }

    "Allows for filtering of the UserActivity object"
    input UserActivityFilter {
      "Filter with for all activity of a specific user"
      userId: ID
      "Filter with for all activity within a specific collection"
      collection: String
    }

    input UserActivityUpdateInput {
      userId: ID!
      collection: String!
      data: JSON
      timestamp: DateTime
    }

    type UserActivityUpdatePayload {
      id: ID
      userId: ID
      collection: String
      previous: DataAndStamp
      current: DataAndStamp
    }

    type DataAndStamp {
      data: JSON
      timestamp: DateTime
    }

    input BudgetStatementEventsFilter {
      budgetStatementId: ID
    }

    input ActivityFeedFilter {
      objectType: String!
      objectId: ID!
    }

    extend type Query {
      activityFeed(
        offset: Int
        limit: Int
        filter: ActivityFeedFilter
      ): [ChangeTrackingEvent]
      userActivity(filter: UserActivityFilter): [UserActivity]
      budgetStatementEvents(
        filter: BudgetStatementEventsFilter
      ): [ChangeTrackingEvent]
    }

    type Mutation {
      userActivityUpdate(
        input: UserActivityUpdateInput
      ): [UserActivityUpdatePayload]
    }

    extend type CoreUnit {
      lastActivity: ChangeTrackingEvent
      activityFeed(limit: Int, offset: Int): [ChangeTrackingEvent]
    }

    extend type Team {
      lastActivity: ChangeTrackingEvent
      activityFeed(limit: Int, offset: Int): [ChangeTrackingEvent]
    }
  `,
];

export const resolvers = {
  Query: {
    activityFeed: async (_: any, filter: any, { dataSources }: any) => {
      return await dataSources.db.ChangeTracking.getActivityFeed(
        filter.limit,
        filter.offset,
        filter.filter,
      );
    },
    userActivity: async (_: any, { filter }: any, { dataSources }: any) => {
      if (filter !== undefined) {
        const queryParams = Object.keys(filter);
        const paramName = queryParams[0];
        const paramValue = filter[queryParams[0]];
        const secondParamName = queryParams[1];
        const secondParamValue = filter[queryParams[1]];
        return measureQueryPerformance('getUserActivity', 'ChangeTracking', dataSources.db.ChangeTracking.getUserActivity(
          paramName,
          paramValue,
          secondParamName,
          secondParamValue,
        ));
      }
      return dataSources.db.ChangeTracking.getUserActivity();
    },
    budgetStatementEvents: async (
      _: any,
      { filter }: any,
      { dataSources }: any,
    ) => {
      const result = await measureQueryPerformance('getBsEvents', "ChangeTracking", dataSources.db.ChangeTracking.getBsEvents(
        filter?.budgetStatementId,
      ));
      return result;
    },
  },
  Mutation: {
    userActivityUpdate: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      try {
        if (!user && !auth) {
          throw new AuthenticationError("Not authenticated, login!");
        } else {
          if (input.timestamp === null || input.timestamp === undefined) {
            input.timestamp = new Date().toISOString();
          }
          const lastActivity =
            await dataSources.db.ChangeTracking.getUserActivity(
              "userId",
              input.userId,
            );
          const lastUserActivity = lastActivity[lastActivity.length - 1];
          const [result] =
            await dataSources.db.ChangeTracking.userActivityCreate(input);
          const output = {
            id: result.id,
            userId: result.userId,
            collection: result.collection,
            previous: {
              data: lastUserActivity?.data,
              timestamp: lastUserActivity?.lastVisit,
            },
            current: {
              data: result.data,
              timestamp: result.lastVisit,
            },
          };
          return [output];
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to perform this query",
        );
      }
    },
  },
  CoreUnit: {
    lastActivity: async (parent: any, _: any, { dataSources }: any) => {
      return dataSources.db.ChangeTracking.getCoreUnitLastActivity(
        parent.id,
        parent.type,
      );
    },
    activityFeed: async (parent: any, _: any, { dataSources }: any) => {
      return dataSources.db.ChangeTracking.getCoreUnitActivityFeed(
        parent.id,
        parent.type,
      );
    },
  },
  Team: {
    lastActivity: async (parent: any, _: any, { dataSources }: any) => {
      return dataSources.db.ChangeTracking.getCoreUnitLastActivity(
        parent.id,
        parent.type,
      );
    },
    activityFeed: async (parent: any, _: any, { dataSources }: any) => {
      return dataSources.db.ChangeTracking.getCoreUnitActivityFeed(
        parent.id,
        parent.type,
      );
    },
  },
};
