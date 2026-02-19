const Story = require("../models/Story");

exports.addStory = async (req, res) => {
  try {
    const story = await Story.create({
      user: req.user._id,
      media: req.file.path,
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
    }).populate("user", "username profilePic");

    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
