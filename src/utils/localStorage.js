const API_URL = "http://localhost:5000/api/state";

// Debounce timer (prevents spamming backend on rapid updates)
let syncTimer = null;

function syncToBackend() {
  // MASTER KILL SWITCH for restore
  if (window.__DISABLE_AUTOSYNC__) {
    console.log("⛔ Autosync DISABLED during restore");
    return;
  }

  const autoSyncEnabled = JSON.parse(
    localStorage.getItem("wd_auto_sync") || "true"
  );

  if (!autoSyncEnabled) {
    console.log("⛔ Auto-sync is OFF. Skipping backend sync.");
    return;
  }

  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = setTimeout(async () => {
    const payload = {
      wd_mern_progress: localStorage.getItem("wd_mern_progress"),
      wd_weight_current: localStorage.getItem("wd_weight_current"),
      wd_weight_history: localStorage.getItem("wd_weight_history"),
      wd_gym_logs: localStorage.getItem("wd_gym_logs"),
      wd_goals: localStorage.getItem("wd_goals"),
      wd_start_weight: localStorage.getItem("wd_start_weight"),
      wd_done: localStorage.getItem("wd_done"),
      syllabus_tree_v2: localStorage.getItem("syllabus_tree_v2"),
      wd_dark: localStorage.getItem("wd_dark"),
    };

    try {
      await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("✅ All data synced to backend");
    } catch (err) {
      console.warn("⚠ Could not sync to backend:", err.message);
    }
  }, 400);
}

export const save = (key, value) => {
  // Save locally like before
  localStorage.setItem(key, JSON.stringify(value));

  // Only trigger sync for your app's system keys
  if (key.startsWith("wd_") || key === "syllabus_tree_v2") {
    syncToBackend();
  }
};

export const load = (key, fallback = null) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
