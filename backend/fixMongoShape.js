import mongoose from "mongoose";
import DashboardState from "./models/DashboardState.js";
import dotenv from "dotenv";

dotenv.config();

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const states = await DashboardState.find({});

    for (const doc of states) {
      let updated = false;

      // ✅ Fix gym logs
      if (Array.isArray(doc.wd_gym_logs)) {
        console.log("Fixing wd_gym_logs for user:", doc.userId);

        const merged = doc.wd_gym_logs.reduce(
          (acc, obj) => ({ ...acc, ...obj }),
          {},
        );

        doc.wd_gym_logs = merged;
        updated = true;
      }

      // ✅ Fix done state
      if (Array.isArray(doc.wd_done)) {
        console.log("Fixing wd_done for user:", doc.userId);

        const merged = doc.wd_done.reduce(
          (acc, obj) => ({ ...acc, ...obj }),
          {},
        );

        doc.wd_done = merged;
        updated = true;
      }

      // ✅ Fix goals
      if (Array.isArray(doc.wd_goals)) {
        console.log("Fixing wd_goals for user:", doc.userId);

        doc.wd_goals = doc.wd_goals[0] || {};
        updated = true;
      }

      // ✅ Fix weight history
      if (Array.isArray(doc.wd_weight_history)) {
        console.log("Fixing wd_weight_history for user:", doc.userId);

        const merged = doc.wd_weight_history.reduce(
          (acc, obj) => ({ ...acc, ...obj }),
          {},
        );

        doc.wd_weight_history = merged;
        updated = true;
      }

      if (updated) {
        await doc.save();
        console.log("✅ Fixed document:", doc.userId);
      }
    }

    console.log("🎉 MongoDB cleanup complete");
    process.exit();
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

fix();
