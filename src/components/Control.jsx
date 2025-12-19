import { useEffect, useState, useRef } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fitness-backend-laoe.onrender.com/api/state";
const BACKUP_INDEX_KEY = "wd_state_backups";
const MAX_BACKUPS = 8;
const STORAGE_WARNING_MB = 4;

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

function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024 / 1024).toFixed(2);
}

const Icon = ({ type, className = "" }) => {
  const icons = {
    download: "⬇️",
    upload: "⬆️",
    trash: "🗑️",
    refresh: "🔄",
    clock: "🕐",
    database: "💾",
    alert: "⚠️",
    check: "✓",
    search: "🔍",
    calendar: "📅",
    settings: "⚙️",
    reset: "🔴",
    shield: "🛡️",
    cloud: "☁️",
  };
  return <span className={className}>{icons[type] || "•"}</span>;
};

export default function Control({
  dashboardState,
  setDashboardState,
  updateDashboard,
}) {
  const [backups, setBackups] = useState([]);
  const [filteredBackups, setFilteredBackups] = useState([]);
  const [label, setLabel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [notification, setNotification] = useState(null);
  const [filterTag, setFilterTag] = useState("all");
  const [isResetting, setIsResetting] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupToRestore, setBackupToRestore] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem("wd_auto_backup_enabled") !== "false"
  );
  const [autoBackupFrequency, setAutoBackupFrequency] = useState(
    localStorage.getItem("wd_auto_backup_frequency") || "weekly"
  );

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  function refreshBackups() {
    const loadedBackups = loadBackupIndex();
    setBackups(loadedBackups);
    setFilteredBackups(loadedBackups);
    setStorageUsed(getLocalStorageSize());
  }

  useEffect(() => {
    let filtered = backups.filter((b) =>
      b.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterTag !== "all") {
      filtered = filtered.filter((b) => b.tag === filterTag);
    }

    setFilteredBackups(filtered);
  }, [searchTerm, backups, filterTag]);

  function createBackup(isManual = true, tag = "manual") {
    if (!dashboardState) {
      showNotification("App state not ready yet", "error");
      return;
    }

    const backups = loadBackupIndex();

    const snapshot = {
      id: crypto.randomUUID(),
      label:
        label ||
        (isManual ? "Manual Backup" : `Auto Backup (${autoBackupFrequency})`),
      tag: isManual ? "manual" : "auto",
      createdAt: new Date().toISOString(),
      state: dashboardState,
      size: JSON.stringify(dashboardState).length,
      itemCount: Object.keys(dashboardState).length,
    };

    const next = [snapshot, ...backups].slice(0, MAX_BACKUPS);

    saveBackupIndex(next);
    setLabel("");
    refreshBackups();

    if (isManual) {
      showNotification("Backup created successfully", "success");
    }
  }

  // Trigger restore modal
  function initiateRestore(snapshot) {
    setBackupToRestore(snapshot);
    setShowRestoreModal(true);
  }

  // Actual restore function
  async function restoreBackup() {
    if (!backupToRestore) return;

    setIsRestoring(true);

    try {
      window.__DISABLE_AUTOSYNC__ = true;

      showNotification("Restoring backup...", "success");

      // Step 1: Update local state
      setDashboardState(backupToRestore.state);
      updateDashboard(backupToRestore.state);

      // Step 2: Sync to MongoDB Atlas
      showNotification("Syncing to MongoDB Atlas...", "success");

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backupToRestore.state),
      });

      if (!response.ok) {
        throw new Error("Failed to sync with MongoDB Atlas");
      }

      showNotification("✅ Backup restored successfully!", "success");

      // Step 3: Reload page
      setTimeout(() => {
        window.__DISABLE_AUTOSYNC__ = false;
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error("Restore error:", error);
      showNotification("⚠️ Restore failed. Please try again.", "error");
      window.__DISABLE_AUTOSYNC__ = false;
      setIsRestoring(false);
    }
  }

  function deleteBackup(id) {
    if (!window.confirm("Delete this backup? This cannot be undone.")) return;

    const next = backups.filter((b) => b.id !== id);
    saveBackupIndex(next);
    setBackups(next);
    setFilteredBackups(next); // ✅ Also update filtered list
    showNotification("Backup deleted", "success");
  }

  function deleteAllBackups() {
    if (
      !window.confirm(
        "⚠️ Delete ALL backups?\n\nThis action is permanent and cannot be undone!"
      )
    )
      return;

    saveBackupIndex([]);
    setBackups([]);
    setFilteredBackups([]); // ✅ Also update filtered list
    showNotification("All backups deleted", "success");
  }

  async function globalReset() {
    setShowResetModal(false);
    setIsResetting(true);

    try {
      // Step 1: Create emergency backup in SEPARATE localStorage key
      if (dashboardState && Object.keys(dashboardState).length > 0) {
        showNotification("Creating emergency backup...", "success");

        const emergencyBackup = {
          id: crypto.randomUUID(),
          label: "Emergency Pre-Reset Backup",
          tag: "emergency",
          createdAt: new Date().toISOString(),
          state: dashboardState,
          size: JSON.stringify(dashboardState).length,
          itemCount: Object.keys(dashboardState).length,
        };

        // Store in DIFFERENT key that won't be cleared
        sessionStorage.setItem(
          "wd_emergency_backup",
          JSON.stringify(emergencyBackup)
        );

        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Step 2: Clear localStorage
      showNotification("Clearing localStorage...", "success");
      localStorage.clear();

      // Step 3: Restore emergency backup to backups list
      const emergencyBackup = sessionStorage.getItem("wd_emergency_backup");
      if (emergencyBackup) {
        const backup = JSON.parse(emergencyBackup);
        const backups = [backup];
        localStorage.setItem(BACKUP_INDEX_KEY, JSON.stringify(backups));
        sessionStorage.removeItem("wd_emergency_backup"); // Clean up
        showNotification("Emergency backup preserved!", "success");
      }

      // Step 4: Delete MongoDB Atlas data via backend
      showNotification("Clearing MongoDB Atlas...", "success");

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        showNotification("✅ All data cleared successfully!", "success");
      } else {
        const error = await response.json();
        console.error("Backend delete error:", error);
        showNotification(
          "⚠️ Atlas clear failed, but localStorage cleared",
          "error"
        );
      }
    } catch (error) {
      console.error("Global reset error:", error);
      showNotification("⚠️ Error connecting to server", "error");
    } finally {
      setIsResetting(false);

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  function exportBackup(snapshot) {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            meta: {
              exportedAt: new Date().toISOString(),
              app: "LifeOS",
              version: 2,
              label: snapshot.label,
            },
            snapshot,
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeos-${snapshot.label.replace(
      /\s+/g,
      "-"
    )}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Backup exported", "success");
  }

  function exportAllBackups() {
    if (backups.length === 0) {
      showNotification("No backups to export", "error");
      return;
    }

    const blob = new Blob(
      [
        JSON.stringify(
          { backups, exportedAt: new Date().toISOString() },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeos-all-backups-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("All backups exported", "success");
  }

  function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result);

        if (json.snapshot?.state) {
          initiateRestore(json.snapshot);
        } else if (json.backups && Array.isArray(json.backups)) {
          const merged = [...json.backups, ...backups].slice(0, MAX_BACKUPS);
          saveBackupIndex(merged);
          refreshBackups();
          showNotification(
            `Imported ${json.backups.length} backups`,
            "success"
          );
        } else {
          throw new Error("Invalid format");
        }
      } catch {
        showNotification("Invalid backup file", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // COMPLETELY FIXED: Auto-backup logic - runs ONLY ONCE on mount
  useEffect(() => {
    // Load backups first
    refreshBackups();

    // Check if we should create an auto-backup
    if (!autoBackupEnabled || !dashboardState) {
      console.log("Auto-backup disabled or no dashboard state");
      return;
    }

    const now = new Date();
    const lastAuto = localStorage.getItem("wd_last_auto_backup");

    let shouldBackup = false;

    if (!lastAuto) {
      // First time - create backup
      console.log("🆕 First auto-backup");
      shouldBackup = true;
    } else {
      const lastAutoDate = new Date(lastAuto);

      switch (autoBackupFrequency) {
        case "hourly":
          const hoursDiff = (now - lastAutoDate) / (1000 * 60 * 60);
          if (hoursDiff >= 1) {
            console.log(
              `⏰ Hourly backup due (${hoursDiff.toFixed(1)} hours since last)`
            );
            shouldBackup = true;
          }
          break;

        case "daily":
          const lastDateStr = lastAutoDate.toDateString();
          const nowDateStr = now.toDateString();
          if (lastDateStr !== nowDateStr) {
            console.log(
              `📅 Daily backup due (last: ${lastDateStr}, now: ${nowDateStr})`
            );
            shouldBackup = true;
          }
          break;

        case "weekly":
          const isSunday = now.getDay() === 0;
          const lastWasToday =
            lastAutoDate.toDateString() === now.toDateString();
          if (isSunday && !lastWasToday) {
            console.log(
              `📅 Weekly backup due (Sunday, last: ${lastAutoDate.toDateString()})`
            );
            shouldBackup = true;
          }
          break;
      }
    }

    if (shouldBackup) {
      console.log(`✅ Creating ${autoBackupFrequency} auto-backup now`);
      createBackup(false, "auto");
      localStorage.setItem("wd_last_auto_backup", now.toISOString());
    } else {
      console.log(
        `⏭️ Auto-backup not needed yet (frequency: ${autoBackupFrequency})`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - run once on mount when dashboardState is available

  function toggleAutoBackup() {
    const newState = !autoBackupEnabled;
    setAutoBackupEnabled(newState);
    localStorage.setItem("wd_auto_backup_enabled", newState.toString());
    showNotification(
      `Auto-backup ${newState ? "enabled" : "disabled"}`,
      "success"
    );
  }

  function changeAutoBackupFrequency(frequency) {
    setAutoBackupFrequency(frequency);
    localStorage.setItem("wd_auto_backup_frequency", frequency);

    // Clear last backup timestamp so new frequency takes effect immediately on next check
    localStorage.removeItem("wd_last_auto_backup");

    showNotification(`Auto-backup frequency set to ${frequency}`, "success");
  }

  function openPreview(backup) {
    setSelectedBackup(backup);
    setShowPreview(true);
  }

  const availableTags = ["all", "manual", "auto", "emergency"]; // ✅ All tags included

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 text-[#E8FFFA]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-emerald-900/90 border border-emerald-500"
              : "bg-red-900/90 border border-red-500"
          }`}
        >
          <Icon type={notification.type === "success" ? "check" : "alert"} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#9FF2E8] flex items-center gap-3">
            <Icon type="settings" className="text-2xl" />
            Control Panel
          </h1>
          <p className="text-[#7FAFA4]">
            Manage backups, restore states, and monitor storage
          </p>
        </div>

        {/* Global Reset Button */}
        <button
          onClick={() => setShowResetModal(true)}
          disabled={isResetting}
          className="px-5 py-2.5 bg-gradient-to-r from-red-900 to-red-700 border-2 border-red-500 rounded-lg hover:from-red-800 hover:to-red-600 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon type="reset" />
          {isResetting ? "Resetting..." : "Global Reset"}
        </button>
      </div>

      {/* Storage Monitor */}
      <div className="mb-6 p-4 border border-[#2F6B60] rounded-xl bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Icon type="database" />
            <h3 className="font-semibold">Storage Usage</h3>
          </div>
          <span className="text-sm text-[#7FAFA4]">
            {storageUsed} MB / 5 MB
          </span>
        </div>
        <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storageUsed > STORAGE_WARNING_MB
                ? "bg-red-500"
                : "bg-gradient-to-r from-[#064E3B] to-[#3FA796]"
            }`}
            style={{ width: `${Math.min((storageUsed / 5) * 100, 100)}%` }}
          />
        </div>
        {storageUsed > STORAGE_WARNING_MB && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <Icon type="alert" />
            Storage is running low. Consider deleting old backups.
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Create Backup */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Backup Card */}
          <div className="p-5 border border-[#2F6B60] rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon type="database" />
              Create Backup
            </h2>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter backup label..."
              className="w-full mb-4 p-3 rounded-lg bg-black/60 border border-[#2F6B60] focus:border-[#3FA796] focus:outline-none transition-colors"
            />

            <button
              onClick={() => createBackup(true)}
              className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-[#064E3B] to-[#0c7660] border border-[#3FA796] rounded-lg hover:from-[#0c7660] hover:to-[#064E3B] transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Icon type="database" />
              Backup Now
            </button>

            <label className="w-full block px-4 py-3 border border-blue-500 text-blue-400 rounded-lg cursor-pointer hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2 font-medium">
              <Icon type="upload" />
              Import Backup
              <input
                type="file"
                accept=".json"
                onChange={importBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Auto-Backup Settings */}
          <div className="p-5 border border-[#2F6B60] rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon type="calendar" />
              Auto-Backup Settings
            </h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#7FAFA4]">Enable Auto-Backup</span>
              <button
                onClick={toggleAutoBackup}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoBackupEnabled ? "bg-[#3FA796]" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoBackupEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {autoBackupEnabled && (
              <div className="mb-3">
                <label className="block text-xs text-[#7FAFA4] mb-2">
                  Backup Frequency
                </label>
                <select
                  value={autoBackupFrequency}
                  onChange={(e) => changeAutoBackupFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#2F6B60] focus:border-[#3FA796] focus:outline-none text-sm"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Sunday)</option>
                </select>
              </div>
            )}

            <p className="text-xs text-[#7FAFA4]">
              {autoBackupEnabled
                ? `Automatic backups will run ${
                    autoBackupFrequency === "hourly"
                      ? "every hour"
                      : autoBackupFrequency === "daily"
                      ? "daily"
                      : "every Sunday"
                  }`
                : "Automatic backups are currently disabled"}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="p-5 border border-[#2F6B60] rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#7FAFA4]">Total Backups</span>
                <span className="font-semibold">{backups.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7FAFA4]">Manual Backups</span>
                <span className="font-semibold">
                  {backups.filter((b) => b.tag === "manual").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7FAFA4]">Auto Backups</span>
                <span className="font-semibold">
                  {backups.filter((b) => b.tag === "auto").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Backup History */}
        <div className="lg:col-span-2">
          <div className="p-5 border border-[#2F6B60] rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm">
            {/* Header with Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Icon type="clock" />
                Backup History ({filteredBackups.length})
              </h2>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7FAFA4]">
                    <Icon type="search" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search backups..."
                    className="w-full sm:w-48 pl-10 pr-3 py-2 rounded-lg bg-black/60 border border-[#2F6B60] focus:border-[#3FA796] focus:outline-none text-sm"
                  />
                </div>

                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-black/60 border border-[#2F6B60] focus:border-[#3FA796] focus:outline-none text-sm"
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            {backups.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={exportAllBackups}
                  className="px-3 py-2 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-900/20 transition-all text-sm flex items-center gap-2"
                >
                  <Icon type="download" />
                  Export All
                </button>
                <button
                  onClick={deleteAllBackups}
                  className="px-3 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-900/20 transition-all text-sm flex items-center gap-2"
                >
                  <Icon type="trash" />
                  Delete All
                </button>
                <button
                  onClick={refreshBackups}
                  className="px-3 py-2 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-900/20 transition-all text-sm flex items-center gap-2"
                >
                  <Icon type="refresh" />
                  Refresh
                </button>
              </div>
            )}

            {/* Backup List */}
            {filteredBackups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">
                  <Icon type="database" />
                </div>
                <p className="text-[#7FAFA4]">
                  {searchTerm
                    ? "No backups found matching your search"
                    : "No backups yet. Create your first backup above!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredBackups.map((b) => (
                  <div
                    key={b.id}
                    className="group p-4 border border-[#2F6B60]/70 rounded-lg bg-black/40 hover:bg-black/60 hover:border-[#3FA796]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-[#9FF2E8]">
                            {b.label}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              b.tag === "auto"
                                ? "bg-blue-900/50 text-blue-300 border border-blue-500/30"
                                : "bg-emerald-900/50 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {b.tag}
                          </span>
                        </div>
                        <p className="text-xs text-[#7FAFA4] flex items-center gap-2">
                          <Icon type="clock" />
                          {new Date(b.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <p className="text-xs text-[#7FAFA4] mt-1">
                          {b.itemCount || 0} items •{" "}
                          {((b.size || 0) / 1024).toFixed(2)} KB
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openPreview(b)}
                          className="px-3 py-1.5 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-900/20 transition-all text-sm"
                        >
                          👁️ Preview
                        </button>
                        <button
                          onClick={() => initiateRestore(b)} // Changed from restoreBackup(b)
                          disabled={isRestoring}
                          className="px-3 py-1.5 border border-amber-500 text-amber-400 rounded-lg hover:bg-amber-900/20 transition-all text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon type="refresh" />
                          {isRestoring ? "Restoring..." : "Restore"}
                        </button>

                        <button
                          onClick={() => exportBackup(b)}
                          className="px-3 py-1.5 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-900/20 transition-all text-sm flex items-center gap-1"
                        >
                          <Icon type="download" />
                          Export
                        </button>
                        <button
                          onClick={() => deleteBackup(b.id)}
                          className="px-3 py-1.5 border border-red-500 text-red-400 rounded-lg hover:bg-red-900/20 transition-all text-sm flex items-center gap-1"
                        >
                          <Icon type="trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Reset Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="bg-[#0a1f1a] border-2 border-red-500 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl shadow-red-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-900/40 to-red-800/20">
              <div className="flex items-center gap-3 mb-2">
                <Icon type="alert" className="text-3xl" />
                <h3 className="text-2xl font-bold text-red-400">
                  Global Reset
                </h3>
              </div>
              <p className="text-sm text-red-200/70">
                <Icon type="shield" /> This will clear ALL data from
                localStorage AND MongoDB Atlas
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                  <Icon type="alert" />
                  What will be permanently deleted:
                </h4>
                <ul className="text-sm text-[#7FAFA4] space-y-1.5 ml-6 list-disc">
                  <li>All workout logs and fitness data</li>
                  <li>Weight history and progress tracking</li>
                  <li>All study topics and syllabus progress</li>
                  <li>Projects, goals, and planner data</li>
                  <li>All created backups (localStorage only)</li>
                  <li>Application preferences and settings</li>
                  <li>
                    <Icon type="cloud" /> MongoDB Atlas database (server-side
                    data)
                  </li>
                </ul>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  <Icon type="alert" />
                  Warning:
                </h4>
                <p className="text-sm text-red-200/70">
                  <Icon type="shield" /> An emergency backup will be created
                  before reset
                </p>
              </div>

              <p className="text-xs text-[#7FAFA4] text-center italic">
                ⚠️ This action is PERMANENT and cannot be undone!
              </p>
            </div>

            <div className="p-6 border-t border-red-500/30 flex gap-3 bg-black/40">
              <button
                onClick={globalReset}
                disabled={isResetting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-900 to-red-700 border border-red-500 rounded-lg hover:from-red-800 hover:to-red-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon type="reset" />
                {isResetting ? "Resetting..." : "Yes, Reset Everything"}
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="px-6 py-3 border border-[#2F6B60] rounded-lg hover:bg-black/60 transition-all font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedBackup && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-[#0a1f1a] border border-[#2F6B60] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#2F6B60] flex justify-between items-center">
              <h3 className="text-lg font-semibold">Backup Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[#7FAFA4] hover:text-[#E8FFFA] text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <p className="text-sm text-[#7FAFA4]">Label</p>
                <p className="font-medium">{selectedBackup.label}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-[#7FAFA4]">Created</p>
                <p className="font-medium">
                  {new Date(selectedBackup.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-[#7FAFA4]">Size</p>
                <p className="font-medium">
                  {((selectedBackup.size || 0) / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-[#7FAFA4]">Data Preview</p>
                <pre className="mt-2 p-3 bg-black/60 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(selectedBackup.state, null, 2).slice(0, 1000)}
                  {JSON.stringify(selectedBackup.state, null, 2).length > 1000
                    ? "\n..."
                    : ""}
                </pre>
              </div>
            </div>
            <div className="p-5 border-t border-[#2F6B60] flex gap-3">
              <button
                onClick={() => {
                  initiateRestore(selectedBackup);
                  setShowPreview(false);
                }}
                disabled={isRestoring}
                className="flex-1 px-4 py-2 bg-[#064E3B] border border-[#3FA796] rounded-lg hover:bg-[#0c7660] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon type="refresh" />
                {isRestoring ? "Restoring..." : "Restore This Backup"}
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-[#2F6B60] rounded-lg hover:bg-black/40 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && backupToRestore && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isRestoring && setShowRestoreModal(false)}
        >
          <div
            className="bg-[#0a1f1a] border-2 border-amber-500 rounded-xl max-w-md w-full overflow-hidden shadow-2xl shadow-amber-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-900/40 to-amber-800/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon type="alert" className="text-3xl" />
                  <h3 className="text-2xl font-bold text-amber-400">
                    Restore Backup
                  </h3>
                </div>
                {/* Add close button */}
                {!isRestoring && (
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    className="text-[#7FAFA4] hover:text-[#E8FFFA] text-2xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-sm text-amber-200/70">
                This will overwrite your current state
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Backup Info Card */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-amber-300 mb-1">
                        {backupToRestore.label}
                      </p>
                      <div className="space-y-1 text-xs text-[#7FAFA4]">
                        <p className="flex items-center gap-2">
                          <Icon type="clock" />
                          {new Date(backupToRestore.createdAt).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                        <p>
                          {backupToRestore.itemCount || 0} items •{" "}
                          {((backupToRestore.size || 0) / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        backupToRestore.tag === "auto"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-500/30"
                          : backupToRestore.tag === "emergency"
                          ? "bg-red-900/50 text-red-300 border border-red-500/30"
                          : "bg-emerald-900/50 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {backupToRestore.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                  <Icon type="alert" />
                  Warning:
                </h4>
                <ul className="text-sm text-[#7FAFA4] space-y-1 ml-6 list-disc">
                  <li>Current state will be overwritten</li>
                  <li>This action cannot be undone</li>
                  <li>All unsaved changes will be lost</li>
                  <li>MongoDB Atlas will be updated</li>
                </ul>
              </div>

              {isRestoring && (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-sm text-emerald-300 flex items-center gap-2">
                    <Icon type="refresh" />
                    <span className="animate-pulse">
                      Restoring backup and syncing to cloud...
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-amber-500/30 flex gap-3 bg-black/40">
              <button
                onClick={restoreBackup}
                disabled={isRestoring}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-900 to-amber-700 border border-amber-500 rounded-lg hover:from-amber-800 hover:to-amber-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon type="refresh" />
                {isRestoring ? "Restoring..." : "Yes, Restore Backup"}
              </button>
              <button
                onClick={() => setShowRestoreModal(false)}
                disabled={isRestoring}
                className="px-6 py-3 border border-[#2F6B60] rounded-lg hover:bg-black/60 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2f6b60;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3fa796;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
