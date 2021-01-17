require("dotenv").config();
const axios = require("axios");

const YelpApi = require("./yelpApi");

async function getRestaurantData(
  address,
  radarApiKey,
  cookie,
  prices,
  yelpApiKey
) {
  let config = {
    method: "get",
    url: "https://api.radar.io/v1/geocode/forward?query=" + address,
    headers: {
      Authorization: radarApiKey,
      Cookie: cookie,
    },
  };

  await axios(config)
    .then((response) => {
      //   console.log(JSON.stringify(response.data));
      //   console.log("LATITUDE: " + response.data["addresses"][0]["latitude"]);
      //   console.log("LONGITUDE: " + response.data["addresses"][0]["longitude"]);
      let coordinates = {
        latitude: response.data["addresses"][0]["latitude"],
        longitude: response.data["addresses"][0]["longitude"],
      };

      return coordinates;
    })
    // .then((coordinates) => {
    //   console.log("Latitude is here: " + coordinates["latitude"]);

    //   return coordinates;
    // })
    .then((coordinates) => {
      //   console.log(coordinates);
      YelpApi.getRestaurantsJSON(
        coordinates["latitude"],
        coordinates["longitude"],
        prices,
        yelpApiKey
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  getRestaurantData: getRestaurantData,
};
