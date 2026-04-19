const mongoose = require("mongoose");

const adViewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad"
  },
  ip: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AdView", adViewSchema);