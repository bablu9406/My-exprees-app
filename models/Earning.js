const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: {
    type: Number,
    default: 0
  },
  source: {
    type: String, // ad_view / ad_click
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad"
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
}, { timestamps: true });

module.exports = mongoose.model("Earning", earningSchema);