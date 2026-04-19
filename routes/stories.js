const router = require("express").Router();
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const storyController = require("../controllers/story.controller");

router.post("/view/:id",auth,storyController.viewStory)
router.post("/", auth, upload.single("file"), storyController.addStory);
router.get("/", auth, storyController.getStories);
router.get("/viewers/:id",auth,storyController.getStoryViewers)

module.exports = router;
