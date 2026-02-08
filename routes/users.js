const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/user.controller");

// FOLLOW
router.put("/follow/:id", auth, userController.followUser);

// UNFOLLOW
router.put("/unfollow/:id", auth, userController.unfollowUser);

// PROFILE
router.get("/profile/:id", auth, userController.getProfile);

module.exports = router;
