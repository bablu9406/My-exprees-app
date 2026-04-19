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

// ================= GET SINGLE POST =================
exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePic")

    if (!post) return res.status(404).json({ error: "Post not found" })

    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= FEED =================
exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20)

    res.json(posts)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= SEARCH =================
exports.searchPost = async (req, res) => {
  try {
    const { q } = req.query

    const posts = await Post.find({
      caption: { $regex: q, $options: "i" }
    })

    res.json(posts)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= EXPLORE =================
exports.getExplore = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ likes: -1 })
      .limit(20)

    res.json(posts)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= REELS =================
exports.getReels = async (req, res) => {
  try {
    const reels = await Post.find({ type: "short" })
      .sort({ createdAt: -1 })

    res.json(reels)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= TRENDING REELS =================
exports.getTrendingReels = async (req, res) => {
  try {
    const reels = await Post.find({ type: "short" })
      .sort({ likes: -1 })
      .limit(20)

    res.json(reels)

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

// ================= UNLIKE POST =================
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    post.likes = post.likes.filter(
      id => id.toString() !== req.user.id
    )

    await post.save()
    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= DISLIKE =================
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

// ================= VIEW =================
exports.addView = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    post.views = (post.views || 0) + 1
    await post.save()

    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= SHARE =================
exports.sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    post.shares = (post.shares || 0) + 1
    await post.save()

    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= UPDATE =================
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return res.status(404).json({ error: "Post not found" })

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" })
    }

    post.caption = req.body.caption || post.caption

    await post.save()
    res.json(post)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= DELETE =================
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