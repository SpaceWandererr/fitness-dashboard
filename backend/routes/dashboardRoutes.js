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

    /* =========================
       1) FIX OBJECT-TYPE KEYS
       ========================= */
    const mustBeObject = [
      "wd_done",
      "wd_gym_logs",
      "wd_weight_history",
      "syllabus_tree_v2",
      "wd_goals",
    ];

    mustBeObject.forEach((key) => {
      const val = newState[key];

      if (val === undefined || val === null || val === "" || val === "null") {
        newState[key] = {};
        return;
      }
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          newState[key] =
            typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
        } catch {
          newState[key] = {};
        }
      }
      if (typeof newState[key] !== "object" || Array.isArray(newState[key])) {
        newState[key] = {};
      }
    });

    /* =========================
       2) FIX SPECIAL SYLLABUS KEYS
       ========================= */

    // syllabus_meta → MUST remain object as React sends it
    if (
      typeof newState.syllabus_meta !== "object" ||
      Array.isArray(newState.syllabus_meta)
    ) {
      newState.syllabus_meta = {};
    }

    // syllabus_notes → MUST remain object
    if (
      typeof newState.syllabus_notes !== "object" ||
      Array.isArray(newState.syllabus_notes)
    ) {
      newState.syllabus_notes = {};
    }

    // syllabus_streak → MUST be a REAL array
    if (!Array.isArray(newState.syllabus_streak)) {
      newState.syllabus_streak = [];
    }

    // syllabus_lastStudied → string
    if (newState.syllabus_lastStudied == null) {
      newState.syllabus_lastStudied = "";
    } else {
      newState.syllabus_lastStudied = String(newState.syllabus_lastStudied);
    }

    /* =========================
       3) FIX BROKEN WD_GYM_LOGS
       ========================= */
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

    /* =========================
       4) FIX WD_DONE
       ========================= */
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

    /* =========================
       5) FIX WEIGHT HISTORY
       ========================= */
    if (Array.isArray(newState.wd_weight_history)) {
      const cleanHistory = {};
      newState.wd_weight_history.forEach((entry) => {
        if (entry?.date && entry?.weight) {
          cleanHistory[entry.date] = entry.weight;
        }
      });
      newState.wd_weight_history = cleanHistory;
    }

    /* =========================
       6) FIX CURRENT WEIGHT
       ========================= */
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

    /* =========================
       7) SAFETY CLEANUP
       ========================= */
    if (Array.isArray(newState.wd_goals)) {
      newState.wd_goals = newState.wd_goals[0] || {};
    }

    /* =========================
       8) CREATE SNAPSHOT
       ========================= */
    await StateSnapshot.create({
      userId,
      state: newState,
    });

    /* =========================
       9) UPDATE MAIN STATE
       ========================= */
    const updated = await DashboardState.findOneAndUpdate(
      { userId },
      { $set: newState },
      { new: true, upsert: true }
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
