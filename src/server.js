const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
// const mongoose = require("mongoose");
// const axios = require("axios");

const viewEngine = require("./config/viewEngine");
const initWebRoutes = require("./routes/web");
// const Room = require("./models/roomModel");

// const fetchRestaurants = require("./apis/yelp.js");

// // DB Config
// console.log("Connecting to MongoDB.");
// mongoose.connect(
//   process.env.MONGODB_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   },
//   (err) => {
//     if (err) {
//       return console.error(err);
//     }
//     console.log("MongoDB connection established.");
//   }
// );

// fetchRestaurants()
//   .then((restaurants) => {
//     console.log("This is coming from server.js");
//     console.log(restaurants);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

let app = express();

// Config view engine
viewEngine(app);

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init web routes
initWebRoutes(app);

// Routes Config

// app.post("/test", async (req, res) => {
//   try {
//     const newRoom = new Room({
//       roomid: "test",
//       users: ["test"],
//       accepted: ["test"],
//     });
//     const roomTest = await newRoom.save();
//     res.json(roomTest);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // axios.post("/test", {});

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running at the port: ${port}`);
});
