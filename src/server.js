const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const viewEngine = require("./config/viewEngine");
const initWebRoutes = require("./routes/web");

const fetchRestaurants = require("./apis/yelp.js");

fetchRestaurants()
  .then((restaurants) => {
    console.log("This is coming from server.js");
    console.log(restaurants);
  })
  .catch((error) => {
    console.log(error);
  });

let app = express();

// Config view engine
viewEngine(app);

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running at the port: ${port}`);
});
