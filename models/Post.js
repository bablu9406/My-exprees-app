const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["image", "video", "short"],
    required: true,
  },

  // OLD FEATURE (Instagram Style) – SAFE
  caption: {
    type: String,
    default: "",
  },
type: {
  type: String,
  enum: ["image", "video", "short"],
  default: "image"
},

  image: {
    type: String,
    default: "",
  },

  // 🔥 NEW YOUTUBE FEATURE
  title: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },

  videoUrl: {
    type: String,
    default: "",
  },
 mediaUrl: {
    type: String,
    default: "",
  },

  thumbnail: {
    type: String,
    default: "",
  },

  views: {
    type: Number,
    default: 0,
  },
 duration: {
    type: Number,
    default: 0,
  },

  // Likes
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
},
{ timestamps: true });

module.exports = mongoose.model("Post", postSchema);