const Wallet = require("../models/Wallet");
const Withdraw = require("../models/Withdraw");

// 💰 GET WALLET
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestWithdraw = async (req, res) => {
  try {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const request = await Withdraw.create({
      user: req.user._id,
      amount
    });

    wallet.balance -= amount;
    await wallet.save();

    res.json({ message: "Withdraw requested", request });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};