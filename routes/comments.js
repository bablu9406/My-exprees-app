const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  addComment,
  getComments,
  deleteComment,
  updateComment
} = require("../controllers/comment.controller");

// ==============================
// COMMENTS ROUTES
// ==============================

// ➕ Add comment
// POST /api/comments/:postId
router.post("/:postId", auth, addComment);

// 📥 Get all comments of a post
// GET /api/comments/:postId
router.get("/:postId", auth, getComments);

// ✏️ Update comment
// PUT /api/comments/:id
router.put("/:id", auth, updateComment);

// ❌ Delete comment
// DELETE /api/comments/:id
router.delete("/:id", auth, deleteComment);

module.exports = router;