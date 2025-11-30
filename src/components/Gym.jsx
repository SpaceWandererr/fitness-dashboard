import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

/* ---------------------- Constants ---------------------- */
const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const fmtISO = (d) => dayjs(d).format("YYYY-MM-DD");
const fmtDisp = (d) => dayjs(d).format("DD-MM-YYYY");

// Sunday Quote Fetcher
async function fetchSundayQuote(opts = { cooldownSeconds: 60 }) {
  const LOCAL_FALLBACK = [
    "Discipline is doing what needs to be done even when you don’t feel like doing it. — Unknown",
    "Your body can stand almost anything. It’s your mind that you have to convince. — Unknown",
    "Push yourself because no one else is going to do it for you. — Unknown",
    "Rest is not idleness. Sometimes, rest is the most productive thing you can do. — Unknown",
    "Small consistent steps every day lead to massive results over time. — Unknown",
  ];
  const now = Date.now();
  const cacheKey = "wd_sunday_quote_cache";
  const cache = (() => {
    try {
      return JSON.parse(localStorage.getItem(cacheKey) || "null");
    } catch {
      return null;
    }
  })();
  if (
    cache &&
    cache.ts &&
    now - cache.ts < (opts.cooldownSeconds || 60) * 1000
  ) {
    return cache.text;
  }
  const sources = [
    {
      id: "zenquotes-direct",
      fn: async () => {
        const res = await fetch("https://zenquotes.io/api/random");
        if (!res.ok) throw new Error("zenquotes down");
        const [data] = await res.json();
        return `“${data.q || "Keep going"}” — ${data.a || "Unknown"}`;
      },
    },
    {
      id: "quotable",
      fn: async () => {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) throw res;
        const data = await res.json();
        return `“${data.content}” — ${data.author || "Unknown"}`;
      },
    },
    {
      id: "typefit",
      fn: async () => {
        const res = await fetch("https://type.fit/api/quotes");
        if (!res.ok) throw res;
        const arr = await res.json();
        const pick = arr[Math.floor(Math.random() * arr.length)];
        return `“${pick.text}” — ${pick.author || "Unknown"}`;
      },
    },
    {
      id: "local-fallback",
      fn: () =>
        Promise.resolve(
          LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)]
        ),
    },
  ];
  for (const src of sources) {
    try {
      const txt = await src.fn();
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ ts: Date.now(), text: txt })
        );
      } catch {}
      return txt;
    } catch (err) {
      if (err && err.status) {
        if (err.status === 429) {
          console.warn(`[quotes] ${src.id} rate-limited (429)`);
          break;
        }
        console.warn(`[quotes] ${src.id} failed: ${err.status}`);
        continue;
      }
      console.warn(`[quotes] ${src.id} error:`, err);
      continue;
    }
  }
  if (cache && cache.text) return cache.text;
  const localPick =
    LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)];
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ ts: Date.now(), text: localPick })
    );
  } catch {}
  return localPick;
}

/* ---------------------- Full 6-day Workout Plan ---------------------- */
const DEFAULT_PLAN = {
  Monday: {
    title: "Chest + Core",
    left: [
      "Bench Press (Barbell or Smith Machine) – 4×8",
      "Incline Dumbbell Press – 4×10",
      "Incline Chest Press Machine – 3×12-15 (replace Push-ups)",
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
    finisherLabel: null,
    finisher: [],
  },
  Wednesday: {
    title: "Legs (Quads + Glutes + Calves)",
    left: [
      "Squats – 4×8",
      "Leg Press Machine – 4×10",
      "Walking Lunges – 3×12 each leg",
    ],
    right: ["Leg Extension Machine – 3×15", "Seated Calf Raise Machine – 4×15"],
    finisherLabel: null,
    finisher: [],
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
      "Russian Twist with Dumbbell or Plate – 3×20",
      "Bicycle Crunch – 3×20",
    ],
  },
  Friday: {
    title: "Chest + Arms (Hypertrophy Focus)",
    left: ["Incline Barbell Press – 4×10", "Close-Grip Bench Press – 3×10"],
    right: [
      "Cable Crossovers – 3×15",
      "Triceps Rope Push-down – 3×15",
      "Preacher Curl (Bench or Machine) – 3×12",
    ],
    finisherLabel: "Core (optional)",
    finisher: ["Decline Bench Crunch – 3×15"],
  },
  Saturday: {
    title: "Legs + Core + Cardio",
    left: [
      "Dead-lift – 4×6 (strength focus)",
      "Leg Press Machine – 4×10",
      "Bulgarian Split Squat (Dumbbells or Smith Machine) – 3×10 each leg",
    ],
    right: [
      "Hamstring Curl Machine – 3×12",
      "Sitting Calf Raise Machine – 4×15",
    ],
    finisherLabel: "Core/Cardio Finisher",
    finisher: [
      "Decline Bench Crunch – 3×15 (replaces Cable Knee Raise)",
      "Plank – 3×1 min",
      "15–20 mins HIIT or Treadmill run",
    ],
  },
  Sunday: {
    title: "Sunday Recharge Mode 🌤",
    left: [],
    right: [],
    finisherLabel: "Motivation of the Day",
    finisher: ["Fetching your motivational quote..."],
  },
};

