import express from "express";
import DashboardState from "../models/DashboardState.js";
import StateSnapshot from "../models/StateSnapshot.js";

const router = express.Router();

// GET CURRENT STATE
router.get("/", async (req, res) => {
  try {
    const userId = "default";

    let doc = await DashboardState.findOne({ userId });

    if (!doc) {
      doc = await DashboardState.create({ userId });
    }

    res.json(doc);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Error fetching state" });
  }
});

// SAVE STATE + SNAPSHOT
router.put("/", async (req, res) => {
  try {
    const userId = "default";
    let newState = req.body;

    // Save snapshot before update
    await StateSnapshot.create({
      userId,
      state: newState,
    });

    // FIX wd_weight_current
    if (
      newState.wd_weight_current === "null" ||
      newState.wd_weight_current === null
    ) {
      newState.wd_weight_current = null;
    }

    if (typeof newState.wd_weight_current === "string") {
      const parsed = Number(newState.wd_weight_current);
      newState.wd_weight_current = isNaN(parsed) ? null : parsed;
    }

    const updated = await DashboardState.findOneAndUpdate(
      { userId },
      { $set: newState },
      { new: true, upsert: true },
    );

    res.json(updated);
  } catch (err) {
    console.error("PUT ERROR:", err);
    res.status(500).json({ message: "Error saving state" });
  }
});

// 🔥 RESET ALL STATE (Mongo reset)
router.post("/reset", async (req, res) => {
  try {
    const userId = "default";

    // delete main dashboard state
    await DashboardState.deleteMany({ userId });

    // delete snapshots also (otherwise corruption can come back)
    await StateSnapshot.deleteMany({ userId });

    res.json({
      success: true,
      message: "✅ Mongo state + snapshots fully reset",
    });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
