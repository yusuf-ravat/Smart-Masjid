const mongoose = require("mongoose");

const MasjidJoinSchema = new mongoose.Schema({
  masjidId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Masjids",
    required: true 
  },
  joinedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    }
  }]
});

module.exports = mongoose.model("MasjidJoins", MasjidJoinSchema);