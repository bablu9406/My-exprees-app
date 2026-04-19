const Wallet = require("../models/Wallet");
const Earning = require("../models/Earning");
const Post = require("../models/Post");

// 📊 USER ANALYTICS
exports.getMyAnalytics = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    const earnings = await Earning.find({ user: req.user._id });

    const totalEarning = earnings.reduce((acc, e) => acc + e.amount, 0);

    const posts = await Post.find({ user: req.user._id });

    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);

    res.json({
      balance: wallet?.balance || 0,
      totalEarned: wallet?.totalEarned || 0,
      totalEarning,
      totalViews,
      totalPosts: posts.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyEarnings = async (req, res) => {
  try {
    res.json({ message: "Earnings API working" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};