require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const path = require("path")

// ================= INIT =================
const app = express()
const server = http.createServer(app)

// ================= SOCKET USERS =================
const onlineUsers = new Map()

// ================= SECURITY =================
app.use(helmet())
app.use(compression())
app.use(morgan("dev"))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// ================= CORS =================
const CLIENT_URL = process.env.CLIENT_URL || "*"

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

// ================= ROUTES =================

// custom routes
app.use("/api/ads", require("./routes/ads"))
app.use("/api/wallet", require("./routes/wallet"))
app.use("/api/withdraw", require("./routes/withdraw"))
app.use("/api/referral", require("./routes/referral"))
app.use("/api/leaderboard", require("./routes/leaderboard"))
app.use("/api/analytics", require("./routes/analytics"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/payment", require("./routes/payment"))
app.use("/api/test-wallet", require("./routes/walletTest"))
app.use("/api/history", require("./routes/history"))
app.use("/api/video", require("./routes/video"))

// main routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/posts", require("./routes/posts"))
app.use("/api/stories", require("./routes/stories"))
app.use("/api/comments", require("./routes/comments"))
app.use("/api/messages", require("./routes/messages"))
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/groups", require("./routes/groups"))
app.use("/api/uploads", require("./routes/uploads"))
app.use("/api/reports", require("./routes/reports"))
app.use("/api/live", require("./routes/live"))
app.use("/api/subscribe", require("./routes/subscribe"))

// ================= FRONTEND SERVE =================
app.use(express.static(path.join(__dirname, "frontend/build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"))
})

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err))

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true
  }
})

const Message = require("./models/Message")
const GroupMessage = require("./models/GroupMessage")
const Notification = require("./models/Notification")

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id)

  // JOIN
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id)
    io.emit("online-users", Array.from(onlineUsers.keys()))
  })

  // CHAT MESSAGE
  socket.on("chat-message", async (data) => {
    try {
      if (!data?.sender || !data?.toUserId || !data?.text) return

      const isOnline = onlineUsers.has(data.toUserId)

      const saved = await Message.create({
        sender: data.sender,
        receiver: data.toUserId,
        text: data.text,
        status: isOnline ? "delivered" : "sent"
      })

      const target = onlineUsers.get(data.toUserId)

      if (target) io.to(target).emit("chat-message", saved)

      socket.emit("chat-message", saved)

      await Notification.create({
        user: data.toUserId,
        type: "message",
        message: data.text,
        from: data.sender
      })

    } catch (err) {
      console.log("❌ Chat Error:", err)
    }
  })

  // TYPING
  socket.on("typing", ({ fromUserId, toUserId }) => {
    const target = onlineUsers.get(toUserId)
    if (target) io.to(target).emit("typing", { fromUserId })
  })

  socket.on("stop-typing", ({ fromUserId, toUserId }) => {
    const target = onlineUsers.get(toUserId)
    if (target) io.to(target).emit("stop-typing", { fromUserId })
  })

  // SEEN
  socket.on("seen", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, { seen: true })
  })

  // NOTIFICATION
  socket.on("new-notification", (data) => {
    const target = onlineUsers.get(data.to)
    if (target) io.to(target).emit("notification", data)
  })

  // GROUP MESSAGE
  socket.on("group-message", async (data) => {
    const saved = await GroupMessage.create({
      group: data.groupId,
      sender: data.sender,
      text: data.text,
      voice: data.voice,
      image: data.image,
      video: data.video
    })

    io.emit("group-message", saved)
  })

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id)

    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()))
  })

})

// ================= START SERVER =================
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

module.exports = { io }