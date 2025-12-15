import { useEffect, useState } from "react";

/**
 * ===============================
 * ENHANCED CONTROL PANEL v2.0 (No Dependencies)
 * ===============================
 */

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

// Simple icon components
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
  const [storageUsed, setStorageUsed] = useState(0);
  const [notification, setNotification] = useState(null);
  const [filterTag, setFilterTag] = useState("all");
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    localStorage.getItem("wd_auto_backup_enabled") !== "false",
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
      b.label.toLowerCase().includes(searchTerm.toLowerCase()),
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
      label: label || (isManual ? "Manual Backup" : "Auto Backup (Sunday)"),
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

  function restoreBackup(snapshot) {
    if (
      !window.confirm(
        `⚠️ This will overwrite your current state.\n\nRestore "${snapshot.label}"?\n\nCreated: ${new Date(snapshot.createdAt).toLocaleString()}`,
      )
    )
      return;

    window.__DISABLE_AUTOSYNC__ = true;
    setDashboardState(snapshot.state);
    updateDashboard(snapshot.state);

    showNotification("Backup restored successfully", "success");

    setTimeout(() => {
      window.__DISABLE_AUTOSYNC__ = false;
      window.location.reload();
    }, 600);
  }

  function deleteBackup(id) {
    if (!window.confirm("Delete this backup? This cannot be undone.")) return;

    const next = backups.filter((b) => b.id !== id);
    saveBackupIndex(next);
    setBackups(next);
    showNotification("Backup deleted", "success");
  }

  function deleteAllBackups() {
    if (
      !window.confirm(
        "⚠️ Delete ALL backups?\n\nThis action is permanent and cannot be undone!",
      )
    )
      return;

    saveBackupIndex([]);
    setBackups([]);
    showNotification("All backups deleted", "success");
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
          2,
        ),
      ],
      { type: "application/json" },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lifeos-${snapshot.label.replace(/\s+/g, "-")}-${Date.now()}.json`;
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
          2,
        ),
      ],
      { type: "application/json" },
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
          restoreBackup(json.snapshot);
        } else if (json.backups && Array.isArray(json.backups)) {
          const merged = [...json.backups, ...backups].slice(0, MAX_BACKUPS);
          saveBackupIndex(merged);
          refreshBackups();
          showNotification(
            `Imported ${json.backups.length} backups`,
            "success",
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

  useEffect(() => {
    refreshBackups();

    if (!autoBackupEnabled) return;

    const today = new Date();
    const isSunday = today.getDay() === 0;
    const lastAuto = localStorage.getItem("wd_last_auto_backup");

    if (isSunday && lastAuto !== today.toDateString()) {
      createBackup(false, "auto");
      localStorage.setItem("wd_last_auto_backup", today.toDateString());
    }
  }, []);

  function toggleAutoBackup() {
    const newState = !autoBackupEnabled;
    setAutoBackupEnabled(newState);
    localStorage.setItem("wd_auto_backup_enabled", newState.toString());
    showNotification(
      `Auto-backup ${newState ? "enabled" : "disabled"}`,
      "success",
    );
  }

  function openPreview(backup) {
    setSelectedBackup(backup);
    setShowPreview(true);
  }

  const availableTags = ["all", "manual", "auto"];

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#9FF2E8] flex items-center gap-3">
          <Icon type="settings" className="text-2xl" />
          Control Panel
        </h1>
        <p className="text-[#7FAFA4]">
          Manage backups, restore states, and monitor storage
        </p>
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
              Auto-Backup
            </h2>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#7FAFA4]">Weekly on Sunday</span>
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

            <p className="text-xs text-[#7FAFA4]">
              {autoBackupEnabled
                ? "Automatic backups will be created every Sunday"
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
                          onClick={() => restoreBackup(b)}
                          className="px-3 py-1.5 border border-amber-500 text-amber-400 rounded-lg hover:bg-amber-900/20 transition-all text-sm flex items-center gap-1"
                        >
                          <Icon type="refresh" />
                          Restore
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
                  restoreBackup(selectedBackup);
                  setShowPreview(false);
                }}
                className="flex-1 px-4 py-2 bg-[#064E3B] border border-[#3FA796] rounded-lg hover:bg-[#0c7660] transition-all"
              >
                Restore This Backup
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
