const router = require("express").Router()

const { auth } = require("../middleware/auth");

const groupController = require("../controllers/group.controller")

router.post("/",auth,groupController.createGroup)

router.get("/",auth,groupController.getGroups)

module.exports = router