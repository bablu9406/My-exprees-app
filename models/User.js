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
  referralCode: {
  type: String,
  unique: true
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

role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

collections:[
 {
  name:String,
  posts:[
   {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
   }
  ]
 }
],

interests: [
  {
    type: String
  }
],

referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

subscribers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],
subscribedTo: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}],

subscriberCount: {
  type: Number,
  default: 0
}

}, { timestamps: true });

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);