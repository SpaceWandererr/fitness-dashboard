import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://fitness-backend-laoe.onrender.com";

const API_STATE = `${API_BASE}/api/state`;
const API_SNAPSHOTS = `${API_BASE}/api/snapshots`;

export default function Control() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [label, setLabel] = useState("");
  const [cloudOnline, setCloudOnline] = useState(false);
  const [autoSync, setAutoSync] = useState(
    JSON.parse(localStorage.getItem("wd_auto_sync") || "true")
  );

  /* ================= CLOUD STATUS ================= */
  async function checkCloud() {
    try {
      const res = await fetch(API_STATE);
      setCloudOnline(res.ok);
    } catch {
      setCloudOnline(false);
    }
  }

  /* ================= LOAD SNAPSHOTS ================= */
  async function loadSnapshots() {
    setLoading(true);

    try {
      const res = await fetch(API_SNAPSHOTS);
      const data = await res.json();

      const safeSnapshots = Array.isArray(data.snapshots) ? data.snapshots : [];

      setSnapshots(safeSnapshots);

      console.log("✅ Snapshots loaded:", safeSnapshots.length);
    } catch (err) {
      console.error("Error loading snapshots:", err);
      setSnapshots([]);
    }

    setLoading(false);
  }

  /* ================= AUTO SYNC TOGGLE ================= */
  function toggleAutoSync() {
    const newVal = !autoSync;
    setAutoSync(newVal);
    localStorage.setItem("wd_auto_sync", JSON.stringify(newVal));
  }

  /* ================= CLOUD SYNC ================= */
  async function syncNow() {
    setSyncing(true);

    // ⚠️ Skip heavy keys to prevent Quota crash
    const payload = {
      wd_mern_progress: localStorage.getItem("wd_mern_progress"),
      wd_weight_current: localStorage.getItem("wd_weight_current"),
      wd_weight_history: localStorage.getItem("wd_weight_history"),
      wd_start_weight: localStorage.getItem("wd_start_weight"),
      wd_done: localStorage.getItem("wd_done"),
      syllabus_tree_v2: localStorage.getItem("syllabus_tree_v2"),
      wd_dark: localStorage.getItem("wd_dark"),
      label: label,
    };

    try {
      const res = await fetch(API_STATE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Sync failed");

      console.log("✅ All data synced to backend");

      setLabel("");
      loadSnapshots();
      alert("✅ Synced and backup created!");
    } catch (err) {
      console.error("❌ Sync error:", err);
      alert("❌ Cloud sync failed. Check console.");
    }

    setSyncing(false);
  }

  /* ================= RESTORE SNAPSHOT ================= */
  async function restoreSnapshot(id) {
    const confirmRestore = window.confirm(
      "This will overwrite your data with this cloud backup.\nContinue?"
    );

    if (!confirmRestore) return;

    try {
      console.log("🔄 Restoring snapshot:", id);

      window.__DISABLE_AUTOSYNC__ = true;

      const res = await fetch(`${API_SNAPSHOTS}/restore/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("❌ Restore failed");
        return;
      }

      localStorage.clear();

      Object.entries(data.updatedState).forEach(([key, value]) => {
        if (["_id", "__v", "userId"].includes(key)) return;
        localStorage.setItem(key, value);
      });

      alert("✅ Snapshot restored! Reloading...");

      setTimeout(() => window.location.reload(), 600);

      setTimeout(() => {
        window.__DISABLE_AUTOSYNC__ = false;
      }, 3000);
    } catch (err) {
      console.error("❌ Restore crash:", err);
      alert("❌ Restore failed. Check console.");
    }
  }

  /* ================= LOCAL EXPORT ================= */
  function exportLocalBackup() {
    const data = {
      wd_mern_progress: localStorage.getItem("wd_mern_progress"),
      wd_weight_current: localStorage.getItem("wd_weight_current"),
      wd_weight_history: localStorage.getItem("wd_weight_history"),
      wd_start_weight: localStorage.getItem("wd_start_weight"),
      wd_done: localStorage.getItem("wd_done"),
      syllabus_tree_v2: localStorage.getItem("syllabus_tree_v2"),
      wd_dark: localStorage.getItem("wd_dark"),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mywebsite-backup-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /* ================= LOCAL IMPORT ================= */
  function importLocalBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);

        const confirmRestore = window.confirm(
          "This will overwrite your current data.\nContinue?"
        );

        if (!confirmRestore) return;

        localStorage.clear();
        Object.entries(json).forEach(([key, value]) => {
          if (key === "timestamp") return;
          localStorage.setItem(key, value);
        });

        alert("✅ Local backup restored!");
        window.location.reload();
      } catch (err) {
        alert("❌ Invalid backup file");
      }
    };

    reader.readAsText(file);
  }

  useEffect(() => {
    loadSnapshots();
    checkCloud();

    const timer = setInterval(checkCloud, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[80vh] p-6 text-[#E8FFFA]">
      <h1 className="text-2xl font-bold mb-6 text-[#9FF2E8]">
        Control Panel 🧠
      </h1>

      <div className="mb-6 flex items-center gap-3">
        <span>Cloud Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            cloudOnline ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {cloudOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="mb-8 p-4 border border-[#2F6B60] rounded-xl bg-black/30">
        <h2 className="text-lg font-semibold mb-3">Cloud Sync</h2>

        <input
          type="text"
          placeholder="Label this backup..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mb-3 w-full p-2 rounded bg-black/40 border border-[#2F6B60]"
        />

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={toggleAutoSync}
            className={`px-4 py-2 border rounded-lg transition
            ${
              autoSync
                ? "border-green-500 text-green-400 hover:bg-green-900/30"
                : "border-gray-500 text-gray-400 hover:bg-gray-900/30"
            }
          `}
          >
            Auto Sync: {autoSync ? "ON" : "OFF"}
          </button>

          <button
            onClick={syncNow}
            disabled={syncing}
            className="px-4 py-2 bg-[#064E3B] border border-[#3FA796] rounded-lg hover:bg-[#0c7660] transition"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>

          <button
            onClick={exportLocalBackup}
            className="px-4 py-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900/30 transition"
          >
            Export Backup
          </button>

          <label className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-900/30 transition">
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={importLocalBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="p-4 border border-[#2F6B60] rounded-xl bg-black/30">
        <h2 className="text-lg font-semibold mb-4">Backup History</h2>

        {loading ? (
          <p className="text-[#7FAFA4]">Loading backups...</p>
        ) : snapshots.length === 0 ? (
          <p className="text-[#7FAFA4]">No backups yet.</p>
        ) : (
          snapshots.map((snap) => (
            <div
              key={snap._id}
              className="flex justify-between items-center p-3 border border-[#2F6B60]/50 rounded-lg bg-black/40 mb-2"
            >
              <div>
                <p className="font-medium">
                  {snap.label || "Untitled Backup"} —{" "}
                  {new Date(snap.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-[#7FAFA4]">{snap._id}</p>
              </div>

              <button
                onClick={() => restoreSnapshot(snap._id)}
                className="px-3 py-1.5 border border-red-500 text-red-400 rounded-md hover:bg-red-950 transition"
              >
                Restore
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
