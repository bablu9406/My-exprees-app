require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ---------------- BASIC MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- CREATE HTTP SERVER ---------------- */

const server = http.createServer(app);

/* ---------------- SOCKET.IO SETUP ---------------- */

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Frontend user connect करेगा
  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

/* ----------- SOCKET ACCESSIBLE IN CONTROLLERS ----------- */

app.set("io", io);
app.set("onlineUsers", onlineUsers);

/* ---------------- MONGODB ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/stories", require("./routes/stories"));
app.use("/api/messages", require("./routes/messages"));

/* ---------------- GLOBAL ERROR ---------------- */

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: err.message });
});

/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
