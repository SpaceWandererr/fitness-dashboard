import mongoose from "mongoose";


if (mongoose.models.DashboardState) {
  delete mongoose.models.DashboardState;
  delete mongoose.modelSchemas.DashboardState;
}

const DashboardStateSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default" },

    wd_weight_current: { type: Number, default: null },

    wd_weight_history: { type: Object, default: {} },
    wd_gym_logs: { type: Object, default: {} },
    wd_goals: { type: Object, default: {} },

    wd_done: { type: Object, default: {} },
    syllabus_tree_v2: { type: Object, default: {} },
    wd_projects: { type: Object, default: {} }, // <-- REQUIRED FIX

    wd_start_weight: Number,
    wd_dark: String,
    wd_mern_progress: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DashboardState", DashboardStateSchema);
