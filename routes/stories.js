const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const storyController = require("../controllers/story.controller");

router.post("/", auth, upload.single("file"), storyController.addStory);
router.get("/", auth, storyController.getStories);

module.exports = router;
