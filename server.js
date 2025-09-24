require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const postRoutes = require('./routes/posts.js');
const userRoutes = require('./routes/users.js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not set in environment variables');
    process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message || err);
        process.exit(1);
    });

// Routes
app.use('/auth', authRoutes);   // /auth/register , /auth/login
app.use('/posts', postRoutes);  // /posts , /posts/:id
app.use('/users', userRoutes);  // follow/unfollow, profile

app.get('/', (req, res) => res.send('✅ CGinsta Backend is running'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
