const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const postController = require("../controllers/post.controller");


// =========================
// 🔥 FEED & SEARCH (TOP)
// =========================

router.get("/feed", auth, postController.getFeed);
router.get("/search", auth, postController.searchPost);
router.get("/explore", auth, postController.getExplore);


// =========================
// 🎬 REELS
// =========================

router.get("/reels", auth, postController.getReels);
router.get("/reels/trending", auth, postController.getTrendingReels);


// =========================
// 📝 POSTS
// =========================

// Create post
router.post("/", auth, upload.single("file"), postController.createPost);

// Get all posts
router.get("/", postController.getPosts);


// =========================
// ❤️ ACTIONS
// =========================

// Like / Unlike
router.put("/like/:id", auth, postController.likePost);
router.put("/unlike/:id", auth, postController.unlikePost);

// Views & Share
router.post("/view/:id", auth, postController.addView);
router.post("/share/:id", auth, postController.sharePost);


// =========================
// ✏️ UPDATE / DELETE
// =========================

// Update post (text or image)
router.put("/edit/:id", auth, postController.updatePost);
router.put("/:id", auth, upload.single("image"), postController.updatePost);

// Delete post
router.delete("/:id", auth, postController.deletePost);


// =========================
// ⚠️ IMPORTANT (LAST)
// =========================

// Get single post (ALWAYS LAST)
router.get("/:id", postController.getSinglePost);


module.exports = router;