const Razorpay = require("razorpay");
const crypto = require("crypto");

const Withdraw = require("../models/Withdraw");
const Wallet = require("../models/Wallet");
const History = require("../models/history");

// ================= RAZORPAY =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount ❌"
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed ❌"
      });
    }

    // ================= WALLET =================
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        totalEarned: 0
      });
    }

    wallet.balance += Number(amount);
    wallet.totalEarned += Number(amount);

    await wallet.save();

// 🔥 ADD THIS HERE
await History.create({
  user: userId,
  amount,
  type: "deposit",
});

    // ================= HISTORY =================
    await History.create({
      userId,
      amount,
      type: "deposit",
      status: "success"
    });

    res.json({
      success: true,
      message: "Payment successful ✅"
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ================= WITHDRAW REQUEST =================
exports.withdrawRequest = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.json({ message: "Wallet not found ❌" });
    }

    if (wallet.balance < amount) {
      return res.json({ message: "Insufficient balance ❌" });
    }

    wallet.balance -= Number(amount);
    await wallet.save();

    await History.create({
      userId,
      amount,
      type: "withdraw",
      status: "success"
    });

    res.json({ message: "Withdraw successful ✅" });

  } catch (err) {
    console.log("WITHDRAW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN SEND (OPTIONAL) =================
exports.sendPayment = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ error: "Withdraw not found" });
    }

    withdraw.status = "paid";
    await withdraw.save();

    res.json({
      success: true,
      message: "Payment sent (simulated)"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};