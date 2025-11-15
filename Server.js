require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

// Middleware
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("🍃 MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/posts', authMiddleware, postRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send("💚 CgInsta Backend is running");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⭐ Server running on port ${PORT}`));
