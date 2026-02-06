const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Post = require("../models/Post");

/* ================= CREATE POST ================= */
router.post("/", auth, async (req, res) => {
  try {
    const { caption, image } = req.body;

    if (!caption) {
      return res.status(400).json({ error: "Caption is required" });
    }

    const newPost = await Post.create({
      user: req.user._id,
      caption,
      image: image || null,
      createdAt: new Date(),
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL POSTS (FEED) ================= */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
