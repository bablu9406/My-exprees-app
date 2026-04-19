const User = require("../models/User")

// ================= SUBSCRIBE =================
exports.subscribe = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user.id

    if (targetUserId === currentUserId) {
      return res.status(400).json({ msg: "You can't subscribe yourself" })
    }

    const user = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    if (!user) return res.status(404).json({ msg: "User not found" })

    // already subscribed check
    if (!user.subscribers.includes(currentUserId)) {
      user.subscribers.push(currentUserId)
      currentUser.subscribedTo.push(targetUserId)

      // optional count
      user.subscriberCount = user.subscribers.length

      await user.save()
      await currentUser.save()
    }

    res.json({ msg: "Subscribed", subscribers: user.subscribers.length })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= UNSUBSCRIBE =================
exports.unsubscribe = async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user.id

    const user = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    user.subscribers = user.subscribers.filter(
      id => id.toString() !== currentUserId
    )

    currentUser.subscribedTo = currentUser.subscribedTo.filter(
      id => id.toString() !== targetUserId
    )

    user.subscriberCount = user.subscribers.length

    await user.save()
    await currentUser.save()

    res.json({ msg: "Unsubscribed" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// ================= GET CHANNEL =================
exports.getChannel = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers following", "username profilePic")

    if (!user) return res.status(404).json({ msg: "User not found" })

    res.json({
      ...user._doc,
      subscriberCount: user.subscribers.length
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}