const mongoose = require("mongoose");

const roomIdSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
});

const RoomId = mongoose.model("roomIds", roomIdSchema);

module.exports = RoomId;
