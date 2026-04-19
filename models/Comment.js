const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔥 VIDEO SUPPORT
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  },

  // 🔥 POST SUPPORT (old system safe रहेगा)
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },

  text: {
    type: String,
    required: true
  },

  // 🔥 LIKE SYSTEM
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // 🔥 REPLY SYSTEM
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  }

},
{ timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema)