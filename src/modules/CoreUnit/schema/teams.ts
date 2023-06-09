import { gql } from 'apollo-server-core';

export const typeDefs = gql`

    type Team {
        "id is autogenerated in the database"
        id: ID!
        "Team code - as defined within the Teams' MIP39"
        code: String
        "Team name - as as defined within the Teams' MIP39"
        name: String
        "Logo image reference to swarm network. In case server is down, copy file reference and paste it in another swarm gateway link"
        image: String
        "Type of Team - Technical, Business, Support etc"
        category: [TeamCategory]
        "A short description of the mandate covered by the Team"
        sentenceDescription: String
        "A more substantial description of the aims and the work to be performed by the Team"
        paragraphDescription: String
        "Optional image provided by the Team to give further context on the descriptions"
        paragraphImage: String
        "A shortened version of the Team code"
        shortCode: String
        "Link to the Legacy GitHub repository containing historical records of the Team Budget Statement reports"
        legacyBudgetStatementUrl: String    
        "The ID of the budget that is assigned to this Team"
        budgetId: ID
        "ResouceType of the Team"
        type: ResourceType
        "Information on the Users that are this Teams' auditors"
        auditors: [User] 
        "Access details on the social media channels of a Team"
        socialMediaChannels: [SocialMediaChannels]
        "Work basis of the FTE's within a Team, use this field to access details of the FTE's contributing to a Team"
        contributorCommitment: [ContributorCommitment]
        "Access details on the relevant GitHub contributions of a Team"
        cuGithubContribution: [CuGithubContribution]
        "Object containing data relating to updates provided by the Team"
        updates: [TeamUpdate]
    }

    enum ResourceType {
        System
        CoreUnit
        Delegates
        EcosystemActor
        AlignedDelegates
    }

    "Possible values for Team categories - A Team can be assigned to more than one category"
    enum TeamCategory {
        Technical
        Support
        Operational
        Business
        RWAs
        Growth
        Finance
        Legal
    }

    type TeamUpdate {
        "Automatically generated ID"
        id: ID!
        "The ID of the relevant Team"
        cuId: ID!
        "The title of the update"
        updateTitle: String
        "The date that the update was published"
        updateDate: String
        "A relevant link to where the update is hosted"
        updateUrl: String
    }

    extend type Query {
        "Use this query to retrieve information about ALL Teams or one Team by using filter arguments."
        teams(filter: TeamFilter, limit: Int, offset: Int): [Team],
        updates(filter: UpdateFilter): [TeamUpdate],
    }

    "Provid information of an update of a Team"
    input UpdateFilter {
        "Automatically generated ID"
        id: ID
        "The ID of the relevant Team"
        cuId: ID
        "The title of the update"
        updateTitle: String
        "The date that the update was published"
        updateDate: DateTime
        "A relevant link to where the update is hosted"
        updateUrl: String
    }

    input TeamFilter {
        "Use to filter on the automatically generated ID of a Team"
        id: ID
        "Use to filter on the full code of a Team e.g. 'SES-001'"
        code: String
        "Use to filter on the name of a Team e.g. 'Sustainable Ecosystem Scaling'"
        name: String
        "Use to filter on the short code of a Team e.g. 'SES'"
        shortCode: String
        "ResourceType of the Team"
        type: ResourceType
    }
`;

export const resolvers = {
    Query: {
        // coreUnits: (parent, args, context, info) => {}
        teams: async (_: any, filter: any, { dataSources }: any) => {
            const result = await dataSources.db.CoreUnit.getTeams(filter)
            const parsedResult = result.map((cu: any) => {
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
        updates: async (_: any, { filter }: any, { dataSources }: any) => {
            return await dataSources.db.CoreUnit.getCuUpdates(filter);
        }
    },
    Team: {
        socialMediaChannels: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getSocialMediaChannels({ cuId: id });
            return result;
        },
        contributorCommitment: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getContributorCommitments({ cuCode: id });
            return result;
        },
        cuGithubContribution: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getCuGithubContributions(id);
            return result;
        },
        updates: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const result = await dataSources.db.CoreUnit.getCuUpdates({ cuId: id });
            return result;
        },
        auditors: async (parent: any, __: any, { dataSources }: any) => {
            const { id } = parent;
            const resourceUsers = await dataSources.db.Auth.getSystemRoleMembers(parent.type + 'Auditor', parent.type, id);
            return resourceUsers
        }
    }
};