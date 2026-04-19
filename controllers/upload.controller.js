const cloudinary = require("../config/cloudinary")

exports.uploadMedia = async(req,res)=>{

 try{

  if(!req.file){
   return res.status(400).json({error:"No file"})
  }

  res.json({
   url:req.file.path
  })

 }catch(err){

  res.status(500).json({error:"Upload failed"})

 }

}