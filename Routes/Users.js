const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('followers following', 'name profilePic');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Follow / Unfollow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const toFollow = await User.findById(req.params.id);
    const me = req.user;
    if (!toFollow) return res.status(404).json({ error: 'User not found' });
    if (toFollow._id.equals(me._id)) return res.status(400).json({ error: 'Cannot follow yourself' });

    const already = me.following.some(f => f.toString() === toFollow._id.toString());
    if (!already) {
      me.following.push(toFollow._id);
      toFollow.followers.push(me._id);
    } else {
      me.following = me.following.filter(f => f.toString() !== toFollow._id.toString());
      toFollow.followers = toFollow.followers.filter(f => f.toString() !== me._id.toString());
    }
    await me.save();
    await toFollow.save();
    res.json({ followingCount: me.following.length, followersCount: toFollow.followers.length, following: !already });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
