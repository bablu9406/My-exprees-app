const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const userController = require("../controllers/user.controller");

router.get("/earnings", auth, userController.getMyEarnings);

// FOLLOW
router.put("/follow/:id", auth, userController.followUser);

// UNFOLLOW
router.put("/unfollow/:id", auth, userController.unfollowUser);

// PROFILE
router.get("/profile/:id", auth, userController.getProfile);
router.get("/profile", auth, userController.getProfile);
router.get("/me", auth, userController.getProfile);
router.put("/me", auth, userController.updateMe);

// SUBSCRIBE
router.post("/subscribe/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  const target = await User.findById(req.params.id)

  if (!target.subscribers.includes(req.user.id)) {
    target.subscribers.push(req.user.id)
    user.subscribedTo.push(target._id)
  }

  await user.save()
  await target.save()

  res.json({ msg: "Subscribed ✅" })
})

// UNSUBSCRIBE
router.post("/unsubscribe/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id)
  const target = await User.findById(req.params.id)

  target.subscribers = target.subscribers.filter(
    id => id.toString() !== req.user.id
  )

  user.subscribedTo = user.subscribedTo.filter(
    id => id.toString() !== target._id.toString()
  )

  await user.save()
  await target.save()

  res.json({ msg: "Unsubscribed ❌" })
})

// SAVE POST
router.put("/save/:postId", auth, userController.savePost);

// UNSAVE POST
router.put("/unsave/:postId", auth, userController.unsavePost);

// SEARCH USER
router.get("/search", auth, userController.searchUsers);

// SUGGESTIONS
router.get("/suggestions", auth, userController.suggestUsers);

// COLLECTION
router.post("/collection", auth, userController.createCollection);

router.post(
  "/collection/:collectionId/:postId",
  auth,
  userController.addToCollection
);

module.exports = router;