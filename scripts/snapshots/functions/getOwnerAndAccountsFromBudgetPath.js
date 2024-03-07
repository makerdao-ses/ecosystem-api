import accounts from "../data/accounts.js";

const ownerTypeMapping = {
  delegates: "Delegates",
  keepers: "Keepers",
  "core-units": "CoreUnit",
  spfs: "SpecialPurposeFund",
  scopes: "Scopes",
  projects: "Project",
  "ecosystem-actors": "EcosystemActor",
};

const getOwnerId = async (ownerType, idSegment, knex) => {
  if (ownerType === "Delegates") {
    return null;
  }

  if (ownerType === "SpecialPurposeFund") {
    return null;
  }

  if (ownerType === "Keepers") {
    return null;
  }

  if (ownerType === "Scopes") {
    let result = await knex("CoreUnit")
      .select("id")
      .whereRaw("LOWER(code) = ?", "" + idSegment)
      .where("type", "=", "Scopes")
      .first();
    if (!result) {
      throw new Error(`Cannot find Scope with code "${idSegment}"`);
    }

    return result.id;
  }

  if (ownerType === "CoreUnit") {
    let result = await knex("CoreUnit")
      .select("id")
      .whereRaw("LOWER(code) = ?", "" + idSegment)
      .where("type", "=", "CoreUnit")
      .first();
    if (!result) {
      throw new Error(`Cannot find Core Unit with code "${idSegment}"`);
    }

    return result.id;
  }

  if (ownerType === "EcosystemActor") {
    let result = await knex("CoreUnit")
      .select("id")
      .whereRaw('LOWER("shortCode") = ?', "" + idSegment)
      .where("type", "=", "EcosystemActor")
      .first();
    if (!result) {
      throw new Error(`Cannot find Ecosystem Actor with code "${idSegment}"`);
    }
    return result.id;
  }

  throw new Error(`Owner id fetching not implemented for type ${ownerType}`);
};

const getOwnerAndAccountsFromBudgetPath = async (budgetPath, knex) => {
  if (!budgetPath) {
    throw new Error(
      `No budget path provided. Try running 'node ./syncSnapshotReport.js makerdao/core-units/SES-001' or similar.`,
    );
  }

  const segments = budgetPath.toLowerCase().split("/");

  if (segments[0] != "makerdao") {
    throw new Error(
      `Expected "makerdao" as first budget path segment but got "${segments[0]}"`,
    );
  }

  let ownerType = ownerTypeMapping[segments[1]];
  if (!ownerType) {
    throw new Error(
      `Expected owner type as second budget path segment but got "${
        segments[1]
      }". Valid owner types are: "${Object.keys(ownerTypeMapping).join(
        '", "',
      )}"`,
    );
  }

  const idSegment = segments[2] || "";
  const scopesSegment = segments[3] || "";
  const ownerId = await getOwnerId(ownerType, idSegment, knex);

  const selectedAccounts = [];
  if(segments[1].toLowerCase() === 'delegates') {
    for (let i = 0; i < accounts.length; i++) {
      if (
        accounts[i]["budget path 1"].toLowerCase() === "makerdao" &&
        accounts[i]["budget path 2"].toLowerCase() ===
          segments[1].toLowerCase()
      ) {
        selectedAccounts.push({
          type: accounts[i].Type,
          label: accounts[i].Name,
          address: accounts[i].Address,
          offchain: false,
        });
      }
    }
  }
  else {
    for (let i = 0; i < accounts.length; i++) {
      if (
        accounts[i]["budget path 1"].toLowerCase() === "makerdao" &&
        accounts[i]["budget path 2"].toLowerCase() ===
          segments[1].toLowerCase() &&
        accounts[i]["budget path 3"].toLowerCase() === idSegment.toLowerCase() 
        //&&
        //accounts[i]["budget path 4"].toLowerCase() === scopesSegment.toLowerCase()
      ) {
        selectedAccounts.push({
          type: accounts[i].Type,
          label: accounts[i].Name,
          address: accounts[i].Address,
          offchain: false,
        });
      }
    }
  }

  return {
    owner: {
      type: ownerType,
      id: ownerId,
    },
    accounts: selectedAccounts,
  };
};

export default getOwnerAndAccountsFromBudgetPath;
