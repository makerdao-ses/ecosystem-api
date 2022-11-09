import { gql } from "apollo-server-core";

export const typeDefs = [gql`
    "Table tracking changes in the database"
    type ChangeTrackingEvent {
        id: ID!
        "Date of change"
        created_at: DateTime!,
        "Type of change"
        event: String!,
        "Parameters of change"
        params: JSON!,
        "Description of the change made"
        description: String!
    }

    extend type Query {
        "Retreive ALL Change Tracking Events"
        activityFeed: [ChangeTrackingEvent]
    }

    extend type CoreUnit {
        "Latest Change Tracking Event"
        lastActivity: ChangeTrackingEvent
        "Full activity feed of Change Tracking Events"
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