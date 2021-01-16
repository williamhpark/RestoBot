const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String },
  reviewNumber: { type: String },
  price: { type: String },
  image: { type: String },
  link: { type: String },
});

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;