const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({

 reporter:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 type:{
  type:String,
  enum:["post","comment","user"]
 },

 targetId:{
  type:mongoose.Schema.Types.ObjectId
 },

 reason:{
  type:String
 }

},{
 timestamps:true
})

module.exports =
  mongoose.models.Report ||
  mongoose.model("Report", reportSchema);