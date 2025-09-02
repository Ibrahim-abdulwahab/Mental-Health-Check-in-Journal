const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: errors.join(", ") });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      status: "fail",
      message: "Duplicate field value entered",
      field: Object.keys(err.keyValue)[0],
      value: Object.values(err.keyValue)[0],
    });
  }

  // Fallback for other errors
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
