import fetch from "node-fetch";
import { json } from "stream/consumers";

const fetchTransactionData = async (
  address,
  ownerType,
  ownerId,
  //apiToken not in use but may return in the future
  apiToken,
) => {
  console.log(
    `\nFetching all transactions for ${ownerType}/${ownerId} account ${address}`
  );

    address = address.toLowerCase();
    let result = [];
    
    const headers = {
        'accept': '*/*',
    };
    
    let response = null;
    let apiCalls = 0;
    let page = 1;
    let jsonData = null;
    
    // make the API call for from_address
    do {

      console.log(` ...API call ${apiCalls} - from_address: ${address} - fetching data...`);
      response = await fetch(`https://cortex.blockanalitica.com/api/v1/tokens/dai/wallet-events?page=${page}&wallet_address=${address}`, {
        method: 'GET',
        headers: headers
      });

      jsonData = await response.json(); // assign response to jsonData

      if (jsonData.detail === "Could not validate credentials") {
      throw new Error("API Error: Could not validate credentials");
      }

      result = result.concat(jsonData.results);
      page = jsonData.next_page;
      apiCalls++;

    } while (page);

  return formatResults(result, 'DAI');
};

const formatResults = (data, token) => {

  return data.map(r => ({
    block: r.block_number,
    timestamp: r.datetime,
    //_originalTimestamp: r.datetime,
    tx_hash: r.tx_hash,
    token: token,
    flow: (r.amount[0]==='-'?'outflow':'inflow'),
    amount: Math.abs(parseFloat(r.amount)),
    balance: parseFloat(r.balance),
    sender: r.sender,
    receiver: r.receiver,
    wallet: r.wallet_address
  }));

};

export default fetchTransactionData;
