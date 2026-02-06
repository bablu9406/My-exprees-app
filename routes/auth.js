const express = require("express");
const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  res.json({ message: "Register OK" });
});

// LOGIN
router.post("/login", (req, res) => {
  res.json({ message: "Login OK" });
});

module.exports = router;
