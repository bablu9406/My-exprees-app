const express = require("express");
const router = express.Router();

// ✅ सही import
const {
  generateReferralCode,
  applyReferral,
  getMyReferrals
} = require("../controllers/referral.controller");

// ✅ routes
router.get("/generate", generateReferralCode);
router.post("/apply", applyReferral);
router.get("/my", getMyReferrals);

module.exports = router;