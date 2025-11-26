const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fitness-backend-laoe.onrender.com/api/state";



// Debounce timer (prevents spamming backend on rapid updates)
let syncTimer = null;

function safeParse(value) {
  // ✅ If it's already an object, don't even warn
  if (typeof value === "object" && value !== null) {
    return value;
  }

  // ✅ If it's a string, try to parse
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      // Only warn for REAL broken JSON
      console.warn("⚠ Corrupt backend JSON skipped:", value);
      return null;
    }
  }

  // ❌ For everything else (undefined, weird stuff)
  return null;
}

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

export function save(key, value) {
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);

    // Prevent huge writes
    if (data.length > 300000) {
      console.warn("⚠ Skipping save, data too large:", key);
      return;
    }

    localStorage.setItem(key, data);
    window.dispatchEvent(new Event("lifeos:update"));
    syncToBackend();
  } catch (e) {
    console.warn("⚠ Save failed:", key, e.message);
  }
}



export function load(key, fallback = null) {
  try {
    const s = localStorage.getItem(key);
    if (!s) return fallback;

    const parsed = safeParse(s);

    if (parsed === null) return fallback;

    return parsed;
  } catch (e) {
    return fallback;
  }
}

