import mongoose from "mongoose";

const StateSnapshotSchema = new mongoose.Schema({
  label: { type: String },
  state: { type: Object }, // ✅ use state, not fullState
  userId: { type: String, default: "default" },
  createdAt: { type: Date, default: Date.now },
});

StateSnapshotSchema.index({ createdAt: -1 });

export default mongoose.model("StateSnapshot", StateSnapshotSchema);
