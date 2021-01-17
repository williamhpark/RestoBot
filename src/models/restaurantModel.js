const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String },
  reviewNumber: { type: String },
  price: { type: String },
  image: { type: String },
  link: { type: String },
  categories: { type: String },
  liked: { type: Number, default: 0 },
  displayPhone: { type: String },
  index: { type: Number },
});

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;
