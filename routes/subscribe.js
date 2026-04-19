const router = require("express").Router()
const { auth } = require("../middleware/auth")

const {
  subscribe,
  unsubscribe,
  getChannel
} = require("../controllers/subscribe.controller")

router.put("/subscribe/:id", auth, subscribe)
router.put("/unsubscribe/:id", auth, unsubscribe)
router.get("/channel/:id", getChannel)

module.exports = router