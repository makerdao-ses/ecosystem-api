import { gql } from 'apollo-server-core';
import { parseToSchemaUser, getCuIdFromPermissions } from '../../Auth/schema.js';

export const typeDefs = gql`

    type CoreUnit {
        "id is autogenerated in the database"
        id: ID!
        "Core Unit code - as defined within the Core Units' MIP39"
        code: String
        "Core Unit name - as as defined within the Core Units' MIP39"
        name: String
        "Logo image reference to swarm network. In case server is down, copy file reference and paste it in another swarm gateway link"
        image: String
        "Type of core unit"
        category: [CoreUnitCategory]
        sentenceDescription: String
        paragraphDescription: String
        paragraphImage: String
        shortCode: String
        legacyBudgetStatementUrl: String       
        auditors: [User] 
        "Access details on the social media channels of a Core Unit"
        socialMediaChannels: [SocialMediaChannels]
        "Work basis of the FTE's within a Core Unit, use this field to access details of the FTE's contributing to a Core Unit"
        contributorCommitment: [ContributorCommitment]
        "Access details on the relevant GitHub contributions of a Core Unit"
        cuGithubContribution: [CuGithubContribution]
        cuUpdates: [CuUpdate]
    }

    enum CoreUnitCategory {
        Technical
        Support
        Operational
        Business
        RWAs
        Growth
        Finance
        Legal
    }

    type CuUpdate {
        id: ID!
        cuId: ID!
        updateTitle: String
        updateDate: String
        updateUrl: String
    }

    type CoreUnitPayload {
        errorrs: [Error!]!
        coreUnit: CoreUnit
    }

    extend type Query {
        "Use this query to retrieve information about ALL Core Units"
        coreUnits(limit: Int, offset: Int): [CoreUnit],
        "Use this query to retrieve information about a single Core Unit, use arguments to filter."
        coreUnit(filter: CoreUnitFilter): [CoreUnit],
        cuUpdates: [CuUpdate],
        cuUpdate(filter: CuUpdateFilter): [CuUpdate]
    }

    input CuUpdateFilter {
        id: ID
        cuId: ID
        updateTitle: String
        updateDate: DateTime
        updateUrl: String
    }

    input CoreUnitInput {
        code: String!
        name: String!
    }

    input CoreUnitFilter {
        id: ID
        code: String
        name: String
        shortCode: String
    }
`;

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        coreUnits: async (_, filter, { dataSources }) => {
            const result = await dataSources.db.CoreUnit.getCoreUnits(filter.limit, filter.offset)
            const parsedResult = result.map(cu => {
                if (cu.category !== null) {
                    const cleanCategory = cu.category.slice(1, cu.category.length - 1)
                    cu.category = cleanCategory.split(',');
                    return cu;
                } else {
                    return cu;
                }
            })
            return parsedResult;
        },
        coreUnit: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            const result = await dataSources.db.CoreUnit.getCoreUnit(paramName, paramValue)
            const parsedResult = result.map(cu => {
                if (cu.category !== null) {
                    const cleanCategory = cu.category.slice(1, cu.category.length - 1)
                    cu.category = cleanCategory.split(',');
                    return cu;
                } else {
                    return cu;
                }
            })
            return parsedResult;
        },
        cuUpdates: async (_, __, { dataSources }) => {
            return await dataSources.db.CoreUnit.getCuUpdates();
        },
        cuUpdate: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose one parameter only"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.CoreUnit.getCuUpdate(paramName, paramValue)
        }
    },
    CoreUnit: {
        socialMediaChannels: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getSocialMediaChannels(id);
            return result;
        },
        contributorCommitment: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getContributorCommitments(id);
            return result;
        },
        cuGithubContribution: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getCuGithubContributions(id);
            return result;
        },
        cuUpdates: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getCuUpdates(id);
            return result;
        },
        auditors: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const users = await dataSources.db.Auth.getUsers();
            const parsedUsers = parseToSchemaUser(users)
            const auditors = [];
            parsedUsers.forEach(user => {
                user.roles.forEach(role => {
                    if (role.name === 'CoreUnitAuditor') {
                        const userObj = [];
                        userObj.push(user)
                        let cuId = undefined;
                        const regex = /[0-9]{1,}/;
                        role.permissions.forEach(permission => {
                            const rgxOutput = permission.match(regex);//permissions not role
                            if (rgxOutput !== null) {
                                cuId = rgxOutput[0]
                                if (parseFloat(cuId) === id) {
                                    auditors.push(user)
                                }
                            };
                            if (permission === 'CoreUnit') {
                                auditors.push(user)
                            }
                        })

                    }
                })
            });
            return auditors
        }
    }
};