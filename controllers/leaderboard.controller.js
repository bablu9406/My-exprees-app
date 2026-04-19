const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Referral = require("../models/Referral");

// 🏆 TOP EARNERS
exports.getTopEarners = async (req, res) => {
  try {
    const users = await Wallet.find()
      .sort({ totalEarned: -1 })
      .limit(10)
      .populate("user", "username profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🎯 TOP REFERRALS
exports.getTopReferrers = async (req, res) => {
  try {
    const data = await Referral.aggregate([
      {
        $group: {
          _id: "$referrer",
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    const result = await User.populate(data, {
      path: "_id",
      select: "username profilePic"
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};