import React, { useEffect, useMemo, useState, useRef } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// 🔧 Auto-clean old boolean logs → replaces "true" & "done" with actual exercise names from plan
(function cleanGymLogs() {
  try {
    const raw = localStorage.getItem("wd_gym_logs");
    if (!raw) return;
    const logs = JSON.parse(raw);
    const plan = JSON.parse(localStorage.getItem("wd_gym_plan") || "{}");

    Object.entries(logs).forEach(([date, entry]) => {
      if (!entry || typeof entry !== "object") return;
      const weekday = entry.weekday || dayjs(date).format("dddd");
      const todayPlan = plan[weekday] || {};
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
      const cleaned = [];
      bools.forEach((b, i) => {
        if (b === true && allExercises[i]) cleaned.push(allExercises[i]);
      });
      // merge existing string names too
      Object.values(entry).forEach((v) => {
        if (typeof v === "string" && v.trim() && !cleaned.includes(v))
          cleaned.push(v.trim());
      });
      logs[date].cleanedExercises = cleaned;
    });

    localStorage.setItem("wd_gym_logs", JSON.stringify(logs));
  } catch (err) {
    console.warn("cleanup skipped:", err);
  }
})();

/**
 * Utilities (localStorage helpers)
 */
function load(key, fallback = null) {
  try {
    const s = localStorage.getItem(key);
    if (!s) return fallback;
    return JSON.parse(s);
  } catch (e) {
    return fallback;
  }
}
function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

/* ---------- Constants & defaults ---------- */
const DEFAULT_PLAN = {
  Monday: {
    title: "Chest + Core",
    left: [
      "Bench Press (Barbell or Smith) – 4×8",
      "Incline Dumbbell Press – 4×10",
      "Incline Chest Press Machine – 3×12-15",
      "Dumbbell Pullover – 3×10",
    ],
    right: ["Chest Fly (Pec Deck / Cable) – 3×12"],
    finisherLabel: "Core Finisher",
    finisher: ["Decline Bench Crunch – 3×15", "Cable Crunch – 3×15"],
  },
  Tuesday: {
    title: "Back + Biceps",
    left: [
      "One-Arm DB Row – 3×12 (Biceps)",
      "Barbell Curl – 3×10 (Biceps)",
      "Hammer Curl – 3×12 (Biceps)",
    ],
    right: [
      "Lat Pull-down – 4×10 (Back)",
      "Seated Cable Row – 4×10 (Back)",
      "Rope Cable Curl – 2×15 (slow burn)",
    ],
  },
  Wednesday: {
    title: "Legs (Quads + Glutes + Calves)",
    left: [
      "Squats – 4×8",
      "Leg Press Machine – 4×10",
      "Walking Lunges – 3×12 each leg",
    ],
    right: ["Leg Extension Machine – 3×15", "Seated Calf Raise Machine – 4×15"],
  },
  Thursday: {
    title: "Shoulders + Abs",
    left: [
      "Overhead DB Press – 4×10",
      "Lateral Raise – 4×12",
      "Front Raise – 3×12",
    ],
    right: ["Rear Delt Fly (Machine Pec) – 3×12", "Shrugs – 3×15"],
    finisherLabel: "Abs Finisher",
    finisher: [
      "Plank – 3×1 min",
      "Russian Twist – 3×20",
      "Bicycle Crunch – 3×20",
    ],
  },
  Friday: {
    title: "Chest + Arms (Hypertrophy)",
    left: [
      "Incline Barbell Press – 4×10 (Chest)",
      "Close-Grip Bench Press – 3×10 (Triceps)",
    ],
    right: [
      "Cable Crossovers – 3×15",
      "Triceps Rope Push-down – 3×15 (Triceps)",
      "Preacher Curl – 3×12 (Biceps)",
    ],
    finisherLabel: "Core (optional)",
    finisher: ["Decline Bench Crunch – 3×15"],
  },
  Saturday: {
    title: "Legs + Core + Cardio",
    left: [
      "Deadlift – 4×6 (strength focus)",
      "Leg Press Machine – 4×10",
      "Bulgarian Split Squat (DB/Smith) – 3×10 each leg",
    ],
    right: [
      "Hamstring Curl Machine – 3×12",
      "Sitting Calf Raise Machine – 4×15",
    ],
    finisherLabel: "Core/Cardio Finisher",
    finisher: [
      "Decline Bench Crunch – 3×15",
      "Plank – 3×1 min",
      "15–20 mins HIIT/Treadmill",
    ],
  },
};

