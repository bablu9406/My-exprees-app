const express = require("express");
const router = express.Router();

// ✅ FIXED IMPORT
const { auth } = require("../middleware/auth");

const {
  createAd,
  getRandomAd,
  trackAdView,
  trackAdClick,
} = require("../controllers/ad.controller");

// ✅ CREATE AD
router.post("/", auth, createAd);

// ✅ GET RANDOM AD
router.get("/random", getRandomAd);

// ✅ TRACK
router.post("/view/:id", trackAdView);
router.post("/click/:id", trackAdClick);

module.exports = router;