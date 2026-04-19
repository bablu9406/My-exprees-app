const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateCode = require("../utils/generateCode");
const Referral = require("../models/Referral");
const Wallet = require("../models/Wallet");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { username, email, password, referralCode: inputReferralCode } = req.body;

    // ✅ validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      });
    }

    // ✅ check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    // ✅ hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ generate referral code (for new user)
    const myReferralCode = generateCode();

    // ✅ create user
    const user = await User.create({
      username,
      email,
      password: hash,
      referralCode: myReferralCode
    });

    // ✅ create wallet for new user
    await Wallet.create({
      user: user._id,
      balance: 0,
      totalEarned: 0
    });

    // ================= REFERRAL LOGIC =================

    if (inputReferralCode) {
      const referrer = await User.findOne({
        referralCode: inputReferralCode
      });

      if (referrer) {
        // link referral
        user.referredBy = referrer._id;
        await user.save();

        const reward = 10;

        // save referral record
        await Referral.create({
          referrer: referrer._id,
          referredUser: user._id,
          reward
        });

        // update referrer wallet
        let wallet = await Wallet.findOne({ user: referrer._id });

        if (!wallet) {
          wallet = await Wallet.create({
            user: referrer._id,
            balance: 0,
            totalEarned: 0
          });
        }

        wallet.balance += reward;
        wallet.totalEarned += reward;

        await wallet.save();
      }
    }

    // ✅ response
    res.status(201).json({
      message: "Register successful",
      userId: user._id,
      referralCode: user.referralCode
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    // ✅ check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        error: "Wrong password"
      });
    }

    // ✅ generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // ✅ response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode
      }
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};