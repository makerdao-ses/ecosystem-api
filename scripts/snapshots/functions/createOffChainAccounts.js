import sesBalances from '../data/offChain-SES.js';
import createSnapshotAccount from './createSnapshotAccount.js';

const ownerMapping = {
    'CoreUnit': {
        '0': 'peBalances',
        '1': 'sesBalances',
        '3': 'cesBalances',
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
    sesBalances: sesBalances
};

const createOffChainAccounts = async (snapshotId, ownerType, ownerId, month, knex) => {
    const balances = getOffChainAccountBalances(ownerType, ownerId, month);
    const accounts = [];
    if (balances.length > 0) {
        console.log(`Creating offchain accounts for balances `, balances);
        const account = {
            type: 'PaymentProcessor',
            label: 'Payment Processor',
            address: '0x3c267dfc8ba8f7359af0d8afc45b43731173236d',
            offChain: true,
            addedTransactions: []
        };
        const result = await createSnapshotAccount(snapshotId, account, true, knex);
        account.accountId = result.id;
        await insertOffChainAccountBalance(result.id, balances, knex);
        accounts.push(account);
    }
    console.log('Created offchain accounts', accounts);
    return accounts;
};

const getOffChainAccountBalances = (ownerType, ownerId, month) => {

    let result = [];
    if (ownerMapping[ownerType] && ownerMapping[ownerType][ownerId]) {
        result = getBalancesFromMapping(ownerMapping[ownerType][ownerId], month);
    }
    return result;
};



const getBalancesFromMapping = (balanceData, month) => {

    const jsonData = dataMapping[balanceData];
    let setMonth;

    if (!month) {
        //Latest month 
        setMonth = Object.keys(jsonData[0]).slice(-2)[0];
    } else {
        const monthIndex = Object.keys(jsonData[0]).findIndex(date => {
            const [day, currentMonth, year] = date.split('/');
            const monthYear = `${currentMonth}/${year}`;
            console.log(monthYear, ' ', month);
            return monthYear === month;
        });

        if (monthIndex !== -1 && monthIndex + 1 < Object.keys(jsonData[0]).length) {
            setMonth = Object.keys(jsonData[0])[monthIndex + 1];
        } else {
            throw new Error(`Matching date not found for month: ${month}`);
        }
    }
    console.log(setMonth);

    if (!jsonData) {
        console.log(`No offchain data provided for ${balanceData} yet`);
    }

    const balances = jsonData
        .filter(entry => !entry.Name.includes('USD value'))
        .reduce((result, entry) => {
            const {
                Name,
                Opening,
                ...rest
            } = entry;
            if (Name.includes('DAI') || Name.includes('USD')) {
                const existingEntryDai = result.find(e => e.token === 'USD');
                if (existingEntryDai) {
                    existingEntryDai.initialBalance += parseFloat(Opening);
                    existingEntryDai.newBalance += parseFloat(entry[setMonth]);
                } else {
                    result.push({
                        token: 'USD',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[setMonth])
                    });
                }
            } else if (Name.includes('EUR')) {
                const existingEntryEur = result.find(e => e.token === 'EUR');
                if (existingEntryEur) {
                    existingEntryEur.initialBalance += parseFloat(Opening);
                    existingEntryEur.newBalance += parseFloat(entry[setMonth]);
                } else {
                    result.push({
                        token: 'EUR',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[setMonth])
                    });
                }
            } else if (Name.includes('DKK')) {
                const existingEntryDkk = result.find(e => e.token === 'DKK');
                if (existingEntryDkk) {
                    existingEntryDkk.initialBalance += parseFloat(Opening);
                    existingEntryDkk.newBalance += parseFloat(entry[setMonth]);
                } else {
                    result.push({
                        token: 'DKK',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[setMonth])
                    });
                }
            } else {
                result.push({
                    token: Name,
                    initialBalance: parseFloat(Opening),
                    newBalance: parseFloat(entry[setMonth])
                });
            }
            return result;
        }, [])
        .filter(entry => !isNaN(entry.initialBalance) && !isNaN(entry.newBalance));

    console.log(balances);


    return balances;
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