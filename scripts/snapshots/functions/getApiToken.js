import fetch from 'node-fetch';

const DIN_API_USER = process.env.DIN_API_USER;
const DIN_API_PW = process.env.DIN_API_PW;

const getToken = async () => {
  /*
    const url = 'https://data-api.makerdao.network/v1/login/access-token';

    if(!DIN_API_USER){
        throw new Error(`API Username not set`);
    }

    if(!DIN_API_PW){
        throw new Error(`API Password not set`);
    }
    
    const body = new URLSearchParams({
      'grant_type': '',
      'username': DIN_API_USER,
      'password': DIN_API_PW,
      'scope': '',
      'client_id': '',
      'client_secret': ''
    });
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: headers
    });
    const data = await response.json();
    const token = data.access_token;
    return token;
  */};

  export default getToken;