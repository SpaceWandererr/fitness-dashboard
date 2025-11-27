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

    // --- KEYS THAT MUST ALWAYS BE OBJECTS ---
    const mustBeObject = [
      "wd_done",
      "wd_gym_logs",
      "wd_weight_history",
      "syllabus_tree_v2",
      "wd_goals",
    ];

    // --- STEP 1: FIX STRINGIFIED + NULL VALUES ---
    mustBeObject.forEach((key) => {
      const val = newState[key];

      if (val === undefined || val === null || val === "" || val === "null") {
        newState[key] = {};
        return;
      }

      // Convert stringified JSON to real object
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          newState[key] = typeof parsed === "object" ? parsed : {};
        } catch {
          newState[key] = {};
        }
      }

      // Force object if wrong type
      if (typeof newState[key] !== "object") {
        newState[key] = {};
      }
    });

    // --- STEP 2: FIX BAD ARRAY STRUCTURE (mobile issue) ---

    // Fix wd_gym_logs: flatten nested arrays into final object
    if (Array.isArray(newState.wd_gym_logs)) {
      const flatLogs = {};

      newState.wd_gym_logs.forEach((level1) => {
        if (typeof level1 === "object") {
          Object.values(level1).forEach((level2) => {
            if (typeof level2 === "object") {
              Object.entries(level2).forEach(([date, data]) => {
                flatLogs[date] = data;
              });
            }
          });
        }
      });

      newState.wd_gym_logs = flatLogs;
    }

    // Fix wd_done: also flatten if corrupted
    if (Array.isArray(newState.wd_done)) {
      const cleanDone = {};

      newState.wd_done.forEach((level1) => {
        if (typeof level1 === "object") {
          Object.values(level1).forEach((level2) => {
            if (typeof level2 === "object") {
              Object.assign(cleanDone, level2);
            }
          });
        }
      });

      newState.wd_done = cleanDone;
    }

    // --- STEP 3: FIX wd_weight_history FORMAT ---
    if (Array.isArray(newState.wd_weight_history)) {
      const weightObj = {};

      newState.wd_weight_history.forEach((entry) => {
        if (entry && typeof entry === "object" && entry.date && entry.weight) {
          weightObj[entry.date] = entry.weight;
        }
      });

      newState.wd_weight_history = weightObj;
    }

    // --- STEP 4: FIX CURRENT WEIGHT ---
    if (
      newState.wd_weight_current === "null" ||
      newState.wd_weight_current === undefined ||
      newState.wd_weight_current === ""
    ) {
      newState.wd_weight_current = null;
    } else if (typeof newState.wd_weight_current === "string") {
      const parsed = Number(newState.wd_weight_current);
      newState.wd_weight_current = isNaN(parsed) ? null : parsed;
    }

    // --- STEP 5: CREATE SNAPSHOT ---
    await StateSnapshot.create({
      userId,
      state: newState,
    });

    // --- STEP 6: UPDATE MAIN STATE ---
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
