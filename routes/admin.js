const router = require("express").Router();
const { admin } = require("../middleware/admin");

const {
  getAllUsers,
  getWithdraws,
  getAds,
  deleteAd
} = require("../controllers/admin.controller");

// 👤 USERS
router.get("/users", admin, getAllUsers);

// 💸 WITHDRAW
router.get("/withdraws", admin, getWithdraws);

// 📢 ADS
router.get("/ads", admin, getAds);
router.delete("/ads/:id", admin, deleteAd);

module.exports = router;