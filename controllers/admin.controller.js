const User = require("../models/User");
const Withdraw = require("../models/Withdraw");
const Ad = require("../models/Ad");

// 👤 ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 💸 ALL WITHDRAW REQUESTS
exports.getWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().populate("user", "name email");
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📢 ALL ADS
exports.getAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate("advertiser", "name");
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE AD
exports.deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};