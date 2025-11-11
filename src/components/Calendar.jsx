// Calendar_Full_Dark.jsx
import React, { useState, useMemo, useEffect } from "react";
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

/**
 * Calendar — Full Dark (final)
 *
 * LocalStorage keys used (keeps compatibility with your app):
 *  - syllabus_tree_v2
 *  - wd_gym_logs
 *  - wd_done
 *  - bmi_logs
 *  - wd_notes_v1
 *
 * Install:
 *  npm i dayjs recharts
 *
 * Drop into your components folder and import where needed.
 */

// ----------------- small local helpers -----------------
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("load error", key, e);
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("save error", key, e);
  }
}

// quotes
const QUOTES = [
  "Small progress is still progress — show up today.",
  "Focus on consistency, not perfection.",
  "Lift heavy. Ship often. Repeat.",
  "Short, focused sessions beat long, distracted ones.",
  "Progress compounds — keep stacking days.",
];

function todayISO() {
  return dayjs().format("YYYY-MM-DD");
}

// ----------------- robust exercise extractor -----------------
function combinedExercisesForDate(iso) {
  // load raw gym logs (helps if other modules update storage)
  const gymLogs = load("wd_gym_logs", {}) || {};
  const g = gymLogs[iso] || {};
  if (g.cleanedExercises && Array.isArray(g.cleanedExercises)) {
    return g.cleanedExercises;
  }

  const parts = [];

  const pushIf = (v) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) {
      v.forEach((it) => pushIf(it));
      return;
    }
    if (typeof v === "string") {
      if (v.trim()) parts.push(v.trim());
      return;
    }
    if (typeof v === "number") {
      parts.push(String(v));
      return;
    }
    if (typeof v === "object" && v !== null) {
      // common keys
      if (v.name && typeof v.name === "string") return pushIf(v.name);
      if (v.title && typeof v.title === "string") return pushIf(v.title);
      if (v.exercise && typeof v.exercise === "string")
        return pushIf(v.exercise);
      // sometimes you have {name:..., reps:...} or nested objects
      // check if object is a map of name->true
      const keys = Object.keys(v);
      const isMapOfTrues =
        keys.length &&
        keys.every(
          (k) =>
            v[k] === true ||
            v[k] === false ||
            typeof v[k] === "string" ||
            typeof v[k] === "number"
        );
      if (isMapOfTrues) {
        keys.forEach((k) => {
          const val = v[k];
          if (val === true || val === 1) parts.push(k);
          else if (typeof val === "string" && val.trim())
            parts.push(val.trim());
          else if (typeof val === "number") parts.push(String(val));
        });
        return;
      }
      // otherwise try to find nested name/title
      for (const k of keys) {
        const val = v[k];
        if (
          typeof val === "string" &&
          val.trim() &&
          (k === "name" || k === "title" || k === "exercise")
        ) {
          parts.push(val.trim());
        } else if (typeof val === "object") {
          pushIf(val);
        } else if (
          (val === true ||
            typeof val === "string" ||
            typeof val === "number") &&
          (k.toLowerCase().includes("exercise") ||
            k.toLowerCase().includes("name") ||
            k.toLowerCase().includes("title"))
        ) {
          parts.push(String(val));
        }
      }
      // fallback: stringify keys where value is truthy
      keys.forEach((k) => {
        if (v[k] === true) parts.push(k);
      });
      return;
    }
    // fallback primitives
    parts.push(String(v));
  };

  // common blocks used in your gym logs: left, right, finisher, exercises, sets
  ["left", "right", "finisher", "exercises", "sets"].forEach((blk) => {
    if (g[blk]) pushIf(g[blk]);
  });

  // if g itself is an array or object with top-level names
  if (Array.isArray(g)) pushIf(g);
  else if (typeof g === "object" && g !== null) {
    // sometimes you store array under g.exercises or g.workout
    if (g.exercises) pushIf(g.exercises);
    else if (g.workout) pushIf(g.workout);
    else {
      // fallback: inspect keys
      const keys = Object.keys(g || {});
      // if keys are strings mapped to true, collect them
      keys.forEach((k) => {
        const v = g[k];
        if (v === true) parts.push(k);
      });
    }
  }

  // NEW FIX — handle boolean arrays + reference plan
  if (
    Array.isArray(g.left) ||
    Array.isArray(g.right) ||
    Array.isArray(g.finisher)
  ) {
    const plan = JSON.parse(localStorage.getItem("wd_gym_plan") || "{}");
    const weekday = g.weekday || dayjs(iso).format("dddd");
    const todayPlan = plan[weekday] || {};
    const allExercises = [
      ...(todayPlan.left || []),
      ...(todayPlan.right || []),
      ...(todayPlan.finisher || []),
    ];
    const bools = [
      ...(g.left || []),
      ...(g.right || []),
      ...(g.finisher || []),
    ];
    bools.forEach((b, i) => {
      if (b && allExercises[i]) parts.push(allExercises[i]);
    });
  }

  // unique and cleaned
  const cleaned = parts
    .map((s) => (typeof s === "string" ? s.trim() : String(s)))
    .filter(Boolean);
  // dedupe keeping order
  const seen = new Set();
  const out = [];
  cleaned.forEach((x) => {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  });
  return out;
}

