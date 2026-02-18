const cloudinary = require("../config/cloudinary");

const Post = require("../models/Post");

const Notification = require("../models/Notification");

const User = require("../models/User");
exports.createPost = async (req, res) => {
  try {
    
    console.log("USER:", req.user);

    const { caption, type } = req.body;

    if (!req.file && !caption) {
      return res.status(400).json({ error: "Post empty" });
    }

    let mediaUrl = "";
    if (req.file) {
      mediaUrl = req.file.path; // Cloudinary URL already
    }

    const post = await Post.create({
      user: req.user._id,
      caption: caption || "",
      type: type || "image",

      image: type === "image" ? mediaUrl : "",
      videoUrl: type !== "image" ? mediaUrl : "",

      duration: type === "short" ? 30 : 0,
      views: 0,
      likes: [],
      comments: []
    });

    res.status(201).json(post);

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LIKE POST
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ error: "Already liked" });
    }

    post.likes.push(req.user._id);
    await post.save();

    await Notification.create({
      from: req.user._id,
      to: post.user,
      type: "like",
      post: post._id
    });

    res.json({ message: "Liked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UNLIKE POST
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ error: "Not liked yet" });
    }

    post.likes.pull(req.user._id);
    await post.save();

    res.json({ message: "Unliked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not allowed" });
    }
    let imageUrl = post.image;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts/images",
      });
    imageUrl = result.secure_url;
    }
    post.caption = caption || post.caption;

if (req.file) {
  post.image = imageUrl;
}
await post.save();
res.json({ message: "Post updated", post });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username");
    if (!post) return res.status(404).json({ error: "Not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getShorts = async (req, res) => {
  try {
    const shorts = await Post.find({
      type: "short",
      duration: { $lte: 60 }
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(shorts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSubscribedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      user: { $in: user.subscribedTo }
    })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      user: { $in: [...user.following, req.user._id] }
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
