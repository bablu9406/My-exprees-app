const router = require("express").Router()
const { auth } = require("../middleware/auth")
const Comment = require("../models/Comment")

// ================= ADD COMMENT =================
router.post("/:videoId", auth, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: "Comment required" })
    }

    const comment = await Comment.create({
      user: req.user.id,
      video: req.params.videoId,
      text
    })

    const populated = await comment.populate("user", "username profilePic")

    res.status(201).json(populated)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ================= GET COMMENTS =================
router.get("/:videoId", async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate("user", "username profilePic")
    .sort({ createdAt: -1 })

  res.json(comments)
})


// ================= DELETE COMMENT =================
router.delete("/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) return res.status(404).json({ msg: "Not found" })

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" })
  }

  await comment.deleteOne()

  res.json({ msg: "Deleted" })
})


// ================= LIKE COMMENT =================
router.put("/like/:id", auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment.likes.includes(req.user.id)) {
    comment.likes.push(req.user.id)
  }

  await comment.save()
  res.json(comment)
})


// ================= REPLY COMMENT =================
router.post("/reply/:id", auth, async (req, res) => {
  const parent = await Comment.findById(req.params.id)

  if (!parent) return res.status(404).json({ msg: "Comment not found" })

  const reply = await Comment.create({
    user: req.user.id,
    video: parent.video,
    text: req.body.text,
    parent: parent._id
  })

  res.json(reply)
})


// ================= GET REPLIES =================
router.get("/reply/:id", async (req, res) => {
  const replies = await Comment.find({ parent: req.params.id })
    .populate("user", "username profilePic")

  res.json(replies)
})

module.exports = router