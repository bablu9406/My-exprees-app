const Group = require("../models/Group")

exports.createGroup = async(req,res)=>{

 try{

  const group = await Group.create({

   name:req.body.name,
   admin:req.user._id,
   members:req.body.members

  })

  res.json(group)

 }catch(err){

  res.status(500).json({error:"Create group failed"})

 }

}

exports.getGroups = async(req,res)=>{

 const groups = await Group.find({

  members:req.user._id

 })

 res.json(groups)

}