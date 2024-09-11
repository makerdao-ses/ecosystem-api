import getOffChainBalances from "./getOffChainBalances.js";
import blockNumbersCES from "../data/blockNumbers-CES.js";
import blockNumbersCOM from "../data/blockNumbers-COM.js";
import blockNumbersDAIF from "../data/blockNumbers-DAIF.js";
import blockNumbersDECO from "../data/blockNumbers-DECO.js";
import blockNumbersDIN from "../data/blockNumbers-DIN.js";
import blockNumbersDUX from "../data/blockNumbers-DUX.js";
import blockNumbersEVT from "../data/blockNumbers-EVT.js";
import blockNumbersGOV from "../data/blockNumbers-GOV.js";
import blockNumbersGRO from "../data/blockNumbers-GRO.js";
import blockNumbersIS from "../data/blockNumbers-IS.js";
import blockNumbersORA from "../data/blockNumbers-ORA.js";
import blockNumbersPH from "../data/blockNumbers-PH.js";
import blockNumbersRISK from "../data/blockNumbers-RISK.js";
import blockNumbersRWF from "../data/blockNumbers-RWF.js";
import blockNumbersSAS from "../data/blockNumbers-SAS.js";
import blockNumbersSES from "../data/blockNumbers-SES.js";
import blockNumbersSH from "../data/blockNumbers-SH.js";
import blockNumbersSNE from "../data/blockNumbers-SNE.js";
import blockNumbersTECHCU from "../data/blockNumbers-TECH-CU.js";
import blockNumbersTECHEA from "../data/blockNumbers-TECH-EA.js";
import blockNumbersSIDESTREAM from "../data/blockNumbers-SIDESTREAM.js";
import blockNumbersJETSTREAM from "../data/blockNumbers-JETSTREAM.js";
import blockNumbersDEWIZ from "../data/blockNumbers-DEWIZ.js";
import blockNumbersDRAFT from "../data/blockNumbers-DRAFT.js";
import blockNumbersDELEGATES from "../data/blockNumbers-DELEGATES.js";
import blockNumbersDRAFT_KEEPERS from "../data/blockNumbers-DRAFT-KEEPERS.js";

const ownerMapping = {
  CoreUnit: {
    0: "blockNumbersDRAFT",
    1: "blockNumbersSES",
    3: "blockNumbersCES",
    7: "blockNumbersRISK",
    8: "blockNumbersGOV",
    9: "blockNumbersRWF",
    10: "blockNumbersGRO",
    11: "blockNumbersORA",
    12: "blockNumbersCOM",
    13: "blockNumbersDAIF",
    14: "blockNumbersSH",
    15: "blockNumbersDUX",
    16: "blockNumbersSNE",
    17: "blockNumbersDIN",
    18: "blockNumbersIS",
    19: "blockNumbersSAS",
    20: "blockNumbersDECO",
    21: "blockNumbersDRAFT",
    22: "blockNumbersTECHCU",
    38: "blockNumbersEVT",
    66: "blockNumbersDRAFT",
  },
  EcosystemActor: {
    44: "blockNumbersDRAFT",
    45: "blockNumbersDRAFT",
    46: "blockNumbersPH",
    47: "blockNumbersDRAFT",
    48: "blockNumbersJETSTREAM",
    49: "blockNumbersDRAFT",
    50: "blockNumbersDRAFT",
    51: "blockNumbersDRAFT",
    52: "blockNumbersDRAFT",
    53: "blockNumbersDRAFT",
    54: "blockNumbersDRAFT",
    55: "blockNumbersDEWIZ",
    56: "blockNumbersDRAFT",
    57: "blockNumbersDRAFT",
    58: "blockNumbersDRAFT",
    59: "blockNumbersSIDESTREAM",
    60: "blockNumbersTECHEA",
    61: "blockNumbersDRAFT",
    64: "blockNumbersDRAFT",
    65: "blockNumbersDRAFT",
    72: "blockNumbersDRAFT",
    73: "blockNumbersDRAFT",
    74: "blockNumbersDRAFT",
    75: "blockNumbersDRAFT",
  },
  Delegates: {
    null: "blockNumbersDELEGATES",
  },
  AlignedDelegates: {
    null: "blockNumbersDRAFT",
  },
  Keepers: {
    null: "blockNumbersDRAFT_KEEPERS",
  },
  SpecialPurposeFund: {
    null: "blockNumbersDRAFT",
  },
  Scopes: {
    67: "blockNumbersDRAFT",
    68: "blockNumbersDRAFT",
    69: "blockNumbersDRAFT",
    70: "blockNumbersDRAFT",
    71: "blockNumbersDRAFT",
  },
};
const blockNumbersMapping = {
  blockNumbersCES,
  blockNumbersCOM,
  blockNumbersDAIF,
  blockNumbersDECO,
  blockNumbersDIN,
  blockNumbersDUX,
  blockNumbersEVT,
  blockNumbersGOV,
  blockNumbersGRO,
  blockNumbersIS,
  blockNumbersORA,
  blockNumbersPH,
  blockNumbersRISK,
  blockNumbersRWF,
  blockNumbersSAS,
  blockNumbersSES,
  blockNumbersSH,
  blockNumbersSNE,
  blockNumbersTECHCU,
  blockNumbersTECHEA,
  blockNumbersSIDESTREAM,
  blockNumbersJETSTREAM,
  blockNumbersDEWIZ,
  blockNumbersDELEGATES,
  blockNumbersDRAFT,
  blockNumbersDRAFT_KEEPERS,
};

