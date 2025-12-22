import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE POST */
export const createPost = async (req, res) => {
  const post = await Post.create({
    user: req.user.id,
    caption: req.body.caption,
    image: req.body.image,
  });

  res.status(201).json(post);
};

/* FEED */
export const getFeed = async (req, res) => {
  const user = await User.findById(req.user.id);

  const posts = await Post.find({
    user: { $in: [...user.following, req.user.id] },
  })
    .populate("user", "name")
    .populate("comments.user", "name")
    .sort({ createdAt: -1 });

  res.json(posts);
};

/* LIKE / UNLIKE */
export const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);

  const isLiked = post.likes.includes(req.user.id);

  if (isLiked) {
    post.likes.pull(req.user.id);
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();
  res.json({ liked: !isLiked });
};

/* COMMENT */
export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user.id,
    text: req.body.text,
  });

  await post.save();
  res.json(post);
};
