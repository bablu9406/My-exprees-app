const Referral = require("../models/Referral");
const User = require("../models/user");

// ✅ GENERATE REFERRAL CODE
exports.generateReferralCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.referralCode) {
      user.referralCode = "REF" + Math.random().toString(36).substring(2, 8);
      await user.save();
    }

    res.json({ referralCode: user.referralCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ APPLY REFERRAL
const Wallet = require("../models/Wallet");

exports.applyReferral = async (req, res) => {
  try {
    const { code } = req.body;

    const referrer = await User.findOne({ referralCode: code });

    if (!referrer) {
      return res.status(400).json({ message: "Invalid referral code" });
    }

    if (referrer._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't refer yourself" });
    }

    const alreadyUsed = await Referral.findOne({
      referredUser: req.user._id,
    });

    if (alreadyUsed) {
      return res.status(400).json({ message: "Already used referral" });
    }

    // ✅ referral create
    const referral = await Referral.create({
      referrer: referrer._id,
      referredUser: req.user._id,
    });

    // 💰 wallet add
    let wallet = await Wallet.findOne({ user: referrer._id });

    if (!wallet) {
      wallet = await Wallet.create({
        user: referrer._id,
        balance: 0,
      });
    }

    wallet.balance += referral.reward;
    await wallet.save();

    res.json({
      message: "Referral applied + ₹ earned 🎉",
      reward: referral.reward,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET MY REFERRALS
exports.getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({
      referrer: req.user._id,
    }).populate("referredUser", "username email");

    res.json(referrals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};