const Withdraw = require("../models/withdraw");
const Wallet = require("../models/wallet");
const History = require("../models/history");

// ✅ USER REQUEST
const Withdraw = require("../models/withdraw");
const Wallet = require("../models/wallet");
const History = require("../models/history");

// ✅ USER REQUEST
exports.requestWithdraw = async (req, res) => {
  try {
    // 🔥 DEBUG (important)
    console.log("BODY:", req.body);

    const { userId, amount, method, accountDetails } = req.body;

    // ❌ validation
    if (!userId || !amount || !method || !accountDetails) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ wallet find
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // ✅ create withdraw
    const withdraw = await Withdraw.create({
      user: userId,
      amount,
      method,
      accountDetails,
      status: "pending",
    });

    // ✅ history
    await History.create({
      user: userId,
      amount,
      type: "withdraw_request",
    });

    res.json({ message: "Withdraw request sent ✅", withdraw });

  } catch (err) {
    console.log("ERROR:", err); // 🔥 full error
    res.status(500).json({ error: err.message });
  }
};



// ✅ ADMIN APPROVE
exports.approveWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ error: "Withdraw not found" });
    }

    if (withdraw.status !== "pending") {
      return res.status(400).json({ error: "Already processed" });
    }

    const wallet = await Wallet.findOne({ user: withdraw.user });

    if (!wallet || wallet.balance < withdraw.amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 💰 deduct now
    wallet.balance -= withdraw.amount;
    await wallet.save();

    withdraw.status = "approved";
    await withdraw.save();

    // history
    await History.create({
      user: withdraw.user,
      amount: withdraw.amount,
      type: "withdraw_approved",
    });

    res.json({ message: "Withdraw approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ❌ ADMIN REJECT
exports.rejectWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ error: "Withdraw not found" });
    }

    if (withdraw.status !== "pending") {
      return res.status(400).json({ error: "Already processed" });
    }

    withdraw.status = "rejected";
    await withdraw.save();

    await History.create({
      user: withdraw.user,
      amount: withdraw.amount,
      type: "withdraw_rejected",
    });

    res.json({ message: "Withdraw rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};