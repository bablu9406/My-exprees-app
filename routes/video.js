const express = require("express")
const router = express.Router()

const upload = require("../utils/multer")
const { auth } = require("../middleware/auth")

const Video = require("../models/Video")
const videoController = require("../controllers/video.controller")

const generateThumbnail = require("../utils/thumbnail")

const fs = require("fs")
const path = require("path")

// ================= STREAM VIDEO =================
router.get("/stream/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) {
      return res.status(404).send("Video not found")
    }

    // 🔥 CLOUD VIDEO (Cloudinary etc.)
    if (video.videoUrl.startsWith("http")) {
      return res.redirect(video.videoUrl)
    }

    const videoPath = path.resolve(video.videoUrl)

    if (!fs.existsSync(videoPath)) {
      return res.status(404).send("File not found")
    }

    const range = req.headers.range

    if (!range) {
      return res.status(400).send("Requires Range header")
    }

    const videoSize = fs.statSync(videoPath).size

    const CHUNK_SIZE = 10 ** 6 // 1MB chunk
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    const contentLength = end - start + 1

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(videoPath, { start, end })

    videoStream.pipe(res)

  } catch (err) {
    console.error(err)
    res.status(500).send("Streaming error")
  }
})


// ================= UPLOAD =================

router.post(
  "/upload",
  auth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description } = req.body

      if (!req.files.video) {
        return res.status(400).json({ message: "Video required ❌" })
      }

      const videoFile = req.files.video[0]
      let thumbnailPath = ""

      // ✅ 1. MANUAL thumbnail
      if (req.files.thumbnail) {
        thumbnailPath = req.files.thumbnail[0].path
      }

      // ✅ 2. AUTO thumbnail
      else {
        await generateThumbnail(videoFile.path, "uploads/")
        thumbnailPath = videoFile.filename.replace(
          path.extname(videoFile.filename),
          ".png"
        )
        thumbnailPath = "uploads/" + "thumb-" + videoFile.filename.split(".")[0] + ".png"
      }

      const video = await Video.create({
        user: req.user.id,
        title,
        description,
        videoUrl: videoFile.path,
        thumbnail: thumbnailPath
      })

      res.json({ message: "Uploaded ✅", video })

    } catch (err) {
      console.log(err)
      res.status(500).json({ error: err.message })
    }
  }
)
// DELETE VIDEO
router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)

    if (!video) return res.status(404).json({ msg: "Not found" })

    if (video.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" })
    }

    await video.deleteOne()

    res.json({ msg: "Deleted ✅" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ================= FEED =================
router.get("/all", videoController.getVideos)


// ================= TRENDING =================
router.get("/trending/all", videoController.trendingVideos)


// ================= SEARCH =================
router.get("/search/all", videoController.searchVideos)


// ================= RECOMMENDED =================
router.get("/recommended", auth, videoController.getRecommendedVideos)


// ================= SINGLE VIDEO =================
router.get("/:id", videoController.getVideo)


// ================= VIEW =================
router.put("/view/:id", videoController.addView)


// ================= LIKE / DISLIKE =================
router.put("/like/:id", auth, videoController.likeVideo)
router.put("/dislike/:id", auth, videoController.dislikeVideo)


module.exports = router