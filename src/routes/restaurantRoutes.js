const express = require("express");
const router = express.Router();

const Restaurant = require("../models/restaurantModel");

// @route   POST /restaurant/:roomId
// @desc    Add a restaurant retreived from the Yelp API to the restaurants collection
// @access  Public
router.post("/restaurant/:roomId", async (req, res) => {
  try {
    const {
      name,
      location,
      rating,
      review_count,
      price,
      image_url,
      url,
    } = req.body;
    const newRestaurant = new Restaurant({
      roomId: req.params.roomId,
      name,
      location: location["address1"],
      rating,
      reviewNumber: review_count,
      price,
      image: image_url,
      link: url,
    });
    const savedRestaurant = await newRestaurant.save();
    res.json(savedRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /accepted/:roomId
// @desc    Add an accepted restaurant to the database
// @access  Public
router.post("/accepted/:roomId", async (req, res) => {
  try {
    const { name } = req.body;

    const updatedItem = await Restaurant.updateOne(
      { roomId: req.params.roomId, name },
      { $inc: { liked: 1 } }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /results/:roomid
// @desc    Retreive ALL restaurants that were accepted in a room
// @access  Public
router.get("/results/:roomid", async (req, res) => {
  try {
    const restaurantResults = await Restaurant.find({
      roomId: req.params.roomid,
    });
    res.json(restaurantResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;