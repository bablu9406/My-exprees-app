const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: {
    type: String,
    enum: ["like", "follow"],
    required: true
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null
  },

  read: { type: Boolean, default: false }
},
{ timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
