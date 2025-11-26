const mongoose = require("mongoose");

const StateSnapshotSchema = new mongoose.Schema({
  label: { type: String },
  fullState: { type: Object },
  userId: { type: String, default: "default" },
  createdAt: { type: Date, default: Date.now },
});

// 🔥 Index for faster sorting & less memory use
StateSnapshotSchema.index({ createdAt: -1 });

module.exports = mongoose.model("StateSnapshot", StateSnapshotSchema);
