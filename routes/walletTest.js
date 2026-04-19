const express = require("express");
const router = express.Router();

// बिना user id test API
router.get("/", (req, res) => {
  res.json({
    balance: 500,
    totalEarned: 1200,
    totalWithdrawn: 200
  });
});

module.exports = router;