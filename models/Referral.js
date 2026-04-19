const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reward: {
      type: Number,
      default: 10 // ₹10 per referral
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed"
    }
  },
  { timestamps: true }
);
referralSchema.index({ referrer: 1, referredUser: 1 }, { unique: true });

module.exports =
  mongoose.models.Referral ||
  mongoose.model("Referral", referralSchema);