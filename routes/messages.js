const router = require("express").Router();
const auth = require("../middleware/auth");
const messageController = require("../controllers/message.controller");

router.post("/", auth, messageController.sendMessage);
router.get("/:userId", auth, messageController.getChat);

module.exports = router;
