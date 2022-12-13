import { gql, AuthenticationError } from "apollo-server-core";

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

    extend type Query {
        activityFeed: [ChangeTrackingEvent],
        userActivity(filter: UserActivityFilter): [UserActivity]
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