const Video = require("../models/video")
const Notification = require("../models/Notification")
const User = require("../models/User")
const { io } = require("../server")

// 🔥 HELPER (NEW - SAFE ADD)
const createNotification = async ({ from, to, type, video, message }) => {
  try {
    if (from.toString() === to.toString()) return // self notification block

    await Notification.create({
      from,
      to,
      type,
      video,
      message
    })
  } catch (err) {
    console.log("Notification error:", err.message)
  }
}


// ================= UPLOAD VIDEO =================
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, duration, category } = req.body

    if (!title || !videoUrl) {
      return res.status(400).json({ error: "Title & video required" })
    }

    const video = await Video.create({
      user: req.user.id,
      title,
      description: description || "",
      videoUrl,
      thumbnail: thumbnail || "",
      duration: duration || 0,
      category: category || "general"
    })

    // 🔔 Notify followers (FIXED FIELD NAME)
    const user = await User.findById(req.user.id)

    if (user?.followers?.length) {
      const notifications = user.followers.map(follower => ({
        from: req.user.id,
        to: follower,
        type: "video",
        message: "📺 New video uploaded",
        video: video._id
      }))

      await Notification.insertMany(notifications)
    }

    res.status(201).json(video)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= GET ALL VIDEOS =================
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 })

    res.json(videos)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= SINGLE VIDEO =================
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("user", "username profilePic")

    if (!video) return res.status(404).json({ error: "Video not found" })

    // ✅ ADD THIS
    video.views += 1
    await video.save()

    res.json(video)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ================= ADD VIEW =================
exports.addView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ error: "Video not found" })
    }

    video.views += 1
    await video.save()

    res.json({ views: video.views })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= LIKE =================
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ error: "Video not found" })
    }

    const userId = req.user.id

    if (!video.likes.includes(userId)) {
      video.likes.push(userId)
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId)
      io.emit("videoLiked", {
  videoId: video._id,
  likes: video.likes.length
})

      // 🔔 NOTIFICATION (NEW)
      await createNotification({
        from: userId,
        to: video.user,
        type: "like",
        video: video._id,
        message: "❤️ Someone liked your video"
      })
    }

    await video.save()
    res.json(video)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= DISLIKE =================
exports.dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).json({ error: "Video not found" })
    }

    const userId = req.user.id

    if (!video.dislikes.includes(userId)) {
      video.dislikes.push(userId)
      video.likes = video.likes.filter(id => id.toString() !== userId)
    }

    await video.save()
    res.json(video)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= TRENDING =================
exports.trendingVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .limit(20)
      .populate("user", "username profilePic")

    res.json(videos)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= SEARCH =================
exports.searchVideos = async (req, res) => {
  try {
    const q = req.query.q || ""

    const videos = await Video.find({
      title: { $regex: q, $options: "i" }
    })
    .populate("user", "username profilePic")
    .sort({ createdAt: -1 })

    res.json(videos)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= RECOMMENDED =================
exports.getRecommendedVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ views: -1 })
      .limit(10)
      .populate("user", "username profilePic")

    res.json(videos)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.subscribe = async (req, res) => {
  const user = await User.findById(req.user._id)
  const target = await User.findById(req.params.id)

  if (!target) return res.status(404).json({ error: "User not found" })

  if (!target.subscribers.includes(user._id)) {
    target.subscribers.push(user._id)
    user.subscribedTo.push(target._id)
  }

  await target.save()
  await user.save()

  res.json({ message: "Subscribed" })
}