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
router.get("/me", auth, userController.getProfile);
router.put("/me", auth, userController.updateMe);
// SAVE POST
router.put("/save/:postId", auth, userController.savePost);
// UNSAVE POST
router.put("/unsave/:postId", auth, userController.unsavePost);
// SEARCH USER
router.get("/search", auth, userController.searchUser);
// SUBSCRIBE
router.post("/subscribe/:id", auth, userController.subscribeUser);
// UNSUBSCRIBE
router.post("/unsubscribe/:id", auth, userController.unsubscribeUser);

module.exports = router;
