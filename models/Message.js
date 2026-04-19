const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

  sender:{
    type:String,
    required:true
  },

  receiver:{
    type:String,
    required:true
  },

  text:{
    type:String,
    default:""
  },

  type:{
    type:String,
    enum:["text","image","voice"],
    default:"text"
  },

  mediaUrl:{
    type:String,
    default:""
  },

  seen:{
    type:Boolean,
    default:false
  },
  
  voice:{
  type:String,
  default:""
  },
  reactions:[
{
user:String,
emoji:String
}
],

deleted:{
type:Boolean,
default:false
},

edited:{
type:Boolean,
default:false
},

  status:{
    type:String,
    enum:["sent","delivered","seen"],
    default:"sent"
  }

},{timestamps:true});

module.exports = mongoose.model("Message",messageSchema);