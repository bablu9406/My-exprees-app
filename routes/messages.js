const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const messageController = require("../controllers/message.controller");


// SEND MESSAGE
router.post("/", auth, messageController.sendMessage);


// GET CHAT BETWEEN TWO USERS
router.get("/chat/:user1/:user2", auth, messageController.getMessages);


// GET ALL MESSAGES OF USER
router.get("/user/:userId", auth, messageController.getMessages);


module.exports = router;