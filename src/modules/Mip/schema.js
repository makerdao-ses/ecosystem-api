import { gql } from "apollo-server-core";

export const typeDefs = [gql`

    type CuMip {
        id: ID!
        mipCode: String
        cuId: ID
        rfc: String
        formalSubmission: String
        accepted: String
        rejected: String
        obsolete: String
        mipStatus: CuMipStatus
        mipUrl: String
        mipTitle: String
        forumUrl: String
        mip39: [Mip39]
        mip40: [Mip40]
        mip41: [Mip41]
        mipReplaces: [MipReplaces]
    }

    enum CuMipStatus {
        RFC
        Formal Submission
        Accepted
        Rejected
        Obsolete
        Withdrawn
    }

    type MipReplaces {
        id: ID!
        newMip: ID!
        replacedMip: ID!
    }

    type Mip39 {
        id: ID!
        mipId: ID!
        mip39Spn: Int!
        mipCode: String!
        cuName: String!
        sentenceSummary: String!
        paragraphSummary: String!
    }

    type Mip40 { 
        id: ID!
        cuMipId: ID!
        mip40Spn: String
        mkrOnly: Boolean
        mkrProgramLength: Float
        mip40BudgetPeriod: [Mip40BudgetPeriod]
        mip40Wallet: [Mip40Wallet]
    }

    type Mip40BudgetPeriod {
        id: ID!
        mip40Id: ID!
        budgetPeriodStart: String!
        budgetPeriodEnd: String!
        ftes: Float!
    }

    type Mip40BudgetLineItem {
        id: ID!
        mip40WalletId: ID
        position: Int!
        budgetCategory: String!
        budgetCap: Float!
        canonicalBudgetCategory: CanonicalBudgetCategory
        group: String
        headcountExpense: Boolean
    }

    enum CanonicalBudgetCategory {
        CompensationAndBenefits
        AdminExpense
        TravelAndEntertainment
        FreightAndDuties
        GasExpense
        GovernancePrograms
        HardwareExpense
        MarketingExpense
        ProfessionalServices
        SoftwareDevelopmentExpense
        SoftwareExpense
        Supplies
        TrainingExpense
        CommunityDevelopmentExpense
    }

    type Mip40Wallet {
        id: ID!
        mip40Id: ID!
        address: String!
        name: String!
        signersTotal: Int!
        signersRequired: Int!
        clawbackLimit: Float
        mip40BudgetLineItem: [Mip40BudgetLineItem]
    }

    type Mip41 {
        id: ID!
        cuMipId: ID!
        contributorId: ID
    }

    input MipReplaceFilter {
        id: ID
        newMip: ID
        replacedMip: ID
    }

    input CuMipFilter {
        id: ID
        mipCode: String
        cuId: ID
        rfc: String
        formalSubmission: String
        accepted: String
        rejected: String
        obsolete: String
        mipStatus: CuMipStatus
    }

    input Mip39Filter {
        id: ID
        mipId: ID
        mip39Spn: Int
        mipCode: String
        cuName: String
        sentenceSummary: String
        paragraphSummary: String
    }

    input Mip40Filter {
        id: ID
        cuMipId: ID
        mip40Spn: String
        mkrOnly: Boolean
        mkrProgramLength: Float
    }

    input Mip40BudgetPeriodFilter {
        id: ID
        mip40Id: ID
        budgetPeriodStart: String
        budgetPeriodEnd: String
        ftes: Int
    }

    input Mip40BudgetLineItemFilter {
        id: ID
        mip40WalletId: ID
        position: Int
        budgetCategory: String
        budgetCap: Int
        canonicalBudgetCategory: String
        group: String
        headcountExpense: Boolean
        mip40BudgetLineItem: [Mip40BudgetLineItemFilter]
    }

    input Mip40WalletFilter{
        id: ID
        mip40Id: ID
        address: String
        name: String
        signersTotal: Int
        signersRequired: Int
        clawbackLimit: Float
    }

    input Mip41Filter {
        id: ID
        cuMipId: ID
        contributorId: ID
        facilitatorName: String
        discordHandle: String
        twitterHandle: String
        forumHandle: String
        githubAccount: String
    }

    extend type Query {
        cuMips: [CuMip]
        cuMip(filter: CuMipFilter): [CuMip]
        mipReplaces: [MipReplaces]
        mipReplace(filter: MipReplaceFilter): [MipReplaces]
        mip39s: [Mip39]
        mip39(filter: Mip39Filter): [Mip39]
        mip40s: [Mip40]
        mip40(filter: Mip40Filter): [Mip40]
        mip40BudgetPeriods: [Mip40BudgetPeriod]
        mip40BudgetPeriod(filter: Mip40BudgetPeriodFilter): [Mip40BudgetPeriod]
        mip40BudgetLineItems: [Mip40BudgetLineItem]
        mip40BudgetLineItem(filter: Mip40BudgetLineItemFilter): [Mip40BudgetLineItem]
        mip40Wallets: [Mip40Wallet]
        mip40Wallet(filter: Mip40WalletFilter): [Mip40Wallet]
        mip41s: [Mip41],
        mip41(filter: Mip41Filter): [Mip41]
    }

    extend type CoreUnit {
        "Access details on MIPs 39/40/41 of a Core Unit"
        cuMip: [CuMip]
    }
`];

export const resolvers = {
    Query: {
        // name: (parent, args, context, info) => {}
        cuMips: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMips()
        },
        cuMip: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip(paramName, paramValue)
        },
        mipReplaces: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMipReplaces();
        },
        mipReplace: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMipReplace(paramName, paramValue)
        },
        mip39s: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMip39s()
        },
        mip39: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip39(paramName, paramValue)
        },
        mip40s: async (_, __, { dataSources }) => {
            return dataSources.db.Mip.getMip40s()
        },
        mip40: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip40(paramName, paramValue)
        },
        mip40BudgetPeriods: async (_, __, { dataSources }) => {
            return dataSources.db.Mip.getMip40BudgetPeriods()
        },
        mip40BudgetPeriod: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip40BudgetPeriod(paramName, paramValue)
        },
        mip40BudgetLineItems: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMip40BudgetLineItems()
        },
        mip40BudgetLineItem: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip40BudgetLineItem(paramName, paramValue)
        },
        mip40Wallets: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMip40Wallets()
        },
        mip40Wallet: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip40Wallet(paramName, paramValue)
        },
        mip41s: async (_, __, { dataSources }) => {
            return await dataSources.db.Mip.getMip41s()
        },
        mip41: async (_, { filter }, { dataSources }) => {
            const queryParams = Object.keys(filter);
            if (queryParams.length > 1) {
                throw "Choose only one parameter"
            }
            const paramName = queryParams[0];
            const paramValue = filter[queryParams[0]];
            return await dataSources.db.Mip.getMip41(paramName, paramValue)
        }

    },
    CoreUnit: {
        cuMip: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMips(id);
            return result;
        },
    },
    CuMip: {
        mipReplaces: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMipReplaces(id);
            return result;
        },
        mip39: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip39s(id);
            return result;
        },
        mip40: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip40s(id);
            return result;
        },
        mip41: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip41s(id);
            return result;

        }
    },
    Mip40: {
        mip40BudgetPeriod: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip40BudgetPeriods(id);
            return result;
        },
        mip40Wallet: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip40Wallets(id);
            return result;
        }
    },
    Mip40Wallet: {
        mip40BudgetLineItem: async (parent, __, { dataSources }) => {
            const { id } = parent;
            const result = await dataSources.db.Mip.getMip40BudgetLineItems(id)
            return result;
        }
    }
}