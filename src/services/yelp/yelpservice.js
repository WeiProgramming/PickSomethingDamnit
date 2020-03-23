import config from '../../config';
const baseUrl = 'https://api.yelp.com/v3/businesses/';
const headers = {
    Authorization: config.yelp.apikey,
    "accept": "application/json",
    "x-requested-with": "xmlhttprequest",
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json'
}

export const getBusinesses = (data) => {
    const jsonData = JSON.stringify(data);
    console.log('sending data to server', jsonData);
    return fetch('http://localhost:8000/',{
        method: 'POST',
        headers: headers,
        body: jsonData
    });
}