const mongoose = require("mongoose")

const liveStreamSchema = new mongoose.Schema({

 host:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 title:String,

 viewers:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
 ],

 status:{
  type:String,
  enum:["live","ended"],
  default:"live"
 }

},{
 timestamps:true
})

module.exports = mongoose.model("LiveStream",liveStreamSchema)