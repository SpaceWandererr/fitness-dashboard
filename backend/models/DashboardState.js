import mongoose from "mongoose";

if (mongoose.models.DashboardState) {
  delete mongoose.models.DashboardState;
  delete mongoose.modelSchemas.DashboardState;
}

const DashboardStateSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "default" },

    // 🆕 Unified Planner Container
    wd_planner: {
      type: Object,
      default: {
        tasks: [],
        dayMap: {}, // dynamic days
        habits: { water: 0, meditate: false, reading: 0 },
        pomodoroSeconds: 1500,
        focusTask: "",
        weatherCity: null,
        weatherCityInput: "",
        weatherStyle: "realistic",
        streak: 0,
      },
    },

    // ===== Existing Dashboard Keys =====
    wd_weight_current: { type: Number, default: null },
    wd_weight_history: { type: Object, default: {} },
    wd_gym_logs: { type: Object, default: {} },
    wd_goals: { type: Object, default: {} },
    wd_done: { type: Object, default: {} },
    syllabus_tree_v2: { type: Object, default: {} },
    wd_projects: { type: Object, default: {} },

    // Misc
    wd_start_weight: Number,
    wd_dark: String,
    wd_mern_progress: Number,
  },
  {
    timestamps: true,
    strict: false, // allows growth / new dynamic fields
    minimize: false, // keeps empty {} instead of deleting
  }
);

export default mongoose.model("DashboardState", DashboardStateSchema);
