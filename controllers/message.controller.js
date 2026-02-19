const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    const msg = await Message.create({
      sender: req.user._id,
      receiver,
      text,
    });

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
