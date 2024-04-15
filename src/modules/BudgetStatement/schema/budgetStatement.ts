import { gql, AuthenticationError } from "apollo-server-core";
import {
  convertDate,
  getAnalyticsActuals,
  getAnalyticsForecast,
  getAnalyticsOnChain,
  getAnalyticsOffChain,
  getAnalyticsNetOutflow
} from "./utils.js";

import { measureQueryPerformance } from "../../../utils/logWrapper.js";
import { resolveBudgetPath } from "./utils.js";

export const typeDefs = [
  gql`
    type BudgetStatement {
      "Auto generated id field"
      id: ID!
      owner: BudgetStatementOwner
      ownerType: String
      "Month of corresponding budget statement"
      month: String!
      "Status of the budgest statement (Draft/Final)"
      status: BudgetStatus
      "Link to the complete publication of the budget statement"
      publicationUrl: String
        @deprecated(
          reason: "Moving this field to CoreUnit.legacyBudgetStamentUrl"
        )
      "Core Unit code as defined with the Core Units' MIP39"
      ownerCode: String
      mkrProgramLength: Float
      forecastExpenses: Float
      actualExpenses: Float
      paymentsOnChain: Float
      paymentsOffChain: Float
      netProtocolOutflow: Float
      activityFeed: [ChangeTrackingEvent]
      auditReport: [AuditReport]
      "Number of full-time employees in the corresponding budget statement"
      budgetStatementFTEs: [BudgetStatementFTEs]
      "Details on the amount of MKR vested in the corresponding budget statement"
      budgetStatementMKRVest: [BudgetStatementMKRVest]
      "Details on the wallets used for budget statement wallets"
      budgetStatementWallet: [BudgetStatementWallet]
    }

    type BudgetStatementOwner {
      id: ID 
      icon: String
      name: String
      shortCode: String
    }

    enum BudgetStatus {
      Draft
      Review
      Escalated
      Final
    }

    type AuditReport {
      id: ID!
      budgetStatementId: ID!
      auditStatus: AuditStatus
      reportUrl: String
      timestamp: Timestamp
    }

    enum AuditStatus {
      Approved
      ApprovedWithComments
      NeedActionsBeforeApproval
      Escalated
    }

    type BudgetStatementFTEs {
      id: ID!
      budgetStatementId: ID
      month: String
      "Full-time employees"
      ftes: Float
    }

    type BudgetStatementMKRVest {
      id: ID!
      budgetStatementId: ID!
      vestingDate: String!
      "Current MKR amount"
      mkrAmount: Float
      "Previous MKR amount"
      mkrAmountOld: Float
      comments: String
    }

    type BudgetStatementWallet {
      id: ID!
      budgetStatementId: ID!
      "Wallet name"
      name: String
      "Wallet address"
      address: String
      "Current wallet balance (as defined within the budget statement"
      currentBalance: Float
      topupTransfer: Float
      comments: String
      "Retrieve breakdown of the line items that make up the corresponding budget statement"
      budgetStatementLineItem(
        offset: Int
        limit: Int
      ): [BudgetStatementLineItem]
      "Retrieve payment information for corresponding budget statement"
      budgetStatementPayment: [BudgetStatementPayment]
      budgetStatementTransferRequest: [BudgetStatementTransferRequest]
    }

    type BudgetStatementTransferRequest {
      id: ID!
      budgetStatementWalletId: ID!
      budgetStatementPaymentId: ID
      requestAmount: Float
      walletBalance: Float
      walletBalanceTimeStamp: DateTime
      target: Target
    }

    type Target {
      amount: Float
      calculation: String
      description: String
      source: Source
    }

    type Source {
      code: String
      url: String
      title: String
    }

    type BudgetStatementLineItem {
      id: ID!
      budgetStatementWalletId: ID!
      month: String
      position: Int
      group: String
      budgetCategory: String
      forecast: Float
      actual: Float
      comments: String
      canonicalBudgetCategory: CanonicalBudgetCategory
      headcountExpense: Boolean
      budgetCap: Float
      payment: Float
      budgetId: ID
      currency: String
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
      Bonus
      ContingencyBuffer
    }

    type BudgetStatementPayment {
      id: ID!
      budgetStatementWalletId: ID!
      transactionDate: String!
      transactionId: String
      budgetStatementLineItemId: Int
      comments: String
    }

    type BudgetStatementPayload {
      errors: [Error]
      budgetStatement: [BudgetStatement]
    }

    input BudgetStatementInput {
      ownerId: ID
      ownerCode: String
      month: String
      status: BudgetStatus
    }

    input BudgetStatementFilter {
      id: ID
      ownerId: [ID]
      ownerType: [BudgetOwner]
      month: String
      status: [BudgetStatus]
      ownerCode: String
      mkrProgramLength: Float
      budgetPath: String
      sortByLastModified: ASC_DESC_SORT
      sortByMonth: ASC_DESC_SORT
    }

    enum ASC_DESC_SORT{
      asc
      desc
    }

    enum BudgetOwner {
      CoreUnit
      Delegates
      SpecialPurposeFund
      Project
      EcosystemActor
      AlignedDelegates
      Keepers
    }

    input BudgetStatementWalletFilter {
      id: ID
      budgetStatementId: ID
      name: String
      address: String
      currentBalance: Float
      topupTransfer: Float
      comments: String
    }

    input BudgetStatementLineItemFilter {
      id: ID
      budgetStatementWalletId: ID
      month: String
      position: Int
      group: String
      budgetCategory: String
      canonicalBudgetCategory: CanonicalBudgetCategory
      forecast: Float
      actual: Float
      comments: String
      budgetCap: Float
    }

    input BudgetStatementPaymentFilter {
      id: ID
      budgetStatementWalletId: ID
      transactionDate: String
      transactionId: String
      budgetStatementLineItemId: Int
      comments: String
    }

    extend type Query {
      budgetStatements(
        limit: Int
        offset: Int
        filter: BudgetStatementFilter
      ): [BudgetStatement!]
      budgetStatementWallets(
        filter: BudgetStatementWalletFilter
      ): [BudgetStatementWallet]
      budgetStatementLineItems(
        limit: Int
        offset: Int
        filter: BudgetStatementLineItemFilter
      ): [BudgetStatementLineItem]
      # budgetStatementPayments: [BudgetStatementPayment]
      # budgetStatementPayment(filter: BudgetStatementPaymentFilter): [BudgetStatementPayment]
    }

    extend type CoreUnit {
      "Access details on the budget statements of a Core Unit"
      budgetStatements: [BudgetStatement]
    }
    extend type Team {
      "Access details on the budget statements of a Team"
      budgetStatements: [BudgetStatement]
    }

    type Mutation {
      budgetStatementsBatchAdd(
        input: [BudgetStatementBatchAddInput]
      ): [BudgetStatement]
      budgetLineItemsBatchAdd(
        input: [LineItemsBatchAddInput]
      ): [BudgetStatementLineItem]
      budgetLineItemsBatchDelete(
        input: [LineItemsBatchDeleteInput]
      ): [BudgetStatementLineItem]
      budgetLineItemUpdate(
        input: LineItemUpdateInput
      ): [BudgetStatementLineItem]
      budgetLineItemsBatchUpdate(
        input: [LineItemsBatchUpdateInput]
      ): [BudgetStatementLineItem]
      budgetStatementWalletBatchAdd(
        input: [BudgetStatementWalletBatchAddInput]
      ): [BudgetStatementWallet]
      budgetStatementFTEAdd(
        input: BudgetStatementFTEInput
      ): [BudgetStatementFTEs]
      budgetStatementFTEUpdate(
        input: BudgetStatementFTEUpdateInput
      ): [BudgetStatementFTEs]
      budgetStatementStatusUpdate(
        input: BudgetStatementStatusInput
      ): BudgetStatement
    }

    input BudgetStatementStatusInput {
      id: ID!
      status: BudgetStatus!
    }

    input BudgetStatementFTEInput {
      budgetStatementId: ID!
      month: String!
      ftes: Float!
      coreUnitId: Float
    }

    input BudgetStatementFTEUpdateInput {
      id: ID!
      budgetStatementId: ID!
      month: String!
      ftes: Float!
      coreUnitId: Float
    }

    input LineItemsBatchUpdateInput {
      id: ID
      budgetStatementWalletId: ID
      month: String
      position: Int
      group: String
      budgetCategory: String
      forecast: Float
      actual: Float
      comments: String
      canonicalBudgetCategory: CanonicalBudgetCategory
      headcountExpense: Boolean
      budgetCap: Float
      payment: Float
      cuId: ID
      ownerType: String
      currency: String
    }

    input LineItemUpdateInput {
      id: ID
      budgetStatementWalletId: ID
      month: String
      position: Int
      group: String
      budgetCategory: String
      forecast: Float
      actual: Float
      comments: String
      canonicalBudgetCategory: CanonicalBudgetCategory
      headcountExpense: Boolean
      budgetCap: Float
      payment: Float
      currency: String
    }

    input LineItemsBatchAddInput {
      budgetStatementWalletId: ID
      month: String
      position: Int
      group: String
      budgetCategory: String
      forecast: Float
      actual: Float
      comments: String
      canonicalBudgetCategory: String
      headcountExpense: Boolean
      budgetCap: Float
      payment: Float
      cuId: ID
      ownerType: String
      currency: String
    }

    input LineItemsBatchDeleteInput {
      id: ID
      budgetStatementWalletId: ID
      month: String
      position: Int
      group: String
      budgetCategory: String
      forecast: Float
      actual: Float
      comments: String
      canonicalBudgetCategory: String
      headcountExpense: Boolean
      cuId: ID
      ownerType: String
      currency: String
    }

    input BudgetStatementBatchAddInput {
      ownerId: ID
      month: String
      status: BudgetStatus
      ownerCode: String
      ownerType: String
    }

    input BudgetStatementWalletBatchAddInput {
      budgetStatementId: ID
      name: String
      address: String
      currentBalance: Float
      topupTransfer: Float
      comments: String
      cuId: ID
    }
  `,
];

