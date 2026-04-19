const Notification = require("../models/Notification");

const NotificationToken = require("../models/NotificationToken")

exports.saveToken = async(req,res)=>{

 try{

  const token = await NotificationToken.create({
   user:req.user._id,
   token:req.body.token
  })

  res.json(token)

 }catch(err){
  res.status(500).json({error:err.message})
 }

}

exports.getNotifications = async (req, res) => {
 try {

  const notifications = await Notification.find({
   to: req.user._id
  })
  .sort({ createdAt: -1 })
  .populate("from", "username profilePic")

  res.json(notifications)

 } catch (err) {
  res.status(500).json({ error: err.message })
 }
}

exports.createNotification = async ({ from, to, type, video, message }) => {
  try {
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