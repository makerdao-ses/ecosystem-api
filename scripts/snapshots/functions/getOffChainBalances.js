import cesBalances from '../data/offChain-CES.js';
import comBalances from '../data/offChain-COM.js';
import dinBalances from '../data/offChain-DIN.js';
import duxBalances from '../data/offChain-DUX.js';
import eventsBalances from '../data/offChain-EVENTS.js';
import groBalances from '../data/offChain-GRO.js';
import oraBalances from '../data/offChain-ORA.js';
import peBalances from '../data/offChain-PE.js';
import riskBalances from '../data/offChain-RISK.js';
import rwfBalances from '../data/offChain-RWF.js';
import sesBalances from '../data/offChain-SES.js';
import sasBalances from '../data/offChain-SAS.js';
import shBalances from '../data/offChain-SH.js';
import sneBalances from '../data/offChain-SNE.js';
import techBalances from '../data/offChain-TECH.js';



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
    cesBalances: cesBalances,
    comBalances: comBalances,
    dinBalances: dinBalances,
    duxBalances: duxBalances,
    eventsBalances: eventsBalances,
    groBalances: groBalances,
    oraBalances: oraBalances,
    peBalances: peBalances,
    riskBalances: riskBalances,
    rwfBalances: rwfBalances,
    sesBalances: sesBalances,
    sasBalances: sasBalances,
    shBalances: shBalances,
    sneBalances: sneBalances,
    techBalances: techBalances
};

const getOffChainBalances = (ownerType, ownerId) => {

    let result = {};
     {
        result = getBalancesFromMapping(ownerType, ownerId);
    }
    return result;
};

const getBalancesFromMapping = (ownerType, ownerId) => {

    if (!ownerMapping[ownerType] || !ownerMapping[ownerType][ownerId] || !dataMapping[ownerMapping[ownerType][ownerId]]){
        console.log(`No offchain data provided for ${ownerType}/${ownerId}`);
        return;
    }
    const jsonData = dataMapping[ownerMapping[ownerType][ownerId]];

    if (jsonData.length<1) {
        console.log(`No offchain data provided for ${ownerType}/${ownerId}`);
        return;
    }

    const pattern = /^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}$/;
    const months = Object.keys(jsonData[0]).filter(k => pattern.test(k)).map(date => ({key: date.slice(6,10) + '/' + date.slice(3,5) , date}));
    const result = {};
    months.forEach(month => {

        result[month.key] = jsonData
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
                    existingEntryDai.newBalance += parseFloat(entry[month.date]);
                } else {
                    result.push({
                        token: 'USD',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[month.date])
                    });
                }
            } else if (Name.includes('EUR')) {
                const existingEntryEur = result.find(e => e.token === 'EUR');
                if (existingEntryEur) {
                    existingEntryEur.initialBalance += parseFloat(Opening);
                    existingEntryEur.newBalance += parseFloat(entry[month.date]);
                } else {
                    result.push({
                        token: 'EUR',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[month.date])
                    });
                }
            } else if (Name.includes('DKK')) {
                const existingEntryDkk = result.find(e => e.token === 'DKK');
                if (existingEntryDkk) {
                    existingEntryDkk.initialBalance += parseFloat(Opening);
                    existingEntryDkk.newBalance += parseFloat(entry[month.date]);
                } else {
                    result.push({
                        token: 'DKK',
                        initialBalance: parseFloat(Opening),
                        newBalance: parseFloat(entry[month.date])
                    });
                }
            } else {
                result.push({
                    token: Name,
                    initialBalance: parseFloat(Opening),
                    newBalance: parseFloat(entry[month.date])
                });
            }
            return result;
        }, [])
        .filter(entry => !isNaN(entry.initialBalance) && !isNaN(entry.newBalance));

    });


    return result;

};

export default getOffChainBalances;