const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  addComment,
  getComments,
  deleteComment,
  updateComment
} = require("../controllers/comment.controller");

router.post("/:postId", auth, addComment);
router.get("/:postId", getComments);
router.delete("/:id", auth, deleteComment);
router.put("/:id", auth, updateComment);

module.exports = router;
