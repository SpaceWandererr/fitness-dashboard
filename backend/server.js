import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http"; // ✅ Important for Render (Fix HTTP2 bug)

// Routes
import dashboardRoutes from "./routes/dashboardRoutes.js";
import snapshotRoutes from "./routes/snapshotRoutes.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.set("etag", false);

// ------------------- CORS FIX (Render + Frontend) -------------------
// ---- CORS FIX ----
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://fitness-dashboard-laoe.vercel.app",
  "https://fitness-frontend.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Preflight response
app.options("*", cors());

// Extra CORS header layer (important)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Stop OPTION request from going to route handlers
  if (req.method === "OPTIONS") {
    return res.status(204).send();
  }

  next();
});

// ---------------------- Body Parsing ----------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ---------------------- Test Routes ----------------------
app.all("(/*)?", (req, res) => {
  res.json({ status: "API running" });
});


app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from your backend 🚀" });
});

// ---------------------- Models Config ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsConfigPath = path.resolve(__dirname, "..", "config", "models.json");

let modelsConfig = { enabledModels: [], defaultModel: null };

function loadModelsConfig() {
  try {
    const raw = fs.readFileSync(modelsConfigPath, "utf8");
    modelsConfig = JSON.parse(raw);
    console.log(`✅ Loaded models.json from ${modelsConfigPath}`);
  } catch (err) {
    console.warn("⚠️ Could not load models config:", err.message);
  }
}

loadModelsConfig();

fs.watchFile(modelsConfigPath, { interval: 1000 }, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    console.log("🔁 models.json changed — reloading...");
    loadModelsConfig();
  }
});

app.get("/api/models", (req, res) => {
  res.json(modelsConfig);
});

// ---------------------- Routes ----------------------
app.use("/api/state", dashboardRoutes);
app.use("/api/snapshots", snapshotRoutes);

// ---------------------- Database & Server Start ----------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app); // ✅ Use HTTP server

mongoose
  .connect(MONGO_URI, { family: 4 }) // IPv4 fix
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));