export const resolvers = {
  Query: {
    // coreUnits: (parent, args, context, info) => {}
    budgetStatements: async (_: any, filter: any, { noCache, dataSources }: any,) => {

      // check filter.filter.budgetPath and resolve to budgetStatementIds in the filter
      if (filter.filter?.budgetPath) {
        const budgetStatementIds = await resolveBudgetPath(filter.filter.budgetPath, dataSources.db.BudgetStatement.knex);
        const uniqueBudgetStatementIds = [...new Set(budgetStatementIds)];
        filter.filter.id = uniqueBudgetStatementIds;
      }

      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatements(filter);
      }
      return await measureQueryPerformance('getBudgetStatements', 'BudgetStatements', dataSources.db.BudgetStatement.getBudgetStatements(filter));
    },
    budgetStatementWallets: async (
      _: any,
      { filter }: any,
      { noCache, dataSources }: any,
    ) => {
      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatementWallets(filter);
      }
      return await measureQueryPerformance('getBudgetStatementWallets', 'BudgetStatement', dataSources.db.BudgetStatement.getBudgetStatementWallets(
        filter,
      ));
    },
    budgetStatementLineItems: async (
      _: any,
      filter: any,
      { noCache, dataSources }: any,
    ) => {
      let queryParams: string[] | undefined = undefined;
      let paramName: string | undefined = undefined;
      let paramValue: string[] | undefined = undefined;
      let secondParamName: string | undefined = undefined;
      let secondParamValue: string[] | undefined = undefined;
      if (filter.filter !== undefined) {
        queryParams = Object.keys(filter.filter);
        if (queryParams.length > 2) {
          throw "Choose no more than 2 parameters";
        }
        paramName = queryParams[0];
        paramValue = filter?.filter[queryParams[0]];
        secondParamName = queryParams[1];
        secondParamValue = filter?.filter[queryParams[1]];
      }
      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatementLineItems(
          filter?.limit,
          filter?.offset,
          paramName,
          paramValue,
          secondParamName,
          secondParamValue,
        );
      }
      return await measureQueryPerformance('getBudgetStatementLineItems', 'BudgetStatement', dataSources.db.BudgetStatement.getBudgetStatementLineItems(
        filter?.limit,
        filter?.offset,
        paramName,
        paramValue,
        secondParamName,
        secondParamValue,
      ));
    },
    // budgetStatementPayments: async (_, __, { dataSources }) => {
    //     return await dataSources.db.BudgetStatement.getBudgetStatementPayments();
    // },
    // budgetStatementPayment: async (_, { filter }, { dataSources }) => {
    //     const queryParams = Object.keys(filter);
    //     if (queryParams.length > 1) {
    //         throw "Choose one parameter only"
    //     }
    //     const paramName = queryParams[0];
    //     const paramValue = filter[queryParams[0]];
    //     return await dataSources.db.BudgetStatement.getBudgetStatementPayment(paramName, paramValue)
    // }
  },
  CoreUnit: {
    budgetStatements: async (parent: any, __: any, { dataSources }: any) => {
      const { id } = parent;
      const [output] = await dataSources.db
        .knex("CoreUnit")
        .where("id", id)
        .select("type");
      const result = await measureQueryPerformance('CoreUnit getBudgetStatements', "BudgetStaetments", dataSources.db.BudgetStatement.getBudgetStatements({
        filter: { ownerId: [id], ownerType: [output.type] },
      }));
      return result;
    },
  },
  Team: {
    budgetStatements: async (parent: any, __: any, { dataSources }: any) => {
      const { id } = parent;
      const [output] = await dataSources.db
        .knex("CoreUnit")
        .where("id", id)
        .select("type");
      const result = await measureQueryPerformance('Team getBudgetStatements', "BudgetStatements", dataSources.db.BudgetStatement.getBudgetStatements({
        filter: { ownerId: [id], ownerType: [output.type] },
      }));
      return result;
    },
  },
  BudgetStatement: {
    activityFeed: async (parent: any, __: any, { dataSources }: any) => {
      const { id } = parent;
      const result = await measureQueryPerformance('getBsEvents', "BudgetStatements", dataSources.db.ChangeTracking.getBsEvents(id));
      return result;
    },
    auditReport: async (parent: any, __: any, { dataSources }: any) => {
      const { id } = parent;
      const result = await measureQueryPerformance("getAuditReports", "BudgetStatements", dataSources.db.BudgetStatement.getAuditReports({
        budgetStatementId: id,
      }))
      return result;
    },
    budgetStatementFTEs: async (parent: any, __: any, { noCache, dataSources }: any) => {
      const { id } = parent;
      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatementFTEs({
          budgetStatementId: id,
        });
      }
      const result = await measureQueryPerformance('getBudgetStatementFTEs', "BudgetStatements", dataSources.db.BudgetStatement.getBudgetStatementFTEs({
        budgetStatementId: id,
      }))
      return result;
    },
    budgetStatementMKRVest: async (
      parent: any,
      __: any,
      { dataSources }: any,
    ) => {
      const { id } = parent;
      const result = await measureQueryPerformance('getBudgetStatementMKRVests', 'BudgetStatements', dataSources.db.BudgetStatement.getBudgetStatementMKRVests({
        budgetStatementId: id,
      }));
      return result;
    },
    budgetStatementWallet: async (
      parent: any,
      __: any,
      { noCache, dataSources }: any,
    ) => {
      const { id } = parent;
      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatementWallets({
          budgetStatementId: id,
        });
      }
      const result = await measureQueryPerformance('getBudgetStatementWallets', "BudgetStatements", dataSources.db.BudgetStatement.getBudgetStatementWallets({
        budgetStatementId: id,
      }));
      return result;
    },
    owner: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType } = parent;
      const [output] = await dataSources.db
        .knex("CoreUnit")
        .where("id", ownerId)
        .select("image", "name", "shortCode");

      const owner = {
        id: '',
        icon: "",
        name: "",
        shortCode: ""
      }

      switch (ownerType) {
        case 'Keepers': {
          owner.name = "Keepers"
          owner.shortCode = 'keepers'
        } break;
        case 'Delegates': {
          if (!output) {
            owner.name = "Recognized Delegates"
            owner.shortCode = "recognized-delegates"
          }
        } break;
        case 'AlignedDelegates': {
          owner.name = "Aligned Delegates"
          owner.shortCode = 'aligned-delegates'
        } break;
        case 'SpecialPurposeFund': {
          owner.name = "Special Purpose Fund"
          owner.shortCode = 'spfs'
        } break;
      }

      if (ownerId) {
        owner.id = ownerId
        owner.icon = output.image
        owner.name = output.name
        owner.shortCode = output.shortCode
      }

      return owner;
    },
    forecastExpenses: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType, month } = parent;
      const queryEngine = dataSources.db.Analytics;
      const convertedMonth = convertDate(month);
      const analytics = await getAnalyticsForecast(queryEngine, convertedMonth, ownerType, ownerId);
      return analytics[0]?.forecast;
    },
    actualExpenses: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType, month } = parent;
      const queryEngine = dataSources.db.Analytics;
      const convertedMonth = convertDate(month);
      const analytics = await getAnalyticsActuals(queryEngine, convertedMonth, ownerType, ownerId);
      return analytics[0]?.actuals;
    },
    paymentsOnChain: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType, month } = parent;
      const queryEngine = dataSources.db.Analytics;
      const convertedMonth = convertDate(month);
      const analytics = await getAnalyticsOnChain(queryEngine, convertedMonth, ownerType, ownerId);
      return analytics[0]?.paymentsOnChain;
    },
    paymentsOffChain: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType, month } = parent;
      const queryEngine = dataSources.db.Analytics;
      const convertedMonth = convertDate(month);
      const analytics = await getAnalyticsOffChain(queryEngine, convertedMonth, ownerType, ownerId);
      return analytics[0]?.paymentsOffChain;
    },
    netProtocolOutflow: async (parent: any, __: any, { dataSources }: any) => {
      const { ownerId, ownerType, month } = parent;
      const queryEngine = dataSources.db.Analytics;
      const convertedMonth = convertDate(month);
      const analytics = await getAnalyticsNetOutflow(queryEngine, convertedMonth, ownerType, ownerId);
      return analytics[0]?.netProtocolOutflow;
    }
  },
  BudgetStatementWallet: {
    budgetStatementLineItem: async (
      parent: any,
      __: any,
      { noCache, dataSources }: any,
    ) => {
      const { id } = parent;
      if (noCache) {
        return await dataSources.db.BudgetStatement.getBudgetStatementLineItems(
          undefined,
          undefined,
          "budgetStatementWalletId",
          id,
        );
      }
      const result = await measureQueryPerformance('getBudgetStatementLineItems', 'BudgetStatements', dataSources.db.BudgetStatement.getBudgetStatementLineItems(
        undefined,
        undefined,
        "budgetStatementWalletId",
        id,
      ));
      return result;
    },
    budgetStatementPayment: async (
      parent: any,
      __: any,
      { dataSources }: any,
    ) => {
      const { id } = parent;
      const result = await measureQueryPerformance('getBudgetStatementPayments', 'BudgetStatement', dataSources.db.BudgetStatement.getBudgetStatementPayments({
        budgetStatementWalletId: id,
      }));
      return result;
    },
    budgetStatementTransferRequest: async (
      parent: any,
      __: any,
      { dataSources }: any,
    ) => {
      const { id } = parent;
      const result = await measureQueryPerformance('getBudgetStatementTransferRequests', 'BudgetStatement', dataSources.db.BudgetStatement.getBudgetStatementTransferRequests(
        { budgetStatementWalletId: id },
      ));
      const parsedResult = result.map((tReqyest: any) => {
        return {
          id: tReqyest.id,
          budgetStatementWalletId: tReqyest.budgetStatementWalletId,
          budgetStatementPaymentId: tReqyest.budgetStatementPaymentId,
          requestAmount: tReqyest.requestAmount,
          walletBalance: tReqyest.walletBalance,
          walletBalanceTimeStamp: tReqyest.walletBalanceTimestamp,
          target: {
            amount: tReqyest.targetAmount,
            calculation: tReqyest.targetCalculation,
            description: tReqyest.targetDescription,
            source: {
              code: tReqyest.targetSourceCode,
              url: tReqyest.targetSourceUrl,
              title: tReqyest.targetSourceTitle,
            },
          },
        };
      });
      return parsedResult;
    },
  },
  Mutation: {
    budgetStatementsBatchAdd: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetStatements",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          // Delegates push
          let allowed = { count: 0 } as any;
          if (input[0].ownerId === null) {
            allowed = await dataSources.db.Auth.canUpdate(
              userObj.id,
              "Delegates",
              input[0].ownerId,
            );
          } else {
            const [typeResult] = await dataSources.db.CoreUnit.getTeams({
              filter: { id: input[0].ownerId },
            });
            allowed = await dataSources.db.Auth.canUpdateCoreUnit(
              userObj.id,
              typeResult.type,
              input[0].ownerId,
            );
          }
          if (parseInt(allowed[0].count) > 0 || input[0].ownerId === null) {
            if (input.length < 1) {
              throw new Error("No input data");
            }
            if (input[0].ownerType === undefined) {
              throw new Error("ownerType not defined");
            }
            console.log(
              `adding ${input.length} budgetStatements to CU ${input[0].ownerId}`,
            );
            const result =
              await dataSources.db.BudgetStatement.addBatchBudgetStatements(
                input,
              );
            return result;
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetStatements",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to update budgetStatements",
        );
      }
    },
    budgetLineItemsBatchAdd: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetLineItems",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const cuIdFromInput = input.pop();
          let allowed = { count: 0 };
          if (cuIdFromInput.ownerType !== "Delegates") {
            [allowed] = await dataSources.db.Auth.canUpdateCoreUnit(
              userObj.id,
              cuIdFromInput.ownerType,
              cuIdFromInput.cuId,
            );
          }
          if (allowed.count > 0 || cuIdFromInput.ownerType === "Delegates") {
            //Tacking Change
            let CU;
            if (cuIdFromInput.ownerType === "Delegates") {
              CU = { id: "", code: "", shortCode: "DEL" };
            } else {
              [CU] = await dataSources.db.CoreUnit.getCoreUnits({
                filter: { id: cuIdFromInput.cuId },
              });
            }
            const [wallet] =
              await dataSources.db.BudgetStatement.getBudgetStatementWallets({
                id: input[0].budgetStatementWalletId,
              });
            const [bStatement] =
              await dataSources.db.BudgetStatement.getBudgetStatements({
                filter: {
                  id: wallet.budgetStatementId,
                  ownerType: [cuIdFromInput.ownerType],
                },
              });
            if (
              bStatement.status === "Final" ||
              bStatement.status === "Escalated"
            ) {
              throw new Error(
                `Cannot update statement with status ${bStatement.status}`,
              );
            }
            dataSources.db.ChangeTracking.coreUnitBudgetStatementCreated(
              CU.id,
              CU.code,
              CU.shortCode,
              wallet.budgetStatementId,
              bStatement.month,
              bStatement.ownerType,
            );
            //Adding lineItems
            console.log(
              `adding ${input.length} line items to CU ${cuIdFromInput.cuId}`,
            );
            const result =
              await dataSources.db.BudgetStatement.addBatchLineItems(input);
            return result;
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetLineItems",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to update budgetLineItems",
        );
      }
    },
    budgetLineItemUpdate: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetLineItem",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const allowed = await auth.canUpdate("CoreUnit", user.cuId);
          if (allowed[0].count > 0) {
            //Tacking Change
            const [CU] = await dataSources.db.CoreUnit.getCoreUnits({
              filter: { id: user.cuId },
            });
            const [wallet] =
              await dataSources.db.BudgetStatement.getBudgetStatementWallets({
                id: input.budgetStatementWalletId,
              });
            const [ownerTypeResult] =
              await dataSources.db.BudgetStatement.getBSOwnerType(
                input.budgetStatementId,
              );
            const [bStatement] =
              await dataSources.db.BudgetStatement.getBudgetStatements({
                filter: {
                  id: wallet.budgetStatementId,
                  ownerType: [ownerTypeResult.ownerType],
                },
              });
            if (
              bStatement.status === "Final" ||
              bStatement.status === "Escalated"
            ) {
              throw new Error(
                `Cannot update statement with status ${bStatement.status}`,
              );
            }
            dataSources.db.ChangeTracking.coreUnitBudgetStatementUpdated(
              CU.id,
              CU.code,
              CU.shortCode,
              wallet.budgetStatementId,
              bStatement.month,
              bStatement.ownerType,
            );
            //Updating lineItems
            console.log(`updating line item ${input.id} to CU ${user.cuId}`);
            console.log("updating lineItem input", input);
            const result =
              await dataSources.db.BudgetStatement.updateLineItem(input);
            return result;
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetLineItems",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to update budgetLineItems",
        );
      }
    },
    budgetLineItemsBatchUpdate: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetLineItem",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const cuIdFromInput = input.pop();
          let allowed = { count: 0 };
          if (cuIdFromInput.ownerType !== "Delegates") {
            [allowed] = await dataSources.db.Auth.canUpdateCoreUnit(
              userObj.id,
              cuIdFromInput.ownerType,
              cuIdFromInput.cuId,
            );
          }
          if (allowed.count > 0 || cuIdFromInput.ownerType === "Delegates") {
            //Tacking Change
            let CU;
            if (cuIdFromInput.ownerType === "Delegates") {
              CU = { id: "", code: "", shortCode: "DEL" };
            } else {
              [CU] = await dataSources.db.CoreUnit.getCoreUnits({
                filter: { id: cuIdFromInput.cuId },
              });
            }
            const [wallet] =
              await dataSources.db.BudgetStatement.getBudgetStatementWallets({
                id: input[0].budgetStatementWalletId,
              });
            const [bStatement] =
              await dataSources.db.BudgetStatement.getBudgetStatements({
                filter: {
                  id: wallet.budgetStatementId,
                  ownerType: [cuIdFromInput.ownerType],
                },
              });
            if (
              bStatement.status === "Final" ||
              bStatement.status === "Escalated"
            ) {
              throw new Error(
                `Cannot update statement with status ${bStatement.status}`,
              );
            }
            dataSources.db.ChangeTracking.coreUnitBudgetStatementUpdated(
              CU.id,
              CU.code,
              CU.shortCode,
              wallet.budgetStatementId,
              bStatement.month,
              bStatement.ownerType,
            );
            //Updating lineItems
            console.log(
              `updating line items ${input.length} to CU ${cuIdFromInput.cuId}`,
            );
            const result =
              await dataSources.db.BudgetStatement.batchUpdateLineItems(input);
            return result;
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetLineItems",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to update budgetLineItems",
        );
      }
    },
    budgetLineItemsBatchDelete: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to delete budgetLineItems",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const allowed = await auth.canUpdate("CoreUnit", user.cuId);
          if (allowed[0].count > 0) {
            const cuIdFromInput = input.pop();
            const [wallet] =
              await dataSources.db.BudgetStatement.getBudgetStatementWallets({
                id: input[0].budgetStatementWalletId,
              });
            const [bStatement] =
              await dataSources.db.BudgetStatement.getBudgetStatements({
                filter: {
                  id: wallet.budgetStatementId,
                  ownerType: [cuIdFromInput.ownerType],
                },
              });
            if (
              bStatement.status === "Final" ||
              bStatement.status === "Escalated"
            ) {
              throw new Error(
                `Cannot update statement with status ${bStatement.status}`,
              );
            }
            console.log(
              `deleting ${input.length} line items from CU ${cuIdFromInput.cuId}`,
            );
            return await dataSources.db.BudgetStatement.batchDeleteLineItems(
              input,
            );
          } else {
            throw new AuthenticationError(
              "You are not authorized to delete budgetLineItems",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error ? error : "You are not authorized to delete budgetLineItems",
        );
      }
    },
    budgetStatementWalletBatchAdd: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      // this one
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetStatementWallets",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const allowed = await auth.canUpdate("CoreUnit", user.cuId);
          if (allowed[0].count > 0) {
            const cuIdFromInput = input.pop();
            console.log(
              `Adding ${input.length} wallets to CU ${cuIdFromInput.cuId}`,
            );
            return await dataSources.db.BudgetStatement.addBudgetStatementWallets(
              input,
            );
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetStatementWallets",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error
            ? error
            : "You are not authorized to update budgetStatementWallets",
        );
      }
    },
    budgetStatementFTEAdd: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetStatementWallets",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const allowed = await auth.canUpdate("CoreUnit", user.cuId);
          if (allowed[0].count > 0) {
            console.log(`Adding ${input.ftes} ftes to CU ${input.coreUnitId}`);
            delete input.coreUnitId;
            return await dataSources.db.BudgetStatement.addBudgetStatementFTE(
              input,
            );
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetStatementWallets",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error
            ? error
            : "You are not authorized to update budgetStatementWallets",
        );
      }
    },
    budgetStatementFTEUpdate: async (
      _: any,
      { input }: any,
      { user, auth, dataSources }: any,
    ) => {
      try {
        if (!user && !auth) {
          throw new AuthenticationError(
            "Not authenticated, login to update budgetStatementWallets",
          );
        } else {
          const [userObj] = await dataSources.db.Auth.getUser(
            "username",
            user.username,
          );
          if (userObj.active === false) {
            throw new Error("Account disabled. Reach admin for more info.");
          }
          const allowed = await auth.canUpdate("CoreUnit", user.cuId);
          if (allowed[0].count > 0) {
            console.log(
              `Updating ${input.ftes} ftes to CU ${input.coreUnitId}`,
            );
            delete input.coreUnitId;
            return await dataSources.db.BudgetStatement.updateBudgetStatementFTE(
              input,
            );
          } else {
            throw new AuthenticationError(
              "You are not authorized to update budgetStatementWallets",
            );
          }
        }
      } catch (error: any) {
        throw new AuthenticationError(
          error
            ? error
            : "You are not authorized to update budgetStatementWallets",
        );
      }
    },
  },
};