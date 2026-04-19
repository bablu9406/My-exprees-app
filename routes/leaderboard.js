const express = require("express");
const router = express.Router();

const {
  getTopEarners,
  getTopReferrers
} = require("../controllers/leaderboard.controller");

router.get("/earnings", getTopEarners);
router.get("/referrals", getTopReferrers);

module.exports = router;