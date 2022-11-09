import { gql } from "apollo-server-core";

export const typeDefs = [gql`
    type ChangeTrackingEvent {
        id: ID!
        created_at: DateTime!,
        event: String!,
        params: JSON!,
        description: String!
    }

    extend type Query {
        activityFeed: [ChangeTrackingEvent]
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