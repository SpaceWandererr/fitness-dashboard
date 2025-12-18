import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

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
      wd_planner: {
        ...(existing.wd_planner || {}),
        ...(incoming.wd_planner || {}),
      },
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
      { new: true, upsert: true },
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
  try {
    const userId = USER_ID;
    const doc = await DashboardState.findOne({ userId });

    if (!doc) {
      console.log("🆕 Creating new DB state");
      const newDoc = await DashboardState.create({ userId });
      return res.json(newDoc);
    }

    res.json(doc.toObject());
  } catch (err) {
    console.error("🔥 GET ERROR:", err);
    res.status(500).json({
      message: "Error fetching state",
      error: err.message,
    });
  }
});

/***************************************
 * 🔴 DELETE STATE (GLOBAL RESET)
 ***************************************/
router.delete("/", async (req, res) => {
  try {
    const userId = USER_ID;

    // Delete the main dashboard state
    const dashboardResult = await DashboardState.deleteMany({ userId });

    // Also delete any snapshots/backups stored in MongoDB (optional)
    const snapshotResult = await StateSnapshot.deleteMany({ userId });

    console.log(`✅ Global Reset Complete:`);
    console.log(
      `   - Dashboard states deleted: ${dashboardResult.deletedCount}`,
    );
    console.log(`   - Snapshots deleted: ${snapshotResult.deletedCount}`);

    res.status(200).json({
      success: true,
      message: "All data cleared from MongoDB Atlas",
      deleted: {
        dashboardStates: dashboardResult.deletedCount,
        snapshots: snapshotResult.deletedCount,
        total: dashboardResult.deletedCount + snapshotResult.deletedCount,
      },
    });
  } catch (error) {
    console.error("❌ Error clearing Atlas data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear database",
      details: error.message,
    });
  }
});

export default router;
