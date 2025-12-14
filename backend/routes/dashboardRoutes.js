import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

// Add this function at the top of dashboardRoutes.js, after imports
function flatten(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      Object.assign(result, flatten(obj[key], fullKey));
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}

const router = express.Router();
const USER_ID = "default";

/***************************************
 * 🔥 Utility: Safe JSON Parse
 ***************************************/
const safeParse = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;

  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/***************************************
 * 🔥 FIXED PUT ROUTE (SAVE STATE)
 ***************************************/
router.put("/", async (req, res) => {
  try {
    const userId = USER_ID;
    let incoming = req.body;

    // 🛑 PROTECT AGAINST NESTED STATE
    if (incoming.state) {
      console.warn("⚠️ Nested state detected, flattening");
      incoming = incoming.state;
    }

    // 🔥 Parse wd_planner if it's a string
    if (incoming.wd_planner && typeof incoming.wd_planner === "string") {
      try {
        incoming.wd_planner = JSON.parse(incoming.wd_planner);
      } catch (err) {
        console.log("❌ wd_planner parse failed:", err);
      }
    }

    console.log("📩 Incoming update:", JSON.stringify(incoming, null, 2));

    const existingDoc = await DashboardState.findOne({ userId });
    const existing = existingDoc ? existingDoc.toObject() : {};

    const mergedState = {
      ...existing,
      ...incoming,
      updatedAt: new Date().toISOString(),
    };

    // ❌ REMOVE MONGOOSE META
    delete mergedState._id;
    delete mergedState.__v;

    // 🧹 HARD DELETE LEGACY KEYS (THIS WAS MISSING)
    if ("wd_dark" in mergedState) {
      console.log("🧹 Purging wd_dark from merged state");
      delete mergedState.wd_dark;
    }

    const updated = await DashboardState.findOneAndUpdate(
      { userId },
      { $set: mergedState },
      { new: true, upsert: true }
    );

    console.log("✅ Saved:", updated);
    res.json(updated);
  } catch (err) {
    console.error("🔥 PUT ERROR FULL:", err);
    res.status(500).json({
      message: "Error saving state",
      error: err.message,
    });
  }
});

/***************************************
 * GET STATE
 ***************************************/
router.get("/", async (req, res) => {
  const userId = USER_ID;
  const doc = await DashboardState.findOne({ userId });

  if (!doc) {
    console.log("🆕 Creating new DB state");
    const newDoc = await DashboardState.create({ userId });
    return res.json(newDoc);
  }

  res.json(doc);
});

export default router;
