const LiveStream = require("../models/LiveStream")

exports.startStream = async(req,res)=>{

 try{

  const stream = await LiveStream.create({
   host:req.user._id,
   title:req.body.title
  })

  res.json(stream)

 }catch(err){
  res.status(500).json({error:err.message})
 }

}


exports.getLiveStreams = async(req,res)=>{

 const streams = await LiveStream.find({
  status:"live"
 }).populate("host","username profilePic")

 res.json(streams)

}

exports.joinLive = async(req,res)=>{

 const live = await Live.findById(req.params.id)

 live.viewers += 1

 await live.save()

 res.json({viewers:live.viewers})

}