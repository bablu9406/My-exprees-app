const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createPost,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
  updatePost,
  getShorts,
  getSinglePost,
  getSubscribedPosts,
  getFeed,
  searchPost
} = require("../controllers/post.controller");

// CREATE POST
router.post("/", auth, upload.single("file"), createPost);

// GET SHORTS
router.get("/shorts", getShorts);

// GET ALL POSTS
router.get("/", getPosts);

// GET SINGLE POST
router.get("/:id", getSinglePost);

// UPDATE POST
router.put("/edit/:id", auth, updatePost);

// LIKE / UNLIKE
router.put("/like/:id", auth, likePost);
router.put("/unlike/:id", auth, unlikePost);

// DELETE
router.delete("/:id", auth, deletePost);

// UPDATE WITH IMAGE
router.put("/:id", auth, upload.single("image"), updatePost);

// SUBSCRIBED POSTS
router.get("/subscribed", auth, getSubscribedPosts);

// 🔥 FEED (NEW)
router.get("/feed", auth, getFeed);

// 🔥 SEARCH (NEW)
router.get("/search", auth, searchPost);

module.exports = router;
