require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
const { router: authRoutes, seedAdmin } = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;
 

app.use(cors());
app.use(express.json());

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dry_laundry";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Laundry Server is running" });
});

// Catch-all route to serve the frontend index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});