const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed
  profilePic: { type: String },
  bio: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
b
