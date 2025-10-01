const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// ----------------- Create Post -----------------
router.post('/', auth, async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const post = new Post({ user: req.user._id, caption, imageUrl });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Get Feed (latest posts) -----------------
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));

    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic')   // ✅ comments भी लाओ
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Get Single Post -----------------
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic');  // ✅ comments भी लाओ

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Like / Unlike Post -----------------
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const idx = post.likes.indexOf(req.user._id);
    if (idx === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(idx, 1);
    }

    await post.save();
    res.json({ likeCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Add Comment -----------------
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    // populate करके return करो
    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic');

    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Delete Post (only owner) -----------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
