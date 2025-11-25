import mongoose from "mongoose";

const stateSnapshotSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    state: { type: Object, required: true }, // all wd_* stuff
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("StateSnapshot", stateSnapshotSchema);
