const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  profilePic: {
    type: String,
    default: ""
  },

  bio: {
    type: String,
    default: ""
  },

  followers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  savedPosts: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Post"
}],

subscribers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],
subscribedTo: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
