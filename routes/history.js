const express = require("express");
const router = express.Router();
const History = require("../models/history");

router.get("/:userId", async (req, res) => {
  try {
    const history = await History.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;