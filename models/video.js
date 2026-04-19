const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  videoUrl: {
    type: String,
    required: true
  },

  thumbnail: {
    type: String,
    default: ""
  },

  duration: {
    type: Number,
    default: 0
  },

  views: {
    type: Number,
    default: 0
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  category: {
    type: String,
    default: "general"
  },

  // 🔥 OPTIONAL BUT POWERFUL
  tags: [String],

  // 🔥 FAST COUNT (optional)
  commentCount: {
    type: Number,
    default: 0
  }

},
{ timestamps: true } // ✅ FIX
)

// 🔥 PERFORMANCE INDEXES
videoSchema.index({ views: -1 })
videoSchema.index({ createdAt: -1 })
videoSchema.index({ title: "text" })

module.exports = mongoose.model("Video", videoSchema)