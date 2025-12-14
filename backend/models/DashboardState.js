import mongoose from "mongoose";

const DashboardStateSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default", index: true },

    // 🧠 Unified Planner Container
    wd_planner: {
      type: Object,
      default: {
        tasks: [],
        dayMap: {},
        habits: { water: 0, meditate: false, reading: 0 },
        pomodoroSeconds: 1500,
        focusTask: "",
        weatherCity: null,
        weatherCityInput: "",
        weatherStyle: "realistic",
        streak: 0,
      },
    },

    // ===== Core Dashboard State =====
    wd_weight_current: { type: Number, default: null },
    wd_weight_history: { type: Object, default: {} },
    wd_gym_logs: { type: Object, default: {} },
    wd_goals: { type: Object, default: {} },
    wd_done: { type: Object, default: {} },
    syllabus_tree_v2: { type: Object, default: {} },
    wd_projects: { type: Object, default: {} },

    // ===== Misc / Meta =====
    wd_start_weight: { type: Number, default: null },
    wd_mern_progress: { type: Number, default: 0 },
  },
  {
    timestamps: true, // ✅ creates updatedAt automatically
    strict: false, // allow future dynamic keys
    minimize: false, // keep empty objects
  }
);

// ✅ SAFE model export (serverless-friendly)
export default mongoose.models.DashboardState ||
  mongoose.model("DashboardState", DashboardStateSchema);
