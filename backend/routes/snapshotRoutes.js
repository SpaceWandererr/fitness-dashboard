import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

const router = express.Router();

// GET LAST 20 SNAPSHOTS
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("📥 GET /api/snapshots");
    console.log("👤 User:", userId || "none");
    console.log("🔌 Mongo State:", StateSnapshot.db.readyState);

    // Optional: safe default user
    const safeUserId = userId || "default";

    const snapshots = await StateSnapshot.find({ userId: safeUserId })
      .sort({ createdAt: -1 })
      .lean();

    console.log("✅ Snapshots fetched:", snapshots.length);

    res.json(Array.isArray(snapshots) ? snapshots : []);
  } catch (error) {
    console.error("❌ SNAPSHOT FETCH ERROR:", error);

    res.status(500).json({
      message: "Error loading history",
      error: error.message,
      name: error.name,
    });
  }
});

// Helper to safely clean broken values
function safeValue(val, fallback = "{}") {
  if (val === undefined || val === null || val === "") {
    return fallback;
  }
  return val;
}

// RESTORE SNAPSHOT
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("📥 GET /api/snapshots");
    console.log("UserId received:", userId);

    let query = {};

    // If userId is sent, filter by it
    if (userId) {
      query.userId = userId;
    }

    const snapshots = await StateSnapshot.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log("✅ Snapshots found:", snapshots.length);

    res.json(Array.isArray(snapshots) ? snapshots : []);
  } catch (error) {
    console.error("❌ Snapshot error:", error);

    res.status(500).json({
      message: "Error loading history",
      error: error.message,
    });
  }
});


// 🔴 YOU ARE MISSING THIS LINE
export default router;
