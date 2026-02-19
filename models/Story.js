const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
