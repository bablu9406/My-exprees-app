const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String, // "deposit" or "withdraw"
    required: true,
  },
  status: {
    type: String, // "success", "pending"
    default: "success",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);