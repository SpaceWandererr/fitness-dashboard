import express from "express";
import StateSnapshot from "../models/StateSnapshot.js";
import DashboardState from "../models/DashboardState.js";

const router = express.Router();

/* ================= GET SNAPSHOTS ================= */
router.get("/", async (req, res) => {
  try {
    const snapshots = await StateSnapshot.find({}, { fullState: 0 }) // ⬅ don't send heavy data
      .sort({ createdAt: -1 })
      .limit(20); // ⬅ avoid loading thousands

    res.json({ snapshots });
  } catch (e) {
    console.error("❌ SNAPSHOT FETCH ERROR:", e);
    res
      .status(500)
      .json({ message: "Error loading history", error: e.message });
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
