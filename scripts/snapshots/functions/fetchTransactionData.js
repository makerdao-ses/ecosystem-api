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

  const token = "DAI";
  const fromUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${address}&skip=`;
  const toUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&to_address=${address}&skip=`;
  const headers = {
    accept: "application/json",
    Authorization: "Bearer " + apiToken,
  };

  let response = null;
  let apiCalls = 0;
  let skip = 0;
  let jsonData = null;

  // make the API call for from_address
  do {
    console.log(
      ` ...API call ${apiCalls} - from_address: ${address} - fetching data...`,
    );
    response = await fetch(fromUrl + skip, {
      method: "GET",
      headers: headers,
    });

    jsonData = await response.json(); // assign response to jsonData

    if (jsonData.detail === "Could not validate credentials") {
      throw new Error("API Error: Could not validate credentials");
    }

    result = result.concat(jsonData);
    skip += jsonData.length;
    apiCalls++;
  } while (jsonData.length !== 0);

  // reset skip and make the API call for to_address
  skip = 0;
  jsonData = null;

  do {
    console.log(
      ` ...API call ${apiCalls} -   to_address: ${address} - fetching data...`,
    );
    response = await fetch(toUrl + skip, {
      method: "GET",
      headers: headers,
    });

    jsonData = await response.json(); // assign response to jsonData

    if (jsonData.detail === "Could not validate credentials") {
      throw new Error("API Error: Could not validate credentials");
    }

    result = result.concat(jsonData);
    skip += jsonData.length;
    apiCalls++;
  } while (jsonData.length !== 0);

  return await filterByOwnerCode(result, ownerType, ownerId, knex);
};

const filterByOwnerCode = async (data, ownerType, ownerId, knex) => {
  let formatData = [];

  if (ownerType === "CoreUnit") {
    const query = await knex("CoreUnit")
      .select("code")
      .where("id", "=", ownerId);

    const code = query[0].code;

    for (let i = 0; i < data.length; i++) {
      if (data[i].code === code) {
        formatData.push(data[i]);
      } else {
        console.log(
          ` ...filtering out duplicate transaction for CoreUnit ${data[i].code} (${data[i].amount} ${data[i].token})`,
        );
      }
    }

    return formatData;
  }

  return data;
};

export default fetchTransactionData;
