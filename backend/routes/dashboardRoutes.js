import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

const router = express.Router();
const USER_ID = "default";

// ✅ GET current dashboard state
router.get("/", async (req, res) => {
  try {
    let state = await DashboardState.findOne({ userId: USER_ID });

    if (!state) {
      state = await DashboardState.create({ userId: USER_ID });
    }

    res.json(state);
  } catch (err) {
    console.error("❌ GET ERROR:", err);
    res.status(500).json({ error: "Failed to fetch dashboard state" });
  }
});

// ✅ SAVE dashboard state + snapshot
router.put("/", async (req, res) => {
  try {
    let newState = req.body;

    // backup snapshot before update
    await StateSnapshot.create({
      userId: USER_ID,
      state: newState,
    });

    // 🧹 Fix corrupted weight values
    if (
      newState.wd_weight_current === "null" ||
      newState.wd_weight_current === null ||
      newState.wd_weight_current === ""
    ) {
      newState.wd_weight_current = null;
    }

    if (typeof newState.wd_weight_current === "string") {
      const parsed = Number(newState.wd_weight_current);
      newState.wd_weight_current = isNaN(parsed) ? null : parsed;
    }

    const updated = await DashboardState.findOneAndUpdate(
      { userId: USER_ID },
      { $set: newState },
      { new: true, upsert: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ PUT ERROR:", err);
    res.status(500).json({ error: "Failed to save dashboard state" });
  }
});

// ✅ FULL RESET (Dashboard + Snapshots)
router.post("/reset", async (req, res) => {
  try {
    await DashboardState.deleteMany({ userId: USER_ID });
    await StateSnapshot.deleteMany({ userId: USER_ID });

    res.json({
      success: true,
      message: "✅ Mongo Dashboard + Snapshots wiped clean",
    });
  } catch (err) {
    console.error("❌ RESET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Optional: export snapshot history
router.get("/snapshots", async (req, res) => {
  try {
    const snaps = await StateSnapshot.find({ userId: USER_ID })
      .sort({ createdAt: -1 })
      .limit(25);

    res.json({ snapshots: snaps });
  } catch (err) {
    console.error("❌ SNAPSHOT ERROR:", err);
    res.status(500).json({ error: "Failed to fetch snapshots" });
  }
});

export default router;
