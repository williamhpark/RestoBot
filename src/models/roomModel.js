const roomSchema = new mongoose.Schema({
    roomid: { type: String, required: true },
    users: { type: [String], required: true },
    accepted: { type: [String], required: true },
  });
  
  const User = mongoose.model("rooms", roomSchema);
  
  module.exports = User;