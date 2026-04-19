const Message = require("../models/Message")

// ================= SEND MESSAGE =================

exports.sendMessage = async (req,res)=>{
  try{

    const {sender,receiver,text,type,mediaUrl} = req.body

    const msg = await Message.create({
      sender,
      receiver,
      text:text || "",
      type:type || "text",
      voice:req.body.voice,
      mediaUrl:mediaUrl || ""
    })

    res.json(msg)

  }catch(err){
    console.error(err)
    res.status(500).json({error:"Send message failed"})
  }
}


// ================= GET MESSAGES =================

exports.getMessages = async (req,res)=>{
  try{

    const {user1,user2,userId} = req.params


    // chat between 2 users

    if(user1 && user2){

      const messages = await Message.find({

        $or:[
          {sender:user1,receiver:user2},
          {sender:user2,receiver:user1}
        ]

      }).sort({createdAt:1})

      return res.json(messages)
    }


    // all messages of one user

    if(userId){

      const messages = await Message.find({

        $or:[
          {sender:userId},
          {receiver:userId}
        ]

      }).sort({createdAt:-1})

      return res.json(messages)
    }

    res.json([])

  }catch(err){

    console.error("Fetch messages error:",err)
    res.status(500).json([])

  }
}