// render helper
function renderExercises(iso) {
  const arr = combinedExercisesForDate(iso);
  if (!arr.length)
    return <p className="text-sm opacity-70">No exercises logged.</p>;
  return (
    <ul className="list-disc list-inside text-sm space-y-1">
      {arr.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );
}

// ----------------- main component -----------------
export default function CalendarFullDark() {
  // state variables (same keys as your app)
  const [month, setMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [syllabus, setSyllabus] = useState(() => load("syllabus_tree_v2", {}));
  const [gymLogs, setGymLogs] = useState(() => load("wd_gym_logs", {}));
  const [doneMap, setDoneMap] = useState(() => load("wd_done", {}));
  const [notesMap, setNotesMap] = useState(() => load("wd_notes_v1", {}));
  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));
  const [quote, setQuote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );
  const [view, setView] = useState("calendar"); // calendar | weekly | compare
  const [compareDates, setCompareDates] = useState([null, null]);
  const [importing, setImporting] = useState(false);

  // keep synched on mount
  useEffect(() => {
    setSyllabus(load("syllabus_tree_v2", {}));
    setGymLogs(load("wd_gym_logs", {}));
    setDoneMap(load("wd_done", {}));
    setNotesMap(load("wd_notes_v1", {}));
    setBmiLogs(load("bmi_logs", []));
    setSelectedDate(todayISO());
  }, []);

  // rebuild study map (date -> [titles]) from syllabus tree
  const studyMap = useMemo(() => {
    const out = {};
    function walk(node) {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (it && it.done && it.completedOn) {
            out[it.completedOn] = out[it.completedOn] || [];
            out[it.completedOn].push(it.title || it.name || "Topic");
          }
        });
        return;
      }
      for (const v of Object.values(node || {})) walk(v);
    }
    walk(syllabus || {});
    return out;
  }, [syllabus]);

  // days to display (6 weeks)
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

  // Streaks (current and longest)
  const streakInfo = useMemo(() => {
    const done = load("wd_done", {});
    const today = dayjs();
    let cur = 0;
    for (let i = 0; i < 365; i++) {
      const k = today.subtract(i, "day").format("YYYY-MM-DD");
      if (done[k]) cur++;
      else break;
    }
    // longest streak
    let longest = 0;
    let running = 0;
    const keys = Object.keys(done).sort();
    for (const k of keys) {
      if (done[k]) running++;
      else running = 0;
      if (running > longest) longest = running;
    }
    const percent = longest ? Math.round((cur / longest) * 100) : 0;
    return { current: cur, longest, percent };
  }, [doneMap]);

  // weekly summary for chart (last 7)
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

  // combined exercises helper uses robust extractor above
  function combinedExercisesForDateWrapper(iso) {
    return combinedExercisesForDate(iso);
  }

  // weekly / compare helpers
  function setCompareSlot(idx, date) {
    setCompareDates((prev) => {
      const next = [...prev];
      next[idx] = date;
      return next;
    });
  }

  // notes save
  function saveNoteForDate(date, text) {
    const next = { ...notesMap, [date]: text };
    setNotesMap(next);
    save("wd_notes_v1", next);
  }

  // export/import all
  function exportAll() {
    const payload = {
      syllabus: load("syllabus_tree_v2", {}),
      gymLogs: load("wd_gym_logs", {}),
      doneMap: load("wd_done", {}),
      bmiLogs: load("bmi_logs", []),
      notes: load("wd_notes_v1", {}),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dashboard-backup-${dayjs().format("YYYYMMDD")}.json`;
    a.click();
  }

  function importAll(file) {
    if (!file) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.syllabus) {
          save("syllabus_tree_v2", data.syllabus);
          setSyllabus(data.syllabus);
        }
        if (data.gymLogs) {
          save("wd_gym_logs", data.gymLogs);
          setGymLogs(data.gymLogs);
        }
        if (data.doneMap) {
          save("wd_done", data.doneMap);
          setDoneMap(data.doneMap);
        }
        if (data.bmiLogs) {
          save("bmi_logs", data.bmiLogs);
          setBmiLogs(data.bmiLogs);
        }
        if (data.notes) {
          save("wd_notes_v1", data.notes);
          setNotesMap(data.notes);
        }
        alert("Import successful!");
      } catch (err) {
        console.error(err);
        alert("Import failed.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  }

  // reset gym
  function resetGymProgress() {
    if (
      !confirm(
        "Reset all gym logs and wd_done calendar marks? This cannot be undone."
      )
    )
      return;
    save("wd_gym_logs", {});
    save("wd_done", {});
    save("wd_weight_overrides", {});
    setGymLogs({});
    setDoneMap({});
    alert("Gym progress reset.");
  }

  // ensure selectedDate / re-sync when storage changes externally
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;
      if (e.key === "syllabus_tree_v2")
        setSyllabus(load("syllabus_tree_v2", {}));
      if (e.key === "wd_gym_logs") setGymLogs(load("wd_gym_logs", {}));
      if (e.key === "wd_done") setDoneMap(load("wd_done", {}));
      if (e.key === "wd_notes_v1") setNotesMap(load("wd_notes_v1", {}));
      if (e.key === "bmi_logs") setBmiLogs(load("bmi_logs", []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // auto-save doneMap/gym/notes when changed in-app
  useEffect(() => save("wd_done", doneMap), [doneMap]);
  useEffect(() => save("wd_gym_logs", gymLogs), [gymLogs]);
  useEffect(() => save("wd_notes_v1", notesMap), [notesMap]);

  // small UI pieces (StreakBar, TodayHighlights, WeeklySummary, ComparePanel)
  function StreakBar() {
    return (
      <div className="bg-[#1c1c1e]/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-md text-gray-300">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">🔥 Streak</div>
          <div className="text-xs opacity-70">{streakInfo.current} days</div>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
            style={{ width: `${streakInfo.percent}%` }}
          />
        </div>
        <div className="mt-2 text-xs opacity-70 flex justify-between">
          <span>Longest: {streakInfo.longest}d</span>
          <span>{streakInfo.percent}% of longest</span>
        </div>
      </div>
    );
  }

  function TodayHighlights({ iso, streakInfo }) {
    const gym = load("wd_gym_logs") || {};
    const syllabus = load("syllabus_tree_v2") || {};

    // --- Count study topics for this date ---
    function countTopics(node) {
      if (!node) return 0;
      let count = 0;
      if (Array.isArray(node)) {
        node.forEach((it) => {
          if (it.completedOn === iso) count++;
        });
      } else if (typeof node === "object") {
        for (const v of Object.values(node)) count += countTopics(v);
      }
      return count;
    }

    const topicCount = countTopics(syllabus);

    // --- Extract gym info for this date ---
    const gymData = gym[iso] || {};
    const exerciseCount = (gymData.cleanedExercises || []).length || 0;
    const caloriesCount = gymData.calories || "—";
    const weightValue = gymData.weight || "—";

    // --- UI ---
    return (
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#182c48] via-[#1f2d4a] to-[#0e1c33] border border-[#3b82f6]/40 shadow-md text-white dark:bg-[#0f172a] dark:border-gray-700 dark:text-gray-200 transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-white dark:text-[#93c5fd]">
            {dayjs(iso).format("dddd, DD MMM")}
          </h3>
          <div className="text-xs text-white/90 dark:text-gray-400">
            🔥 Streak: {streakInfo?.current || 0}d
          </div>
        </div>

        <div className="grid grid-cols-4 text-center mt-2">
          <div>
            <p className="text-[#38bdf8] font-semibold">{topicCount}</p>
            <p className="text-xs text-white/80 dark:text-gray-400">Topics</p>
          </div>
          <div>
            <p className="text-[#22c55e] font-semibold">{exerciseCount}</p>
            <p className="text-xs text-white/80 dark:text-gray-400">
              Exercises
            </p>
          </div>
          <div>
            <p className="text-[#facc15] font-semibold">{caloriesCount}</p>
            <p className="text-xs text-white/80 dark:text-gray-400">Calories</p>
          </div>
          <div>
            <p className="text-[#f472b6] font-semibold">{weightValue}</p>
            <p className="text-xs text-white/80 dark:text-gray-400">Weight</p>
          </div>
        </div>
      </div>
    );
  }

  function WeeklySummary() {
    return (
      <div className="rounded-xl p-3 border border-gray-700 bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Weekly Summary</h4>
          <div className="text-xs opacity-70">Last 7 days</div>
        </div>
        <div className="h-48 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233046" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                wrapperStyle={{
                  backgroundColor: "#0b1220",
                  border: "1px solid #263249",
                }}
              />
              <Legend />
              <Bar dataKey="study" stackId="a" fill="#16a34a" />
              <Bar dataKey="gym" stackId="a" fill="#0284c7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  function ComparePanel() {
    const [a, b] = compareDates;
    const info = (iso) => ({
      studyCount: (studyMap[iso] || []).length,
      gymDone: !!gymLogs[iso],
      exercises: combinedExercisesForDateWrapper(iso),
      notes: notesMap[iso] || "",
    });
    const ia = a ? info(a) : null;
    const ib = b ? info(b) : null;
    return (
      <div className="rounded-xl p-3 border border-gray-700 bg-gray-900 shadow-sm">
        <h4 className="font-semibold mb-2">Compare Dates</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={a || ""}
            onChange={(e) => setCompareSlot(0, e.target.value)}
            className="border rounded px-2 py-1 bg-gray-800"
          />
          <input
            type="date"
            value={b || ""}
            onChange={(e) => setCompareSlot(1, e.target.value)}
            className="border rounded px-2 py-1 bg-gray-800"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 border rounded bg-gray-900">
            <div className="text-xs opacity-70">{a || "—"}</div>
            <div>Study: {ia ? ia.studyCount : "—"}</div>
            <div>Gym: {ia ? (ia.gymDone ? "Yes" : "No") : "—"}</div>
            <div>Exercises: {ia ? ia.exercises.length : "—"}</div>
            <div className="text-sm opacity-70 mt-1">{ia?.notes}</div>
          </div>
          <div className="p-2 border rounded bg-gray-900">
            <div className="text-xs opacity-70">{b || "—"}</div>
            <div>Study: {ib ? ib.studyCount : "—"}</div>
            <div>Gym: {ib ? (ib.gymDone ? "Yes" : "No") : "—"}</div>
            <div>Exercises: {ib ? ib.exercises.length : "—"}</div>
            <div className="text-sm opacity-70 mt-1">{ib?.notes}</div>
          </div>
        </div>
      </div>
    );
  }

  // right panel main contents
  const selectedStudy = studyMap[selectedDate] || [];
  const selectedGym = gymLogs[selectedDate] || {};
  const selectedExercises = combinedExercisesForDateWrapper(selectedDate);
  const selectedNote = notesMap[selectedDate] || "";

  // ----------------- UI -----------------
  return (
    <div className="w-full max-w-6xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 items-start transition-colors duration-500 bg-[#0b1220] dark:bg-transparent">
      {/* Top Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        {/* Row 1: Streak + Quote */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Streak Card */}
          {/* Streak Card */}
          <div className="rounded-xl p-4 border border-[#3b82f6]/40 bg-gradient-to-b from-[#182c48] to-[#0e1c33] shadow-md dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 text-white dark:text-gray-200">
            <StreakBar />
          </div>

          {/* Quote Card */}
          <div className="rounded-xl p-4 border border-[#3b82f6]/40 bg-gradient-to-b from-[#182c48] to-[#0e1c33] shadow-md dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 flex flex-col justify-center">
            <div className="text-sm font-semibold text-[#38bdf8] dark:text-teal-300 mb-1">
              💬 Quote
            </div>
            <div className="text-sm text-[#e2e8f0] dark:text-gray-300 leading-snug">
              {quote}
            </div>
          </div>
        </div>

        {/* Row 2: Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {[
            { label: "Calendar", val: "calendar" },
            { label: "Weekly", val: "weekly" },
            { label: "Compare", val: "compare" },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setView(btn.val)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                view === btn.val
                  ? "bg-[#2563eb] text-white dark:bg-[#1f2937] dark:hover:bg-gray-700"
                  : "bg-[#1c2b45] hover:bg-[#263656] text-[#e2e8f0] dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={exportAll}
            className="w-full py-2 rounded-lg text-sm bg-[#15803d] hover:bg-[#166534] text-white dark:bg-emerald-700/40 dark:hover:bg-emerald-600/50"
          >
            Export
          </button>

          <label className="w-full py-2 rounded-lg text-sm bg-[#0369a1] hover:bg-[#075985] text-white cursor-pointer dark:bg-sky-700/40 dark:hover:bg-sky-600/50">
            Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => importAll(e.target.files?.[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={resetGymProgress}
            className="w-full py-2 rounded-lg text-sm bg-[#b91c1c] hover:bg-[#991b1b] text-white dark:bg-red-600 dark:hover:bg-red-500"
          >
            Reset Gym
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="lg:col-span-2 rounded-2xl border border-[#274472] dark:border-gray-700 p-3 bg-[#13223a] dark:bg-[#071022] space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonth((m) => m.subtract(1, "month"))}
              className="px-2 py-1 rounded bg-[#1c2b45] hover:bg-[#263656] text-[#e2e8f0] dark:bg-gray-800 dark:text-white"
            >
              ◀
            </button>
            <h2 className="text-lg font-semibold text-[#60a5fa] dark:text-gray-100">
              {month.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setMonth((m) => m.add(1, "month"))}
              className="px-2 py-1 rounded bg-[#1c2b45] hover:bg-[#263656] text-[#e2e8f0] dark:bg-gray-800 dark:text-white"
            >
              ▶
            </button>
          </div>
          <button
            onClick={() => setMonth(dayjs())}
            className="px-3 py-1 rounded bg-[#1c2b45] hover:bg-[#263656] text-[#e2e8f0] dark:bg-gray-800 dark:text-white"
          >
            Today
          </button>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = d.format("YYYY-MM-DD");
            const status = getDayStatusStr(iso);
            const isCurMonth = d.month() === month.month();

            return (
              <button
                key={iso}
                onClick={() => openDay(d)}
                className={`aspect-square w-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300 hover:scale-105 ${
                  !isCurMonth ? "opacity-30" : ""
                } ${
                  status === "both"
                    ? "bg-gradient-to-br from-[#2563eb] to-[#e11d48] text-white"
                    : status === "study"
                    ? "bg-[#22c55e]/70 text-white"
                    : status === "gym"
                    ? "bg-[#38bdf8]/80 text-[#0f172a]"
                    : "bg-[#1c2b45] hover:bg-[#263656] text-[#e2e8f0]"
                } dark:${
                  status === "both"
                    ? "bg-gradient-to-br from-[#38bdf8]/60 to-[#34d399]/60 text-white"
                    : status === "study"
                    ? "bg-[#22c55e]/30 text-green-200"
                    : status === "gym"
                    ? "bg-[#0ea5e9]/30 text-blue-200"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {d.date()}
              </button>
            );
          })}
        </div>

        {/* Notes Section */}
        <div className="rounded-xl p-3 border bg-[#1c2b45] border-[#3b82f6]/40 dark:bg-gray-900 dark:border-gray-700">
          <h4 className="font-semibold text-[#60a5fa] dark:text-gray-100 mb-2">
            📝 Notes
          </h4>
          <textarea
            value={selectedNote}
            onChange={(e) => saveNoteForDate(selectedDate, e.target.value)}
            placeholder="Write a short note about today..."
            className="w-full min-h-[70px] p-2 border rounded bg-[#0f1b33] text-[#e2e8f0] border-[#475569] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          />
        </div>

        {/* Compare / Weekly Containers Below Notes */}
        <div className="transition-all duration-500 ease-in-out space-y-4">
          {view === "weekly" && (
            <div className="rounded-xl p-4 border bg-[#182844] border-[#3b82f6]/50 dark:bg-[#0b2440] dark:border-gray-700 transition-colors text-[#dbeafe] dark:text-gray-100">
              <WeeklySummary />
            </div>
          )}

          {view === "compare" && (
            <div className="rounded-xl p-4 border bg-[#182844] border-[#3b82f6]/50 dark:bg-[#0b2440] dark:border-gray-700 transition-colors text-[#dbeafe] dark:text-gray-100">
              <ComparePanel />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="rounded-2xl border border-[#274472] dark:border-gray-700 p-3 bg-[#13223a] dark:bg-[#071022] space-y-3">
        <div className="text-sm text-[#93c5fd] dark:text-gray-300 mb-2">
          {dayjs(selectedDate).format("dddd, DD MMM YYYY")}
        </div>

        <TodayHighlights iso={selectedDate} streakInfo={streakInfo} />

        {/* Topics */}
        <div className="rounded-xl p-3 border bg-[#132f27] border-green-600/40 dark:bg-[#0c2f28] dark:border-gray-700 transition-colors">
          <h4 className="font-semibold text-green-400 mb-2">
            📚 Topics Studied
          </h4>
          {selectedStudy.length ? (
            <ul className="list-disc list-inside text-sm space-y-1 text-[#bbf7d0] dark:text-gray-100">
              {selectedStudy.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm opacity-70 text-green-100 dark:text-gray-300">
              No study recorded this day.
            </div>
          )}
        </div>

        {/* Gym Summary */}
        <div className="rounded-xl p-3 border bg-[#182844] border-[#3b82f6]/40 dark:bg-[#0b2440] dark:border-gray-700 transition-colors">
          <h4 className="font-semibold text-[#60a5fa] mb-2">🏋️ Gym Summary</h4>
          <div className="text-sm space-y-1 text-[#e2e8f0] dark:text-gray-100">
            <div>
              <b>Weight:</b> {selectedGym.weight ?? "-"} kg
            </div>
            <div>
              <b>Calories:</b> {selectedGym.calories ?? "-"} kcal
            </div>
            <div>
              <b>BMI:</b> {selectedGym.bmi ?? "-"}
            </div>
            <div className="mt-2">
              <b>Exercises:</b>
              <div className="mt-1">{renderExercises(selectedDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
