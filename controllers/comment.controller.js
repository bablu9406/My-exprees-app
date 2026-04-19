const Comment = require("../models/Comment")
const Notification = require("../models/Notification")
const Post = require("../models/Post")
const Video = require("../models/video")
const contentFilter = require("../middleware/contentFilter")

const { io } = require("../server")

/* ================= ADD COMMENT ================= */

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body
    const { postId, videoId } = req.params

    if (!text) {
      return res.status(400).json({ error: "Text required" })
    }

    if (contentFilter(text)) {
      return res.status(400).json({
        error: "Comment contains abusive content"
      })
    }

    let ownerId = null

    // 👉 post owner
    if (postId) {
      const post = await Post.findById(postId)
      if (post) ownerId = post.user
    }

    // 👉 video owner
    if (videoId) {
      const video = await Video.findById(videoId)
      if (video) ownerId = video.user
    }

    // ✅ create comment first
    const comment = await Comment.create({
      user: req.user._id,
      post: postId || null,
      video: videoId || null,
      text
    })

    // ✅ populate after create
    const populated = await comment.populate("user", "username profilePic")

    // 🔥 REALTIME COMMENT
    io.emit("newComment", populated)

    // 🔔 notification
    if (ownerId && ownerId.toString() !== req.user._id.toString()) {
      const notif = await Notification.create({
        user: ownerId,
        type: "comment",
        message: "Someone commented",
        from: req.user._id,
        post: postId || null,
        video: videoId || null
      })

      io.emit("newNotification", notif)
    }

    res.status(201).json(populated)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ================= GET COMMENTS ================= */

exports.getComments = async (req, res) => {
  try {
    const { postId, videoId } = req.params

    const query = postId
      ? { post: postId }
      : { video: videoId }

    const comments = await Comment.find(query)
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 })

    res.json(comments)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ================= DELETE COMMENT ================= */

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ error: "Not found" })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" })
    }

    await comment.deleteOne()

    // 🔥 realtime delete
    io.emit("commentDeleted", { commentId: req.params.id })

    res.json({ message: "Deleted" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ================= UPDATE COMMENT ================= */

exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body

    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    if (text && contentFilter(text)) {
      return res.status(400).json({
        error: "Comment contains abusive content"
      })
    }

    comment.text = text || comment.text

    await comment.save()

    const populated = await comment.populate("user", "username profilePic")

    // 🔥 realtime update
    io.emit("commentUpdated", populated)

    res.json({ message: "Comment updated", comment: populated })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ================= LIKE COMMENT ================= */

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ error: "Not found" })
    }

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id)
    }

    await comment.save()

    // 🔥 realtime like
    io.emit("commentLiked", {
      commentId: comment._id,
      likes: comment.likes.length
    })

    res.json(comment)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ================= REPLY COMMENT ================= */

exports.replyComment = async (req, res) => {
  try {
    const parent = await Comment.findById(req.params.id)

    if (!parent) {
      return res.status(404).json({ error: "Parent comment not found" })
    }

    const reply = await Comment.create({
      user: req.user._id,
      text: req.body.text,
      parent: parent._id,
      post: parent.post,
      video: parent.video
    })

    const populated = await reply.populate("user", "username profilePic")

    // 🔥 realtime reply
    io.emit("newReply", populated)

    res.json(populated)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}