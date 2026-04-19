const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: {
    type: String,
    enum: ["like", "comment", "subscribe", "video"],
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    default: null
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)