const getMonthInfo = (owner, month, endBlockNo) => {
  const result = {
    month: null,
    firstDay: null,
    lastDay: null,
    offChainBalances: {},
    blockNumberRange: {
      initial: null,
      final: null,
    },
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

    if (!ownerMapping[owner.type][owner.id]) {
      throw new Error(
        `Cannot find any block numbers for ${owner.type}/${owner.id}`,
      );
    }
    const blockNumbers =
      blockNumbersMapping[ownerMapping[owner.type][owner.id]];
    if (!blockNumbers) {
      throw new Error(
        `Cannot find any block numbers for ${owner.type}/${owner.id}`,
      );
    }

    const startBlockNumber = blockNumbers[month];
    if (!startBlockNumber) {
      throw new Error(
        `Cannot find start block number for the month ${month} for ${owner.type}/${owner.id}`,
      );
    }
    result.blockNumberRange.initial = startBlockNumber;

    const nextMonth = convertMonthStringToDate(month, 1)
      .toISOString()
      .slice(0, 7)
      .replace("-", "/");

    const endBlockNumber = blockNumbers[nextMonth];

    console.log("NEXT MONTH ", nextMonth);
    console.log("START BLOCK NUMBER ", startBlockNumber);
    console.log("END BLOCK NUMBER ", endBlockNumber);
    console.log("END BLOCK NUMBER GIVEN", endBlockNo);

    if (endBlockNo && endBlockNo < startBlockNumber) {
      console.log("Out of snapshot window");
      return;
    }
    if (!endBlockNumber) {
      const keys = Object.keys(blockNumbers);
      console.log("KEYS ", keys[keys.length - 1]);
      if (keys[keys.length - 1] != month) {
        throw new Error(
          `Cannot find end block number for the month ${month} for ${owner.type}/${owner.id}`,
        );
      }
      if (endBlockNo) {
        result.blockNumberRange.final = endBlockNo;
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
    lastDay,
  };
}

function convertMonthStringToDate(monthString, addMonths = 0) {
  // Split the month string into year and month parts
  let [year, month] = monthString.split("/");
  // Convert month to zero-based index
  month = parseInt(month, 10) - 1;
  // Create a new Date object with the year and month values
  let date = new Date(year, month + addMonths, 2);

  return date;
}

export default getMonthInfo;
