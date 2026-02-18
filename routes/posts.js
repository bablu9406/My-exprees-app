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
  getSubscribedPosts
} = require("../controllers/post.controller");


router.post("/", auth, upload.single("file"), createPost);

router.get("/shorts", getShorts);
router.get("/", getPosts);
router.get("/:id", getSinglePost);
router.put("/edit/:id", auth, updatePost);
router.put("/like/:id", auth, likePost);
router.put("/unlike/:id", auth, unlikePost);
router.delete("/:id", auth, deletePost);
router.put("/:id", auth, upload.single("image"), updatePost);
router.get("/subscribed", auth, getSubscribedPosts);
router.get("/feed", auth, postController.getFeed);

module.exports = router;
