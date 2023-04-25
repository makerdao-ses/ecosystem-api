import { gql } from 'apollo-server-core';

export const typeDefs = [gql`

    type Snapshot {
        id: ID!
        start: DateTime
        end: DateTime
        ownerType: String
        ownerId: ID
        snapshotAccount: [SnapshotAccount]
    }

    type SnapshotAccount { 
        id: ID!
        snapshotId: ID
        accountLabel: String
        accountType: String
        accountAddress: String
        groupAccountId: ID
        upstreamAccountId: ID
        snapshotAccountTransaction: [SnapshotAccountTransaction]
        snapshotAccountBalance: [SnapshotAccountBalance]

    }

    type SnapshotAccountTransaction { 
        id: ID!
        snapshotAccountId: ID
        block: Int
        timeStamp: DateTime
        tx_hash: String
        token: String
        counterParty: String
        amount: Float
    }

    type SnapshotAccountBalance {
        id: ID!
        snapshotAccountId: ID
        token: String
        initialBalance: Float
        newBalance: Float
        inflow: Float
        outflow: Float
    }

    extend type Query { 
        snapshots: [Snapshot]
    }
`];


export const resolvers = {
    Query: {
        // schema object: (parent, args, context, info) => {}
        snapshots: async (_: any, filter: any, { dataSources }: any) => {
            return dataSources.db.Snapshot.getSnapshots(filter);
        }
    },
    Snapshot: {
        snapshotAccount: async (parent: any, __: any, { dataSources }: any) => {
            return dataSources.db.Snapshot.getSnapshotAccounts(parent.id);
        }
    },
    SnapshotAccount: {
        snapshotAccountTransaction: async (parent: any, __: any, { dataSources }: any) => {
            return dataSources.db.Snapshot.getSnapshotAccountTransactions(parent.id);
        },
        snapshotAccountBalance: async (parent: any, __: any, { dataSources }: any) => {
            return dataSources.db.Snapshot.getSnapshotAccountBalances(parent.id);
        },
    },


};