const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 caption:{
  type:String,
  default:""
 },

 title:{
  type:String,
  default:""
 },

 image:{
  type:String,
  default:""
 },

 videoUrl:{
  type:String,
  default:""
 },

 mediaUrl:{
  type:String,
  default:""
 },

 type:{
  type:String,
  enum:["image","video","short"],
  default:"image"
 },

 duration:{
  type:Number,
  default:0
 },

 views:{
  type:Number,
  default:0
 },

 likes:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
 ],

 savedBy:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
 ],

 shares:{
  type:Number,
  default:0
 },

 hashtags:[
  {
   type:String
  }
 ],

 comments:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"Comment"
  }
 ],

 viralScore:{
  type:Number,
  default:0
 }

},{
 timestamps:true
});

module.exports =
  mongoose.models.Post ||
  mongoose.model("Post", postSchema);