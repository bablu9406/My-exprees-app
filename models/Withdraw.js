const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    method: {
      type: String,
      enum: ["upi", "bank", "paypal"],
      required: true
    },

    accountDetails: {
      type: String, // UPI ID / Bank / PayPal
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    adminNote: {
      type: String
    },

    processedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Withdraw ||
  mongoose.model("Withdraw", withdrawSchema);