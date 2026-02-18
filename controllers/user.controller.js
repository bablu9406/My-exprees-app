const User = require("../models/User");

exports.followUser = async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);
await Notification.create({
  from: req.user._id,
  to: userToFollow._id,
  type: "follow"
});

  if (!userToFollow.followers.includes(currentUser._id)) {
    userToFollow.followers.push(currentUser._id);
    currentUser.following.push(userToFollow._id);

    await userToFollow.save();
    await currentUser.save();
  }

  res.json({ message: "Followed" });
};

exports.unfollowUser = async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  userToUnfollow.followers.pull(currentUser._id);
  currentUser.following.pull(userToUnfollow._id);

  await userToUnfollow.save();
  await currentUser.save();

  res.json({ message: "Unfollowed" });
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SAVE POST
exports.savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;

    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ error: "Already saved" });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.json({ message: "Post saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UNSAVE POST
exports.unsavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;

    user.savedPosts.pull(postId);
    await user.save();

    res.json({ message: "Post unsaved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// SEARCH USER
exports.searchUser = async (req, res) => {
  try {
    const name = req.query.name;

    const users = await User.find({
      username: { $regex: name, $options: "i" }
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Post = require("../models/Post");

exports.getUserProfile = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SUBSCRIBE
exports.subscribeUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot subscribe yourself" });
    }

    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.subscribedTo.includes(targetUserId)) {
      return res.status(400).json({ error: "Already subscribed" });
    }

    user.subscribedTo.push(targetUserId);
    targetUser.subscribers.push(req.user._id);

    await user.save();
    await targetUser.save();

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UNSUBSCRIBE
exports.unsubscribeUser = async (req, res) => {
  try {
    const userToUnsubscribe = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnsubscribe)
      return res.status(404).json({ error: "User not found" });

    currentUser.subscribedTo.pull(userToUnsubscribe._id);
    userToUnsubscribe.subscribers.pull(currentUser._id);

    await currentUser.save();
    await userToUnsubscribe.save();

    res.json({ message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ error: "User not found" });
    if (userToFollow._id.equals(currentUser._id))
      return res.status(400).json({ error: "Cannot follow yourself" });

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);

      await userToFollow.save();
      await currentUser.save();
    }

    res.json({ message: "Followed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    userToUnfollow.followers.pull(currentUser._id);
    currentUser.following.pull(userToUnfollow._id);

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
