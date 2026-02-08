const User = require("../models/User");

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(userToFollow.id)) {
      return res.status(400).json({ message: "Already following" });
    }

    currentUser.following.push(userToFollow.id);
    userToFollow.followers.push(currentUser.id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    currentUser.following.pull(userToUnfollow.id);
    userToUnfollow.followers.pull(currentUser.id);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username")
      .populate("following", "username");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
