import { gql } from "apollo-server-core";

export const typeDefs = [gql`
    type ChangeTrackingEvent {
        id: ID!
        created_at: DateTime!,
        event: String!,
        params: JSON!,
        description: String!
    }

    type UserActivity {
        id: ID!
        userId: ID!
        collection: String
        data: JSON
        lastVisit: DateTime
    }

    input UserActivityFilter {
        userId: ID
        collection: String
    }

    extend type Query {
        activityFeed: [ChangeTrackingEvent],
        userActivity(filter: UserActivityFilter): [UserActivity]
    }

    extend type CoreUnit {
        lastActivity: ChangeTrackingEvent
        activityFeed: [ChangeTrackingEvent]
    }
`];

export const resolvers = {
    Query: {
        activityFeed: async (_, __, { dataSources }) => {
            return dataSources.db.ChangeTracking.getActivityFeed();
        },
        userActivity: async (_, { filter }, { dataSources }) => {
            if (filter !== undefined) {
                const queryParams = Object.keys(filter);
                const paramName = queryParams[0];
                const paramValue = filter[queryParams[0]];
                const secondParamName = queryParams[1];
                const secondParamValue = filter[queryParams[1]];
                return dataSources.db.ChangeTracking.getUserActivity(paramName, paramValue, secondParamName, secondParamValue)
            }
            return dataSources.db.ChangeTracking.getUserActivity()
        }
    },
    CoreUnit: {
        lastActivity: async (parent, _, { dataSources }) => {
            return dataSources.db.ChangeTracking.getCoreUnitLastActivity(parent.id);
        },
        activityFeed: async (parent, _, { dataSources }) => {
            return dataSources.db.ChangeTracking.getCoreUnitActivityFeed(parent.id);
        },
    },
};