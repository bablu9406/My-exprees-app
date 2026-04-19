const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  sendPayment,
} = require("../controllers/payment.controller");

// 🟢 user payment
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

// 🟢 admin withdraw
router.post("/send/:id", sendPayment);

module.exports = router;