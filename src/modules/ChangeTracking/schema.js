import { gql, AuthenticationError } from "apollo-server-core";

export const typeDefs = [gql`
    type ChangeTrackingEvent {
        "Automatically generated ID"
        id: ID!
        "Timestamp of the event"
        created_at: DateTime!,
        "Type of event"
        event: String!,
        "JSON object containing more context on the event"
        params: JSON!,
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

    extend type Query {
        activityFeed: [ChangeTrackingEvent],
        userActivity(filter: UserActivityFilter): [UserActivity]
        budgetStatementEvents(filter: BudgetStatementEventsFilter): [ChangeTrackingEvent]
    }

    type Mutation {
        userActivityUpdate(input: UserActivityUpdateInput): [UserActivityUpdatePayload]
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
        },
        budgetStatementEvents: async (_, { filter }, { dataSources }) => {
            const result = await dataSources.db.ChangeTracking.getBsEvents(filter?.budgetStatementId);
            return result
        }
    },
    Mutation: {
        userActivityUpdate: async (_, { input }, { user, auth, dataSources }) => {
            try {
                if (!user && !auth) {
                    throw new AuthenticationError("Not authenticated, login!")
                } else {
                    if (input.timestamp === null || input.timestamp === undefined) {
                        input.timestamp = new Date().toISOString();
                    };
                    const lastActivity = await dataSources.db.ChangeTracking.getUserActivity('userId', input.userId);
                    const lastUserActivity = lastActivity[lastActivity.length - 1];
                    const [result] = await dataSources.db.ChangeTracking.userActivityCreate(input);
                    const output = {
                        id: result.id,
                        userId: result.userId,
                        collection: result.collection,
                        previous: {
                            data: lastUserActivity?.data,
                            timestamp: lastUserActivity?.lastVisit
                        },
                        current: {
                            data: result.data,
                            timestamp: result.lastVisit
                        }
                    };
                    return [output];
                }

            } catch (error) {
                throw new AuthenticationError(error ? error : 'You are not authorized to perform this query')
            }
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