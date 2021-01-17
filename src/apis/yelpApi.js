"use strict";

async function getRestaurantsJSON(lat, long, prices, apikey) {
  const yelp = require("yelp-fusion");
  const client = yelp.client(apikey);

  const searchRequest = {
    latitude: lat,
    longitude: long,
    radius: "200",
    categories: "restaurants",
    price: prices,
    sort_by: "rating",
  };

  await client
    .search(searchRequest)
    .then((response) => {
      console.log(response.jsonBody.businesses);
      return response.jsonBody.businesses;
    })
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  getRestaurantsJSON: getRestaurantsJSON,
};
