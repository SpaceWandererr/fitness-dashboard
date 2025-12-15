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

export function save(key, value) {
  try {
    const stored = typeof value === "string" ? value : JSON.stringify(value);

    localStorage.setItem(key, stored);
  } catch (err) {
    console.warn("⚠ Storage full, trimming:", key);

    // 🔥 prevent app crash
    if (key === "wd_gym_logs") {
      localStorage.setItem(key, "[]");
    }
    if (key === "syllabus_tree_v2") {
      localStorage.removeItem(key);
    }
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

