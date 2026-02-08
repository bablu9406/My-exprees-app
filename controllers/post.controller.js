const Post = require("../models/Post");

exports.createPost = async (req,res)=>{
  const { caption,image } = req.body;
  const post = await Post.create({
    user: req.user.id,
    caption,
    image
  });
  res.status(201).json(post);
};

exports.getPosts = async (req,res)=>{
  const posts = await Post.find()
  .populate("user","username")
  .sort({createdAt:-1});
  res.json(posts);
};

exports.likePost = async (req,res)=>{
  const post = await Post.findById(req.params.id);
  if(!post.likes.includes(req.user.id)){
    post.likes.push(req.user.id);
  }
  await post.save();
  res.json(post);
};

exports.deletePost = async (req,res)=>{
  await Post.findByIdAndDelete(req.params.id);
  res.json({message:"Deleted"});
};
