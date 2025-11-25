import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import snapshotRoutes from "./routes/snapshotRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


// Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend is running properly");
});

// API test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from your backend 🚀" });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/state", dashboardRoutes);
app.use("/api/snapshots", snapshotRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);
  });
