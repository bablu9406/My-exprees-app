const express = require("express")
const router = express.Router()

const { auth } = require("../middleware/auth");

const liveController = require("../controllers/live.controller")

router.post("/start",auth,liveController.startStream)

router.get("/",liveController.getLiveStreams)

module.exports = router