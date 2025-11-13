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

// Updated Calendar — with: selected glow (neon blue), today highlight,
// compact "no exercises" handling, light-theme color fixes, monthly stats,
// hover popup, smooth animations, and Quote replaced with Today's Stats.

// LocalStorage helpers
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

function todayISO() {
  return dayjs().format("YYYY-MM-DD");
}

// Combined extractor (same robust version as before)
function combinedExercisesForDate(iso) {
  const gymLogs = load("wd_gym_logs", {}) || {};
  const g = gymLogs[iso] || {};
  if (g.cleanedExercises && Array.isArray(g.cleanedExercises))
    return g.cleanedExercises;
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
      if (v.name && typeof v.name === "string") return pushIf(v.name);
      if (v.title && typeof v.title === "string") return pushIf(v.title);
      if (v.exercise && typeof v.exercise === "string")
        return pushIf(v.exercise);
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
        const ignoreKeys = [
          "done",
          "weight",
          "calories",
          "bmi",
          "notes",
          "date",
          "weekday",
          "cleanedExercises",
          "workout",
        ];
        keys.forEach((k) => {
          const val = v[k];
          if (ignoreKeys.includes(k)) return;
          if (val === true) {
            const pretty = k
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            parts.push(pretty);
          } else if (typeof val === "string" && val.trim()) {
            parts.push(val.trim());
          }
        });
        return;
      }
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
      keys.forEach((k) => {
        if (v[k] === true) parts.push(k);
      });
      return;
    }
    parts.push(String(v));
  };

  ["left", "right", "finisher", "exercises", "sets"].forEach((blk) => {
    if (g[blk]) pushIf(g[blk]);
  });

  if (Array.isArray(g)) pushIf(g);
  else if (typeof g === "object" && g !== null) {
    if (g.exercises) pushIf(g.exercises);
    else if (g.workout) pushIf(g.workout);
    else {
      Object.keys(g || {}).forEach((k) => {
        const v = g[k];
        if (v === true) parts.push(k);
      });
    }
  }

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

  const cleaned = parts
    .map((s) => (typeof s === "string" ? s.trim() : String(s)))
    .filter(Boolean);
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

