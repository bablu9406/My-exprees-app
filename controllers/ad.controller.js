const Ad = require("../models/Ad");
const AdView = require("../models/AdView");
const Earning = require("../models/Earning");
const Wallet = require("../models/Wallet");
const Post = require("../models/Post");
const { calculateRevenue } = require("../utils/revenue");


// ================= CREATE AD =================
exports.createAd = async (req, res) => {
  try {
    const { title, videoUrl, budget } = req.body;

    const ad = await Ad.create({
      title,
      videoUrl,
      budget,
      advertiser: req.user._id
    });

    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET RANDOM AD =================
exports.getRandomAd = async (req, res) => {
  try {
    const ad = await Ad.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 1 } }
    ]);

    res.json(ad[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= TRACK AD VIEW =================
exports.trackAdView = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    const userId = req.user._id;

    // 🔥 better IP detection
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // ❌ Duplicate check (IP + USER)
    const existingView = await AdView.findOne({
      ad: ad._id,
      $or: [
        { ip, createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } },
        { user: userId, createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } }
      ]
    });

    if (existingView) {
      return res.json({ message: "Duplicate or blocked view" });
    }

    // ✅ Save view
    await AdView.create({
      user: userId,
      ad: ad._id,
      ip
    });

    // ❌ budget check
    if (ad.spent >= ad.budget) {
      ad.isActive = false;
      await ad.save();
      return res.json({ message: "Ad stopped (budget over)" });
    }

    // ✅ count view
    ad.views += 1;
    ad.spent += ad.costPerView || 0;

    // ✅ CTR update
    if (ad.views > 0) {
      ad.ctr = ad.clicks / ad.views;
    }

    await ad.save();

    // 🎯 RANDOM POST (earning)
    const post = await Post.findOne({ type: "short" });

    if (post) {
      const revenue = calculateRevenue(1);

      // 💰 save earning
      await Earning.create({
        user: post.user,
        amount: revenue.creator,
        source: "ad_view",
        ad: ad._id,
        post: post._id
      });

      // 💳 wallet update
      const wallet = await Wallet.findOne({ user: post.user });

      if (wallet) {
        wallet.balance += revenue.creator;
        wallet.totalEarned += revenue.creator;
        await wallet.save();
      }
    }

    res.json({ message: "Valid view counted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= TRACK AD CLICK =================
exports.trackAdClick = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    // ❌ budget check
    if (ad.spent >= ad.budget) {
      ad.isActive = false;
      await ad.save();
      return res.json({ message: "Ad stopped (budget over)" });
    }

    ad.clicks += 1;
    ad.spent += ad.costPerClick || 0;

    // CTR update
    if (ad.views > 0) {
      ad.ctr = ad.clicks / ad.views;
    }

    await ad.save();

    res.json({ message: "Ad clicked" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};