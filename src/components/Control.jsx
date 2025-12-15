import { useEffect, useState } from "react";

/**
 * ===============================
 * CONTROL PANEL (STATE BACKUPS)
 * ===============================
 * ✔ Backups REAL dashboardState (truth of the app)
 * ✔ No backend calls
 * ✔ Weekly auto-backup (Sunday)
 * ✔ Manual backup / restore
 * ✔ Export / import JSON
 * ✔ App.jsx remains single source of sync
 */

const BACKUP_INDEX_KEY = "wd_state_backups";
const MAX_BACKUPS = 8;

function loadBackupIndex() {
  try {
    return JSON.parse(localStorage.getItem(BACKUP_INDEX_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveBackupIndex(list) {
  localStorage.setItem(BACKUP_INDEX_KEY, JSON.stringify(list));
}

export default function Control({
  dashboardState,
  setDashboardState,
  updateDashboard,
}) {
  const [backups, setBackups] = useState([]);
  const [label, setLabel] = useState("");

  /* ================= LOAD BACKUPS ================= */
  function refreshBackups() {
    setBackups(loadBackupIndex());
  }

  /* ================= CREATE BACKUP ================= */
  function createBackup(isManual = true) {
    if (!dashboardState) {
      alert("❌ App state not ready yet");
      return;
    }

    const backups = loadBackupIndex();

    const snapshot = {
      id: crypto.randomUUID(),
      label: label || (isManual ? "Manual Backup" : "Auto Backup (Sunday)"),
      createdAt: new Date().toISOString(),
      state: dashboardState,
    };

    const next = [snapshot, ...backups].slice(0, MAX_BACKUPS);

    saveBackupIndex(next);
    setLabel("");
    refreshBackups();

    if (isManual) {
      alert("✅ Backup created");
    }
  }

  /* ================= RESTORE BACKUP ================= */
  function restoreBackup(snapshot) {
    const ok = window.confirm(
      "This will overwrite your current app state.\nContinue?",
    );
    if (!ok) return;

    // ⛔ Stop autosync during restore
    window.__DISABLE_AUTOSYNC__ = true;

    // 1️⃣ Restore state in memory
    setDashboardState(snapshot.state);

    // 2️⃣ Push restored state to backend (if online)
    updateDashboard(snapshot.state);

    alert("✅ Backup restored. Reloading...");

    setTimeout(() => {
      window.__DISABLE_AUTOSYNC__ = false;
      window.location.reload();
    }, 600);
  }

  /* ================= DELETE BACKUP ================= */
  function deleteBackup(id) {
    const next = backups.filter((b) => b.id !== id);
    saveBackupIndex(next);
    setBackups(next);
  }

  /* ================= EXPORT BACKUP ================= */
  function exportBackup(snapshot) {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            meta: {
              exportedAt: new Date().toISOString(),
              app: "LifeOS",
              version: 1,
            },
            snapshot,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeos-backup-${snapshot.createdAt}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ================= IMPORT BACKUP ================= */
  function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);
        if (!json.snapshot?.state) {
          throw new Error("Invalid backup format");
        }
        restoreBackup(json.snapshot);
      } catch {
        alert("❌ Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  /* ================= AUTO BACKUP (SUNDAY) ================= */
  useEffect(() => {
    refreshBackups();

    const today = new Date();
    const isSunday = today.getDay() === 0;
    const lastAuto = localStorage.getItem("wd_last_auto_backup");

    if (isSunday && lastAuto !== today.toDateString()) {
      createBackup(false);
      localStorage.setItem("wd_last_auto_backup", today.toDateString());
    }
  }, []);

  return (
    <div className="min-h-[80vh] p-6 text-[#E8FFFA]">
      <h1 className="text-2xl font-bold mb-6 text-[#9FF2E8]">
        Control Panel 🧠
      </h1>

      {/* CREATE BACKUP */}
      <div className="mb-6 p-4 border border-[#2F6B60] rounded-xl bg-black/30">
        <h2 className="text-lg font-semibold mb-3">Create Backup</h2>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Optional label..."
          className="w-full mb-3 p-2 rounded bg-black/40 border border-[#2F6B60]"
        />

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => createBackup(true)}
            className="px-4 py-2 bg-[#064E3B] border border-[#3FA796] rounded-lg hover:bg-[#0c7660]"
          >
            Backup Now
          </button>

          <label className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-lg cursor-pointer hover:bg-yellow-900/30">
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={importBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* BACKUP HISTORY */}
      <div className="p-4 border border-[#2F6B60] rounded-xl bg-black/30">
        <h2 className="text-lg font-semibold mb-4">Backup History</h2>

        {backups.length === 0 ? (
          <p className="text-[#7FAFA4]">No backups yet.</p>
        ) : (
          backups.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center p-3 border border-[#2F6B60]/50 rounded-lg bg-black/40 mb-2"
            >
              <div>
                <p className="font-medium">
                  {b.label} — {new Date(b.createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-[#7FAFA4]">
                  {Object.keys(b.state || {}).length} keys
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => restoreBackup(b)}
                  className="px-3 py-1 border border-red-500 text-red-400 rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => exportBackup(b)}
                  className="px-3 py-1 border border-blue-500 text-blue-400 rounded"
                >
                  Export
                </button>
                <button
                  onClick={() => deleteBackup(b.id)}
                  className="px-3 py-1 border border-gray-500 text-gray-400 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
