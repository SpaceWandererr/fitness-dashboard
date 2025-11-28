import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

console.log("🔥 USING DashboardState from:", import.meta.url);
console.log("🔥 Schema paths:", DashboardState.schema.paths);

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

// ✅ SAVE STATE + SNAPSHOT
router.put("/", async (req, res) => {
  try {
    const userId = USER_ID;
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

      // Convert stringified JSON
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          newState[key] = typeof parsed === "object" ? parsed : {};
        } catch {
          newState[key] = {};
        }
      }

      if (typeof newState[key] !== "object") {
        newState[key] = {};
      }
    });

    // --- STEP 2: FIX BROKEN ARRAY STRUCTURE (MOBILE BUG FIX) ---

    // FIX wd_gym_logs
    if (Array.isArray(newState.wd_gym_logs)) {
      const flatLogs = {};

      newState.wd_gym_logs.forEach((block) => {
        if (typeof block === "object") {
          Object.values(block).forEach((inner) => {
            if (typeof inner === "object") {
              Object.entries(inner).forEach(([date, data]) => {
                flatLogs[date] = data;
              });
            }
          });
        }
      });

      newState.wd_gym_logs = flatLogs;
    }

    // FIX wd_done
    if (Array.isArray(newState.wd_done)) {
      const cleanDone = {};

      newState.wd_done.forEach((block) => {
        if (typeof block === "object") {
          Object.values(block).forEach((inner) => {
            if (typeof inner === "object") {
              Object.assign(cleanDone, inner);
            }
          });
        }
      });

      newState.wd_done = cleanDone;
    }

    // --- STEP 3: FIX WEIGHT HISTORY ---
    if (Array.isArray(newState.wd_weight_history)) {
      const cleanHistory = {};

      newState.wd_weight_history.forEach((entry) => {
        if (entry?.date && entry?.weight) {
          cleanHistory[entry.date] = entry.weight;
        }
      });

      newState.wd_weight_history = cleanHistory;
    }

    // --- STEP 4: FIX CURRENT WEIGHT FORMAT ---
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

    // --- STEP 5: FINAL SAFETY: ENSURE NO ARRAYS SLIP IN ---
    if (Array.isArray(newState.wd_gym_logs)) newState.wd_gym_logs = {};
    if (Array.isArray(newState.wd_done)) newState.wd_done = {};
    if (Array.isArray(newState.wd_goals))
      newState.wd_goals = newState.wd_goals[0] || {};

    // --- STEP 6: CREATE SNAPSHOT ---
    await StateSnapshot.create({
      userId,
      state: newState,
    });

    // --- STEP 7: UPDATE MAIN STATE ---
    const updated = await DashboardState.findOneAndUpdate(
      { userId },
      { $set: newState },
      { new: true, upsert: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ PUT ERROR:", err);
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

// ✅ FETCH SNAPSHOT HISTORY
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
