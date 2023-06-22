import sesBalances from '../data/offChain-SES.js';
import createSnapshotAccount from './createSnapshotAccount.js';

const ownerMapping = {
    'CoreUnit': {
        '1': 'sesBalances'
    }
};

const createOffChainAccounts = async (snapshotId, ownerType, ownerId, month, knex) => {
    const balances = getOffChainAccountBalances(ownerType, ownerId, month);
    const accounts = [];
    if(balances.length>0){
        console.log(`Creating offchain accounts for balances `,balances);
        const account = {
            type: 'PaymentProcessor',
            label: 'Payment Processor',
            address: '0x3c267dfc8ba8f7359af0d8afc45b43731173236d',
            offChain: true,
            addedTransactions: []
        };
        const result = await createSnapshotAccount(snapshotId, account, true, knex);
        account.accountId = result.id;
        accounts.push(account);
    }
    console.log('Created offchain accounts', accounts);
    return accounts;
};

const getOffChainAccountBalances = (ownerType, ownerId, month) => {
    
    if(month){
        throw new Error(`Cannot get offchain acccount balances for month ${month}: not yet implemented`);
    }
    let result = [];
    if(ownerMapping[ownerType]&&ownerMapping[ownerType][ownerId]){
       result = getBalancesFromMapping(ownerMapping[ownerType][ownerId]); 
    }
    return result;
};

const getBalancesFromMapping = (balanceData) => {
    return [
        {
            token: 'DAI',
            initialBalance: 0,
            newBalance: 35000,
        }
    ];
};

export default createOffChainAccounts;