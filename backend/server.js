import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import snapshotRoutes from "./routes/snapshotRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

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

// Serve models config to clients
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsConfigPath = path.resolve(__dirname, "..", "config", "models.json");

let modelsConfig = { enabledModels: [], defaultModel: null };

function loadModelsConfig() {
  try {
    const raw = fs.readFileSync(modelsConfigPath, "utf8");
    modelsConfig = JSON.parse(raw);
    console.log(`✅ Loaded models config from ${modelsConfigPath}`);
  } catch (err) {
    console.warn(`⚠️ Could not load models config at ${modelsConfigPath}:`, err.message);
    modelsConfig = { enabledModels: [], defaultModel: null };
  }
}

// initial load
loadModelsConfig();

// watch for changes and reload on change
fs.watchFile(modelsConfigPath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    console.log("🔁 models.json changed — reloading...");
    loadModelsConfig();
  }
});

app.get("/api/models", (req, res) => {
  res.json(modelsConfig);
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/state", dashboardRoutes);
app.use("/api/snapshots", snapshotRoutes);

mongoose
  .connect(MONGO_URI, {
    family: 4   // 🔥 Forces IPv4 and fixes Render DNS issue
  })
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
