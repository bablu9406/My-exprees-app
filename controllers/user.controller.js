const User = require("../models/User");
const Post = require("../models/Post");

/* FOLLOW / UNFOLLOW */
exports.toggleFollow = async (req, res) => {
  const user = await User.findById(req.user.id);
  const target = await User.findById(req.params.id);

  const isFollowing = user.following.includes(target.id);

  if (isFollowing) {
    user.following.pull(target.id);
    target.followers.pull(user.id);
  } else {
    user.following.push(target.id);
    target.followers.push(user.id);
  }

  await user.save();
  await target.save();

  res.json({ following: !isFollowing });
};

/* PROFILE */
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers following", "name");

  const posts = await Post.find({ user: req.params.id });

  res.json({ user, posts });
};
