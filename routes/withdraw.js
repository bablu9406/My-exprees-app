const express = require("express");
const router = express.Router();

// ✅ सही
const Withdraw = require("../models/Withdraw")
const Wallet = require("../models/Wallet")
const History = require("../models/history")

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// ✅ USER REQUEST (NO MONEY DEDUCT HERE)
router.post("/request", async (req, res) => {
  try {
    const { userId, amount, method, accountDetails } = req.body;

    // ✅ validation
    if (!userId || !amount || !method || !accountDetails) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    let wallet = await Wallet.findOne({ user: userId });

    // ✅ अगर wallet नहीं है तो create करो
    if (!wallet) {
      wallet = await Wallet.create({
        user: userId,
        balance: 0,
        totalEarned: 0
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance ❌" });
    }

    // ✅ withdraw create
    const withdraw = await Withdraw.create({
      user: userId,
      amount,
      method,
      accountDetails,
      status: "pending"
    });

    // ✅ history
    await History.create({
      user: userId,
      amount,
      type: "withdraw_request"
    });

    res.json({ message: "Withdraw request sent ✅", withdraw });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ✅ ADMIN APPROVE
const razorpay = require("../utils/razorpay");

router.put("/approve/:id", auth, admin, async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ message: "Not found ❌" });
    }

    if (withdraw.status !== "pending") {
      return res.status(400).json({ message: "Already processed ❌" });
    }

    const wallet = await Wallet.findOne({ user: withdraw.user });

    if (!wallet || wallet.balance < withdraw.amount) {
      return res.status(400).json({ message: "Insufficient balance ❌" });
    }

    // 💰 Razorpay payout
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT,
      fund_account: {
        account_type: withdraw.method === "upi" ? "vpa" : "bank_account",
        vpa: withdraw.method === "upi" ? { address: withdraw.accountDetails } : undefined
      },
      amount: withdraw.amount * 100,
      currency: "INR",
      mode: "UPI",
      purpose: "payout"
    });

    // 💸 deduct wallet
    wallet.balance -= withdraw.amount;
    await wallet.save();

    withdraw.status = "approved";
    await withdraw.save();

    await History.create({
      user: withdraw.user,
      amount: withdraw.amount,
      type: "withdraw_approved"
    });

    res.json({ message: "Approved & Paid ✅", payout });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✅ GET ALL (ADMIN)
router.get("/all", auth, admin, async (req, res) => {
  const data = await Withdraw.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(data);
});


module.exports = router;