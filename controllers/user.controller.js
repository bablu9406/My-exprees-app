const User = require("../models/User");
const Post = require("../models/Post");
const Earning = require("../models/Earning");

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

exports.getExplore = async(req,res)=>{

 try{

  const posts = await Post.find()
  .sort({
   viralScore:-1,
   createdAt:-1
  })
  .limit(30)
  .populate("user","username profilePic")

  res.json(posts)

 }catch(err){
  res.status(500).json({error:err.message})
 }

}
// FOLLOW USER
const Notification = require("../models/Notification")

exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const me = await User.findById(req.user.id)

    if (!user.followers.includes(req.user.id)) {
      user.followers.push(req.user.id)
      me.following.push(req.params.id)

      await user.save()
      await me.save()

      // 🔔 Notification
      await Notification.create({
        user: user._id,
        type: "follow",
        message: "Started following you",
        from: req.user.id
      })

      res.json({ msg: "Followed" })
    } else {
      res.json({ msg: "Already following" })
    }

  } catch (err) {
    res.status(500).json(err.message)
  }
}

exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const me = await User.findById(req.user.id)

    user.followers = user.followers.filter(
      (id) => id.toString() !== req.user.id
    )

    me.following = me.following.filter(
      (id) => id.toString() !== req.params.id
    )

    await user.save()
    await me.save()

    res.json({ msg: "Unfollowed" })
  } catch (err) {
    res.status(500).json(err.message)
  }
}


// SEARCH USERS
exports.searchUsers = async (req, res) => {
  try {

    const { q } = req.query;

    const users = await User.find({
      username: { $regex: q, $options: "i" }
    }).limit(20);

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// USER POSTS
exports.getUserProfile = async (req, res) => {
  try {

    const posts = await Post.find({
      user: req.params.id
    });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// SUGGEST USERS (यही missing था)
exports.suggestUsers = async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.user._id }
    }).limit(10);

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// CREATE COLLECTION
exports.createCollection = async (req, res) => {

  const user = await User.findById(req.user._id);

  user.collections.push({
    name: req.body.name,
    posts: []
  });

  await user.save();

  res.json(user.collections);
};


// ADD TO COLLECTION
exports.addToCollection = async (req, res) => {

  const user = await User.findById(req.user._id);

  const collection = user.collections.id(req.params.collectionId);

  collection.posts.push(req.params.postId);

  await user.save();

  res.json(collection);
};

exports.getMyEarnings = async (req, res) => {
  try {
    const earnings = await Earning.find({ user: req.user._id });

    const total = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      total,
      transactions: earnings
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};