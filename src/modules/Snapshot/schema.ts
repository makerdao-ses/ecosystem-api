import { gql } from "apollo-server-core";

export const typeDefs = [
  gql`
    type Snapshot {
      id: ID!
      period: String
      start: DateTime
      end: DateTime
      ownerType: String
      ownerId: ID
      created: DateTime
      snapshotAccount: [SnapshotAccount]
      actualsComparison: [ActualsComparison]
    }

    type SnapshotAccount {
      id: ID!
      accountLabel: String
      accountType: String
      accountAddress: String
      groupAccountId: ID
      upstreamAccountId: ID
      offChain: Boolean
      snapshotAccountTransaction: [SnapshotAccountTransaction]
      snapshotAccountBalance: [SnapshotAccountBalance]
    }

    type SnapshotAccountTransaction {
      id: ID!
      block: Int
      timestamp: DateTime
      txHash: String
      token: String
      counterParty: String
      amount: Float
      txLabel: String
      counterPartyName: String
    }

    type SnapshotAccountBalance {
      id: ID!
      token: String
      initialBalance: Float
      newBalance: Float
      inflow: Float
      outflow: Float
      includesOffChain: Boolean
    }

    type ActualsComparison {
      month: String
      currency: String
      reportedActuals: Float
      netExpenses: ActualsComparisonNetExpenses
    }

    type ActualsComparisonNetExpenses {
      onChainOnly: ActualsComparisonNetExpensesItem!
      offChainIncluded: ActualsComparisonNetExpensesItem
    }

    type ActualsComparisonNetExpensesItem {
      amount: Float
      difference: Float
    }

    input SnapshotFilter {
      id: ID
      ownerType: String!
      ownerId: ID
      period: String
    }

    extend type Query {
      snapshots(filter: SnapshotFilter): [Snapshot]
    }
  `,
];

export const resolvers = {
  Query: {
    // schema object: (parent, args, context, info) => {}
    snapshots: async (_: any, filter: any, { dataSources }: any) => {
      const result = await dataSources.db.Snapshot.getSnapshots(filter);

      return result.map((report: { month?: string; period: string | null }) => {
        if (report.month) {
          const month = report.month;
          report.period = month.slice(0, 4) + "/" + month.slice(5, 7);
        } else {
          report.period = null;
        }

        report.month = undefined;
        return report;
      });
    },
  },
  Snapshot: {
    snapshotAccount: async (parent: any, __: any, { dataSources }: any) => {
      return dataSources.db.Snapshot.getSnapshotAccounts(parent.id);
    },
  },
  SnapshotAccount: {
    snapshotAccountTransaction: async (
      parent: any,
      __: any,
      { dataSources }: any,
    ) => {
      return dataSources.db.Snapshot.getSnapshotAccountTransactions(parent.id);
    },
    snapshotAccountBalance: async (
      parent: any,
      __: any,
      { dataSources }: any,
    ) => {
      return dataSources.db.Snapshot.getSnapshotAccountBalances(parent.id);
    },
  },
};
