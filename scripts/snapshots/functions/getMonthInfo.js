import getOffChainBalances from "./getOffChainBalances.js";
import blockNumbersIS from "../data/blockNumbers-IS.js";
import blockNumbersSAS from "../data/blockNumbers-SAS.js";
import blockNumbersSES from "../data/blockNumbers-SES.js";
import blockNumbersDRAFT from "../data/blockNumbers-DRAFT.js";

const ownerMapping = {
    'CoreUnit': {
        '0': 'blockNumbersDRAFT',
        '1': 'blockNumbersSES',
        '3': 'blockNumbersDRAFT',
        '7': 'blockNumbersDRAFT',
        '8': 'blockNumbersDRAFT',
        '9': 'blockNumbersDRAFT',
        '10': 'blockNumbersDRAFT',
        '11': 'blockNumbersDRAFT',
        '12': 'blockNumbersDRAFT',
        '13': 'blockNumbersDRAFT',
        '14': 'blockNumbersDRAFT',
        '15': 'blockNumbersDRAFT',
        '16': 'blockNumbersDRAFT',
        '17': 'blockNumbersDRAFT',
        '18': 'blockNumbersIS',
        '19': 'blockNumbersSAS',
        '20': 'blockNumbersDRAFT',
        '21': 'blockNumbersDRAFT',
        '22': 'blockNumbersDRAFT',
        '38': 'blockNumbersDRAFT'
    },
    'EcosystemActor': {
        '44':'blockNumbersDRAFT',
        '45':'blockNumbersDRAFT',
        '46':'blockNumbersDRAFT',
        '47':'blockNumbersDRAFT',
        '48':'blockNumbersDRAFT',
        '49':'blockNumbersDRAFT',
        '50':'blockNumbersDRAFT',
        '51':'blockNumbersDRAFT',
        '52':'blockNumbersDRAFT',
        '53':'blockNumbersDRAFT',
        '54':'blockNumbersDRAFT',
        '55':'blockNumbersDRAFT',
        '56':'blockNumbersDRAFT',
        '57':'blockNumbersDRAFT',
        '58':'blockNumbersDRAFT',
        '59':'blockNumbersDRAFT',
        '60':'blockNumbersDRAFT',
        '61':'blockNumbersDRAFT',
    }
};
const blockNumbersMapping = {
    blockNumbersIS,
    blockNumbersSAS,
    blockNumbersSES,
    blockNumbersDRAFT
};

const getMonthInfo = (owner, month) => {

    const result = {
        month: null,
        firstDay: null,
        lastDay: null,
        offChainBalances: {},
        blockNumberRange: {
            initial: null,
            final: null
        }
    };

    const pattern = /^[0-9]{4}\/[0-1][0-9]$/;

    if (month) {
        if (!pattern.test(month)) {
            throw new Error(`Expected YYYY/MM as month format but got "${month}"`);
        }
        result.month = month;

        const startAndEnd = getStartAndEndDates(convertMonthStringToDate(month));
        result.firstDay = startAndEnd.firstDay;
        result.lastDay = startAndEnd.lastDay;

        if(!ownerMapping[owner.type][owner.id]){
            throw new Error(`Cannot find any block numbers for ${owner.type}/${owner.id}`);
        }
        const blockNumbers = blockNumbersMapping[ownerMapping[owner.type][owner.id]];
        if (!blockNumbers) {
            throw new Error(`Cannot find any block numbers for ${owner.type}/${owner.id}`);
        }

        const startBlockNumber = blockNumbers[month];
        if (!startBlockNumber) {
            throw new Error(`Cannot find start block number for the month ${month} for ${owner.type}/${owner.id}`);
        }
        result.blockNumberRange.initial = startBlockNumber;

        const nextMonth = convertMonthStringToDate(month, 1).toISOString().slice(0, 7).replace('-', '/');
        const endBlockNumber = blockNumbers[nextMonth];
        if (!endBlockNumber) {
            const keys = Object.keys(blockNumbers);
            if (keys[keys.length - 1] != month) {
                throw new Error(`Cannot find end block number for the month ${month} for ${owner.type}/${owner.id}`);
            }
        } else {
            result.blockNumberRange.final = endBlockNumber;
        }
    }
    result.offChainBalances = getOffChainBalances(owner.type, owner.id);

    return result;

};

function getStartAndEndDates(month) {

    // Get the year and month components from the provided date

    // Get the year and month components from the provided date
    const year = month.getUTCFullYear();
    const monthIndex = month.getUTCMonth();

    // Create a new Date object for the first day of the month
    const firstDay = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));

    // Create a new Date object for the last day of the month
    const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));


    return {
        firstDay,
        lastDay
    };
}

function convertMonthStringToDate(monthString, addMonths = 0) {
    // Split the month string into year and month parts
    const [year, month] = monthString.split('/');

    // Create a new Date object with the year and month values
    const date = new Date(year, parseInt(month) + addMonths, 1);

    return date;
}

export default getMonthInfo;