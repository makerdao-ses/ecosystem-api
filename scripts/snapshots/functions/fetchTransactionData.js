import fetch from "node-fetch";

const tokens = { DAI: "DAI", MKR: "MKR", USDC: "USDC", GUSD: "GUSD", USDP: "USDP", USDT: "USDT", SKY: "SKY", USDS: "USDS"};

const fetchTransactionData = async (
  address,
  ownerType,
  ownerId,
  apiToken,
) => {
  console.log(
    `\nFetching all transactions for ${ownerType}/${ownerId} account ${address}`,
  );

  address = address.toLowerCase();

  let formattedResults = [];

  const headers = {
    accept: "*/*",
  };

  let response = null;
  let apiCalls = 0;
  let page = 1;
  let jsonData = null;

  // make the API call for from_address
  for (const key in tokens) {
    if (tokens.hasOwnProperty(key)) {
      const token = tokens[key];
      let result = [];
      do {
        const apiCallToken = token.toLowerCase();

        console.log(
          ` ...API call ${apiCalls} - token: ${token} - from_address: ${address} - fetching data...`,
        );
        response = await fetch(
          `https://cortex.blockanalitica.com/api/v1/tokens/${apiCallToken}/wallet-events?page=${page}&wallet_address=${address}`,
          {
            method: "GET",
            headers: headers,
          },
        );

        jsonData = await response.json(); // assign response to jsonData

        if (jsonData.detail === "Could not validate credentials") {
          throw new Error("API Error: Could not validate credentials");
        }

        result = result.concat(jsonData.results);
        page = jsonData.next_page;
        apiCalls++;
      } while (page);

      formattedResults = formattedResults.concat(formatResults(result, token));
    }
  }
  return formattedResults;
};

const formatResults = (data, token) => {
  return data.map((r) => ({
    block: r.block_number,
    timestamp: r.datetime,
    tx_hash: r.tx_hash,
    token: token,
    flow: r.amount[0] === "-" ? "outflow" : "inflow",
    amount: Math.abs(parseFloat(r.amount)),
    balance: parseFloat(r.balance),
    sender: r.sender,
    receiver: r.receiver,
    wallet: r.wallet_address,
  }));
};

export default fetchTransactionData;
