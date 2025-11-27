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
// RESET ALL DASHBOARD STATE
router.post("/api/state/reset", async (req, res) => {
  try {
    const userId = "default"; // keep same as your other logic

    // if you're using a specific model like DashboardState or StateSnapshot:
    await DashboardState.deleteMany({ userId });

    // OR if your model is named differently:
    // await StateSnapshot.deleteMany({ userId });

    return res.json({
      success: true,
      message: "All dashboard state reset from MongoDB ✅",
    });
  } catch (err) {
    console.error("Reset state error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
