const express = require("express");
const router = express.Router();

const Wallet = require("../models/Wallet");

// 🟢 Get Wallet
router.get("/:userId", async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });

    if (!wallet) {
      return res.json({
        balance: 0,
        totalEarned: 0,
      });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;