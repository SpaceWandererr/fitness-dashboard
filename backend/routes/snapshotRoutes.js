import express from "express";
import StateSnapshot from "../models/StateSnapshot.js";
import DashboardState from "../models/DashboardState.js";

const router = express.Router();

/* ================= GET SNAPSHOTS ================= */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};

    // Only fetch light data
    const snapshots = await StateSnapshot.find(query, {
      state: 0, // don't send full giant state
      fullState: 0,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    console.log("✅ Snapshots fetched:", snapshots.length);

    res.json({
      snapshots: Array.isArray(snapshots) ? snapshots : [],
    });
  } catch (err) {
    console.error("❌ Snapshot fetch error:", err);
    res.status(500).json({
      message: "Error loading history",
      error: err.message,
    });
  }
});

/* ================= RESTORE SNAPSHOT ================= */
router.post("/restore/:id", async (req, res) => {
  try {
    const snap = await StateSnapshot.findById(req.params.id).lean();

    if (!snap) {
      return res.status(404).json({ message: "Snapshot not found" });
    }

    const cleanState = snap.state || snap.fullState;
    if (!cleanState) {
      return res.status(400).json({ message: "Snapshot data missing" });
    }

    const updated = await DashboardState.findOneAndUpdate(
      { userId: "default" },
      { $set: cleanState },
      { new: true, upsert: true }
    );

    console.log("✅ Snapshot restored");

    res.json({
      success: true,
      updatedState: updated,
    });
  } catch (err) {
    console.error("❌ Restore error:", err);
    res.status(500).json({
      message: "Error restoring snapshot",
      error: err.message,
    });
  }
});

export default router;