export default function Gym() {
  const today = dayjs();
  const todayIso = today.format("YYYY-MM-DD");
  const todayName = today.format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  // Date and weekday state
  const [date, setDate] = useState(todayIso);
  const [weekday, setWeekday] = useState(defaultDay);
  const userChangedWeekday = useRef(false);

  // State for logs, done state, weights, goals
  const [logs, setLogs] = useState({});
  const [doneState, setDoneState] = useState({});
  const [currWeight, setCurrWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [sundayQuote, setSundayQuote] = useState(
    "Fetching your motivational quote..."
  );

  // Modal inputs
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const weightInputRef = useRef(null);

  // Fetch initial state from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://fitness-backend-laoe.onrender.com/api/state"
        );
        if (res.ok) {
          const data = await res.json();
          setLogs(data.wd_gym_logs || {});
          setDoneState(data.wd_done || {});
          setCurrWeight(
            data.wd_weight_current != null ? data.wd_weight_current : ""
          );
          setTargetWeight(
            data.wd_goals?.targetWeight != null
              ? data.wd_goals.targetWeight
              : ""
          );
        } else {
          console.error("Failed to fetch state:", res.status);
        }
      } catch (err) {
        console.error("Error fetching state:", err);
      }
    })();
  }, []);

  // Sync date -> weekday
  useEffect(() => {
    const wd = dayjs(date).format("dddd");
    setWeekday(wd);
  }, [date]);

  // Sync weekday change -> date (current week)
  useEffect(() => {
    if (!userChangedWeekday.current) return;
    const currentDate = dayjs();
    const startOfWeek = currentDate.startOf("week").add(1, "day"); // Monday
    const newDate = startOfWeek
      .add(WEEK.indexOf(weekday), "day")
      .format("YYYY-MM-DD");
    setDate(newDate);
    userChangedWeekday.current = false;
  }, [weekday]);

  // Sunday quote fetch on Sunday
  useEffect(() => {
    if (weekday === "Sunday") {
      fetchSundayQuote().then(setSundayQuote);
    }
  }, [weekday]);

  // Helper: get current log entry or default for this date
  const getEntry = (dKey) => {
    const prev = logs[dKey];

    if (!prev) {
      const planDay = DEFAULT_PLAN[weekday] || {};
      return {
        weekday,
        left: (planDay.left || []).map(() => false),
        right: (planDay.right || []).map(() => false),
        finisher: (planDay.finisher || []).map(() => false),
        done: false,
        calories: undefined,
        weight: undefined,
        bmi: undefined,
      };
    }

    // DO NOT OVERRIDE weekday from UI
    const planDay = DEFAULT_PLAN[prev.weekday] || {};

    return {
      weekday: prev.weekday, // <-- correct weekday preserved
      left: prev.left ?? planDay.left.map(() => false),
      right: prev.right ?? planDay.right.map(() => false),
      finisher: prev.finisher ?? planDay.finisher.map(() => false),
      done: prev.done ?? false,
      calories: prev.calories,
      weight: prev.weight,
      bmi: prev.bmi,
    };
  };

  // Toggle a single exercise
  const toggle = (section, idx) => {
    if (dayjs(date).isAfter(dayjs(), "day")) {
      alert("🚫 You can't log future workouts");
      return;
    }
    const dateKey = fmtISO(date);
    const planDay = DEFAULT_PLAN[weekday] || {
      left: [],
      right: [],
      finisher: [],
    };
    const old = logs[dateKey] || getEntry(dateKey);
    const updatedEntry = { ...old };
    if (section === "left") {
      updatedEntry.left = old.left.map((v, i) => (i === idx ? !v : v));
    }
    if (section === "right") {
      updatedEntry.right = old.right.map((v, i) => (i === idx ? !v : v));
    }
    if (section === "finisher") {
      updatedEntry.finisher = old.finisher.map((v, i) => (i === idx ? !v : v));
    }
    // Persist toggles (done remains as was)
    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
  };

  // Toggle all exercises for today
  const toggleMarkAll = () => {
    if (dayjs(date).isAfter(dayjs(), "day")) {
      return;
    }
    const dateKey = fmtISO(date);
    const entry = logs[dateKey] || getEntry(dateKey);
    const allDone =
      (entry.left || []).every(Boolean) &&
      (entry.right || []).every(Boolean) &&
      (entry.finisher || []).every(Boolean);
    const nextVal = !allDone;
    const updatedEntry = {
      weekday, // <-- IMPORTANT
      left: (entry.left || []).map(() => nextVal),
      right: (entry.right || []).map(() => nextVal),
      finisher: (entry.finisher || []).map(() => nextVal),
      done: entry.done || false,
      calories: entry.calories,
      weight: entry.weight,
      bmi: entry.bmi,
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
  };

  // Open modal to mark workout done (or edit)
  const openModal = () => {
    if (dayjs(date).isAfter(dayjs(), "day")) {
      alert("🚫 Can't complete future workouts");
      return;
    }
    const dateKey = fmtISO(date);
    const entry = logs[dateKey] || getEntry(dateKey);
    setCaloriesInput(entry.calories != null ? String(entry.calories) : "");
    setWeightInput(entry.weight != null ? String(entry.weight) : "");
    setShowModal(true);
  };

  // Save workout (calories, weight) and mark done
  const saveWorkout = () => {
    const dateKey = fmtISO(date);
    const rawCalories = Number(caloriesInput) || 0;
    const parsedWeight = weightInput === "" ? null : Number(weightInput);

    const weightVal = Number.isFinite(parsedWeight)
      ? parsedWeight
      : getEntry(dateKey).weight || null;

    const savedHeight = 176;
    const newBmi = weightVal
      ? Number((weightVal / Math.pow(savedHeight / 100, 2)).toFixed(1))
      : getEntry(dateKey).bmi;

    const entry = logs[dateKey] || getEntry(dateKey);
    const updatedEntry = {
      weekday, // ALWAYS attach weekday
      left: entry.left || [],
      right: entry.right || [],
      finisher: entry.finisher || [],
      done: true,
      calories: rawCalories,
      weight: weightVal,
      bmi: newBmi,
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
    setDoneState((prev) => ({ ...prev, [dateKey]: true }));
    setShowModal(false);

    // SAVE TO BACKEND
    fetch("https://fitness-backend-laoe.onrender.com/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wd_gym_logs: { ...logs, [dateKey]: updatedEntry },
        wd_done: { ...doneState, [dateKey]: true },
        wd_weight_current: weightVal, // <---- NEW
        wd_goals: { targetWeight },
      }),
    });
  };

  // Edit existing workout (open modal with existing values)
  const editWorkout = () => {
    openModal();
  };

  // Unmark workout and clear calories (and weight)
  const deleteWorkout = () => {
    const dateKey = fmtISO(date);
    const entry = logs[dateKey] || getEntry(dateKey);
    const updatedEntry = {
      weekday, // <--- IMPORTANT
      left: entry.left || [],
      right: entry.right || [],
      finisher: entry.finisher || [],
      calories: undefined,
      weight: undefined,
      bmi: undefined,
      done: false,
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
    setDoneState((prev) => {
      const newDone = { ...prev };
      delete newDone[dateKey];
      return newDone;
    });
    // Notify others if needed
    window.dispatchEvent(new Event("lifeos:update"));
    // Save to backend
    const outgoing = {
      wd_gym_logs: { ...logs, [dateKey]: updatedEntry },
      wd_done: (() => {
        const nd = { ...doneState };
        delete nd[dateKey];
        return nd;
      })(),
      wd_weight_current: currWeight,
      wd_goals: { targetWeight: targetWeight },
    };
    fetch("https://fitness-backend-laoe.onrender.com/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(outgoing),
    }).catch((err) => console.error("❌ Backend Save FAILED:", err));
  };

  // Update target weight and save to backend
  const saveTargetWeight = async () => {
    const raw = targetWeight;
    if (!raw || isNaN(raw)) {
      alert("Enter a valid target weight!");
      return;
    }
    const newWeight = Number(raw);
    setTargetWeight(newWeight);
    // Save to backend
    const outgoing = {
      wd_goals: { targetWeight: newWeight },
      wd_weight_current: currWeight,
      wd_gym_logs: logs,
      wd_done: doneState,
    };
    try {
      await fetch("https://fitness-backend-laoe.onrender.com/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outgoing),
      });
      console.log("Target weight saved:", newWeight);
    } catch (err) {
      console.error("❌ Failed to save target weight", err);
      alert("Failed to save target weight.");
    }
  };

  // Update current weight and save to backend
  const updateCurrentWeight = async () => {
    const raw = currWeight;
    if (raw === "" || isNaN(raw)) {
      alert("Enter a valid weight!");
      return;
    }
    const newWeight = Number(raw);
    setCurrWeight(newWeight);
    // Save to backend
    const outgoing = {
      wd_weight_current: newWeight,
      wd_goals: { targetWeight: targetWeight },
      wd_gym_logs: logs,
      wd_done: doneState,
    };
    try {
      await fetch("https://fitness-backend-laoe.onrender.com/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outgoing),
      });
      console.log("Current weight updated:", newWeight);
    } catch (err) {
      console.error("❌ Failed to update current weight", err);
      alert("Failed to save current weight.");
    }
  };

  // Reset all progress both backend and local
  const resetProgress = async () => {
    const confirmReset = window.confirm("Reset ALL gym data from backend?");
    if (!confirmReset) return;
    try {
      await fetch("https://fitness-backend-laoe.onrender.com/api/state/reset", {
        method: "POST",
      });
      console.log("✅ Backend reset completed");
    } catch (err) {
      console.error("❌ Backend reset failed:", err);
    }
    // Clear local state
    setLogs({});
    setDoneState({});
    setCurrWeight("");
    setTargetWeight("");
    setSundayQuote("Fetching your motivational quote...");
    // Notify others
    window.dispatchEvent(new Event("lifeos:update"));
    alert("FULL RESET DONE ✅");
  };

  // Derived entry and plan for rendering
  const dateKey = fmtISO(date);
  const entry = logs[dateKey] || getEntry(dateKey);
  const dayPlan = DEFAULT_PLAN[weekday] || {
    title: `${weekday || "Unknown"} — No Plan`,
    left: [],
    right: [],
    finisher: [],
  };

  // Calculate completion and allowing save
  const totalExercises =
    (dayPlan.left?.length || 0) +
    (dayPlan.right?.length || 0) +
    (dayPlan.finisher?.length || 0);
  const completedExercises =
    (entry.left?.filter(Boolean).length || 0) +
    (entry.right?.filter(Boolean).length || 0) +
    (entry.finisher?.filter(Boolean).length || 0);
  let canComplete = totalExercises > 0 && completedExercises > 0;
  // If past date, allow even if no toggles
  if (!canComplete && !dayjs(date).isSame(dayjs(), "day")) {
    canComplete = true;
  }

  // Compute progress towards goal
  // Baseline is current weight or first logged weight or target
  let baseline;
  if (currWeight !== "" && !isNaN(currWeight)) {
    baseline = Number(currWeight);
  } else {
    const datedKeys = Object.keys(logs)
      .filter((k) => logs[k]?.weight != null)
      .sort();
    if (datedKeys.length > 0) {
      baseline = logs[datedKeys[0]].weight;
    } else {
      baseline = targetWeight !== "" ? Number(targetWeight) : null;
    }
  }
  const current = entry.weight != null ? entry.weight : baseline;
  const tw = targetWeight !== "" ? Number(targetWeight) : null;
  let pctToGoal = 0;
  if (
    baseline != null &&
    isFinite(baseline) &&
    tw != null &&
    isFinite(tw) &&
    isFinite(current)
  ) {
    const span = baseline - tw;
    if (span !== 0) {
      const progress = ((baseline - current) / span) * 100;
      if (progress > 120) pctToGoal = 120;
      else if (progress < -120) pctToGoal = -120;
      else pctToGoal = progress;
    }
  }
  const diffToGoal =
    isFinite(current) && isFinite(tw) ? (current - tw).toFixed(1) : null;

  return (
    <div className="rounded-2xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500 bg-gradient-to-br from-[#183D3D] via-[#5a2d2d] to-[#0F766E] border-gray-800 text-emerald-100 font-medium">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide text-emerald-200">
            Gym
          </h1>
          <p className="text-sm text-gray-300">
            Log workouts, calories, weight — stable, dark-mode ready.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={weekday}
            onChange={(e) => {
              userChangedWeekday.current = true;
              setWeekday(e.target.value);
            }}
            className="px-3 py-2 rounded-md border bg-[#07201f] text-[#FAFAF9] border-emerald-800 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
          >
            {WEEK.map((d) => (
              <option
                key={d}
                value={d}
                className="bg-[#07201f] text-emerald-100"
              >
                {d}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-md border bg-[#07201f] border-emerald-800 text-[#FAFAF9] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
          />
          <button
            onClick={resetProgress}
            className="ml-auto bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:from-red-600 hover:to-red-400 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-200"
          >
            Reset Progress
          </button>
        </div>
      </header>

      {/* Progress / Weight Section */}
      <section className="mb-4 border rounded-2xl p-4 space-y-3 border-gray-700 bg-gradient-to-br from-[#0F766E] via-[#582717] to-[#0F766E] backdrop-blur-md min-h-[120px]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Target Weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-100">
              🎯 Target
            </span>
            <input
              type="number"
              step="0.1"
              placeholder="Target weight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveTargetWeight();
                  e.target.blur();
                }
              }}
              className="w-24 px-2 py-1 rounded-md border border-gray-700 bg-[#0c2624] text-emerald-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              onClick={saveTargetWeight}
              className="px-2 py-1 rounded bg-cyan-600 text-sm hover:bg-cyan-700 transition"
            >
              Set
            </button>
            <span className="text-sm text-gray-300">kg</span>
          </div>
          ;{/* Current Weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-100">
              ⚖ Curr Weight
            </span>
            <input
              type="number"
              step="0.1"
              value={currWeight}
              onChange={(e) => setCurrWeight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateCurrentWeight();
                  e.target.blur();
                }
              }}
              className="w-24 px-2 py-1 rounded-md border border-gray-700 bg-[#0c2624] text-emerald-100 text-sm focus:ring-1 focus:ring-emerald-400"
            />
            <button
              onClick={updateCurrentWeight}
              className="px-2 py-1 rounded bg-emerald-600 text-sm hover:bg-emerald-700 transition"
            >
              Set
            </button>
            <span className="text-sm text-gray-300">kg</span>
          </div>
          ; ;{/* Display current weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Now:</span>
            <span className="text-emerald-300 font-semibold">
              {entry?.weight != null
                ? `${entry.weight} kg`
                : currWeight !== ""
                ? `${currWeight} kg`
                : "— kg"}
            </span>
          </div>
          {/* Progress text */}
          <div className="text-sm text-gray-300">
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

        {/* Progress bar */}
        <div className="relative mt-1">
          <div className="h-3 rounded-full bg-[#123232]/50 overflow-hidden" />
          <div
            className="absolute top-0 h-3 rounded-full transition-all duration-700"
            style={{
              left: pctToGoal < 0 ? "0" : "auto",
              right: pctToGoal >= 0 ? "0" : "auto",
              width: `${Math.min(100, Math.abs(pctToGoal))}%`,
              background:
                pctToGoal < 0
                  ? "linear-gradient(90deg, rgba(255,85,85,1), rgba(255,150,150,1))"
                  : "linear-gradient(270deg, rgba(79,209,197,1), rgba(34,197,94,1))",
            }}
          />
          <div
            className="absolute -top-5 mt-1 transition-all duration-700 z-20"
            style={{
              [pctToGoal < 0 ? "left" : "right"]: `calc(${Math.min(
                100,
                Math.abs(pctToGoal)
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

      {/* Workout Section */}
      <section className="mb-4 border rounded-2xl p-4 bg-gradient-to-br from-[#0F766E] via-[#582717] to-[#0F766E] text-[#FAFAFA] backdrop-blur-md min-h-[300px] transition-all duration-500">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-lg font-semibold text-emerald-200">
            {weekday} • {dayPlan.title || "No Plan Found"}
          </h2>
        </div>
        {weekday !== "Sunday" ? (
          <>
            {/* Exercises Lists */}
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {/* Left Column */}
              <ul className="list-inside list-decimal space-y-1">
                {dayPlan.left.map((exercise, i) => (
                  <li
                    key={i}
                    className={`cursor-pointer ${
                      entry.left[i] ? "text-emerald-100" : "text-gray-300"
                    }`}
                    onClick={() => toggle("left", i)}
                  >
                    <span className="inline-block w-5">
                      {entry.left[i] ? "✔️" : "⭕"}
                    </span>
                    {exercise}
                  </li>
                ))}
              </ul>
              {/* Right Column */}
              <ul className="list-inside list-decimal space-y-1">
                {dayPlan.right.map((exercise, i) => (
                  <li
                    key={i}
                    className={`cursor-pointer ${
                      entry.right[i] ? "text-emerald-100" : "text-gray-300"
                    }`}
                    onClick={() => toggle("right", i)}
                  >
                    <span className="inline-block w-5">
                      {entry.right[i] ? "✔️" : "⭕"}
                    </span>
                    {exercise}
                  </li>
                ))}
              </ul>
            </div>
            {/* Finisher */}
            {dayPlan.finisher.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-emerald-200">
                  {dayPlan.finisherLabel || "Finisher"}
                </h3>
                <ul className="list-inside list-decimal space-y-1 mt-1 text-sm">
                  {dayPlan.finisher.map((exercise, i) => (
                    <li
                      key={i}
                      className={`cursor-pointer ${
                        entry.finisher[i] ? "text-emerald-100" : "text-gray-300"
                      }`}
                      onClick={() => toggle("finisher", i)}
                    >
                      <span className="inline-block w-5">
                        {entry.finisher[i] ? "✔️" : "⭕"}
                      </span>
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Controls */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <button
                onClick={toggleMarkAll}
                className={`px-4 py-2 rounded ${
                  entry.left.every(Boolean) &&
                  entry.right.every(Boolean) &&
                  entry.finisher.every(Boolean)
                    ? "bg-yellow-600 text-white hover:bg-yellow-500"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                } transition-all duration-150`}
              >
                {entry.left.every(Boolean) &&
                entry.right.every(Boolean) &&
                entry.finisher.every(Boolean)
                  ? "❌ Unmark All"
                  : "✔️ Mark All"}
              </button>
              {!doneState[dateKey] ? (
                <button
                  onClick={openModal}
                  disabled={!canComplete}
                  className={`px-4 py-2 rounded transition-all duration-150 ${
                    canComplete
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ✅ Mark Workout Done ({fmtDisp(date)})
                </button>
              ) : (
                <button
                  onClick={deleteWorkout}
                  className="px-4 py-2 rounded bg-red-600/90 hover:bg-red-600 text-white transition-all duration-200"
                >
                  ❌ Unmark & Clear
                </button>
              )}
              {doneState[dateKey] && (
                <button
                  onClick={editWorkout}
                  className="px-3 py-2 border rounded hover:bg-white/5 transition-all duration-200 border-gray-700"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          </>
        ) : (
          // Sunday Mode
          <div className="flex flex-col items-center justify-center text-center mt-8">
            <h2 className="text-2xl font-semibold text-emerald-300 mb-3">
              🌤 Sunday Recharge Mode
            </h2>
            <p className="text-emerald-100 italic text-lg mb-4">
              {sundayQuote}
            </p>
            <button
              onClick={async () => {
                const newQuote = await fetchSundayQuote();
                setSundayQuote(newQuote);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow"
            >
              🔄 New Quote
            </button>
          </div>
        )}
      </section>

      {/* Calendar + Daily Summary */}
      <section className="grid md:grid-cols-2 gap-4 mb-2">
        <MiniCalendar date={date} setDate={setDate} doneState={doneState} />
        <DailySummary key={date} date={date} logs={logs} />
      </section>

      {/* Modal for saving workout */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-200">
              Save Workout • {fmtDisp(date)}
            </h3>

            <div>
              <label className="text-sm block text-gray-300">
                🔥 Calories Burned
              </label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-white/90 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                placeholder="e.g. 350"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveWorkout();
                    setShowModal(false);
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm block text-gray-300">
                ⚖ Current Weight (kg)
              </label>
              <input
                ref={weightInputRef}
                type="number"
                className="w-full border rounded px-3 py-2 bg-white/90 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 75"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveWorkout();
                    setTimeout(() => weightInputRef.current?.blur(), 30);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 border rounded hover:bg-white/5 text-emerald-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveWorkout();
                }}
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
function DailySummary({ date, logs }) {
  const dateKey = fmtISO(date);
  const entry = logs[dateKey];

  return (
    <div className="border rounded-2xl p-4 h-full bg-gradient-to-br from-[#0F766E] via-[#183D3D] to-[#0F0F0F] text-[#FAFAFA] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-emerald-200">Daily Summary</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            entry?.done
              ? "bg-emerald-600 text-white"
              : "bg-gray-300/20 text-emerald-100"
          }`}
        >
          {entry?.done ? "✅ Done" : "❌ Not Done"}
        </span>
      </div>

      <div className="text-sm text-gray-300 mt-1">📅 {fmtDisp(date)}</div>

      <div className="mt-3 space-y-2 text-sm text-emerald-100">
        <div>
          🔥 Calories:{" "}
          {entry?.calories != null ? `${entry.calories} kcal` : "—"}
        </div>
        <div>
          ⚖️ Weight: {entry?.weight != null ? `${entry.weight} kg` : "—"}
        </div>
        <div>📊 BMI: {entry?.bmi != null ? entry.bmi : "—"}</div>
        <div className="mt-2">
          <h4 className="font-medium mb-1 text-emerald-200">Exercises</h4>
          {entry ? (
            <ul className="list-disc list-inside text-sm">
              {(() => {
                const wd = entry.weekday || dayjs(date).format("dddd");
                const todayPlan = DEFAULT_PLAN[wd] || {};
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
                    className={bools[i] ? "text-emerald-100" : "opacity-60"}
                  >
                    {ex}
                  </li>
                ));
              })()}
            </ul>
          ) : (
            <div className="opacity-70 text-emerald-100">
              No exercises logged for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ date, setDate, doneState }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  const today = dayjs();

  useEffect(() => {
    setViewMonth(dayjs(date));
  }, [date]);

  const monthStart = viewMonth.startOf("month");
  const weekdayIndex = (monthStart.day() + 6) % 7; // Monday=0...Sunday=6
  const start = monthStart.subtract(weekdayIndex, "day");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  const doneMap = doneState || {};

  return (
    <section className="border rounded-2xl p-4 bg-gradient-to-br from-[#0F766E] via-[#183D3D] to-[#0F0F0F] text-[#FAFAFA] backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
          className="px-2 py-1 rounded hover:bg-white/5"
        >
          〈
        </button>
        <div className="font-bold text-sm text-emerald-200">
          {viewMonth.format("MMMM YYYY")}
        </div>
        <button
          onClick={() => setViewMonth(viewMonth.add(1, "month"))}
          className="px-2 py-1 rounded hover:bg-white/5"
        >
          〉
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs text-center mb-1 text-gray-400">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="opacity-80">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.format("YYYY-MM-DD");
          const isCurMonth = d.month() === viewMonth.month();
          const isSelected = key === fmtISO(date);
          const isToday = d.isSame(today, "day");

          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              title={d.format("DD-MM-YYYY")}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[11px] flex items-center justify-center border transition
                ${!isCurMonth ? "opacity-30" : ""}
                ${
                  doneMap[key]
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }
                ${isSelected ? "ring-2 ring-emerald-400" : ""}
                ${isToday ? "border-cyan-400 font-bold" : "border-white/10"}
                hover:scale-[1.03] hover:shadow`}
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
      <div className="absolute inset-0 flex items-start justify-center pt-[15vh] p-4">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F1E1E] text-emerald-100 p-4 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
/* ---------------------- Main Component ---------------------- */
