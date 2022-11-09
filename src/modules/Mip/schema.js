import { gql } from "apollo-server-core";

export const typeDefs = [gql`

    "Information for a specifc MIP"
    type CuMip {
        id: ID!
        "Full MIP Code"
        mipCode: String
        "ID of the Core Unit to which the MIP relates"
        cuId: ID
        "Date MIP was status was changed to RFC"
        rfc: String
        "Date MIP was status was changed to Formal Submission"
        formalSubmission: String
        "Date MIP was status was changed to Accepted"
        accepted: String
        "Date MIP was status was changed to Rejected"
        rejected: String
        "Date MIP was status was changed to Obsolete - Meaning that a it has been overwritten by a later MIP"
        obsolete: String
        "Current status of the MIP"
        mipStatus: CuMipStatus
        "URL of the MIP Portal for the corresponding MIP"
        mipUrl: String
        "Title of the MIP"
        mipTitle: String
        "Forum URL where the MIP was proposed"
        forumUrl: String
        "If applicable - More specific information for MIP39's"
        mip39: [Mip39]
        "If applicable - More specific information for MIP40's"
        mip40: [Mip40]
        "If applicable - More specific information for MIP41's"
        mip41: [Mip41]
        "If applicable - Details of the MIP's that this one may replace"
        mipReplaces: [MipReplaces]
    }

    "Describes the current status of the MIP"
    enum CuMipStatus {
        RFC
        Formal Submission
        Accepted
        Rejected
        Obsolete
        Withdrawn
    }

    "If applicable - Details of the MIP's that have been replaced"
    type MipReplaces {
        id: ID!
        newMip: ID!
        replacedMip: ID!
    }

    "Information specific to MIP39 - Core Unit Framework"
    type Mip39 {
        id: ID!
        mipId: ID!
        mip39Spn: Int!
        mipCode: String!
        cuName: String!
        sentenceSummary: String!
        paragraphSummary: String!
    }

    "Information specific to MIP40 - Budget Framework"
    type Mip40 { 
        id: ID!
        cuMipId: ID!
        mip40Spn: String
        mkrOnly: Boolean
        mkrProgramLength: Float
        mip40BudgetPeriod: [Mip40BudgetPeriod]
        mip40Wallet: [Mip40Wallet]
    }

    "The period relevant to the budget laid out in the corresponding MIP40"
    type Mip40BudgetPeriod {
        id: ID!
        mip40Id: ID!
        budgetPeriodStart: String!
        budgetPeriodEnd: String!
        ftes: Float!
    }

    "Information on the budget cap of a specific line item within the MIP40"
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

    "Detail of the wallet(s) specified within the MIP40"
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

    "Information speficic to MIP41's - Facilitator Framework"
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

    "Allows for filtering of Core Unit MIP's"
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

    "Allows for filtering of Core Unit MIP39's"
    input Mip39Filter {
        id: ID
        mipId: ID
        mip39Spn: Int
        mipCode: String
        cuName: String
        sentenceSummary: String
        paragraphSummary: String
    }

    "Allows for filtering of Core Unit MIP40's using the MIP40 table"
    input Mip40Filter {
        id: ID
        cuMipId: ID
        mip40Spn: String
        mkrOnly: Boolean
        mkrProgramLength: Float
    }

    "Allows for filtering of Core Unit MIP40's using the MIP40BudgetPeriod table"
    input Mip40BudgetPeriodFilter {
        id: ID
        mip40Id: ID
        budgetPeriodStart: String
        budgetPeriodEnd: String
        ftes: Int
    }

    "Allows for filtering of Core Unit MIP40's using the MIP40BudgetLineItem table"
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

    "Allows for filtering of Core Unit MIP40's using the MIP40Wallet table"
    input Mip40WalletFilter {
        id: ID
        mip40Id: ID
        address: String
        name: String
        signersTotal: Int
        signersRequired: Int
        clawbackLimit: Float
    }

    "Allows for filtering of Core Unit MIP41's"
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
        "Retrieve ALL Core Unit MIP's"
        cuMips: [CuMip]
        "Retrieve specifc Core Unit MIP's using filters"
        cuMip(filter: CuMipFilter): [CuMip]
        "Retrieve information on ALL Core Unit MIP's that have been replaced"
        mipReplaces: [MipReplaces]
        "Retrieve information on which Core Unit MIP's have been replaced using filters"
        mipReplace(filter: MipReplaceFilter): [MipReplaces]
        "Retrieve all MIP39's in the database"
        mip39s: [Mip39]
        "Retrieve specific MIP39's using filters"
        mip39(filter: Mip39Filter): [Mip39]
        "Retrieve all MIP40's in the database"
        mip40s: [Mip40]
        "Retrieve specific MIP40's using filters"
        mip40(filter: Mip40Filter): [Mip40]
        "Retrieve ALL MIP40BudgetPeriods"
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