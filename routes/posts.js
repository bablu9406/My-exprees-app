const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/post.controller");

router.post("/", auth, ctrl.createPost);
router.get("/", ctrl.getPosts);
router.post("/:id/like", auth, ctrl.likePost);
router.delete("/:id", auth, ctrl.deletePost);

module.exports = router;
