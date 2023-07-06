import sesBalances from '../data/offChain-SES.js';
import sasBalances from '../data/offChain-SAS.js';
import createSnapshotAccount from './createSnapshotAccount.js';

const ownerMapping = {
    'CoreUnit': {
        '0': 'peBalances',
        '1': 'sesBalances',
        //'3': 'cesBalances',
        '9': 'rwfBalances',
        '11': 'oraBalances',
        '12': 'comBalances',
        '14': 'shBalances',
        '15': 'duxBalances',
        '16': 'sneBalances',
        '17': 'dinBalances',
        '19': 'sasBalances'
    }
};
const dataMapping = {
    sesBalances: sesBalances,
    sasBalances: sasBalances
};

const createOffChainAccounts = async (snapshotId, ownerType, ownerId, month, knex) => {
    //const balances = getOffChainAccountBalances(ownerType, ownerId, month);
    const accounts = [];
        //console.log(`Creating offchain accounts for balances `, balances);
        const account = {
            type: 'PaymentProcessor',
            label: 'Payment Processor',
            address: '0x3c267dfc8ba8f7359af0d8afc45b43731173236d',
            offChain: true,
            addedTransactions: []
        };
        const result = await createSnapshotAccount(snapshotId, account, true, knex);
        account.accountId = result.id;
        //if (balances.length > 0) { await insertOffChainAccountBalance(result.id, balances, knex); }
        accounts.push(account);
    
    console.log('Created offchain accounts', accounts);
    return accounts;
};

const insertOffChainAccountBalance = async (accountId, balances, knex) => {

    for (const balance of balances) {
        console.table(balance);
        await knex('SnapshotAccountBalance')
            .insert({
                snapshotAccountId: accountId,
                token: balance.token,
                initialBalance: balance.initialBalance,
                newBalance: balance.newBalance,
                includesOffChain: true
            });
    }
};

export default createOffChainAccounts;