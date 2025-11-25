import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

const router = express.Router();

// GET LAST 20 SNAPSHOTS
router.get("/", async (req, res) => {
  try {
    const snapshots = await StateSnapshot.find({ userId: "default" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(snapshots);
  } catch (err) {
    console.error("SNAPSHOT GET ERROR:", err);
    res.status(500).json({ message: "Error loading history" });
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
router.post("/restore/:id", async (req, res) => {
  try {
    console.log("RESTORE REQUEST ID:", req.params.id);

    const snap = await StateSnapshot.findById(req.params.id);

    if (!snap) {
      return res.status(404).json({ message: "Snapshot not found" });
    }

    if (!snap.state) {
      return res.status(500).json({ message: "Snapshot state missing" });
    }

    let cleanState = { ...snap.state };

    // ✅ FIX wrong values
    if (cleanState.wd_weight_current === "null") {
      cleanState.wd_weight_current = null;
    }

    if (typeof cleanState.wd_weight_current === "string") {
      const parsed = parseFloat(cleanState.wd_weight_current);
      cleanState.wd_weight_current = isNaN(parsed) ? null : parsed;
    }

    console.log("CLEAN STATE:", cleanState);

    const updatedState = await DashboardState.findOneAndUpdate(
      { userId: "default" },
      { $set: cleanState },
      { new: true, upsert: true }
    );

    console.log("✅ State successfully restored");

    res.json({
      success: true,
      updatedState,
    });
  } catch (err) {
    console.error("RESTORE ERROR FULL:", err);
    res.status(500).json({ message: "Error restoring snapshot", error: err });
  }
});

// 🔴 YOU ARE MISSING THIS LINE
export default router;
