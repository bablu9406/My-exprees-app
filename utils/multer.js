const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video")) cb(null, true)
    else cb(new Error("Only video allowed"), false)
  }

  if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image")) cb(null, true)
    else cb(new Error("Only image allowed"), false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = upload