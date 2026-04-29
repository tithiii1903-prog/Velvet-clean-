require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const orderRoutes = require('./routes/orders');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const distPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("⚠️ dist folder not found");
}
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dry_laundry';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Laundry Server is running' });
});
app.get("/", (req, res) => {
  res.send("Velvet Clean API is running 🚀");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

