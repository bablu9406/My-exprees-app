const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/* PROFILE */
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers following", "username");

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

/* FOLLOW / UNFOLLOW */
router.post("/:id/follow", auth, async (req, res) => {
  const target = await User.findById(req.params.id);
  const me = await User.findById(req.user._id);

  if (!target) return res.status(404).json({ error: "User not found" });

  const isFollowing = me.following.includes(target._id);

  if (isFollowing) {
    me.following.pull(target._id);
    target.followers.pull(me._id);
  } else {
    me.following.push(target._id);
    target.followers.push(me._id);
  }

  await me.save();
  await target.save();

  res.json({ following: !isFollowing });
});

module.exports = router;
