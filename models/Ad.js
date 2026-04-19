const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  budget: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ctr: {
  type: Number,
  default: 0
  },
  spent: {
  type: Number,
  default: 0
},
costPerView: {
  type: Number,
  default: 0.02
},
costPerClick: {
  type: Number,
  default: 0.5
},
  targetTags: [String]
  
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);