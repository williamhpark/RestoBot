const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomid: { type: String, required: true },
    users: { type: [String], required: true },
    accepted: { type: [String], required: true },
  });
  
const Room = mongoose.model("rooms", roomSchema);
  
module.exports = Room;