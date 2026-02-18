const router = require("express").Router();
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notification.controller");

router.get("/", auth, notificationController.getNotifications);

module.exports = router;
