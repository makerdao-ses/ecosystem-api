import fetch from 'node-fetch';

const fetchTransactionData = async (address, ownerType, ownerId, month, apiToken, knex) => {

    address = address.toLowerCase();

    console.log(`Fetching transactions for account ${ownerType} ${ownerId} ${address}, ${month||'draft'}`);

    const token = 'DAI';
    const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + apiToken
    };
    let data = [];
    let skip = 0;
    let response = null;
    let jsonData = null; // declare jsonData variable
    let apiCalls = 0;

    // loop through each address

    skip = 0;

    const fromUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&from_address=${address}&skip=`;
    const toUrl = `https://data-api.makerdao.network/v1/core_units/transfers?token=${token}&to_address=${address}&skip=`;

    // make the API call for from_address
    do {
        response = await fetch(fromUrl + skip, {
            method: 'GET',
            headers: headers
        });
        jsonData = await response.json(); // assign response to jsonData

        if (jsonData.detail === 'Could not validate credentials') {
            console.log('Error: Could not validate credentials');
            return data;
        }
        data = data.concat(jsonData);

        skip += jsonData.length;

        apiCalls++;

        console.log(`Address ${address}: API call ${apiCalls} - from_address - fetching data...`);

    } while (jsonData.length !== 0);

    // reset skip and make the API call for to_address
    skip = 0;
    jsonData = null;

    do {
        response = await fetch(toUrl + skip, {
            method: 'GET',
            headers: headers
        });
        
        jsonData = await response.json(); // assign response to jsonData

        if (jsonData.detail === 'Could not validate credentials') {
            console.log('Error: Could not validate credentials');
            return data;
        }
        data = data.concat(jsonData);

        skip += jsonData.length;

        apiCalls++;
        console.log(`Address ${address}: API call ${apiCalls} - to_address - fetching data...`);
    } while (jsonData.length !== 0);

    let formattedData = [];

    //Check the code in the response matches the report
    data = await checkOwnerCode(data, ownerType, ownerId, knex);

   
        formattedData = data;
    

    return formattedData;
};


const formatResponse = async (apiResponse, startTimestamp, endTimestamp) => {

    let formattedData = [];

    for (let i = 0; i < apiResponse.length; i++) {
        if (apiResponse[i].timestamp > startTimestamp.toISOString() && apiResponse[i].timestamp < endTimestamp.toISOString()) {
            formattedData.push(
                apiResponse[i]
            );
        }
    }

    return formattedData;

};

const getMonthTimestamps = async (monthInput) => {
    // Parse the month input
    const [year, month] = monthInput.split('/').map(Number);

    // Create the start timestamp for the month
    const startTimestamp = new Date(Date.UTC(year, month - 1, 1));

    // Get the last day of the next month in UTC
    const endTimestamp = new Date(Date.UTC(year, month, 0));

    // Adjust the end timestamp to the last millisecond of the month
    endTimestamp.setUTCDate(endTimestamp.getUTCDate() + 1);
    endTimestamp.setUTCHours(0, 0, 0, 0);
    endTimestamp.setUTCMilliseconds(endTimestamp.getUTCMilliseconds() - 1);

    return {
        startTimestamp,
        endTimestamp,
    };
};

const checkOwnerCode = async (data, ownerType, ownerId, knex) => {

    let formatData = [];
    if(ownerType === 'CoreUnit')
    {
        const query = await knex('CoreUnit')
        .select('code')
        .where('id', '=', ownerId);
        const code = query[0].code;
        for(let i = 0; i < data.length; i++){
            if(data[i].code === code)
            {
                formatData.push(data[i]);
            }
        }
        return formatData;
    }
    else
    {
        return data;
    }
};


export default fetchTransactionData;