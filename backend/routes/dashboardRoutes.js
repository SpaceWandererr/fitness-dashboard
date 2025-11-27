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

// SAVE STATE + SNAPSHOT
router.put("/", async (req, res) => {
  try {
    const userId = "default";
    let newState = req.body;

    // --- FIX CORRUPTED STRING FIELDS ---
    const mustBeObject = [
      "wd_done",
      "wd_gym_logs",
      "wd_weight_history",
      "syllabus_tree_v2",
    ];

    mustBeObject.forEach((key) => {
      if (typeof newState[key] === "string") {
        try {
          newState[key] = JSON.parse(newState[key]);
        } catch {
          newState[key] = {};
        }
      }
    });

    // Fix corrupt array formats
    if (Array.isArray(newState.wd_weight_history)) {
      newState.wd_weight_history = newState.wd_weight_history.map((v) => {
        if (typeof v === "string") {
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        }
        return v;
      });
    }

    // Fix weight null/string issues
    if (newState.wd_weight_current === "null")
      newState.wd_weight_current = null;

    if (typeof newState.wd_weight_current === "string") {
      const parsed = Number(newState.wd_weight_current);
      newState.wd_weight_current = isNaN(parsed) ? null : parsed;
    }

    // SAVE SNAPSHOT
    await StateSnapshot.create({
      userId,
      state: newState,
    });

    // UPDATE MAIN STATE
    const updated = await DashboardState.findOneAndUpdate(
      { userId },
      { $set: newState },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("PUT ERROR:", err);
    res.status(500).json({ message: "Error saving state" });
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
