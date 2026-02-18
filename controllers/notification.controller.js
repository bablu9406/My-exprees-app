const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("fromUser", "username")
    .sort({ createdAt: -1 });

  res.json(notifications);
};
