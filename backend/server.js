import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import dashboardRoutes from "./routes/dashboardRoutes.js";
import snapshotRoutes from "./routes/snapshotRoutes.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.set("etag", false);

// ------------------------------------------------------
// 🔥 GLOBAL ERROR HANDLERS (VERY IMPORTANT)
// ------------------------------------------------------
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION:", err);
});

// ------------------------------------------------------
// ⭐ GLOBAL CORS
// ------------------------------------------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ------------------------------------------------------
// Body Parsing
// ------------------------------------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ------------------------------------------------------
// 🔥 ROOT HEALTH ROUTE (IMPORTANT FOR RENDER)
// ------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ------------------------------------------------------
// Test Route
// ------------------------------------------------------
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from your backend 🚀" });
});

// ------------------------------------------------------
// Dynamic Model Loading
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsConfigPath = path.resolve(__dirname, "..", "config", "models.json");

let modelsConfig = { enabledModels: [], defaultModel: null };

function loadModelsConfig() {
  try {
    const raw = fs.readFileSync(modelsConfigPath, "utf8");
    modelsConfig = JSON.parse(raw);
    console.log("✅ Loaded models.json");
  } catch (err) {
    console.warn("⚠️ Could not load models config:", err.message);
  }
}

loadModelsConfig();

fs.watchFile(modelsConfigPath, { interval: 1000 }, () => {
  console.log("🔁 models.json changed — reloading...");
  loadModelsConfig();
});

// Models API
app.get("/api/models", (req, res) => {
  res.json(modelsConfig);
});

// ------------------------------------------------------
// Routes
// ------------------------------------------------------
app.use("/api/state", dashboardRoutes);
app.use("/api/snapshots", snapshotRoutes);

// ------------------------------------------------------
// 404 Fallback
// ------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    status: "API running",
    route: req.originalUrl,
    message: "Route not found",
  });
});

// ------------------------------------------------------
// DB + Server Start
// ------------------------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { family: 4 })
  .then(() => {
    console.log("🟢 MongoDB Atlas Connected");

    // ✅ IMPORTANT: use app.listen (NOT http server)
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
