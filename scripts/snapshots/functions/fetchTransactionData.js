import fetch from "node-fetch";

const fetchTransactionData = async (
  address,
  ownerType,
  ownerId,
  apiToken,
  knex,
) => {
  console.log(
    `\nFetching all transactions for ${ownerType}/${ownerId} account ${address}`,
  );

    address = address.toLowerCase();
    let result = [];
    
    const token = 'DAI';
    const url = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${address}&skip=`;
    const headers = {
        'accept': '*/*',
    };
    
    let response = null;
    let apiCalls = 0;
    let skip = 1;
    let jsonData = null;
    
    // make the API call for from_address
    do {
        console.log(` ...API call ${apiCalls} - from_address: ${address} - fetching data...`);
        response = await fetch(`https://cortex.blockanalitica.com/api/v1/tokens/dai/wallet-events?page=${skip}&wallet_address=${address}`, {
            method: 'GET',
            headers: headers
        });

        jsonData = await response.json(); // assign response to jsonData

    if (jsonData.detail === "Could not validate credentials") {
      throw new Error("API Error: Could not validate credentials");
    }

        result = result.concat(jsonData.results);
        skip += 1;
        apiCalls++;

    } while (jsonData.next_page !== null);

  return await filterByOwnerCode(result, ownerType, ownerId, knex);
};

const filterByOwnerCode = async (data, ownerType, ownerId, knex) => {
  let formatData = [];

   
    
    return data;
};

export default fetchTransactionData;
