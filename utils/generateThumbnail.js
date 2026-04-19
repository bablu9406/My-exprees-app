const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("ffmpeg-static")
const path = require("path")

ffmpeg.setFfmpegPath(ffmpegPath)

const generateThumbnail = (videoPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = videoPath + "-thumbnail.png"

    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: path.dirname(videoPath),
        filename: path.basename(outputPath),
        size: "320x240"
      })
      .on("end", () => resolve(outputPath))
      .on("error", reject)
  })
}

module.exports = generateThumbnail