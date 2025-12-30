import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
// Backend API base
// Updated Calendar — with: selected glow (neon blue), today highlight,
// compact "no exercises" handling, light-theme color fixes, monthly stats,
// hover popup, smooth animations, and Quote replaced with Today's Stats.

function todayISO() {
  return dayjs().format("YYYY-MM-DD");
}

// Combined extractor (backend-only, no localStorage)
function combinedExercisesForDate(iso, gymLogsState) {
  const g = gymLogsState?.[iso];
  if (!g) return [];

  const extract = (arr) =>
    (arr || []).filter((ex) => ex && ex.done).map((ex) => ex.name);

  return [...extract(g.left), ...extract(g.right), ...extract(g.finisher)];
}

function renderExercises(iso, gymLogsState) {
  const entry = gymLogsState?.[iso];
  if (!entry) return null;

  // If backend already stores exercises in cleanedExercises
  if (Array.isArray(entry.cleanedExercises)) {
    if (!entry.cleanedExercises.length) return null;

    return (
      <ul className="list-disc list-inside text-sm space-y-1">
        {entry.cleanedExercises.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    );
  }

  // If not, fallback to basic combined extraction
  const extracted = combinedExercisesForDate(iso, gymLogsState);
  if (!extracted.length) return null;

  return (
    <ul className="list-disc list-inside text-sm space-y-1">
      {extracted.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );
}

export default function CalendarFullDarkUpdated({
  syllabus_tree_v2 = {},
  gymLogs = {},
  doneMap = {},
  notesMap = {},
  bmiLogs = [],
  updateDashboard,
}) {
  const [month, setMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [view, setView] = useState("calendar");
  const [compareDates, setCompareDates] = useState([null, null]);
  const [showResetModal, setShowResetModal] = useState(false);

  // Add state for loading
  const [isResetting, setIsResetting] = useState(false);

  // Toast helper function
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    const bgColor =
      type === "success"
        ? "bg-emerald-500/90"
        : type === "error"
        ? "bg-red-500/90"
        : "bg-orange-500/90";

    toast.className = `fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg ${bgColor} text-white text-sm font-medium shadow-lg transition-all duration-300`;
    toast.style.animation = "slideIn 0.3s ease-out";
    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Handle reset with proper error handling
  async function handleReset() {
    setIsResetting(true);

    try {
      await resetGymProgress();
      setShowResetModal(false);
      showToast("✓ Gym progress reset successfully", "success");
    } catch (error) {
      console.error("Reset error:", error);
      showToast("⚠️ Reset failed. Please try again.", "error");
    } finally {
      setIsResetting(false);
    }
  }

  const studyMap = useMemo(() => {
    const out = {};

    function walk(node) {
      if (!node) return;

      // Agar array hai toh ye leaf topics list hai
      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (it && it.done && it.completedOn) {
            // 🔑 completedOn ko sirf date (YYYY-MM-DD) me convert karo
            let dayKey = "";

            if (typeof it.completedOn === "string") {
              // ISO string hai: "2025-12-06T15:45:21.123Z" → "2025-12-06"
              dayKey = it.completedOn.slice(0, 10);
            } else {
              // Safety fallback
              dayKey = dayjs(it.completedOn).format("YYYY-MM-DD");
            }

            if (!dayKey) return;

            if (!out[dayKey]) out[dayKey] = [];
            out[dayKey].push(it.title || it.name || "Topic");
          }
        });
        return;
      }

      // Agar object hai, toh andar jao
      Object.values(node || {}).forEach(walk);
    }

    walk(syllabus_tree_v2 || {});
    return out;
  }, [syllabus_tree_v2]);

  const days = useMemo(() => {
    const start = month.startOf("month").startOf("week");
    return Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  }, [month]);

  function getDayStatusStr(dateStr) {
    const hasStudy = studyMap[dateStr] && studyMap[dateStr].length > 0;
    const hasGym = !!gymLogs[dateStr];
    if (hasStudy && hasGym) return "both";
    if (hasStudy) return "study";
    if (hasGym) return "gym";
    return "none";
  }

  function openDay(d) {
    setSelectedDate(d.format("YYYY-MM-DD"));
  }

  const streakInfo = useMemo(() => {
    const done = doneMap || {};
    const today = dayjs();

    // Current streak (count backwards from today)
    let current = 0;
    for (let i = 0; i < 365; i++) {
      const key = today.subtract(i, "day").format("YYYY-MM-DD");
      if (done[key]) current++;
      else break;
    }

    // Longest streak (scan entire history)
    let longest = 0;
    let running = 0;

    const keys = Object.keys(done).sort(); // chronological order

    for (const k of keys) {
      if (done[k]) {
        running++;
        longest = Math.max(longest, running);
      } else {
        running = 0;
      }
    }

    const percent = longest ? Math.round((current / longest) * 100) : 0;

    return { current, longest, percent };
  }, [doneMap]);

  const weeklyData = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = dayjs().subtract(i, "day");
      const iso = d.format("YYYY-MM-DD");
      arr.push({
        date: d.format("DD MMM"),
        study: (studyMap[iso] || []).length,
        gym: gymLogs[iso] ? 1 : 0,
        iso,
      });
    }
    return arr;
  }, [studyMap, gymLogs]);

  function combinedExercisesForDateWrapper(iso) {
    return combinedExercisesForDate(iso, gymLogs);
  }

  function setCompareSlot(idx, date) {
    setCompareDates((prev) => {
      const next = [...prev];
      next[idx] = date;
      return next;
    });
  }

  function saveNoteForDate(date, text) {
    const next = { ...notesMap, [date]: text };
    updateDashboard({ wd_notes_v1: next });
  }

  function exportAll() {
    const payload = {
      syllabus: syllabus_tree_v2 || {},
      gymLogs: gymLogs || {},
      doneMap: doneMap || {},
      bmiLogs: bmiLogs || [],
      notes: notesMap || {},
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dashboard-backup-${dayjs().format("YYYYMMDD")}.json`;
    a.click();
  }

  async function importAll(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);

        const payload = {
          syllabus_tree_v2: data.syllabus || {},
          wd_gym_logs: data.gymLogs || {},
          wd_done: data.doneMap || {},
          bmi_logs: data.bmiLogs || [],
          wd_notes_v1: data.notes || {},
        };

        // Push to backend
        await fetch(`${API}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // Update UI state
        setSyllabus(payload.syllabus_tree_v2);
        setGymLogs(payload.wd_gym_logs);
        setDoneMap(payload.wd_done);
        setBmiLogs(payload.bmi_logs);
        setNotesMap(payload.wd_notes_v1);

        alert("Import successful!");
      } catch (err) {
        console.error(err);
        alert("Import failed.");
      }
    };

    reader.readAsText(file);
  }

  /* ---------- Reset gym progress (calendar button / quick reset) -------------- */
  const resetGymProgress = async () => {
    // 🔑 SINGLE SOURCE OF TRUTH RESET
    const updates = {
      wd_gym_logs: {},
      wd_done: {},
      wd_goals: {
        targetWeight: "",
        currentWeight: "",
      },
      wd_weight_overrides: {}, // include if used anywhere
    };

    // 🚀 App.jsx handles localStorage + backend sync
    updateDashboard(updates);
  };

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const start = month.startOf("month");
    const end = month.endOf("month");

    let topics = 0;
    let exercises = 0;

    for (
      let d = start;
      d.isBefore(end) || d.isSame(end, "day");
      d = d.add(1, "day")
    ) {
      const iso = d.format("YYYY-MM-DD");

      topics += (studyMap[iso] || []).length;
      exercises += combinedExercisesForDate(iso, gymLogs).length;
    }

    return { topics, exercises };
  }, [month, studyMap, gymLogs]);

  const todayStats = useMemo(() => {
    const iso = todayISO();

    const topics = (studyMap[iso] || []).length;
    const exercises = combinedExercisesForDate(iso, gymLogs).length;

    const g = gymLogs?.[iso] || {};

    return {
      topics,
      exercises,
      calories: g.calories || "—",
      weight: g.weight || "—",
      bmi: g.bmi || "—",
    };
  }, [studyMap, gymLogs]);

  // Add these state declarations at the top with your other useState hooks
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Hover popup content
  function handleMouseEnterDate(e, iso) {
    setHoveredDate(iso);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({ x: rect.right + 8, y: rect.top });
  }
  function handleMouseLeaveDate() {
    setHoveredDate(null);
  }

  const selectedStudy = studyMap[selectedDate] || [];
  const selectedGym = gymLogs[selectedDate] || {};
  const selectedExercises = combinedExercisesForDateWrapper(selectedDate);
  const selectedNote = notesMap[selectedDate] || "";

  // Extract target muscle groups from exercise names
  const getTargetMuscles = (date) => {
    if (!gymLogs[date]) return [];

    const exercises = combinedExercisesForDateWrapper(date);
    const muscleKeywords = {
      Chest: ["Press", "Bench", "Fly", "Push"],
      Back: ["Pull", "Row", "Deadlift", "Lat"],
      Shoulders: ["Shoulder", "Raise", "Shrug", "Overhead"],
      Arms: ["Curl", "Tricep", "Bicep"],
      Legs: ["Squat", "Lunge", "Leg", "Calf"],
      Core: ["Plank", "Crunch", "Ab", "Core"],
    };

    const muscles = new Set();
    exercises.forEach((ex) => {
      Object.entries(muscleKeywords).forEach(([muscle, keywords]) => {
        if (
          keywords.some((kw) => ex.toLowerCase().includes(kw.toLowerCase()))
        ) {
          muscles.add(muscle);
        }
      });
    });

    return Array.from(muscles);
  };

  // Check if this workout has a personal record
  const hasPersonalRecord = (date) => {
    if (!gymLogs[date]) return false;
    // Add your PR logic here based on your data structure
    // Example: check if weight/reps exceed previous records
    return false; // Placeholder
  };

  // Get PR details
  const getPRDetails = (date) => {
    // Return details about what record was broken
    return "New max weight on Bench Press!"; // Placeholder
  };

  // Extract study categories from topic names
  const getStudyCategories = (topics) => {
    const categoryKeywords = {
      "Web Dev": [
        "HTTP",
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "API",
        "Browser",
        "VPN",
        "SSL",
        "TLS",
      ],
      Networking: ["TCP", "UDP", "IP", "Network", "Protocol", "Proxy", "VPN"],
      Security: ["Encryption", "SSL", "TLS", "Security", "HTTPS"],
      Backend: ["Server", "Database", "API", "Node", "Express"],
      Frontend: ["React", "CSS", "HTML", "UI", "Component"],
    };

    const categories = new Set();
    topics.forEach((topic) => {
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        if (keywords.some((kw) => topic.includes(kw))) {
          categories.add(category);
        }
      });
    });

    return Array.from(categories);
  };

  return (
    <div
      className="w-full max-w-[1300px] mx-auto p-3 overflow-x-hidden
      grid grid-cols-1 gap-4 items-start
      transition-colors duration-500 rounded-xl
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
      md:mt-7 lg:mt-0"
    >
      {/* Top Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] rounded-xl p-4 border border-[#2F6B60]/40 backdrop-blur-sm shadow-[0_0_12px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(47,107,96,0.25)] transition-all duration-300 text-[#E8FFFA] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-orange-500/5 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <span
                      className={`text-2xl ${
                        streakInfo.current > 0 ? "animate-pulse" : ""
                      }`}
                    >
                      {streakInfo.current > 0 ? "🔥" : "💤"}
                    </span>
                    {streakInfo.current >= 7 && (
                      <span className="absolute -top-1 -right-1 text-xs">
                        {streakInfo.current >= 30
                          ? "🏆"
                          : streakInfo.current >= 14
                          ? "⭐"
                          : "✨"}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#FF8F8F]">
                      Current Streak
                    </div>
                    <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                      {streakInfo.current === 0 ? "Start Today" : "Keep Going!"}
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                    {streakInfo.current}
                  </span>
                  <span className="text-sm text-[#7FAFA4] font-medium">
                    {streakInfo.current === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2.5 bg-[#081C18] rounded-full overflow-hidden border border-[#2F6B60]/30 mb-3 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-700 relative ${
                    streakInfo.percent < 50
                      ? "bg-gradient-to-r from-[#0F766E] to-[#22C55E] shadow-[0_0_6px_#22C55E]"
                      : streakInfo.percent < 80
                      ? "bg-gradient-to-r from-[#F59E0B] to-[#FB923C] shadow-[0_0_8px_#FB923C]"
                      : "bg-gradient-to-r from-[#EF4444] to-[#FF8F8F] shadow-[0_0_8px_#EF4444]"
                  }`}
                  style={{ width: `${Math.max(3, streakInfo.percent)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center text-xs mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-[#7FAFA4]">Best:</span>
                  <span className="font-bold text-[#CDEEE8]">
                    {streakInfo.longest}d
                  </span>
                </div>
                <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-bold text-[#9FF2E8]">
                    {streakInfo.percent}%
                  </span>
                  <span className="text-[#7FAFA4] ml-1">of best</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#7FAFA4]">Need:</span>
                  <span className="font-bold text-[#FF8F8F]">
                    {Math.max(0, streakInfo.longest - streakInfo.current + 1)}d
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-[#2F6B60]/30 text-center">
                <p className="text-xs text-[#CDEEE8] font-medium">
                  {streakInfo.current === 0 && "💪 Start your streak today!"}
                  {streakInfo.current >= 1 &&
                    streakInfo.current < 7 &&
                    "🚀 Building momentum!"}
                  {streakInfo.current >= 7 &&
                    streakInfo.current < 14 &&
                    "🔥 One week strong!"}
                  {streakInfo.current >= 14 &&
                    streakInfo.current < 30 &&
                    "⚡ Unstoppable force!"}
                  {streakInfo.current >= 30 && "🏆 Legendary discipline!"}
                </p>
              </div>
            </div>
          </div>

          {/* Today's Stats Card */}
          <div className="bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] rounded-xl p-4 border border-[#2F6B60]/40 backdrop-blur-sm shadow-[0_0_12px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(47,107,96,0.25)] transition-all duration-300 text-[#E8FFFA] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <div>
                    <div className="text-sm font-semibold text-[#9FF2E8]">
                      Today's Stats
                    </div>
                    <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                      {dayjs().format("MMM DD, YYYY")}
                    </div>
                  </div>
                </div>
                {(todayStats.exercises > 0 || todayStats.topics > 0) && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Active
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="bg-black/30 rounded-lg p-2 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                  <div className="text-xl font-black text-[#4ADE80] mb-0.5">
                    {todayStats.topics}
                  </div>
                  <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                    Topics
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 border border-teal-500/20 hover:border-teal-500/40 transition-all">
                  <div className="text-xl font-black text-[#22C55E] mb-0.5">
                    {todayStats.exercises}
                  </div>
                  <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                    Exercises
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 border border-orange-500/20 hover:border-orange-500/40 transition-all">
                  <div className="text-xl font-black text-[#F59E0B] mb-0.5">
                    {todayStats.calories}
                  </div>
                  <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                    Calories
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 border border-red-500/20 hover:border-red-500/40 transition-all">
                  <div className="text-xl font-black text-[#FF8F8F] mb-0.5">
                    {todayStats.weight}
                  </div>
                  <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                    Weight
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-2 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                  <div className="text-xl font-black text-[#9FF2E8] mb-0.5">
                    {todayStats.bmi}
                  </div>
                  <div className="text-[9px] text-[#7FAFA4] uppercase tracking-wider">
                    BMI
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#2F6B60]/30 flex justify-between items-center text-xs">
                <span className="text-[#7FAFA4]">Daily Goal Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[#081C18] rounded-full overflow-hidden border border-[#2F6B60]/30">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          100,
                          (todayStats.exercises > 0 ? 25 : 0) +
                            (todayStats.topics > 0 ? 25 : 0) +
                            (todayStats.calories > 0 ? 25 : 0) +
                            (todayStats.weight > 0 ? 25 : 0)
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="font-bold text-[#9FF2E8]">
                    {Math.min(
                      100,
                      (todayStats.exercises > 0 ? 25 : 0) +
                        (todayStats.topics > 0 ? 25 : 0) +
                        (todayStats.calories > 0 ? 25 : 0) +
                        (todayStats.weight > 0 ? 25 : 0)
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center p-2 rounded-lg bg-black/20 border border-[#2F6B60]/40 backdrop-blur-sm shadow-[0_0_10px_rgba(0,0,0,0.3)]">
          {[
            { label: "Calendar", val: "calendar" },
            { label: "Weekly", val: "weekly" },
            { label: "Compare", val: "compare" },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setView(btn.val)}
              className={`w-full py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                view === btn.val
                  ? `bg-[#0A2B22] text-[#9FF2E8] border-[#3FA796] ring-2 ring-[#3FA796]/60 shadow-[0_0_12px_rgba(63,167,150,0.4)]`
                  : `bg-transparent text-[#CDEEE8] border-[#2F6B60]/40 hover:border-[#4ade80] hover:text-[#E8FFFA] hover:shadow-[0_0_8px_#4ade80]`
              } active:scale-95`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={exportAll}
            className="w-full py-2 rounded-lg text-sm font-medium text-[#B6FFD7] bg-transparent border border-[#15803d]/60 shadow-[0_0_6px_rgba(21,128,61,0.3)] transition-all duration-200 hover:bg-[#052E19] hover:border-[#22c55e] hover:shadow-[0_0_8px_#22c55e] active:scale-95"
          >
            Export
          </button>

          <label className="w-full py-2 rounded-lg text-sm font-medium cursor-pointer text-center text-[#AEE7FF] bg-transparent border border-[#0369a1]/60 shadow-[0_0_6px_rgba(3,105,161,0.3)] transition-all duration-200 hover:bg-[#031927] hover:border-[#0ea5e9] hover:shadow-[0_0_8px_#0ea5e9] active:scale-95">
            Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => importAll(e.target.files?.[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetModal(true)}
            className="w-full py-2 rounded-lg text-sm font-medium text-[#FFDADA] bg-transparent border border-[#7A1D2B]/60 shadow-[0_0_6px_rgba(122,29,43,0.35)] transition-all duration-200 hover:bg-[#2A0509] hover:border-[#B82132] hover:shadow-[0_0_8px_#B82132] active:scale-95"
          >
            Reset Gym
          </button>
        </div>
      </div>

      {/* MAIN CONTENT ROW */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-3 gap-4">
          {/* Calendar Section */}
          <div className="md:col-span-5 lg:col-span-1 rounded-2xl border border-[#2F6B60]/30 p-1.5 xs:p-2 md:p-3 h-auto md:h-auto lg:h-[584px] overflow-hidden bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] shadow-2xl flex flex-col">
            {/* Fixed Header Section */}
            <div className="flex-shrink-0 space-y-1.5 xs:space-y-2 md:space-y-3">
              {/* Compact Header */}
              <div className="flex flex-col gap-2">
                {/* Month Navigation - Always Centered */}
                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                  <button
                    onClick={() => setMonth((m) => m.subtract(1, "month"))}
                    className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm text-[#9FF2E8] border border-[#2F6B60]/40 transition-all duration-200 hover:border-[#4ade80] hover:text-[#CFFFF7] hover:shadow-[0_0_8px_#4ade80] active:scale-95 text-sm md:text-base"
                  >
                    ←
                  </button>

                  <h2 className="px-1.5 xs:px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] xs:text-xs md:text-sm lg:text-base font-semibold text-[#9FF2E8] border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm min-w-[95px] xs:min-w-[110px] md:min-w-[130px] lg:min-w-[140px] text-center">
                    {month.format("MMM YYYY")}
                  </h2>

                  <button
                    onClick={() => setMonth((m) => m.add(1, "month"))}
                    className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm text-[#9FF2E8] border border-[#2F6B60]/40 transition-all duration-200 hover:border-[#4ade80] hover:text-[#CFFFF7] hover:shadow-[0_0_8px_#4ade80] active:scale-95 text-sm md:text-base"
                  >
                    →
                  </button>
                </div>

                {/* Quick Actions - Centered Below */}
                <div className="flex items-center justify-evenly gap-2">
                  <button
                    onClick={() => {
                      const today = dayjs();
                      setMonth(today);
                      setSelectedDate(today.format("YYYY-MM-DD"));
                    }}
                    className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium bg-black/20 text-[#9FF2E8] border border-[#2F6B60]/40 transition-all duration-200 hover:border-[#4ade80] hover:text-[#CFFFF7] hover:shadow-[0_0_8px_#4ade80] active:scale-95"
                  >
                    Today
                  </button>

                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        const newValue = e.target.value;

                        if (!newValue) {
                          const today = dayjs();
                          setMonth(today);
                          setSelectedDate(today.format("YYYY-MM-DD"));
                          return;
                        }

                        const newDate = dayjs(newValue);
                        if (newDate.isValid()) {
                          setMonth(newDate);
                          setSelectedDate(newValue);
                        }
                      }}
                      className="custom-date-input w-8 h-7 md:w-9 md:h-8 rounded-lg bg-black/20 backdrop-blur-sm text-transparent border border-[#2F6B60]/40 cursor-pointer transition-all duration-200 hover:border-[#4ade80] hover:shadow-[0_0_8px_#4ade80] hover:text-[#9FF2E8] focus:text-[#9FF2E8] active:scale-95 [color-scheme:dark] px-2"
                      title="Jump to date"
                    />
                    <div className="absolute left-2 top-1.5 md:left-2.5 md:top-2 pointer-events-none transition-opacity">
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#9FF2E8]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Stats - Balanced Responsive */}
              <div className="flex items-center justify-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-sm border border-[#2F6B60]/30 transition-all duration-300">
                {/* Date Display */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] md:text-[11px] lg:text-xs text-[#9FF2E8]/50 font-medium truncate max-w-[55px] md:max-w-[70px]">
                    {selectedDate
                      ? dayjs(selectedDate).format("MMM DD")
                      : "Select"}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-3 bg-[#2F6B60]/40" />

                {/* Topics Count */}
                <div className="flex items-center gap-1 md:gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
                  <span className="text-[11px] md:text-xs lg:text-sm font-semibold text-[#4ADE80]">
                    {selectedDate
                      ? (studyMap[selectedDate] || []).length
                      : monthlyStats.topics}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-[#9FF2E8]/60">
                    T
                  </span>
                </div>

                {/* Divider */}
                <div className="w-px h-3 bg-[#2F6B60]/40" />

                {/* Exercises Count */}
                <div className="flex items-center gap-1 md:gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]" />
                  <span className="text-[11px] md:text-xs lg:text-sm font-semibold text-[#60A5FA]">
                    {selectedDate
                      ? gymLogs[selectedDate]
                        ? combinedExercisesForDateWrapper(selectedDate).length
                        : 0
                      : monthlyStats.exercises}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-[#9FF2E8]/60">
                    E
                  </span>
                </div>
              </div>

              {/* Calendar Grid - Reduced spacing for tablets */}
              <div className="grid grid-cols-7 gap-[2px] xs:gap-0.5 md:gap-1 lg:gap-1.5">
                {/* Day Labels Row */}
                <div className="col-span-7 grid grid-cols-7 gap-[2px] xs:gap-0.5 md:gap-1 lg:gap-1.5 mb-0.5 md:mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                    <div
                      key={idx}
                      className="text-center text-[8px] md:text-[9px] lg:text-[10px] text-[#9FF2E8]/50 font-semibold"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                {days.map((d) => {
                  const iso = d.format("YYYY-MM-DD");
                  const status = getDayStatusStr(iso);
                  const isCurMonth = d.month() === month.month();
                  const isToday = iso === todayISO();
                  const isSelected = iso === selectedDate;

                  const base = `aspect-square w-full rounded-md md:rounded-lg lg:rounded-xl flex items-center justify-center font-medium text-[10px] md:text-xs lg:text-sm transition-all duration-200 relative overflow-hidden select-none cursor-pointer`;
                  const notCur = !isCurMonth ? "opacity-30" : "";
                  const bgClass =
                    status === "both"
                      ? "bg-gradient-to-br from-[#064E3B] to-[#7A1D2B] text-[#ECFFFA]"
                      : status === "study"
                      ? "bg-[#0A2B22] text-[#9FF2E8] border border-[#10b981]/20"
                      : status === "gym"
                      ? "bg-[#071A2F] text-[#9FCAFF] border border-[#3b82f6]/20"
                      : "bg-[#081C18]/60 text-[#B6E5DC] border border-[#2F6B60]/20";
                  const selectedClass = isSelected
                    ? "ring-2 ring-[#3FA796] shadow-[0_0_15px_rgba(63,167,150,0.4)] scale-105 z-10"
                    : "hover:scale-105 hover:shadow-[0_0_8px_rgba(63,167,150,0.2)]";
                  const todayClass =
                    isToday && !isSelected ? "ring-2 ring-[#fbbf24]/50" : "";

                  return (
                    <button
                      key={iso}
                      onClick={() => openDay(d)}
                      onMouseEnter={(e) => handleMouseEnterDate(e, iso)}
                      onMouseLeave={handleMouseLeaveDate}
                      className={`${base} ${notCur} ${bgClass} ${selectedClass} ${todayClass}`}
                      title={`${d.format("ddd, DD MMM YYYY")} — ${
                        status === "both"
                          ? "Study + Gym"
                          : status === "study"
                          ? "Study"
                          : status === "gym"
                          ? "Gym"
                          : "No activity"
                      }`}
                    >
                      <span className="z-10 text-[10px] md:text-[11px] lg:text-sm">
                        {d.date()}
                      </span>
                      {(status === "study" ||
                        status === "gym" ||
                        status === "both") && (
                        <div className="absolute bottom-0.5 md:bottom-1 lg:bottom-1 flex gap-0.5 pb-0.5">
                          {(status === "study" || status === "both") && (
                            <span className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1.5 lg:h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_4px_#4ADE80]" />
                          )}
                          {(status === "gym" || status === "both") && (
                            <span className="w-1 h-1 md:w-1.5 md:h-1.5 lg:w-1.5 lg:h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_4px_#60A5FA]" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Bottom Section */}
            <div className="flex-1 overflow-y-auto mt-3 space-y-3 custom-scrollbar-green">
              {/* Compact Notes */}
              <div className=" rounded-xl p-2.5 border border-[#2F6B60]/30 bg-gradient-to-br from-[#B82132]/20 via-[#183D3D]/20 to-[#0F0F0F]/20 dark:from-[#0F1622]/40 dark:via-[#132033]/40 dark:to-[#0A0F1C]/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-[#00e5ff] text-xs flex items-center gap-1.5">
                    📝{" "}
                    {selectedDate
                      ? dayjs(selectedDate).format("MMM DD")
                      : "Notes"}
                  </h4>
                  <span className="text-[10px] text-[#9FF2E8]/50">
                    {selectedNote.length}/200
                  </span>
                </div>
                <textarea
                  value={selectedNote}
                  onChange={(e) =>
                    saveNoteForDate(selectedDate, e.target.value)
                  }
                  maxLength={200}
                  placeholder="Quick note for today..."
                  className="w-full min-h-[60px] p-2 border rounded-lg text-sm bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] text-[#cfefff] border-[#233446] focus:border-[#4ade80]/50 focus:outline-none placeholder:text-[#9FF2E8]/30 resize-none"
                />
              </div>

              {/* Compact Charts */}
              {view === "weekly" && (
                <div className="rounded-xl p-2.5 border border-[#2F6B60]/30 bg-[#071827]/60 backdrop-blur-sm">
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#122236" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#071425",
                            border: "1px solid #263249",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar
                          dataKey="study"
                          stackId="a"
                          fill="#4ADE80"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="gym"
                          stackId="a"
                          fill="#60A5FA"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {view === "compare" && (
                <div className="rounded-xl p-2.5 border border-[#2F6B60]/30 bg-[#071827]/60 backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={compareDates[0] || ""}
                        onChange={(e) => setCompareSlot(0, e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg text-xs bg-[#02061a] text-white border border-[#2F6B60]/40 focus:border-[#4ade80]/50 focus:outline-none [color-scheme:dark]"
                      />
                      <input
                        type="date"
                        value={compareDates[1] || ""}
                        onChange={(e) => setCompareSlot(1, e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg text-xs bg-[#02061a] text-white border border-[#2F6B60]/40 focus:border-[#4ade80]/50 focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1].map((i) => {
                        const iso = compareDates[i];
                        const info = iso
                          ? {
                              studyCount: (studyMap[iso] || []).length,
                              gymDone: !!gymLogs[iso],
                              exercises: combinedExercisesForDateWrapper(iso),
                              notes: notesMap[iso] || "",
                            }
                          : null;
                        return (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-[#071323]/80 border border-[#2F6B60]/30"
                          >
                            <div className="text-[10px] text-[#9FF2E8]/50 mb-1.5">
                              {iso ? dayjs(iso).format("MMM DD") : "—"}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#9FF2E8]/70">Study</span>
                                <span className="text-[#4ADE80] font-semibold">
                                  {info ? info.studyCount : "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#9FF2E8]/70">Gym</span>
                                <span className="text-[#60A5FA] font-semibold">
                                  {info ? (info.gymDone ? "✓" : "✗") : "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#9FF2E8]/70">Ex.</span>
                                <span className="text-[#E0F2F1] font-semibold">
                                  {info ? info.exercises.length : "—"}
                                </span>
                              </div>
                            </div>
                            {info?.notes && (
                              <p className="text-[10px] text-[#9FF2E8]/60 mt-1.5 line-clamp-1">
                                {info.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Day Summary & Gym - Takes 2 columns */}
          <div className="md:col-span-7 lg:col-span-2 space-y-4">
            {/* Day Summary Header */}
            <div className="rounded-2xl border border-[#2F6B60]/30 p-4 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]">
              <div className="rounded-2xl p-3 border bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] border-green-600/40 dark:border-gray-700 transition-colors">
                <h4 className="font-semibold text-[#00e5ff] mb-3 flex justify-between items-center">
                  Day Summary
                  <div className="text-sm font-normal text-[#9FF2E8]/70 border-l-2 border-[#00e5ff]/40 pl-2">
                    {dayjs(selectedDate).format("dddd, DD MMM YYYY")}
                  </div>
                </h4>

                <div className="grid grid-cols-5 text-center gap-2">
                  <div>
                    <p className="text-[#38bdf8] font-semibold text-lg">
                      {(studyMap[selectedDate] || []).length}
                    </p>
                    <p className="text-xs opacity-70">Topics</p>
                  </div>
                  <div>
                    <p className="text-[#22c55e] font-semibold text-lg">
                      {
                        combinedExercisesForDateWrapper(selectedDate, gymLogs)
                          .length
                      }
                    </p>
                    <p className="text-xs opacity-70">Exercises</p>
                  </div>
                  <div>
                    <p className="text-[#facc15] font-semibold text-lg">
                      {selectedGym.calories || "—"}
                    </p>
                    <p className="text-xs opacity-70">Calories</p>
                  </div>
                  <div>
                    <p className="text-[#f472b6] font-semibold text-lg">
                      {selectedGym.weight || "—"}
                    </p>
                    <p className="text-xs opacity-70">Weight</p>
                  </div>
                  <div>
                    <p className="text-[#34d399] font-semibold text-lg">
                      {selectedGym.bmi || "—"}
                    </p>
                    <p className="text-xs opacity-70">BMI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Topics Studied | Gym Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Topics Studied Panel */}
              <div className="rounded-xl border border-green-600/40 dark:border-gray-700 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] transition-all duration-300 h-[430px] flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-3 pb-2 border-b border-[#2F6B60]/20">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-green-400 flex items-center gap-2">
                      📚 Topics Studied
                    </h4>
                    {selectedStudy.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#4ade80]/20 border border-[#4ade80]/30 text-[10px] text-[#4ade80] font-semibold">
                          {selectedStudy.length} topics
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#10b981]/20 border border-[#10b981]/30 text-[10px] text-[#10b981] font-semibold">
                          ✓ Complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pt-2 custom-scrollbar-green">
                  {selectedStudy.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1 text-[#bbf7d0] pb-2">
                      {selectedStudy.map((t, i) => (
                        <li
                          key={i}
                          className="border-b-2 border-[#4ade80]/30 pb-2 mb-2"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#2F6B60]/20 flex items-center justify-center mb-2">
                        <span className="text-2xl opacity-50">📖</span>
                      </div>
                      <div className="text-sm text-[#9FF2E8]/50">
                        No topics studied
                      </div>
                      <div className="text-xs text-[#9FF2E8]/30 mt-1">
                        Add study topics for{" "}
                        {selectedDate
                          ? dayjs(selectedDate).format("MMM DD")
                          : "this day"}
                      </div>
                    </div>
                  )}
                </div>

                {selectedStudy.length > 0 && (
                  <div className="sticky bottom-0 z-10 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] px-3 pb-3 pt-2 border-t border-[#2F6B60]/20">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="flex items-center justify-between bg-gradient-to-r from-[#4ade80]/10 to-transparent backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-[#4ade80]/20">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">✓</span>
                          <span className="text-[#9FF2E8]/60 text-[10px]">
                            Done
                          </span>
                        </div>
                        <span className="font-bold text-[#4ade80] text-sm">
                          {selectedStudy.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gradient-to-r from-[#60A5FA]/10 to-transparent backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-[#60A5FA]/20">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">📊</span>
                          <span className="text-[#9FF2E8]/60 text-[10px]">
                            Progress
                          </span>
                        </div>
                        <span className="font-bold text-[#60A5FA] text-sm">
                          {Math.round((selectedStudy.length / 621) * 100)}%
                        </span>
                      </div>
                    </div>

                    {getStudyCategories(selectedStudy).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {getStudyCategories(selectedStudy).map(
                          (category, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30"
                            >
                              {category}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Gym Summary Panel */}
              <div className="rounded-xl border border-green-600/40 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] h-[430px] flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-3 pb-2 border-b border-[#2F6B60]/20">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#ff6b6b] flex items-center gap-2">
                      🏋️ Gym Summary
                    </h4>
                    {gymLogs[selectedDate] && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#60A5FA]/20 border border-[#60A5FA]/30 text-[10px] text-[#60A5FA] font-semibold">
                          {combinedExercisesForDateWrapper(selectedDate).length}{" "}
                          exercises
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#4ade80]/20 border border-[#4ade80]/30 text-[10px] text-[#4ade80] font-semibold">
                          ✓ Complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 pt-2 custom-scrollbar">
                  {gymLogs[selectedDate] ? (
                    <div className="space-y-3">
                      <div className="text-sm space-y-1 text-[#e2e8f0]">
                        {renderExercises(selectedDate, gymLogs)}
                      </div>

                      <div className="pt-3 border-t border-[#2F6B60]/30">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                            <div className="text-[10px] text-[#9FF2E8]/50 mb-1">
                              Total Sets
                            </div>
                            <div className="text-lg font-bold text-[#60A5FA]">
                              {combinedExercisesForDateWrapper(
                                selectedDate
                              ).reduce((sum, ex) => {
                                const sets = ex.match(/(\d+)\s*×/);
                                return sum + (sets ? parseInt(sets[1]) : 0);
                              }, 0)}
                            </div>
                          </div>
                          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                            <div className="text-[10px] text-[#9FF2E8]/50 mb-1">
                              Total Reps
                            </div>
                            <div className="text-lg font-bold text-[#4ade80]">
                              {combinedExercisesForDateWrapper(
                                selectedDate
                              ).reduce((sum, ex) => {
                                const reps = ex.match(/×\s*(\d+)/);
                                return sum + (reps ? parseInt(reps[1]) : 0);
                              }, 0)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                          <div className="text-[10px] text-[#9FF2E8]/50 mb-1.5">
                            Target Muscles
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {getTargetMuscles(selectedDate).map(
                              (muscle, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-[#ff6b6b]/20 border border-[#ff6b6b]/30 text-[10px] text-[#ff6b6b] font-medium"
                                >
                                  {muscle}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-[#0F766E]/20 via-[#0c4a42]/10 to-[#0a3832]/20 border border-emerald-400/30 rounded-xl p-3 text-[#E8FFFA]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                            Today's Details
                          </span>
                          <span
                            className={`text-[10px] px-2 py-1 rounded-lg font-semibold ${
                              gymLogs[selectedDate]?.done
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/40"
                                : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 border border-gray-600/40"
                            }`}
                          >
                            {gymLogs[selectedDate]?.done
                              ? "✅ Done"
                              : "⭕ Not Done"}
                          </span>
                        </div>

                        {/* Extra Activity - Redesigned */}
                        <div className="mt-2 bg-gradient-to-br from-[#0F766E]/15 via-[#0c4a42]/10 to-[#0a3832]/15 border border-emerald-400/20 rounded-lg p-2">
                          <div className="text-[8px] text-emerald-200/80 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                            <span className="text-xs">⚡</span>
                            Extra Activity
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Run Card */}
                            <div className="bg-black/20 rounded-md p-1.5 border border-emerald-500/20">
                              <div className="text-[8px] text-emerald-300/70 font-semibold mb-0.5 flex items-center gap-0.5">
                                <span>🏃</span> Run
                              </div>
                              <div className="text-[9px] text-emerald-100 font-medium">
                                {gymLogs[selectedDate].running?.distanceKm !=
                                  null ||
                                gymLogs[selectedDate].running
                                  ?.durationMinutes != null ? (
                                  <div className="flex flex-wrap gap-x-1">
                                    {gymLogs[selectedDate].running
                                      ?.distanceKm != null && (
                                      <span className="bg-emerald-500/10 px-1 py-0.5 rounded">
                                        {
                                          gymLogs[selectedDate].running
                                            .distanceKm
                                        }
                                        km
                                      </span>
                                    )}
                                    {gymLogs[selectedDate].running
                                      ?.durationMinutes != null && (
                                      <span className="bg-emerald-500/10 px-1 py-0.5 rounded">
                                        {
                                          gymLogs[selectedDate].running
                                            .durationMinutes
                                        }
                                        m
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-emerald-300/40">—</span>
                                )}
                              </div>
                            </div>

                            {/* Yoga Card */}
                            <div className="bg-black/20 rounded-md p-1.5 border border-teal-500/20">
                              <div className="text-[8px] text-teal-300/70 font-semibold mb-0.5 flex items-center gap-0.5">
                                <span>🧘</span> Yoga
                              </div>
                              <div className="text-[9px] text-teal-100 font-medium">
                                {gymLogs[selectedDate].yogaMinutes != null ? (
                                  <span className="bg-teal-500/10 px-1 py-0.5 rounded inline-block">
                                    {gymLogs[selectedDate].yogaMinutes}m
                                  </span>
                                ) : (
                                  <span className="text-teal-300/40">—</span>
                                )}
                              </div>
                            </div>

                            {/* Felt Card */}
                            <div className="bg-black/20 rounded-md p-1.5 border border-emerald-500/20">
                              <div className="text-[8px] text-emerald-300/70 font-semibold mb-0.5 flex items-center gap-0.5">
                                <span>💭</span> Felt
                              </div>
                              <div className="text-[9px] text-emerald-100/90 font-medium truncate">
                                {gymLogs[selectedDate].running?.mood && (
                                  <span className="text-sm mr-1">
                                    {gymLogs[selectedDate].running.mood}
                                  </span>
                                )}
                                {gymLogs[selectedDate].running?.notes && (
                                  <span className="text-[8px] italic">
                                    {gymLogs[selectedDate].running.notes}
                                  </span>
                                )}
                                {!gymLogs[selectedDate].running?.mood &&
                                  !gymLogs[selectedDate].running?.notes && (
                                    <span className="text-emerald-300/40">
                                      —
                                    </span>
                                  )}
                              </div>
                            </div>

                            {/* Other Card */}
                            <div className="bg-black/20 rounded-md p-1.5 border border-emerald-500/20">
                              <div className="text-[8px] text-emerald-300/70 font-semibold mb-0.5 flex items-center gap-0.5">
                                <span>➕</span> Other
                              </div>
                              <div className="text-[9px] text-emerald-100/90 font-medium truncate">
                                {gymLogs[selectedDate].otherExercises ? (
                                  <span className="text-[8px]">
                                    {gymLogs[selectedDate].otherExercises}
                                  </span>
                                ) : (
                                  <span className="text-emerald-300/40">—</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#2F6B60]/20 flex items-center justify-center mb-2">
                        <span className="text-2xl opacity-50">💪</span>
                      </div>
                      <div className="text-sm text-[#9FF2E8]/50">
                        No workout logged
                      </div>
                      <div className="text-xs text-[#9FF2E8]/30 mt-1">
                        Track your exercises for{" "}
                        {selectedDate
                          ? dayjs(selectedDate).format("MMM DD")
                          : "this day"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
              .custom-scrollbar-green::-webkit-scrollbar,
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar-green::-webkit-scrollbar-track {
                background: rgba(16, 185, 129, 0.1);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(47, 107, 96, 0.1);
                border-radius: 10px;
              }
              .custom-scrollbar-green::-webkit-scrollbar-thumb {
                background: rgba(74, 222, 128, 0.4);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(63, 167, 150, 0.4);
                border-radius: 10px;
              }
              .custom-scrollbar-green::-webkit-scrollbar-thumb:hover {
                background: rgba(74, 222, 128, 0.6);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(63, 167, 150, 0.6);
              }
            `}</style>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-[90%] max-w-md rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#2a0a0f] via-[#1a0a0f] to-[#0a0a0f] shadow-[0_25px_60px_rgba(220,38,38,0.4),0_0_80px_rgba(220,38,38,0.2)] p-6">
            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-red-400 text-xl font-bold">
                  Reset Gym Progress
                </h3>
                <p className="text-red-200/50 text-xs">Permanent action</p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/20">
              <p className="text-sm text-red-100/90 leading-relaxed mb-3">
                This will permanently delete:
              </p>
              <ul className="space-y-1.5 text-sm text-red-200/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  All gym logs and workout history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Calendar completion marks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Weight tracking data
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <p className="text-xs text-red-300/70 font-semibold flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setShowResetModal(false);
                  showToast("✓ Action cancelled safely", "success");
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-br from-slate-700 to-slate-800 text-white border border-slate-600/50 hover:from-slate-600 hover:to-slate-700 transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-br from-red-600 to-red-700 text-white border border-red-500/50 hover:from-red-500 hover:to-red-600 transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Progress"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add these animations to your CSS/Tailwind config */}
      <style jsx>{`
        .custom-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        /* Firefox */
        .custom-date-input::-moz-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        /* Your existing scrollbar styles */
        .custom-scrollbar-green::-webkit-scrollbar,
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
