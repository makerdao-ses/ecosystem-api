import { gql } from "apollo-server-core";

export const typeDefs = [gql`

    type CuMip {
        "Automatically generated ID value"
        id: ID!
        "MIP code as defined within the MIP submitted to Maker governance"
        mipCode: String
        "The ID of the Core Unit of which the MIP relates to"
        cuId: ID
        "The date that the MIP was submitted for 'Request For Comments'"
        rfc: String
        "The date that the MIP was formally submitted to Maker governance"
        formalSubmission: String
        "The date that the MIP was accepted by Maker governance"
        accepted: String
        "The date that the MIP was rejected by Maker governance"
        rejected: String
        "The date that the MIP was made obsolete - usually through being replaced by a newer MIP"
        obsolete: String
        "The current status of the MIP "
        mipStatus: CuMipStatus
        "A link to the MIPs portal the full Maker Improvement Proposal (MIP) can be read"
        mipUrl: String
        "The full title given to the MIP by the MIP creator"
        mipTitle: String
        "A link to the MakerDAO Governance Forum where this MIP is discussed"
        forumUrl: String
        "If applicatble - This object provides further information on specific information contained in the MIP39"
        mip39: [Mip39]
        "If applicatble - This object provides further information on specific information contained in the MIP40"
        mip40: [Mip40]
        "If applicatble - This object provides further information on specific information contained in the MIP41"
        mip41: [Mip41]
        "If applicatble - Information on the MIP(s) that are repalaced by this later one"
        mipReplaces: [MipReplaces]
    }

    "Current status of the MIP - RFC, Accepted, Rejected etc"
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
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the CuMip table"
        mipId: ID!
        "The SPN of the MIP39"
        mip39Spn: Int!
        "The full MIP code"
        mipCode: String!
        "The Core Unit name as defined within the MIP39"
        cuName: String!
        "A short description of the mandate covered by the Core Unit"
        sentenceSummary: String!
        "A more substantial description of the aims and the work to be performed by the Core Unit"
        paragraphSummary: String!
    }

    type Mip40 { 
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the CuMip table"
        cuMipId: ID!
        "The SPN of the MIP40"
        mip40Spn: String
        "A boolean value signifying whether the MIP40 relates only to an MKR budget"
        mkrOnly: Boolean
        "The length of the MKR incentive plan defined within the MIP40"
        mkrProgramLength: Float
        "An object containing further information on the period to which the MIP40 is relevant"
        mip40BudgetPeriod: [Mip40BudgetPeriod]
        "An object containing further information on the wallet(s) defined in the MIP40"
        mip40Wallet: [Mip40Wallet]
    }

    type Mip40BudgetPeriod {
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the Mip40 table"
        mip40Id: ID!
        "The start of the period that the budget will be relevant for"
        budgetPeriodStart: String!
        "The end of the period that the budget will be relevant for"
        budgetPeriodEnd: String!
        "The predicted number of fte's for the budget period as set out in the MIP40"
        ftes: Float!
    }

    type Mip40BudgetLineItem {
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the Mip40Wallet table"
        mip40WalletId: ID
        position: Int!
        "The name of the budget category used within the MIP40"
        budgetCategory: String!
        "The budget cap defined for the corresponding line item"
        budgetCap: Float!
        "The expense type as defined within the Strategic Finance Chart of Accounts"
        canonicalBudgetCategory: CanonicalBudgetCategory
        "If relevant - the sub-group that this expense is relevant for e.g. if the expense is for a sub-team within the Core Unit"
        group: String
        "Boolean value defining whether the expense is a headcount expense"
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
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the Mip40 table"
        mip40Id: ID!
        "The ETH wallet address as defined in the MIP40"
        address: String!
        "The wallet name as defined in the MIP40"
        name: String!
        "The total number of signers for the multi-sig address"
        signersTotal: Int!
        "The total number of signers required to sign a transaction for the multi-sig address"
        signersRequired: Int!
        clawbackLimit: Float
        "An object containing further information on the individual budget line items of the MIP40 budget"
        mip40BudgetLineItem: [Mip40BudgetLineItem]
    }

    type Mip41 {
        "Automatically generated ID"
        id: ID!
        "ID referencing to the corresponding entry in the CuMip table"
        cuMipId: ID!
        "ID referencing to the corresponding entry in the Contributor table"
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
        "Used to retrieve all Core Unit Mips in the database"
        cuMips: [CuMip]
        "Used to retrieve specifc Core Unit Mips in the database using a filter"
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