function renderExercises(iso) {
  const logs = load("wd_gym_logs", {}) || {};
  const entry = logs[iso];
  if (!entry) return null; // compact: show nothing if no gym entry
  const planStore = load("wd_gym_plan", {}) || {};
  const weekday = entry.weekday || dayjs(iso).format("dddd");
  const todayPlan = planStore[weekday] || {};
  const allExercises = [
    ...(todayPlan.left || []),
    ...(todayPlan.right || []),
    ...(todayPlan.finisher || []),
  ];
  const bools = [
    ...(entry.left || []),
    ...(entry.right || []),
    ...(entry.finisher || []),
  ];
  const doneExercises = allExercises.filter((ex, i) => bools[i]);
  if (!doneExercises.length) return null; // compact
  return (
    <ul className="list-disc list-inside text-sm space-y-1">
      {doneExercises.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );
}

export default function CalendarFullDarkUpdated() {
  const [month, setMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [syllabus, setSyllabus] = useState(() => load("syllabus_tree_v2", {}));
  const [gymLogs, setGymLogs] = useState(() => load("wd_gym_logs", {}));
  const [doneMap, setDoneMap] = useState(() => load("wd_done", {}));
  const [notesMap, setNotesMap] = useState(() => load("wd_notes_v1", {}));
  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));
  const [view, setView] = useState("calendar");
  const [compareDates, setCompareDates] = useState([null, null]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const hoverRef = useRef(null);

  useEffect(() => {
    setSyllabus(load("syllabus_tree_v2", {}));
    setGymLogs(load("wd_gym_logs", {}));
    setDoneMap(load("wd_done", {}));
    setNotesMap(load("wd_notes_v1", {}));
    setBmiLogs(load("bmi_logs", []));
    setSelectedDate(todayISO());
  }, []);

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
    const done = load("wd_done", {});
    const today = dayjs();
    let cur = 0;
    for (let i = 0; i < 365; i++) {
      const k = today.subtract(i, "day").format("YYYY-MM-DD");
      if (done[k]) cur++;
      else break;
    }
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
    return combinedExercisesForDate(iso);
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
    setNotesMap(next);
    save("wd_notes_v1", next);
  }

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
      }
    };
    reader.readAsText(file);
  }

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

  useEffect(() => save("wd_done", doneMap), [doneMap]);
  useEffect(() => save("wd_gym_logs", gymLogs), [gymLogs]);
  useEffect(() => save("wd_notes_v1", notesMap), [notesMap]);

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
      exercises += combinedExercisesForDateWrapper(iso).length;
    }
    return { topics, exercises };
  }, [month, studyMap, gymLogs]);

  // Today's stats card (replaces quote)
  const todayStats = useMemo(() => {
    const iso = todayISO();
    const topics = (studyMap[iso] || []).length;
    const exercises = combinedExercisesForDateWrapper(iso).length;
    const g = gymLogs[iso] || {};
    return {
      topics,
      exercises,
      calories: g.calories || "—",
      weight: g.weight || "—",
      bmi: g.bmi || "—",
    };
  }, [studyMap, gymLogs]);

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

  return (
    <div className="w-full max-w-6xl mx-auto p-3 grid grid-cols-1 lg:grid-cols-[1.7fr,1fr] gap-4 items-start transition-colors duration-500 bg-[#0b1220] rounded-xl">
      {/* Top Controls */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border bg-gradient-to-b from-[#0b0b0b] to-[#071016] shadow-md transition-all duration-300 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">🔥 Streak</div>
              <div className="text-xs opacity-70">
                {streakInfo.current} days
              </div>
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

          {/* Today's Stats (replaces quote) */}
          <div className="rounded-xl p-4 border bg-gradient-to-br from-[#071022] to-[#081427] shadow-md transition-all duration-300 text-white">
            <div className="text-sm font-semibold text-[#60a5fa] mb-1">
              📊 Today's Stats
            </div>
            <div className="grid grid-cols-5 text-center mt-2">
              <div>
                <p className="text-[#38bdf8] font-semibold">
                  {todayStats.topics}
                </p>
                <p className="text-xs opacity-70">Topics</p>
              </div>
              <div>
                <p className="text-[#22c55e] font-semibold">
                  {todayStats.exercises}
                </p>
                <p className="text-xs opacity-70">Exercises</p>
              </div>
              <div>
                <p className="text-[#facc15] font-semibold">
                  {todayStats.calories}
                </p>
                <p className="text-xs opacity-70">Calories</p>
              </div>
              <div>
                <p className="text-[#f472b6] font-semibold">
                  {todayStats.weight}
                </p>
                <p className="text-xs opacity-70">Weight</p>
              </div>
              <div>
                <p className="text-[#34d399] font-semibold">{todayStats.bmi}</p>
                <p className="text-xs opacity-70">BMI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {[
            { label: "Calendar", val: "calendar" },
            { label: "Weekly", val: "weekly" },
            { label: "Compare", val: "compare" },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => setView(btn.val)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                view === btn.val
                  ? "bg-[#000000] text-[#00e5ff] shadow-[0_4px_20px_rgba(0,149,255,0.18)]"
                  : "bg-[#071227] hover:bg-[#0b2a44] text-[#dbeafe]"
              }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={exportAll}
            className="w-full py-2 rounded-lg text-sm bg-[#15803d] hover:bg-[#166534] text-white"
          >
            Export
          </button>

          <label className="w-full py-2 rounded-lg text-sm bg-[#0369a1] hover:bg-[#075985] text-white cursor-pointer">
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
            className="w-full py-2 rounded-lg text-sm bg-[#b91c1c] hover:bg-[#991b1b] text-white"
          >
            Reset Gym
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="lg:col-span-2 rounded-2xl border p-3 bg-[#071022] space-y-6 min-w-[650px] min-h-[600px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonth((m) => m.subtract(1, "month"))}
              className="px-2 py-1 rounded bg-black text-[#00e5ff] hover:scale-105 transition-transform"
            >
              ◀
            </button>
            <h2 className="text-lg font-semibold text-[#00e5ff]">
              {month.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setMonth((m) => m.add(1, "month"))}
              className="px-2 py-1 rounded bg-black text-[#00e5ff] hover:scale-105 transition-transform"
            >
              ▶
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMonth(dayjs())}
              className="px-3 py-1 rounded bg-black text-[#00e5ff]"
            >
              Today
            </button>
            <div className="px-3 py-1 rounded bg-[#0b0b0b] text-sm text-[#e6ffea]">
              Monthly:{" "}
              <span className="font-semibold">{monthlyStats.topics} T</span> /{" "}
              <span className="font-semibold text-red-400">
                {monthlyStats.exercises} E
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = d.format("YYYY-MM-DD");
            const status = getDayStatusStr(iso);
            const isCurMonth = d.month() === month.month();
            const isToday = iso === todayISO();
            const isSelected = iso === selectedDate;

            const base = `aspect-square w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all duration-300 transform`;
            const notCur = !isCurMonth ? "opacity-40" : "";

            const bgClass =
              status === "both"
                ? "bg-gradient-to-br from-[#2563eb] to-[#e11d48] text-white"
                : status === "study"
                ? "bg-[#07391f] text-green-200"
                : status === "gym"
                ? "bg-[#071633] text-blue-200"
                : "bg-[#0b1220] text-[#bfe9ff]";

            return (
              <button
                key={iso}
                onClick={() => openDay(d)}
                onMouseEnter={(e) => handleMouseEnterDate(e, iso)}
                onMouseLeave={handleMouseLeaveDate}
                className={`${base} ${notCur} ${bgClass} ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-[#0ea5ff] shadow-[0_8px_30px_rgba(14,165,255,0.12)] scale-105"
                    : "hover:scale-105"
                }`}
                title={`${d.format("ddd, DD MMM YYYY")} — ${
                  status === "both"
                    ? "Study + Gym"
                    : status === "study"
                    ? "Study"
                    : status === "gym"
                    ? "Gym"
                    : ""
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-full h-full ${
                    isToday
                      ? "before:absolute before:inset-0 before:rounded-xl before:ring-2 before:ring-green-500/40 before:animate-pulse"
                      : ""
                  }`}
                >
                  <span>{d.date()}</span>
                  {/* small dot indicators */}
                  <div className="absolute bottom-2 flex gap-1">
                    {status === "study" || status === "both" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    ) : null}
                    {status === "gym" || status === "both" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Notes */}
        <div className="rounded-xl p-3 border bg-[#071227] transition-all">
          <h4 className="font-semibold text-[#00e5ff] mb-2">📝 Notes</h4>
          <textarea
            value={selectedNote}
            onChange={(e) => saveNoteForDate(selectedDate, e.target.value)}
            placeholder="Write a short note about today..."
            className="w-full min-h-[70px] p-2 border rounded bg-[#02060a] text-[#cfefff] border-[#233446]"
          />
        </div>

        <div className="space-y-4">
          {view === "weekly" && (
            <div className="rounded-xl p-4 border bg-[#071827] transition-colors text-[#dbeafe]">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#122236" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      wrapperStyle={{
                        backgroundColor: "#071425",
                        border: "1px solid #263249",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="study" stackId="a" />
                    <Bar dataKey="gym" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {view === "compare" && (
            <div className="rounded-xl p-4 border bg-[#071827] transition-colors text-[#dbeafe]">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={compareDates[0] || ""}
                    onChange={(e) => setCompareSlot(0, e.target.value)}
                    className="border rounded px-2 py-1 bg-[#02061a] text-white"
                  />
                  <input
                    type="date"
                    value={compareDates[1] || ""}
                    onChange={(e) => setCompareSlot(1, e.target.value)}
                    className="border rounded px-2 py-1 bg-[#02061a] text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                      <div className="p-2 border rounded bg-[#071323]">
                        <div className="text-xs opacity-70">{iso || "—"}</div>
                        <div>Study: {info ? info.studyCount : "—"}</div>
                        <div>
                          Gym: {info ? (info.gymDone ? "Yes" : "No") : "—"}
                        </div>
                        <div>
                          Exercises: {info ? info.exercises.length : "—"}
                        </div>
                        <div className="text-sm opacity-70 mt-1">
                          {info?.notes}
                        </div>
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
      <div className="rounded-2xl border p-3 bg-[#071022] space-y-3 min-h-[600px] min-w-[450px]">
        <div className="text-sm text-[#60a5fa] mb-2">
          {dayjs(selectedDate).format("dddd, DD MMM YYYY")}
        </div>

        <div className="rounded-2xl p-3 border bg-[#071827]">
          <h4 className="font-semibold text-[#00e5ff] mb-2">Day Summary</h4>
          <div className="grid grid-cols-5 text-center mt-2">
            <div>
              <p className="text-[#38bdf8] font-semibold">
                {(studyMap[selectedDate] || []).length}
              </p>
              <p className="text-xs opacity-70">Topics</p>
            </div>
            <div>
              <p className="text-[#22c55e] font-semibold">
                {combinedExercisesForDateWrapper(selectedDate).length}
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

        <div className="rounded-xl p-3 border bg-[#132f27] border-green-600/40 dark:bg-[#0c2f28] dark:border-gray-700 transition-colors">
          <h4 className="font-semibold text-green-400 mb-2">
            📚 Topics Studied
          </h4>
          {(selectedStudy.length && (
            <ul className="list-disc list-inside text-sm space-y-1 text-[#bbf7d0]">
              {selectedStudy.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )) || <div className="text-sm opacity-60">—</div>}
        </div>

        <div className="rounded-xl p-3 border bg-[#071427] min-h-[160px]">
          <h4 className="font-semibold text-[#60a5fa] mb-2">🏋️ Gym Summary</h4>
          <div className="text-sm space-y-1 text-[#e2e8f0]">
            <div className="mt-2">
              <b>Exercises:</b>
              <div className="mt-1">
                {renderExercises(selectedDate) || (
                  <div className="text-sm opacity-60">—</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
