const cloudinary = require("../config/cloudinary")
const Post = require("../models/Post")
const User = require("../models/User")
const contentFilter = require("../middleware/contentFilter")

// ================= CREATE POST =================
exports.createPost = async (req, res) => {
  try {
    const { caption, type } = req.body

    if (!req.file && !caption) {
      return res.status(400).json({ error: "Post empty" })
    }

    if (caption && contentFilter(caption)) {
      return res.status(400).json({ error: "Banned content" })
    }

    const allowedTypes = ["image", "video", "short"]

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid type" })
    }

    let mediaUrl = ""

    // 🔥 Upload to Cloudinary (if file exists)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto"
      })
      mediaUrl = result.secure_url
    }

    const post = await Post.create({
      user: req.user._id,
      caption: caption || "",
      type: type || "image",
      image: type === "image" ? mediaUrl : "",
      videoUrl: type === "video" || type === "short" ? mediaUrl : "",
      duration: type === "short" ? 30 : 0
    })

    res.status(201).json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= GET ALL POSTS =================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 })

    res.json(posts)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= LIKE POST =================
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id)
      post.dislikes = post.dislikes.filter(
        id => id.toString() !== req.user.id
      )
    }

    await post.save()
    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= DISLIKE POST =================
exports.dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post.dislikes.includes(req.user.id)) {
      post.dislikes.push(req.user.id)
      post.likes = post.likes.filter(
        id => id.toString() !== req.user.id
      )
    }

    await post.save()
    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= DELETE POST =================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await post.deleteOne()

    res.json({ message: "Post deleted" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}