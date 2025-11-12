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

/* ---------------------------------------------------------
   🔧 One-time cleanup for old logs that had "true"/"done"
---------------------------------------------------------- */
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

/* ---------------------- Utilities ---------------------- */
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

export default function Gym() {
  /* ------------ Persisted plan ------------ */
  const [plan, setPlan] = useState(() => load("wd_gym_plan", DEFAULT_PLAN));
  useEffect(() => save("wd_gym_plan", plan), [plan]);

  // 🧩 Auto-fill missing weekdays if old plan was incomplete
  useEffect(() => {
    const updated = { ...DEFAULT_PLAN, ...plan };
    setPlan(updated);
    save("wd_gym_plan", updated);
  }, []); // run once on load

  /* ------------ Calendar & weekday ------------ */
  const todayIso = dayjs().format("YYYY-MM-DD");
  const todayName = dayjs().format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  const [weekday, setWeekday] = useState(defaultDay);
  const [date, setDate] = useState(todayIso);
  const dateKey = fmtISO(date);

  /* ------------ Logs & goals ------------ */
  const [logs, setLogs] = useState(() => load("wd_gym_logs", {}));
  useEffect(() => save("wd_gym_logs", logs), [logs]);

  const [targetWeight, setTargetWeight] = useState(() => {
    const goals = load("wd_goals", { targetWeight: 70 });
    return goals?.targetWeight ?? 70;
  });
  useEffect(() => {
    const goals = load("wd_goals", {});
    save("wd_goals", { ...goals, targetWeight });
  }, [targetWeight]);

  // NEW: editable, persistent startWeight
  const [startWeight, setStartWeight] = useState(() =>
    load("wd_start_weight", null)
  );
  useEffect(() => {
    if (startWeight !== null && startWeight !== undefined) {
      save("wd_start_weight", startWeight);
    }
  }, [startWeight]);

  const [weightOverrides, setWeightOverrides] = useState(() =>
    load("wd_weight_overrides", {})
  );
  useEffect(
    () => save("wd_weight_overrides", weightOverrides),
    [weightOverrides]
  );

  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));
  useEffect(() => save("bmi_logs", bmiLogs), [bmiLogs]);

  /* ------------ Modal state ------------ */
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [currentWeightInput, setCurrentWeightInput] = useState("");
  const weightInputRef = useRef(null);

  // autofocus when modal opens
  useEffect(() => {
    if (showModal && weightInputRef.current) {
      // slight delay to ensure mount
      setTimeout(() => {
        weightInputRef.current?.focus();
        weightInputRef.current?.select();
      }, 10);
    }
  }, [showModal]);

  /* ------------ Misc UI ------------ */
  const [saving, setSaving] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Sync weekday when date changes
  // ✅ Always set weekday, even for Sunday/future days
  useEffect(() => {
    const name = dayjs(date).format("dddd");
    setWeekday(name);
  }, [date]);

  function persistLogFor(dateIso, obj) {
    const next = { ...logs, [dateIso]: obj };
    setLogs(next);
    save("wd_gym_logs", next);
  }

  /* ------------ Checks for selected day ------------ */
  // ✅ bulletproof checks initializer
  const checks = useMemo(() => {
    const def = plan?.[weekday] ?? { left: [], right: [], finisher: [] };
    const prev = logs?.[dateKey];

    if (!prev || typeof prev !== "object") {
      return {
        weekday: weekday || "",
        left: Array.isArray(def.left) ? def.left.map(() => false) : [],
        right: Array.isArray(def.right) ? def.right.map(() => false) : [],
        finisher: Array.isArray(def.finisher)
          ? def.finisher.map(() => false)
          : [],
        done: false,
        calories: undefined,
        bmi: undefined,
        weight: undefined,
      };
    }

    return {
      weekday: weekday || "",
      left: Array.isArray(prev.left)
        ? prev.left
        : Array.isArray(def.left)
        ? def.left.map(() => false)
        : [],
      right: Array.isArray(prev.right)
        ? prev.right
        : Array.isArray(def.right)
        ? def.right.map(() => false)
        : [],
      finisher: Array.isArray(prev.finisher)
        ? prev.finisher
        : Array.isArray(def.finisher)
        ? def.finisher.map(() => false)
        : [],
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

  /* ------------ Exercise toggles ------------ */
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

    const doneMap = load("wd_done", {});
    doneMap[dateKey] = true;
    save("wd_done", doneMap);

    const overrides = { ...weightOverrides, [dateKey]: weight };
    setWeightOverrides(overrides);
    save("wd_weight_overrides", overrides);

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

    // if startWeight is not set yet, initialize it with the first saved weight
    // 🧠 Smart baseline update
    if (weight) {
      const savedStart = load("wd_start_weight", null);
      // If no start or gained weight beyond previous start → update
      if (!savedStart || weight > savedStart) {
        setStartWeight(weight);
        save("wd_start_weight", weight);
      }
    }

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

  /* ------------ Streak & totals ------------ */
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

  /* ------------ Weight progress helpers ------------ */
  const recentWeights = (load("bmi_logs", []) || [])
    .map((b) => b?.weight)
    .filter((w) => typeof w === "number");

  // If user hasn't set startWeight yet, infer a reasonable default
  const inferredStart = recentWeights.length
    ? Math.max(...recentWeights.slice(-30))
    : checks.weight ?? targetWeight;

  const effectiveStart = startWeight ?? inferredStart;
  const overrideWeight = weightOverrides[dateKey];
  let curWeight =
    overrideWeight ??
    checks.weight ??
    recentWeights.slice().reverse()[0] ??
    effectiveStart;

  const tw = Number(targetWeight);

  // ✅ Progress = how far NOW is from START toward TARGET (works for loss or gain)
  // 🧮 Realistic progress (supports regression + dynamic baseline)
  const pctToGoal = (() => {
    const from = Number(effectiveStart);
    const to = Number(tw);
    const cur = Number(curWeight);
    const span = from - to;
    if (!isFinite(span) || span === 0) return 0;

    const p = ((from - cur) / span) * 100;
    return p; // can go negative if weight increases
  })();

  const diffToGoal =
    isFinite(curWeight) && isFinite(tw) ? (curWeight - tw).toFixed(1) : null;

  /* ------------ Chart data ------------ */
  const chartData = (bmiLogs || []).map((e) => ({
    date: e.date,
    weight: e.weight,
    bmi: e.bmi,
  }));

  /* ------------ Next Day Plan ------------ */
  const nextDayName = (() => {
    const d = dayjs(date).add(1, "day").format("dddd");
    if (d === "Sunday") return "Rest Day (Sunday)";
    if (WEEK.includes(d)) return d;
    return "Monday";
  })();
  const nextPlan =
    nextDayName === "Rest Day (Sunday)" ? null : plan[nextDayName] || null;

  /* ------------ Reset ------------ */
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

  /* ------------ Render ------------ */
  // ✅ Always safe fallback, even if weekday invalid or not in plan
  // ✅ Always fix case + fill missing days dynamically
  const normalizedWeekday = WEEK.find(
    (d) => d.toLowerCase() === (weekday || "").toLowerCase()
  );

  const dayPlan = (normalizedWeekday && plan?.[normalizedWeekday]) ||
    DEFAULT_PLAN[normalizedWeekday] || {
      title: `${weekday || "Unknown"} — No Plan Found`,
      left: [],
      right: [],
      finisher: [],
    };

  // 🛡️ Emergency guard: prevent rendering if critical data missing
  if (!plan || typeof plan !== "object") {
    return (
      <div className="p-4 text-red-400">
        ⚠ Error: Workout plan data is missing or corrupted.
      </div>
    );
  }
  console.log("DEBUG weekday:", weekday);
  console.log("PLAN KEYS:", Object.keys(plan || {}));

  return (
    <div
      className="rounded-xl p-6 backdrop-blur-md border shadow-md transition-all duration-500 
      bg-gradient-to-br from-[#01497c]/50 via-[#1F2A2A]/85 to-[#0A8754]/50 border-gray-800 text-blue-500 font-medium"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-wide 
                         text-[#E9F8F8] drop-shadow-[0_0_8px_rgba(24,61,61,0.4)]"
          >
            Gym
          </h1>
          <p className="text-sm text-[#C4D9D9]">
            Log workouts, calories, weight. Everything syncs with the calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={weekday}
            onChange={(e) => setWeekday(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#406B6B]/60 
                       bg-[#102626]/80 text-[#E9F8F8] text-sm 
                       focus:outline-none focus:ring-1 focus:ring-cyan-300 transition"
          >
            {WEEK.map((d) => (
              <option key={d} value={d} className="bg-[#102626] text-[#E9F8F8]">
                {d}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#406B6B]/60 
                       bg-[#102626]/80 text-[#E9F8F8] text-sm 
                       focus:outline-none focus:ring-1 focus:ring-cyan-300 transition"
          />

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

      {/* 🎯 Progress Section */}
      <section
        className="mb-3 border border-[#2A4B4B]/70 rounded-2xl p-4 space-y-3 
                          bg-[#102626]/60 backdrop-blur-md shadow-[0_0_12px_rgba(24,61,61,0.2)]"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Target Weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#E9F8F8]">
              🎯 Target
            </span>
            <input
              type="number"
              step="0.1"
              className="w-24 px-2 py-1 rounded-md border border-[#406B6B]/60 
                         bg-[#183D3D]/80 text-[#F1FCFC] text-sm 
                         focus:outline-none focus:ring-1 focus:ring-cyan-300 transition"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
            />
            <span className="text-sm text-[#C4D9D9]">kg</span>
          </div>

          {/* Start Weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#E9F8F8]">⚖️ Start</span>
            <input
              type="number"
              step="0.1"
              className="w-24 px-2 py-1 rounded-md border border-[#406B6B]/60 
                         bg-[#183D3D]/80 text-[#F1FCFC] text-sm 
                         focus:outline-none focus:ring-1 focus:ring-cyan-300 transition"
              value={effectiveStart ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") setStartWeight(null);
                else setStartWeight(Number(v));
              }}
            />
            <span className="text-sm text-[#C4D9D9]">kg</span>
          </div>

          {/* Current Weight (auto) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#E9F8F8]">Now:</span>
            <span className="text-emerald-300 font-semibold">
              {curWeight ? `${curWeight} kg` : "—"}
            </span>
          </div>

          {/* Percent to goal (handles regression + dynamic Δ) */}
          <div className="text-sm text-[#C4D9D9]">
            {pctToGoal < 0 ? (
              <>
                ⚠️ Regression{" "}
                <span className="text-red-400 font-semibold">
                  {Math.abs(pctToGoal).toFixed(0)}%
                </span>{" "}
                <span className="text-xs opacity-80">
                  (Δ +{Math.abs(diffToGoal)} kg)
                </span>
              </>
            ) : (
              <>
                {Math.min(100, pctToGoal).toFixed(0)}% to goal{" "}
                <span className="text-xs opacity-80">(Δ {diffToGoal} kg)</span>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {/* 🏃 Right-to-Left Progress Bar with Regression */}
        <div className="relative mt-1">
          {/* Base Bar */}
          <div className="h-3 rounded-full bg-[#264545]/60 overflow-hidden shadow-inner" />

          {/* Fill: Green for progress, Red for regression */}
          <div
            className="absolute top-0 right-0 h-3 rounded-l-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(0, Math.abs(pctToGoal)))}%`,
              background:
                pctToGoal < 0
                  ? "linear-gradient(270deg, rgba(255,85,85,1) 0%, rgba(255,150,150,1) 100%)" // 🔴 regression
                  : "linear-gradient(270deg, rgba(79,209,197,1) 0%, rgba(34,197,94,1) 100%)", // 🟢 progress
              transformOrigin: "right",
            }}
          />

          {/* Runner */}
          <div
            className="absolute -top-5 mt-1 transition-all duration-500 z-20"
            style={{
              right: `calc(${Math.min(
                100,
                Math.max(0, Math.abs(pctToGoal))
              )}% - 15px)`,
            }}
          >
            <span
              className={`text-2xl drop-shadow-[0_0_6px_rgba(79,209,197,0.6)] ${
                pctToGoal < 0 ? "rotate-180" : ""
              }`}
            >
              🏃
            </span>
          </div>
        </div>
      </section>

      {/* 💪 Workout Section */}
      <section className="mb-3 border rounded-2xl p-4 bg-[#0E2121]/60 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#E9F8F8]">
              {weekday} • {dayPlan.title || "No Plan Found"}
            </h2>
            <div className="text-sm text-[#B6D0D0] mt-1">
              Date: {fmtDisp(date)}
            </div>
            <div className="mt-2 text-sm text-[#CDE7E7]">
              Completion:{" "}
              {typeof completedExercises !== "undefined"
                ? `${completedExercises}/${totalExercises} (${
                    completionPct || 0
                  }%)`
                : "—"}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`text-sm px-3 py-1 rounded transition ${
                checks?.done
                  ? "bg-green-600 text-white"
                  : "bg-gray-200/20 text-[#E9F8F8]"
              }`}
            >
              {checks?.done ? "Completed" : "Not completed"}
            </div>
            <div className="text-sm px-3 py-1 rounded bg-green-600/90 text-white shadow">
              🔥 Streak: {streak || 0} days
            </div>
          </div>
        </div>

        {/* 🧩 Unified render logic */}
        {weekday === "Sunday" ? (
          <div className="p-3 rounded bg-blue-50/10 text-blue-200 mt-4">
            Rest Day — stretch, hydrate, recover.
          </div>
        ) : dayPlan?.left?.length +
            dayPlan?.right?.length +
            dayPlan?.finisher?.length ===
          0 ? (
          <div className="p-3 rounded bg-yellow-50/10 text-yellow-200 mt-4">
            ⚠ No exercises defined for {weekday}.
          </div>
        ) : (
          <>
            {/* ✅ Workout Lists */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <ExerciseList
                label="Left"
                list={dayPlan.left || []}
                state={checks?.left || []}
                onToggle={(i) => toggle("left", i)}
              />
              <ExerciseList
                label="Right"
                list={dayPlan.right || []}
                state={checks?.right || []}
                onToggle={(i) => toggle("right", i)}
              />
            </div>

            {!!dayPlan.finisher?.length && (
              <div className="mt-5">
                <h3 className="font-semibold mb-2 text-[#E9F8F8]">
                  {dayPlan.finisherLabel || "Finisher"}
                </h3>
                <ul className="space-y-2">
                  {dayPlan.finisher.map((t, i) => (
                    <li
                      key={i}
                      onClick={() => toggle("finisher", i)}
                      className="flex items-center gap-3 p-2 border rounded-xl bg-[#0C1C1C]/60 hover:shadow-md hover:shadow-emerald-500/10 transition cursor-pointer select-none"
                    >
                      <AnimatedCheckbox checked={!!checks?.finisher?.[i]} />
                      <span className="text-[#E9F8F8]">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons Section */}
            <div className="flex gap-3 mt-6 items-center flex-wrap">
              <button
                onClick={toggleMarkAll}
                className="px-4 py-2 rounded border border-emerald-600/60 text-[#E9F8F8] hover:bg-emerald-600/10 transition"
              >
                {checks?.left?.every(Boolean) &&
                checks?.right?.every(Boolean) &&
                (checks?.finisher?.every?.(Boolean) ?? true)
                  ? "❌ Unmark All"
                  : "✔ Mark All"}
              </button>

              {!checks?.done ? (
                <button
                  onClick={openCaloriesModal}
                  disabled={!canComplete}
                  className={`px-4 py-2 rounded ${
                    canComplete
                      ? "bg-emerald-600 text-white shadow hover:bg-emerald-500"
                      : "bg-gray-400/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ✅ Mark Workout Done ({fmtDisp(date)})
                </button>
              ) : (
                <button
                  onClick={deleteCaloriesAndUnmark}
                  className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  ❌ Unmark & Clear
                </button>
              )}

              {checks?.done && (
                <button
                  onClick={editCalories}
                  className="px-3 py-2 border rounded hover:bg-white/5"
                >
                  ✏ Edit
                </button>
              )}

              <div className="ml-auto text-sm text-[#C4D9D9]">
                Status: {checks?.done ? "Done" : "Not done"} • 🔥 Calories:{" "}
                {checks?.calories != null ? `${checks.calories} kcal` : "—"} •
                📊 BMI: {checks?.bmi != null ? checks.bmi : "—"} • ⚖️ Weight:{" "}
                {checks?.weight != null ? `${checks.weight} kg` : "—"}
              </div>
            </div>
          </>
        )}
      </section>

      {/* 📆 Calendar + Summary */}
      <section className="grid md:grid-cols-2 gap-4 mb-3">
        <MiniCalendar
          date={date}
          setDate={(d) => {
            setDate(d);
          }}
        />
        <DailySummary date={date} logs={logs} dateKey={dateKey} />
      </section>

      {/* 📊 Progress Chart (Collapsible) */}
      <section className="border rounded-2xl mb-3 p-4 bg-[#0E2121]/50">
        <button
          onClick={() => setShowChart((s) => !s)}
          className="text-sm px-3 py-2 rounded border border-[#2A4B4B]/70 hover:bg-white/5"
        >
          {showChart ? "🙈 Hide Progress Graph" : "📈 Show Progress Graph"}
        </button>
        {showChart && (
          <div className="h-64 mt-3">
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
        )}
      </section>

      {/* 🔜 Next workout & 🏅 Badges */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-2xl p-4 bg-[#0E2121]/50">
          <h3 className="font-semibold mb-2 text-[#E9F8F8]">Next Workout</h3>
          {nextDayName === "Rest Day (Sunday)" ? (
            <div className="opacity-80 text-[#CDE7E7]">
              Tomorrow is Rest Day (Sunday)
            </div>
          ) : nextPlan ? (
            <div className="text-sm text-[#CDE7E7]">
              <div className="font-medium mb-1 text-[#E9F8F8]">
                {nextDayName} • {nextPlan.title}
              </div>
              <div className="opacity-90">
                Total exercises:{" "}
                {(nextPlan.left?.length || 0) +
                  (nextPlan.right?.length || 0) +
                  (nextPlan.finisher?.length || 0)}
              </div>
            </div>
          ) : (
            <div className="opacity-80 text-[#CDE7E7]">Plan not found</div>
          )}
        </div>

        <div className="border rounded-2xl p-4 bg-[#0E2121]/50">
          <h3 className="font-semibold mb-3 text-[#E9F8F8]">Badges</h3>
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
            <h3 className="text-lg font-semibold text-[#E9F8F8]">
              Save Workout • {fmtDisp(date)}
            </h3>

            <div>
              <label className="text-sm block text-[#CDE7E7]">
                🔥 Calories Burned
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-white/90 dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-400"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                placeholder="e.g. 350"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveCaloriesAndComplete();
                }}
              />
            </div>

            <div>
              <label className="text-sm block text-[#CDE7E7]">
                ⚖ Current Weight (kg)
              </label>
              <input
                ref={weightInputRef}
                type="number"
                className="w-full border rounded px-3 py-2 bg-white/90 dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-400"
                value={currentWeightInput}
                onChange={(e) => setCurrentWeightInput(e.target.value)}
                placeholder="e.g. 75"
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveCaloriesAndComplete();
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 border rounded hover:bg-white/5 text-[#E9F8F8]"
              >
                Cancel
              </button>
              <button
                onClick={saveCaloriesAndComplete}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
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

/* ---------------------- Subcomponents ---------------------- */

function AnimatedCheckbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-5 h-5 rounded-md border flex items-center justify-center transition
                 ${
                   checked
                     ? "bg-emerald-500 border-emerald-400 scale-105 shadow shadow-emerald-500/30"
                     : "bg-transparent border-gray-400/60 hover:border-emerald-400/70"
                 }`}
      aria-pressed={checked}
    >
      <span
        className={`text-white text-xs transition-transform ${
          checked ? "scale-100" : "scale-0"
        }`}
      >
        ✓
      </span>
    </button>
  );
}

function ExerciseList({ label, list = [], state = [], onToggle }) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-[#E9F8F8]">{label}</h3>
      <ul className="space-y-2">
        {list.map((t, i) => (
          <li
            key={i}
            onClick={() => onToggle(i)}
            className="flex items-center gap-3 p-2 border rounded-xl bg-[#0C1C1C]/60 hover:shadow-md hover:shadow-emerald-500/10 transition cursor-pointer select-none"
          >
            {/* make the checkbox non-interactive; the row handles clicks */}
            <AnimatedCheckbox checked={!!state[i]} inert />
            <span className="text-[#E9F8F8]">{t}</span>
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
    <div className="border rounded-2xl p-4 h-full bg-[#0E2121]/60 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#E9F8F8]">Daily Summary</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            entry?.done
              ? "bg-emerald-600 text-white"
              : "bg-gray-300/20 text-[#E9F8F8]"
          }`}
        >
          {entry?.done ? "✅ Done" : "❌ Not Done"}
        </span>
      </div>

      <div className="text-sm text-[#B6D0D0] mt-1">📅 {fmtDisp(date)}</div>

      <div className="mt-3 space-y-2 text-sm text-[#CDE7E7]">
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
          <h4 className="font-medium mb-1 text-[#E9F8F8]">Exercises</h4>
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
                  <li
                    key={i}
                    className={bools[i] ? "text-[#CDE7E7]" : "opacity-60"}
                  >
                    {ex}
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
      className={`px-3 py-2 rounded-xl border text-sm transition ${
        earned
          ? "text-emerald-200 border-emerald-500/50 shadow shadow-emerald-500/10"
          : "opacity-60 text-gray-300 border-gray-500/30"
      }`}
    >
      {earned ? "🏆" : "🔒"} {label}
    </div>
  );
}

function MiniCalendar({ date, setDate }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  useEffect(() => setViewMonth(dayjs(date)), [date]);

  const start = viewMonth.startOf("month").startOf("week");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  const doneMap = load("wd_done", {});
  const today = dayjs();

  const colorOf = (d) => {
    const key = d.format("YYYY-MM-DD");
    if (doneMap[key]) return "bg-emerald-600 text-white";
    if (d.isAfter(today, "day")) return "bg-gray-600 text-white/80 opacity-60";
    return "bg-gray-700 text-white/90";
  };

  return (
    <section className="border rounded-2xl p-4 bg-[#0E2121]/60 backdrop-blur">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
          className="px-2 py-1 rounded hover:bg-white/5"
        >
          〈
        </button>
        <div className="font-semibold text-sm text-[#E9F8F8]">
          {viewMonth.format("MMMM YYYY")}
        </div>
        <button
          onClick={() => setViewMonth(viewMonth.add(1, "month"))}
          className="px-2 py-1 rounded hover:bg-white/5"
        >
          〉
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs text-center mb-1 text-[#B6D0D0]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="opacity-80">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.format("YYYY-MM-DD");
          const isCurMonth = d.month() === viewMonth.month();
          const isSelected = key === date;
          const isToday = d.isSame(today, "day");
          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              title={d.format("DD-MM-YYYY")}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-[11px] flex items-center justify-center border transition
                ${!isCurMonth ? "opacity-30" : ""}
                ${colorOf(d)} 
                ${isSelected ? "ring-2 ring-cyan-300" : ""}
                ${isToday ? "border-cyan-400" : "border-white/10"}
                hover:scale-[1.03] hover:shadow hover:shadow-emerald-500/10
              `}
            >
              {d.date()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-start justify-center pt-[10vh] p-4">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F1E1E] text-[#E9F8F8] p-4 shadow-2xl shadow-black/40">
          {children}
        </div>
      </div>
    </div>
  );
}
