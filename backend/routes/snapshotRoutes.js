import express from "express";
import StateSnapshot from "../models/StateSnapshot.js";
import DashboardState from "../models/DashboardState.js";

const router = express.Router();

/* ================= GET SNAPSHOTS ================= */
router.get("/snapshots", async (req, res) => {
  try {
    const snaps = await StateSnapshot.find({})
      .sort({ createdAt: -1 }) // newest first
      .limit(20) // 🔥 CRITICAL: prevent memory crash
      .select("_id label createdAt userId"); // 🔥 don't pull fullState

    res.json({
      total: snaps.length,
      snapshots: snaps,
    });
  } catch (err) {
    console.error("❌ SNAPSHOT FETCH ERROR:", err.message);
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
