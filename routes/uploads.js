const router = require("express").Router()
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
 cloudinary,
 params:{
  folder:"social-app",
  allowed_formats:["jpg","png","jpeg","mp4","mp3","webm"]
 }
})

const upload = multer({storage})

router.post("/",upload.single("file"),(req,res)=>{

 if(!req.file){
  return res.status(400).json({error:"file missing"})
 }

 res.json({
  url:req.file.path
 })

})

module.exports = router