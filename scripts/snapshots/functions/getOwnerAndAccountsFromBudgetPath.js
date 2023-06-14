import accounts from '../data/accounts.js';
const ownerTypeMapping = {
    "delegates": "Delegates",
    "core-units": "CoreUnit",
    "spfs": "SpecialPurposeFund",
    "projects": "Project",
    "ecosystem-actors": "EcosystemActor",
    "scopes": "EcosystemActor"
};
const getOwnerId = async (ownerType, idSegment, knex) => {
    if(ownerType === 'Delegates'){
       return null; 
    }

    if(ownerType === 'CoreUnit'){    
        let result = await knex('CoreUnit').select('id').whereRaw('LOWER(code) = ?', ''+idSegment).first();
        if(!result){
            throw new Error(`Cannot find Core Unit with code "${idSegment}"`);
        }

        return result.id;   
    }

    if(ownerType === 'EcosystemActor'){
        let result = await knex('CoreUnit').select('id').whereRaw('LOWER(code) = ?', ''+idSegment).first();
        if(!result){
            throw new Error(`Cannot find Core Unit with code "${idSegment}"`);
        }
        return result.id;   
    }

    throw new Error(`Owner id fetching not implemented for type ${ownerType}`);
}; 

const getOwnerAndAccountsFromBudgetPath = async (budgetPath, knex) => {
    let segments = budgetPath.toLowerCase().split('/');

    if (segments[0] != 'makerdao'){
        throw new Error(`Expected "makerdao" as first budget path segment but got "${segments[0]}"`);
    }

    let ownerType = ownerTypeMapping[segments[1]];
    if(!ownerType){
        throw new Error(`Expected owner type as second budget path segment but got "${segments[1]}"`);
    }

    const idSegment = segments[2]||"";
    const scopesSegment = segments[3]||"";
    let ownerId = await getOwnerId(ownerType, idSegment, knex);
    console.log(segments);
    let selectedAccounts = [];
    for (let i = 0; i < accounts.length; i++){
        if (
            accounts[i]['budget path 1'].toLowerCase() === 'makerdao' && 
            accounts[i]['budget path 2'].toLowerCase() === segments[1].toLowerCase() &&
            accounts[i]['budget path 3'].toLowerCase() === idSegment.toLowerCase() &&
            accounts[i]['budget path 4'].toLowerCase() === scopesSegment.toLowerCase()
        ){
            selectedAccounts.push(
                {
                    type:accounts[i].Type,
                    label: accounts[i].Name,
                    address: accounts[i].Address,
                }
            );
        }
    }
    
    
    return {
        type: ownerType,
        id: ownerId,
        accounts: selectedAccounts
    };
};

export default getOwnerAndAccountsFromBudgetPath;