const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const fmtISO = (d) => dayjs(d).format("YYYY-MM-DD");
const fmtDisp = (d) => dayjs(d).format("DD-MM-YYYY");

/* ---------- Main component ---------- */
export default function Gym() {
  // plan persisted (editable)
  const [plan, setPlan] = useState(() => load("wd_gym_plan", DEFAULT_PLAN));
  useEffect(() => save("wd_gym_plan", plan), [plan]);

  // calendar selection & weekday
  const todayIso = dayjs().format("YYYY-MM-DD");
  const todayName = dayjs().format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  const [weekday, setWeekday] = useState(defaultDay);
  const [date, setDate] = useState(todayIso);
  const dateKey = fmtISO(date);

  // logs persisted: { "YYYY-MM-DD": { weekday, left:[], right:[], finisher:[], done, calories, weight, bmi } }
  const [logs, setLogs] = useState(() => load("wd_gym_logs", {}));
  useEffect(() => save("wd_gym_logs", logs), [logs]);

  // goals, overrides, bmi logs
  const [targetWeight, setTargetWeight] = useState(() => {
    const goals = load("wd_goals", { targetWeight: 70 });
    return goals.targetWeight || 70;
  });

  useEffect(() => {
    const goals = load("wd_goals", {});
    save("wd_goals", { ...goals, targetWeight });
  }, [targetWeight]);

  const [weightOverrides, setWeightOverrides] = useState(() =>
    load("wd_weight_overrides", {})
  );
  useEffect(
    () => save("wd_weight_overrides", weightOverrides),
    [weightOverrides]
  );

  // bmi logs array [{date: 'DD-MM-YYYY', weight, bmi}]
  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));
  useEffect(() => save("bmi_logs", bmiLogs), [bmiLogs]);

  // modal inputs & state
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [currentWeightInput, setCurrentWeightInput] = useState("");

  // UI helpers
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  // When 'date' changes from anywhere (calendar or date input), we should ensure weekday sync
  useEffect(() => {
    const name = dayjs(date).format("dddd");
    if (WEEK.includes(name)) setWeekday(name);
    // ensure checks persist: if logs has an entry for date, keep it; else create default placeholder
    // (we won't auto-write logs here)
  }, [date]);

  // Persist helper
  function persistLogFor(dateIso, obj) {
    const next = { ...logs, [dateIso]: obj };
    setLogs(next);
    save("wd_gym_logs", next);
  }

  // Build checks view for current selected date (shows default plan structure but uses saved values when available)
  const checks = useMemo(() => {
    const def = plan[weekday] || { left: [], right: [], finisher: [] };
    const prev = logs[dateKey];
    const fit = (arr = [], len = 0) => {
      const a = (arr || []).slice(0, len);
      while (a.length < len) a.push(false);
      return a;
    };
    if (!prev) {
      return {
        weekday,
        left: fit([], def.left?.length || 0),
        right: fit([], def.right?.length || 0),
        finisher: fit([], def.finisher?.length || 0),
        done: false,
        calories: undefined,
        bmi: undefined,
        weight: undefined,
      };
    }
    return {
      weekday,
      left: fit(prev.left, def.left?.length || 0),
      right: fit(prev.right, def.right?.length || 0),
      finisher: fit(prev.finisher, def.finisher?.length || 0),
      done: !!prev.done,
      calories: prev.calories,
      bmi: prev.bmi,
      weight: prev.weight,
    };
  }, [logs, dateKey, weekday, plan]);

  const totalExercises =
    (plan[weekday]?.left?.length || 0) +
    (plan[weekday]?.right?.length || 0) +
    (plan[weekday]?.finisher?.length || 0);

  const completedExercises =
    (checks.left?.filter(Boolean).length || 0) +
    (checks.right?.filter(Boolean).length || 0) +
    (checks.finisher?.filter(Boolean).length || 0);

  const completionPct = totalExercises
    ? Math.round((completedExercises / totalExercises) * 100)
    : 0;

  // mark toggle for an exercise
  const toggle = (section, idx) => {
    const prev = logs[dateKey] || { ...checks, weekday };
    const next = {
      ...prev,
      left: prev.left
        ? [...prev.left]
        : Array(plan[weekday].left.length).fill(false),
      right: prev.right
        ? [...prev.right]
        : Array(plan[weekday].right.length).fill(false),
      finisher: prev.finisher
        ? [...prev.finisher]
        : Array(plan[weekday].finisher.length).fill(false),
    };
    next[section] = next[section] || [];
    next[section][idx] = !next[section][idx];
    persistLogFor(dateKey, next);
  };

  // Mark workout done (open modal to save calories + weight)
  const canComplete =
    checks.left.some(Boolean) ||
    checks.right.some(Boolean) ||
    checks.finisher?.some(Boolean) ||
    false;

  const openCaloriesModal = () => {
    if (!canComplete) return;
    setCaloriesInput((checks.calories ?? "").toString());
    const overrideWeight = weightOverrides[dateKey];
    setCurrentWeightInput(
      ((checks.weight ?? overrideWeight ?? "") || "").toString()
    );
    setShowModal(true);
  };

  const saveCaloriesAndComplete = () => {
    const calories = Number(caloriesInput) || 0;
    const weight = Number(currentWeightInput) || checks.weight || null;

    // compute BMI using saved height (fallback 176 cm)
    const savedHeight = Number(load("bmi_height", 176));
    const newBmi =
      weight && savedHeight
        ? Number((weight / Math.pow(savedHeight / 100, 2)).toFixed(1))
        : checks.bmi;

    const prev = logs[dateKey] || { ...checks, weekday };
    const next = {
      ...prev,
      left: prev.left || checks.left,
      right: prev.right || checks.right,
      finisher: prev.finisher || checks.finisher,
      done: true,
      calories,
      weight,
      bmi: newBmi,
    };
    persistLogFor(dateKey, next);

    // mark calendar done map
    const doneMap = load("wd_done", {});
    doneMap[dateKey] = true;
    save("wd_done", doneMap);

    // save weight override to keep data even if bmi logs removed
    const overrides = { ...weightOverrides, [dateKey]: weight };
    setWeightOverrides(overrides);
    save("wd_weight_overrides", overrides);

    // push/update bmi_logs (DD-MM-YYYY)
    const disp = fmtDisp(date);
    const arr = load("bmi_logs", []);
    const idx = arr.findIndex((e) => e?.date === disp);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], weight, bmi: newBmi };
    } else {
      arr.push({ date: disp, weight, bmi: newBmi });
    }
    setBmiLogs(arr);
    save("bmi_logs", arr);

    setShowModal(false);
  };

  const editCalories = () => {
    const prev = logs[dateKey] || {};
    setCaloriesInput((prev.calories ?? "").toString());
    setCurrentWeightInput(
      ((prev.weight ?? weightOverrides[dateKey] ?? "") || "").toString()
    );
    setShowModal(true);
  };

  const deleteCaloriesAndUnmark = () => {
    const prev = logs[dateKey] || { ...checks, weekday };
    const next = { ...prev, calories: undefined, done: false };
    persistLogFor(dateKey, next);
    const doneMap = load("wd_done", {});
    delete doneMap[dateKey];
    save("wd_done", doneMap);
  };

  // Mark/unmark all exercises
  const toggleMarkAll = () => {
    const prev = logs[dateKey] || { ...checks, weekday };
    const def = plan[weekday] || { left: [], right: [], finisher: [] };
    const allDone =
      (prev.left || []).every(Boolean) &&
      (prev.right || []).every(Boolean) &&
      (prev.finisher || []).every(Boolean);
    const next = {
      ...prev,
      left: Array(def.left?.length || 0).fill(!allDone),
      right: Array(def.right?.length || 0).fill(!allDone),
      finisher: Array(def.finisher?.length || 0).fill(!allDone),
      done: prev.done,
    };
    persistLogFor(dateKey, next);
  };

  // streak and totals derived from wd_done map
  const streak = useMemo(() => {
    const doneMap = load("wd_done", {});
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const k = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      if (doneMap[k]) s++;
      else break;
    }
    return s;
  }, [logs, date]);

  const totalWorkouts = useMemo(() => {
    const doneMap = load("wd_done", {});
    return Object.values(doneMap).filter(Boolean).length;
  }, [logs]);

  // Weight progress helpers
  const recentWeights = (load("bmi_logs", []) || [])
    .map((b) => b?.weight)
    .filter((w) => typeof w === "number");
  const startWeight = recentWeights.length
    ? Math.max(...recentWeights.slice(-30))
    : checks.weight ?? targetWeight;
  const overrideWeight = weightOverrides[dateKey];
  let curWeight =
    overrideWeight ??
    checks.weight ??
    recentWeights.slice().reverse()[0] ??
    startWeight;
  const tw = Number(targetWeight);
  const pct = (from, to, cur) => {
    const span = Math.abs(from - to);
    if (!isFinite(span) || span === 0) return 0;
    const p = ((from - cur) / (from - to)) * 100;
    return Math.max(0, Math.min(100, p));
  };
  const runnerPct = pct(startWeight, tw, curWeight);
  const diffToGoal =
    isFinite(curWeight) && isFinite(tw) ? curWeight - tw : null;

  // Chart data
  const chartData = (bmiLogs || []).map((e) => ({
    date: e.date,
    weight: e.weight,
    bmi: e.bmi,
  }));

  // Next day plan description
  const nextDayName = (() => {
    const d = dayjs(date).add(1, "day").format("dddd");
    if (d === "Sunday") return "Rest Day (Sunday)";
    if (WEEK.includes(d)) return d;
    return "Monday";
  })();
  const nextPlan =
    nextDayName === "Rest Day (Sunday)" ? null : plan[nextDayName] || null;

  // Reset progress (clear logs, wd_done, overrides, but keep plan & goals)
  const resetProgress = () => {
    if (
      !confirm(
        "Reset ALL gym progress? This will clear logs, weights, streaks. Plan and goals will remain."
      )
    )
      return;
    setLogs({});
    save("wd_gym_logs", {});
    save("wd_done", {});
    save("wd_weight_overrides", {});
    setWeightOverrides({});
    setBmiLogs([]);
    save("bmi_logs", []);
    setSaving(true);
    setTimeout(() => setSaving(false), 900);
  };

  // When calendar changes date externally, consumer will call setDate (we rely on prop setDate in MiniCalendar)
  // We already have setDate local.

  /* ---------- Render ---------- */
  const dayPlan = plan[weekday] || {
    title: "",
    left: [],
    right: [],
    finisher: [],
  };

  return (
    <div
      className="rounded-xl p-6 backdrop-blur-md border shadow-md text-gray-300 transition-all duration-500 
    bg-gradient-to-br from-[#01497c]/50 via-[#1F2A2A]/85 to-[#0A8754]/50 border-gray-800 text-blue-500 font-medium"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
  {/* Left Section: Title & Subtitle */}
  <div>
    <h1 className="text-2xl font-extrabold tracking-wide 
                   text-[#E9F8F8] dark:text-[#E9F8F8] drop-shadow-[0_0_8px_rgba(24,61,61,0.4)]">
      Gym
    </h1>
    <p className="text-sm text-[#C4D9D9] dark:text-[#A8BFBF]">
      Log workouts, calories, weight, and sync with the calendar.
    </p>
  </div>

  {/* Right Section: Controls */}
  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
    {/* Weekday Dropdown */}
    <select
      value={weekday}
      onChange={(e) => setWeekday(e.target.value)}
      className="px-3 py-2 rounded-md border border-[#406B6B]/60 
                 bg-[#102626]/80 text-[#E9F8F8] text-sm 
                 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] transition"
    >
      {WEEK.map((d) => (
        <option key={d} value={d} className="bg-[#102626] text-[#E9F8F8]">
          {d}
        </option>
      ))}
    </select>

    {/* Date Picker */}
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="px-3 py-2 rounded-md border border-[#406B6B]/60 
                 bg-[#102626]/80 text-[#E9F8F8] text-sm 
                 focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] transition"
    />

    {/* Reset Button */}
    <button
      onClick={resetProgress}
      className="ml-auto bg-gradient-to-r from-[#D64545] via-[#B82132] to-[#8C1E28]
                 hover:from-[#E14D4D] hover:to-[#B82132] text-[#FAFAFA] 
                 px-4 py-2 rounded-md text-sm font-semibold 
                 shadow-md transition-all duration-200"
    >
      Reset Progress
    </button>
  </div>
</header>


    {/* 🎯 Target & Progress Bar */}
      {/* 🎯 Target vs Starting Weight */}
<section className="mb-2 border border-[#2A4B4B]/70 rounded-2xl p-4 space-y-3 
                    bg-[#102626]/60 backdrop-blur-md shadow-[0_0_12px_rgba(24,61,61,0.2)] 
                    transition-all duration-300">

  {/* Inputs Row */}
  <div className="flex items-center justify-between flex-wrap gap-4">
    {/* Target Weight */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#E9F8F8]">🎯 Target Weight</span>
      <input
        type="number"
        step="0.1"
        className="w-24 px-2 py-1 rounded-md border border-[#406B6B]/60 
                   bg-[#183D3D]/80 text-[#F1FCFC] text-sm 
                   focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] transition"
        value={targetWeight}
        onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
      />
      <span className="text-sm text-[#C4D9D9]">kg</span>
    </div>

    {/* Starting Weight */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#E9F8F8]">⚖️ Starting Weight</span>
      <input
        type="number"
        step="0.1"
        className="w-24 px-2 py-1 rounded-md border border-[#406B6B]/60 
                   bg-[#183D3D]/80 text-[#F1FCFC] text-sm 
                   focus:outline-none focus:ring-1 focus:ring-[#4FD1C5] transition"
        value={startWeight}
        onChange={(e) => setStartWeight(Number(e.target.value || 0))}
      />
      <span className="text-sm text-[#C4D9D9]">kg</span>
    </div>

    {/* Auto Current Weight Display */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#E9F8F8]">Current Weight:</span>
      <span className="text-[#A8F8E0] font-semibold">
        {curWeight ? `${curWeight} kg` : "—"}
      </span>
    </div>
  </div>

  {/* 🏃 Progress Bar — right → left */}
  <div className="relative mt-3">
    <div className="h-3 rounded-full bg-[#264545]/60 overflow-hidden shadow-inner" />

    {(() => {
      const start = startWeight || 85;
      const target = targetWeight || 75;
      const current = curWeight || start;

      const totalLoss = start - target;
      const currentLoss = start - current;

      // Progress = how much lost out of total goal
      const pct = totalLoss > 0 ? (currentLoss / totalLoss) * 100 : 0;
      const clamped = Math.min(100, Math.max(0, pct));

      return (
        <>
          {/* Fill (right → left) */}
          <div
            className="absolute top-0 right-0 h-3 rounded-l-full transition-all duration-700"
            style={{
              width: `${100 - clamped}%`,
              background:
                "linear-gradient(270deg, rgba(79,209,197,1) 0%, rgba(34,197,94,1) 100%)",
            }}
          />

          {/* Runner */}
          <div
            className="absolute -top-5 mt-1 transition-all duration-500 z-20"
            style={{
              right: `calc(${100 - clamped}% - 15px)`,
            }}
          >
            <span className="text-2xl drop-shadow-[0_0_6px_rgba(79,209,197,0.6)]">
              🏃
            </span>
          </div>
        </>
      );
    })()}
  </div>
</section>





      {/* Workout card */}
      <section className="mb-2 border rounded-2xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {weekday} • {dayPlan.title || "Untitled"}
            </h2>
            <div className="text-sm opacity-70 mt-1">Date: {fmtDisp(date)}</div>
            <div className="mt-2 text-sm opacity-80">
              Completion: {completedExercises}/{totalExercises} ({completionPct}
              %)
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`text-sm px-3 py-1 rounded ${
                checks.done
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {checks.done ? "Completed" : "Not completed"}
            </div>
            <div className="text-sm px-3 py-1 rounded bg-green-600 text-white">
              🔥 Streak: {streak} days
            </div>
          </div>
        </div>

        {!["Sunday"].includes(dayjs(date).format("dddd")) ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <ExerciseList
                label="Left"
                list={dayPlan.left || []}
                state={checks.left}
                onToggle={(i) => toggle("left", i)}
              />
              <ExerciseList
                label="Right"
                list={dayPlan.right || []}
                state={checks.right}
                onToggle={(i) => toggle("right", i)}
              />
            </div>

            {!!dayPlan.finisher?.length && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">
                  {dayPlan.finisherLabel || "Finisher"}
                </h3>
                <ul className="space-y-2">
                  {dayPlan.finisher.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 p-2 border rounded-xl"
                    >
                      <input
                        type="checkbox"
                        checked={checks.finisher[i] || false}
                        onChange={() => toggle("finisher", i)}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 mt-6 items-center">
              <button
                onClick={toggleMarkAll}
                className="px-4 py-2 rounded border"
              >
                {checks.left.every(Boolean) &&
                checks.right.every(Boolean) &&
                (checks.finisher?.every?.(Boolean) ?? true)
                  ? "❌ Unmark All"
                  : "✔ Mark All"}
              </button>

              {!checks.done ? (
                <button
                  onClick={openCaloriesModal}
                  disabled={!canComplete}
                  className={`px-4 py-2 rounded ${
                    canComplete
                      ? "bg-green-600 text-white"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  ✅ Mark Workout Done ({fmtDisp(date)})
                </button>
              ) : (
                <button
                  onClick={deleteCaloriesAndUnmark}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  ❌ Unmark & Clear
                </button>
              )}

              {checks.done && (
                <button
                  onClick={editCalories}
                  className="px-3 py-2 border rounded"
                >
                  ✏ Edit
                </button>
              )}
              <div className="ml-auto text-sm opacity-80">
                Status: {checks.done ? "Done" : "Not done"} • 🔥 Calories:{" "}
                {checks.calories != null ? `${checks.calories} kcal` : "—"} • 📊
                BMI: {checks.bmi != null ? checks.bmi : "—"} • ⚖️ Weight:{" "}
                {checks.weight != null ? `${checks.weight} kg` : "—"}
              </div>
            </div>
          </>
        ) : (
          <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 mt-4">
            Rest Day — stretch, hydrate, recover.
          </div>
        )}
      </section>

      {/* Calendar + Daily Summary side-by-side on desktop */}
      <section className="grid md:grid-cols-2 gap-4 mb-2">
        <MiniCalendar
          date={date}
          setDate={(d) => {
            setDate(d);
          }}
        />
        <DailySummary date={date} logs={logs} dateKey={dateKey} />
      </section>

      {/* Progress Chart */}
      <section className="border rounded-2xl mb-2 p-4">
        <h3 className="font-semibold mb-3">Progress (Weight & BMI)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="bmi"
                stroke="#82ca9d"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Next day & Badges */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Next Workout</h3>
          {nextDayName === "Rest Day (Sunday)" ? (
            <div className="opacity-80">Tomorrow is Rest Day (Sunday)</div>
          ) : nextPlan ? (
            <div className="text-sm">
              <div className="font-medium mb-1">
                {nextDayName} • {nextPlan.title}
              </div>
              <div className="opacity-80">
                Total exercises:{" "}
                {(nextPlan.left?.length || 0) +
                  (nextPlan.right?.length || 0) +
                  (nextPlan.finisher?.length || 0)}
              </div>
            </div>
          ) : (
            <div className="opacity-80">Plan not found</div>
          )}
        </div>

        <div className="border rounded-2xl p-4">
          <h3 className="font-semibold mb-3">Badges</h3>
          <div className="flex flex-wrap gap-3">
            <Badge label="7-Day Streak" earned={streak >= 7} />
            <Badge label="14-Day Streak" earned={streak >= 14} />
            <Badge label="30-Day Streak" earned={streak >= 30} />
            <Badge label="10 Workouts" earned={totalWorkouts >= 10} />
            <Badge label="25 Workouts" earned={totalWorkouts >= 25} />
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Save Workout • {fmtDisp(date)}
            </h3>

            <div>
              <label className="text-sm block">🔥 Calories Burned</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                placeholder="e.g. 350"
              />
            </div>

            <div>
              <label className="text-sm block">⚖ Current Weight (kg)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800"
                value={currentWeightInput}
                onChange={(e) => setCurrentWeightInput(e.target.value)}
                placeholder="e.g. 75"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveCaloriesAndComplete}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function ExerciseList({ label, list = [], state = [], onToggle }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{label}</h3>
      <ul className="space-y-2">
        {list.map((t, i) => (
          <li key={i} className="flex items-center gap-3 p-2 border rounded-xl">
            <input
              type="checkbox"
              checked={!!state[i]}
              onChange={() => onToggle(i)}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DailySummary({ date, logs, dateKey }) {
  const entry = logs[dateKey];
  const bmiLogs = load("bmi_logs", []);
  const latestBmi = bmiLogs.slice().reverse()[0] || null;
  return (
    <div className="border rounded-2xl p-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Daily Summary</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            entry?.done
              ? "bg-green-600 text-white"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          {entry?.done ? "✅ Done" : "❌ Not Done"}
        </span>
      </div>

      <div className="text-sm opacity-70 mt-1">📅 {fmtDisp(date)}</div>

      <div className="mt-3 space-y-2 text-sm">
        <div>
          🔥 Calories:{" "}
          {entry?.calories != null ? `${entry.calories} kcal` : "—"}
        </div>
        <div>
          ⚖️ Weight: {entry?.weight != null ? `${entry.weight} kg` : "—"}
        </div>
        <div>
          📊 BMI: {entry?.bmi != null ? entry.bmi : latestBmi?.bmi ?? "—"}
        </div>
        <div>
          🎯 Target Diff:{" "}
          {entry?.weight != null
            ? `${(
                entry.weight - (load("wd_goals", {}).targetWeight || 70)
              ).toFixed(1)} kg`
            : "—"}
        </div>

        <div className="mt-2">
          <h4 className="font-medium mb-1">Exercises</h4>
          {entry ? (
            <ul className="list-disc list-inside text-sm">
              {(() => {
                const plan = load("wd_gym_plan", {});
                const weekday = entry?.weekday || dayjs(date).format("dddd");
                const todayPlan = plan[weekday] || {};
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
                return allExercises.map((ex, i) => (
                  <li key={i}>
                    {bools[i] ? ex : <span className="opacity-60">{ex}</span>}
                  </li>
                ));
              })()}
            </ul>
          ) : (
            <div className="opacity-70">No exercises logged for this day.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ label, earned }) {
  return (
    <div
      className={`px-3 py-2 rounded-xl border text-sm ${
        earned ? "" : "opacity-40 grayscale"
      }`}
    >
      {earned ? "🏆" : "🔒"} {label}
    </div>
  );
}

/* Mini calendar with month navigation - compact and responsive */
function MiniCalendar({ date, setDate }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  useEffect(() => setViewMonth(dayjs(date)), [date]);

  const start = viewMonth.startOf("month").startOf("week");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  const doneMap = load("wd_done", {});
  const today = dayjs();

  const colorOf = (d) => {
    const key = d.format("YYYY-MM-DD");
    if (doneMap[key]) return "bg-green-500 text-white";
    if (d.isAfter(today, "day")) return "bg-gray-600 text-white opacity-60";
    return "bg-gray-700 text-white";
  };

  return (
    <section className="border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
          className="px-2"
        >
          〈
        </button>
        <div className="font-semibold text-sm">
          {viewMonth.format("MMMM YYYY")}
        </div>
        <button
          onClick={() => setViewMonth(viewMonth.add(1, "month"))}
          className="px-2"
        >
          〉
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs text-center mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="opacity-60">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.format("YYYY-MM-DD");
          const isCurMonth = d.month() === viewMonth.month();
          const isSelected = key === date;
          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              title={d.format("DD-MM-YYYY")}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-[11px] flex items-center justify-center border ${
                !isCurMonth ? "opacity-30" : ""
              } ${colorOf(d)} ${isSelected ? "ring-2 ring-blue-400" : ""}`}
            >
              {d.date()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* Modal */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border bg-white dark:bg-gray-900 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
