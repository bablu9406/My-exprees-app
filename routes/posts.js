const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");

const router = express.Router();

/* CREATE POST */
router.post("/", auth, async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      caption: req.body.caption,
      image: req.body.image,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET FEED */
router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("user", "username")
    .sort({ createdAt: -1 });
  res.json(posts);
});

module.exports = router;
