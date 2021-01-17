const express = require("express");
const router = express.Router();

const RoomId = require("../models/roomIdModel");

// @route   POST /accepted/:roomId
// @desc    Add an accepted restaurant to the database
// @access  Public
router.post("/roomId/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const newRoomId = await RoomId({ roomId });
    newRoomId.save();
    res.json(newRoomId);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /results/:roomid
// @desc    Retreive ALL restaurants that were retreived from the Yelp API for a room
// @access  Public
router.get("/roomId/:roomid", async (req, res) => {
  try {
    const matchRoomId = await Restaurant.find({
      roomId: req.params.roomid,
    });
    res.json(restaurantResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
