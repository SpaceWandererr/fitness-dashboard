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

  async function resetGymProgress() {
    if (
      !confirm(
        "Reset all gym logs and wd_done calendar marks? This cannot be undone.",
      )
    )
      return;

    const payload = {
      wd_gym_logs: {},
      wd_done: {},
      wd_weight_overrides: {},
    };

    try {
      // Push reset state to backend
      await fetch(`${API}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Update UI state
      setGymLogs({});
      setDoneMap({});

      alert("Gym progress reset.");
    } catch (err) {
      console.error("Reset failed", err);
      alert("Failed to reset.");
    }
  }

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
      grid grid-cols-1 lg:grid-cols-2 gap-4 items-start transition- 
      colors duration-500 rounded-xl
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
      [#0A0F1C]"
    >
      {/* Top Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className=" 
            bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] 
            dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
             rounded-xl p-4
             bg-black/30
             border border-[#2F6B60]/40
             backdrop-blur-sm
             shadow-[0_0_12px_rgba(0,0,0,0.35)]
             transition-all duration-300
             text-[#E8FFFA]
           "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2          ">
              <div className="text-sm font-medium text-[#FF8F8F] flex items-center gap-1">
                🔥 <span>Streak</span>
              </div>
              <div className="text-xs text-[#9FF2E8] font-semibold">
                {streakInfo.current} days
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2.5 bg-[#081C18] rounded-full overflow-hidden border border-[#2F6B60]/30">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Fill */}
              <div
                className={`
        h-full rounded-full transition-all duration-700
        ${
          streakInfo.percent < 50
            ? "bg-gradient-to-r from-[#0F766E] to-[#22C55E] shadow-[0_0_6px_#22C55E]"
            : "bg-gradient-to-r from-[#7A1D2B] to-[#FF8F8F] shadow-[0_0_8px_#FF8F8F]"
        }
      `}
                style={{ width: `${streakInfo.percent}%` }}
              />
            </div>

            {/* Footer Info */}
            <div className="mt-2 text-xs text-[#7FAFA4] flex justify-between">
              <span>
                Longest: <b className="text-[#CDEEE8]">{streakInfo.longest}d</b>
              </span>
              <span>
                <b className="text-[#9FF2E8]">{streakInfo.percent}%</b> of
                longest
              </span>
            </div>
          </div>

          {/* Today's Stats (replaces quote) */}
          <div
            className="
            bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] 
            dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
    rounded-xl p-4
    bg-black/30
    border border-[#2F6B60]/40
    backdrop-blur-sm
    shadow-[0_0_12px_rgba(0,0,0,0.35)]
    transition-all duration-300
    text-[#E8FFFA]
  "
          >
            {/* Title */}
            <div className="text-sm font-semibold text-[#9FF2E8] tracking-wide flex items-center gap-1 mb-2">
              📊 <span>Today’s Stats</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 text-center mt-3 gap-y-2">
              {/* Topics */}
              <div>
                <p className="text-[#4ADE80] font-semibold text-lg">
                  {todayStats.topics}
                </p>
                <p className="text-xs text-[#7FAFA4]">Topics</p>
              </div>

              {/* Exercises */}
              <div>
                <p className="text-[#22C55E] font-semibold text-lg">
                  {todayStats.exercises}
                </p>
                <p className="text-xs text-[#7FAFA4]">Exercises</p>
              </div>

              {/* Calories */}
              <div>
                <p className="text-[#F59E0B] font-semibold text-lg">
                  {todayStats.calories}
                </p>
                <p className="text-xs text-[#7FAFA4]">Calories</p>
              </div>

              {/* Weight */}
              <div>
                <p className="text-[#FF8F8F] font-semibold text-lg">
                  {todayStats.weight}
                </p>
                <p className="text-xs text-[#7FAFA4]">Weight</p>
              </div>

              {/* BMI */}
              <div>
                <p className="text-[#9FF2E8] font-semibold text-lg">
                  {todayStats.bmi}
                </p>
                <p className="text-xs text-[#7FAFA4]">BMI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="
  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center
  p-2 rounded-lg
  bg-black/20
  border border-[#2F6B60]/40
  backdrop-blur-sm
  shadow-[0_0_10px_rgba(0,0,0,0.3)]
"
        >
          {[
            { label: "Calendar", val: "calendar" },
            { label: "Weekly", val: "weekly" },
            { label: "Compare", val: "compare" },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setView(btn.val)}
              className={`
        w-full py-2 rounded-lg text-sm font-medium
        border transition-all duration-200
        ${
          view === btn.val
            ? `
              bg-[#0A2B22]
              text-[#9FF2E8]
              border-[#3FA796]
              ring-2 ring-[#3FA796]/60
              shadow-[0_0_12px_rgba(63,167,150,0.4)]
            `
            : `
              bg-transparent
              text-[#CDEEE8]
              border-[#2F6B60]/40
              hover:border-[#4ade80]
              hover:text-[#E8FFFA]
              hover:shadow-[0_0_8px_#4ade80]
            `
        }
        active:scale-95
      `}
            >
              {btn.label}
            </button>
          ))}

          {/* Export Button */}
          <button
            onClick={exportAll}
            className="
      w-full py-2 rounded-lg text-sm font-medium
      text-[#B6FFD7]
      bg-transparent
      border border-[#15803d]/60
      shadow-[0_0_6px_rgba(21,128,61,0.3)]
      transition-all duration-200
      hover:bg-[#052E19]
      hover:border-[#22c55e]
      hover:shadow-[0_0_8px_#22c55e]
      active:scale-95
    "
          >
            Export
          </button>

          {/* Import Button */}
          <label
            className="
    w-full py-2 rounded-lg text-sm font-medium cursor-pointer text-center
    text-[#AEE7FF]
    bg-transparent
    border border-[#0369a1]/60
    shadow-[0_0_6px_rgba(3,105,161,0.3)]
    transition-all duration-200
    hover:bg-[#031927]
    hover:border-[#0ea5e9]
    hover:shadow-[0_0_8px_#0ea5e9]
    active:scale-95
  "
          >
            Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => importAll(e.target.files?.[0])}
              className="hidden"
            />
          </label>

          {/* Reset Gym */}
          <button
            onClick={resetGymProgress}
            className="
      w-full py-2 rounded-lg text-sm font-medium
      text-[#FFDADA]
      bg-transparent
      border border-[#7A1D2B]/60
      shadow-[0_0_6px_rgba(122,29,43,0.35)]
      transition-all duration-200
      hover:bg-[#2A0509]
      hover:border-[#B82132]
      hover:shadow-[0_0_8px_#B82132]
      active:scale-95
    "
          >
            Reset Gym
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div
        className="xl:col-span-1 rounded-2xl border border-[#2F6B60]/30 p-3 space-y-3 
        w-full min-h-[400px] md:min-h-[600px]
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]      
        dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
        shadow-2xl"
      >
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonth((m) => m.subtract(1, "month"))}
              className="w-8 h-8 rounded-lg flex items-center justify-center
              bg-black/20 backdrop-blur-sm
              text-[#9FF2E8]
              border border-[#2F6B60]/40
              transition-all duration-200
              hover:border-[#4ade80] hover:text-[#CFFFF7]
              hover:shadow-[0_0_8px_#4ade80]
              active:scale-95"
            >
              ←
            </button>

            <h2
              className="px-3 py-1.5 rounded-lg
              text-sm sm:text-base font-semibold
              text-[#9FF2E8]
              border border-[#2F6B60]/40
              bg-black/20 backdrop-blur-sm
              min-w-[140px] text-center"
            >
              {month.format("MMMM YYYY")}
            </h2>

            <button
              onClick={() => setMonth((m) => m.add(1, "month"))}
              className="w-8 h-8 rounded-lg flex items-center justify-center
              bg-black/20 backdrop-blur-sm
              text-[#9FF2E8]
              border border-[#2F6B60]/40
              transition-all duration-200
              hover:border-[#4ade80] hover:text-[#CFFFF7]
              hover:shadow-[0_0_8px_#4ade80]
              active:scale-95"
            >
              →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const today = dayjs();
                setMonth(today);
                setSelectedDate(today.format("YYYY-MM-DD"));
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium
              bg-black/20 text-[#9FF2E8]
              border border-[#2F6B60]/40
              transition-all duration-200
              hover:border-[#4ade80] hover:text-[#CFFFF7]
              hover:shadow-[0_0_8px_#4ade80]
              active:scale-95"
            >
              Today
            </button>

            {/* Quick Jump - With Date Display on Hover */}
            <div className="relative group">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const newDate = dayjs(e.target.value);
                  setMonth(newDate);
                  setSelectedDate(e.target.value);
                }}
                className="
                  peer
                  w-9 h-8 rounded-lg
                  bg-black/20 backdrop-blur-sm 
                  text-transparent
                  border border-[#2F6B60]/40 
                  cursor-pointer
                  transition-all duration-200
                  hover:border-[#4ade80] 
                  hover:shadow-[0_0_8px_#4ade80]
                  hover:text-[#9FF2E8]
                  focus:text-[#9FF2E8]
                  active:scale-95
                  [color-scheme:dark]
                  px-2
                  sm:hover:w-32
                  sm:focus:w-32
                  focus:w-full
                "
                title="Jump to date"
              />
              {/* Icon - Hidden on Hover/Focus */}
              <div className="absolute left-2.5 top-2 pointer-events-none peer-hover:opacity-0 peer-focus:opacity-0 transition-opacity">
                <svg
                  className="w-4 h-4 text-[#9FF2E8]"
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

        {/* Dynamic Stats - Updates with Selected Date */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-4 px-3 py-1.5 rounded-lg
          bg-black/20 backdrop-blur-sm border border-[#2F6B60]/30
          transition-all duration-300"
        >
          {/* Date Label - Shows Selected Date */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs text-[#9FF2E8]/50 font-medium">
              {selectedDate ? dayjs(selectedDate).format("MMM DD") : "Select"}
            </span>
          </div>

          <div className="w-px h-3 bg-[#2F6B60]/40" />

          {/* Study Count for Selected Date */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
            <span className="text-xs font-semibold text-[#4ADE80]">
              {selectedDate
                ? (studyMap[selectedDate] || []).length
                : monthlyStats.topics}
            </span>
            <span className="text-[10px] sm:text-xs text-[#9FF2E8]/60 hidden sm:inline">
              {selectedDate ? "topics" : "monthly"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#9FF2E8]/60 sm:hidden">
              T
            </span>
          </div>

          <div className="w-px h-3 bg-[#2F6B60]/40" />

          {/* Gym/Exercise Count for Selected Date */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]" />
            <span className="text-xs font-semibold text-[#60A5FA]">
              {selectedDate
                ? gymLogs[selectedDate]
                  ? combinedExercisesForDateWrapper(selectedDate).length
                  : 0
                : monthlyStats.exercises}
            </span>
            <span className="text-[10px] sm:text-xs text-[#9FF2E8]/60 hidden sm:inline">
              {selectedDate ? "exercises" : "monthly"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#9FF2E8]/60 sm:hidden">
              E
            </span>
          </div>
        </div>

        {/* Calendar Grid - Compact */}
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((d) => {
            const iso = d.format("YYYY-MM-DD");
            const status = getDayStatusStr(iso);
            const isCurMonth = d.month() === month.month();
            const isToday = iso === todayISO();
            const isSelected = iso === selectedDate;

            const base = `
              aspect-square w-full 
              min-w-[32px] max-w-[56px]
              rounded-xl 
              flex items-center justify-center 
              font-medium text-xs sm:text-sm
              transition-all duration-200
              relative overflow-hidden
              select-none cursor-pointer
            `;

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
              isToday && !isSelected
                ? "ring-2 ring-[#fbbf24]/50 animate-pulse"
                : "";

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
                {/* Date */}
                <span className="z-10">{d.date()}</span>

                {/* Activity dots */}
                {(status === "study" ||
                  status === "gym" ||
                  status === "both") && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {(status === "study" || status === "both") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
                    )}
                    {(status === "gym" || status === "both") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Compact Notes with Character Counter */}
        <div
          className="rounded-xl p-2.5 border border-[#2F6B60]/30
          bg-gradient-to-br from-[#B82132]/20 via-[#183D3D]/20 to-[#0F0F0F]/20 
          dark:from-[#0F1622]/40 dark:via-[#132033]/40 dark:to-[#0A0F1C]/40
          backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="font-semibold text-[#00e5ff] text-xs flex items-center gap-1.5">
              📝 {selectedDate ? dayjs(selectedDate).format("MMM DD") : "Notes"}
            </h4>
            <span className="text-[10px] text-[#9FF2E8]/50">
              {selectedNote.length}/200
            </span>
          </div>
          <textarea
            value={selectedNote}
            onChange={(e) => saveNoteForDate(selectedDate, e.target.value)}
            maxLength={200}
            placeholder="Quick note for today..."
            className="w-full min-h-[60px] p-2 border rounded-lg text-sm
              bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] 
              dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
              text-[#cfefff] border-[#233446]
              focus:border-[#4ade80]/50 focus:outline-none
              placeholder:text-[#9FF2E8]/30 resize-none"
          />
        </div>

        {/* Compact Charts */}
        <div className="space-y-3">
          {view === "weekly" && (
            <div
              className="rounded-xl p-2.5 border border-[#2F6B60]/30
              bg-[#071827]/60 backdrop-blur-sm"
            >
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
            <div
              className="rounded-xl p-2.5 border border-[#2F6B60]/30
              bg-[#071827]/60 backdrop-blur-sm"
            >
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={compareDates[0] || ""}
                    onChange={(e) => setCompareSlot(0, e.target.value)}
                    className="flex-1 px-2 py-1 rounded-lg text-xs
                    bg-[#02061a] text-white border border-[#2F6B60]/40
                    focus:border-[#4ade80]/50 focus:outline-none
                    [color-scheme:dark]"
                  />
                  <input
                    type="date"
                    value={compareDates[1] || ""}
                    onChange={(e) => setCompareSlot(1, e.target.value)}
                    className="flex-1 px-2 py-1 rounded-lg text-xs
                    bg-[#02061a] text-white border border-[#2F6B60]/40
                    focus:border-[#4ade80]/50 focus:outline-none
                    [color-scheme:dark]"
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

      {/* Right Panel */}
      <div
        className="xl:col-span-1 relative rounded-2xl border p-3
       bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]      
       dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
       space-y-3 w-full min-h-[400px] md:min-h-[600px]
        border-green-600/40 dark:border-gray-700 transition-colors"
      >
        <div className="text-sm text-white font-bold mb-2">
          {dayjs(selectedDate).format("dddd, DD MMM YYYY")}
        </div>

        {/* Selected date stats */}
        <div
          className="rounded-2xl p-2 border
         bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]      
         dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] 
          border-green-600/40 dark:border-gray-700 transition-colors
         "
        >
          <h4 className="font-semibold text-[#00e5ff] mb-2">Day Summary</h4>
          <div className="grid grid-cols-5 text-center mt-0 min-h-[20px]">
            <div>
              <p className="text-[#38bdf8] font-semibold">
                {(studyMap[selectedDate] || []).length}
              </p>
              <p className="text-xs opacity-70">Topics</p>
            </div>
            <div>
              <p className="text-[#22c55e] font-semibold">
                {combinedExercisesForDateWrapper(selectedDate, gymLogs).length}
              </p>
              <p className="text-xs opacity-70">Exercises</p>
            </div>
            <div>
              <p className="text-[#facc15] font-semibold">
                {selectedGym.calories || "—"}
              </p>
              <p className="text-xs opacity-70">Calories</p>
            </div>
            <div>
              <p className="text-[#f472b6] font-semibold">
                {selectedGym.weight || "—"}
              </p>
              <p className="text-xs opacity-70">Weight</p>
            </div>
            <div>
              <p className="text-[#34d399] font-semibold">
                {selectedGym.bmi || "—"}
              </p>
              <p className="text-xs opacity-70">BMI</p>
            </div>
          </div>
        </div>

        {/* Topics studied - Sticky Header & Footer */}
        <div
          className="rounded-xl border border-green-600/40 dark:border-gray-700
          bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]      
          dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]        
          transition-all duration-300
          min-h-[160px] max-h-[360px]
          flex flex-col overflow-hidden"
        >
          {/* Sticky Header */}
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

          {/* Scrollable Content - Only Topics */}
          <div className="flex-1 overflow-y-auto px-3 pt-2 custom-scrollbar-green">
            {selectedStudy.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1 text-[#bbf7d0] pb-2">
                {selectedStudy.map((t, i) => (
                  <li key={i}>{t}</li>
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

          {/* Sticky Footer - Stats & Categories */}
          {selectedStudy.length > 0 && (
            <div className="sticky bottom-0 z-10 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] px-3 pb-3 pt-2 border-t border-[#2F6B60]/20">
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#4ade80]/10 to-transparent backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-[#4ade80]/20">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">✓</span>
                    <span className="text-[#9FF2E8]/60 text-[10px]">Done</span>
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

              {/* Study Categories */}
              {getStudyCategories(selectedStudy).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {getStudyCategories(selectedStudy).map((category, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Scrollbar - Green theme */}
        <style jsx>{`
          .custom-scrollbar-green::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar-green::-webkit-scrollbar-track {
            background: rgba(16, 185, 129, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar-green::-webkit-scrollbar-thumb {
            background: rgba(74, 222, 128, 0.4);
            border-radius: 10px;
          }
          .custom-scrollbar-green::-webkit-scrollbar-thumb:hover {
            background: rgba(74, 222, 128, 0.6);
          }
        `}</style>

        {/* Gym Exercises - Sticky Header */}
        <div
          className="rounded-xl border border-[#2F6B60]/30
          bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]      
          dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
          transition-all duration-300
          min-h-[160px] max-h-[260px]
          flex flex-col overflow-hidden"
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] p-3 pb-2 border-b border-[#2F6B60]/20">
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

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3 pt-2 custom-scrollbar">
            {gymLogs[selectedDate] ? (
              <div className="space-y-2">
                {/* Exercise List */}
                <div className="text-sm space-y-1 text-[#e2e8f0]">
                  {renderExercises(selectedDate, gymLogs)}
                </div>

                {/* Workout Analytics */}
                <div className="mt-3 pt-3 border-t border-[#2F6B60]/30">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Total Sets */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                      <div className="text-[10px] text-[#9FF2E8]/50 mb-1">
                        Total Sets
                      </div>
                      <div className="text-lg font-bold text-[#60A5FA]">
                        {combinedExercisesForDateWrapper(selectedDate).reduce(
                          (sum, ex) => {
                            const sets = ex.match(/(\d+)\s*×/);
                            return sum + (sets ? parseInt(sets[1]) : 0);
                          },
                          0,
                        )}
                      </div>
                    </div>

                    {/* Total Reps */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                      <div className="text-[10px] text-[#9FF2E8]/50 mb-1">
                        Total Reps
                      </div>
                      <div className="text-lg font-bold text-[#4ade80]">
                        {combinedExercisesForDateWrapper(selectedDate).reduce(
                          (sum, ex) => {
                            const reps = ex.match(/×\s*(\d+)/);
                            return sum + (reps ? parseInt(reps[1]) : 0);
                          },
                          0,
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Target Muscle Groups */}
                  <div className="mt-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-[#2F6B60]/20">
                    <div className="text-[10px] text-[#9FF2E8]/50 mb-1.5">
                      Target Muscles
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getTargetMuscles(selectedDate).map((muscle, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#ff6b6b]/20 border border-[#ff6b6b]/30 text-[10px] text-[#ff6b6b] font-medium"
                        >
                          {muscle}
                        </span>
                      ))}
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

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(47, 107, 96, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(63, 167, 150, 0.4);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(63, 167, 150, 0.6);
          }
        `}</style>
      </div>
    </div>
  );
}
