const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const viewEngine = require("./config/viewEngine");
const initWebRoutes = require("./routes/web");

const yelp = require("./apis/yelp");

console.log(yelp);

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
