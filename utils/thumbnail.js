const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")

ffmpeg.setFfmpegPath(ffmpegPath)

const generateThumbnail = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: outputPath,
        filename: "thumb-%b.png",
        size: "320x180"
      })
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
  })
}

module.exports = generateThumbnail