import mongoose from "mongoose";

const dashboardStateSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default", index: true },

    wd_mern_progress: { type: Object, default: {} },
    wd_weight_current: { type: Number, default: null },
    wd_weight_history: {type: [Object], default: {}},
    wd_gym_logs: { type: [Object], default: {} },
    wd_goals: { type: [Object], default: {} },
    wd_start_weight: { type: Number, default: null },
    wd_done: { type: Object, default: {} },
    syllabus_tree_v2: { type: Object, default: {} },
    wd_dark: { type: String, default: "false" },
  },
  { timestamps: true }
);

export default mongoose.model("DashboardState", dashboardStateSchema);
