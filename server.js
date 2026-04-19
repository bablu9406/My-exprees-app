require("dotenv").config()

const onlineUsers = new Map()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")

// MODELS
const Message = require("./models/Message")
const GroupMessage = require("./models/GroupMessage")
const Notification = require("./models/Notification") // ✅ FIX

// ROUTES
const adRoutes = require("./routes/ads")
const walletRoutes = require("./routes/wallet")
const withdrawRoutes = require("./routes/withdraw")
const referralRoutes = require("./routes/referral")
const leaderboardRoutes = require("./routes/leaderboard")
const analyticsRoutes = require("./routes/analytics")
const walletTestRoutes = require("./routes/walletTest")
const historyRoutes = require("./routes/history")
const adminRoutes = require("./routes/admin")
const paymentRoutes = require("./routes/payment")
const videoRoutes = require("./routes/video")

const app = express()

/* ================= SECURITY ================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(helmet())
app.use(compression())
app.use(morgan("dev"))
app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(limiter)

/* ================= ROUTES ================= */

app.use("/api/ads", adRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/withdraw", withdrawRoutes)
app.use("/api/referral", referralRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/test-wallet", walletTestRoutes)
app.use("/api/history", historyRoutes)
app.use("/api/video", videoRoutes)

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

app.use(express.static("frontend"))

/* ================= MONGODB ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err))

/* ================= HTTP SERVER ================= */

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

/* ================= SOCKET ================= */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // store users
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id)
    io.emit("online-users", Array.from(onlineUsers.keys()))
  })

  // ✅ DISCONNECT FIX (ADD THIS)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()))
  })

})

  /* ===== CHAT MESSAGE ===== */
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

      if (target) {
        io.to(target).emit("chat-message", saved)
      }

      socket.emit("chat-message", saved)

      // 🔔 notification save
      await Notification.create({
        user: data.toUserId,
        type: "message",
        message: data.text,
        from: data.sender
      })

    } catch (err) {
      console.log("DB Error:", err)
    }
  })

  /* ===== TYPING ===== */
  socket.on("typing", ({ fromUserId, toUserId }) => {
    const target = onlineUsers.get(toUserId)
    if (target) io.to(target).emit("typing", { fromUserId })
  })

  socket.on("stop-typing", ({ fromUserId, toUserId }) => {
    const target = onlineUsers.get(toUserId)
    if (target) io.to(target).emit("stop-typing", { fromUserId })
  })

  /* ===== SEEN MESSAGE (FIXED) ===== */
  socket.on("seen", async ({ messageId }) => {
    await Message.findByIdAndUpdate(messageId, { seen: true })
  })

  /* ===== NOTIFICATION ===== */
  socket.on("new-notification", (data) => {
    const target = onlineUsers.get(data.to)
    if (target) {
      io.to(target).emit("notification", data)
    }
  })

  /* ===== GROUP MESSAGE ===== */
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

  /* ===== DISCONNECT ===== */
  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId)
        break
      }
    }

    io.emit("online-users", Array.from(onlineUsers.keys()))
    console.log("User Disconnected:", socket.id)
  })
})

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log("Server running on port", PORT)
})

/* ✅ EXPORT (IMPORTANT) */
module.exports = { io }