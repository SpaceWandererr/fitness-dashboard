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


/* ---------------------- Main Component ---------------------- */
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
            data.wd_goals?.currentWeight != null
              ? data.wd_goals.currentWeight
              : ""
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
  const getEntry = (dateKey) => {
    const plan = DEFAULT_PLAN[weekday]; // today's expected exercises
    const existing = logs[dateKey] || {}; // backend or local saved entry

    // helper normalizer
    const normalize = (planList, savedList) => {
      return planList.map((name, i) => {
        const saved = savedList?.[i];

        // Case 1 — already correct format: { name, done }
        if (saved && typeof saved === "object") return saved;

        // Case 2 — old format boolean: true / false
        if (typeof saved === "boolean") return { name, done: saved };

        // Case 3 — no data → create default object
        return { name, done: false };
      });
    };

    return {
      weekday: existing.weekday || weekday,

      // Always normalized
      left: normalize(plan.left, existing.left),
      right: normalize(plan.right, existing.right),
      finisher: normalize(plan.finisher, existing.finisher),

      // Persist extra workout info if exists
      calories: existing.calories,
      weight: existing.weight,
      bmi: existing.bmi,

      // Marked done?
      done: existing.done || false,
    };
  };

  // Toggle a single exercise
  const toggle = (section, idx, dateKey) => {
    if (doneState[dateKey]) return;

    const dayPlan = DEFAULT_PLAN[weekday];
    const entry = logs[dateKey] || getEntry(dateKey);

    const updated = {
      ...entry,
      [section]: entry[section].map((item, i) =>
        i === idx ? { ...item, done: !item.done } : item
      ),
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updated }));
  };

  // Toggle all exercises for today
  const toggleMarkAll = (dateKey) => {
    const entry = logs[dateKey] || getEntry(dateKey);

    const allDone =
      entry.left.every((e) => e.done) &&
      entry.right.every((e) => e.done) &&
      entry.finisher.every((e) => e.done);

    const val = !allDone;

    const updated = {
      ...entry,
      left: entry.left.map((e) => ({ ...e, done: val })),
      right: entry.right.map((e) => ({ ...e, done: val })),
      finisher: entry.finisher.map((e) => ({ ...e, done: val })),
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updated }));
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

    // Normalize the entry FIRST — ensures objects always have {name, done}
    const entry = logs[dateKey] || getEntry(dateKey);

    // 🔥 CALORIES
    const caloriesVal = Number(caloriesInput) || 0;

    // ⚖ WEIGHT
    const parsedWeight = weightInput === "" ? null : Number(weightInput);
    const weightVal = Number.isFinite(parsedWeight)
      ? parsedWeight
      : entry.weight || null;

    // 📊 BMI
    const HEIGHT_CM = 176;
    const newBmi = weightVal
      ? Number((weightVal / Math.pow(HEIGHT_CM / 100, 2)).toFixed(1))
      : entry.bmi || null;

    // 🆕 BUILD UPDATED ENTRY (always keeps name + done objects)
    const updatedEntry = {
      weekday: entry.weekday || weekday,
      left: entry.left.map((x) => ({ ...x })), // preserve objects
      right: entry.right.map((x) => ({ ...x })),
      finisher: entry.finisher.map((x) => ({ ...x })),
      calories: caloriesVal,
      weight: weightVal,
      bmi: newBmi,
      done: true,
    };

    // ⬆ Update UI state
    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
    setDoneState((prev) => ({ ...prev, [dateKey]: true }));
    setShowModal(false);

    // 🌐 BACKEND SAVE — CLEAN MODEL
    const outgoing = {
      wd_gym_logs: {
        ...logs,
        [dateKey]: updatedEntry,
      },
      wd_done: {
        ...doneState,
        [dateKey]: true,
      },
      wd_goals: {
        targetWeight, // keep target
        currentWeight: weightVal, // <-- single source of truth
      },
    };

    fetch("https://fitness-backend-laoe.onrender.com/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(outgoing),
    }).catch((err) => console.error("SAVE FAILED ❌", err));
  };
  // Edit existing workout (open modal with existing values)
  const editWorkout = () => {
    openModal();
  };

  // Unmark workout and fully reset the day
  const deleteWorkout = (dateKey) => {
    // Update local state - REMOVE the entry completely
    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[dateKey]; // Completely remove the date entry
      return updated;
    });

    // Remove from doneState
    setDoneState((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });

    // Sync to backend with the updated state
    setTimeout(() => {
      const updatedLogs = { ...logs };
      delete updatedLogs[dateKey];

      const updatedDone = { ...doneState };
      delete updatedDone[dateKey];

      fetch("https://fitness-backend-laoe.onrender.com/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wd_gym_logs: updatedLogs,
          wd_done: updatedDone,
          wd_goals: {
            targetWeight,
            currentWeight: currWeight,
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Successfully deleted workout", data);
        })
        .catch((err) => {
          console.error("Failed to sync deleted workout", err);
        });
    }, 100);

    // Trigger UI updates across app
    window.dispatchEvent(new Event("lifeos:update"));
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
      wd_goals: {
        targetWeight: newWeight,
        currentWeight: currWeight,
      },
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
      wd_goals: {
        targetWeight,
        currentWeight: newWeight,
      },
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
    const confirmReset = window.confirm("Reset ALL gym data?");
    if (!confirmReset) return;

    const outgoing = {
      wd_gym_logs: {},
      wd_done: {},
      wd_goals: {
        targetWeight: "",
        currentWeight: "",
      },
    };

    try {
      await fetch("https://fitness-backend-laoe.onrender.com/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outgoing),
      });

      console.log("✅ FULL RESET DONE");
    } catch (err) {
      console.error("❌ Reset failed:", err);
      alert("Reset failed!");
      return;
    }

    // Clear local
    setLogs({});
    setDoneState({});
    setCurrWeight("");
    setTargetWeight("");
    setSundayQuote("Fetching your motivational quote...");

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

  // Paste this above your `Gym` component in Gym.jsx
  // ============================================
  // Clean, Safe, Tailwind-Compatible Column Component
  // ============================================
  function ExerciseColumn({
    title,
    items = [],
    dayPlanItems = [],
    planLength = 0,
    color = "emerald", // "emerald" or "cyan"
    section, // "left" | "right" | "finisher"
    toggle, // toggle(section, idx, dateKey)
    doneState = {},
    dateKey,
  }) {
    // Detect if items is boolean array or object array
    const isBooleanArray =
      Array.isArray(items) && items.every((item) => typeof item === "boolean");

    // Column color theme
    const titleColor =
      color === "cyan"
        ? "text-cyan-300 dark:text-cyan-400"
        : "text-emerald-300 dark:text-emerald-400";

    const tagBg =
      color === "cyan"
        ? "bg-cyan-500/20 text-cyan-200"
        : "bg-emerald-500/20 text-emerald-200";

    const doneBg =
      color === "cyan"
        ? "bg-cyan-500/10 hover:bg-cyan-500/20 dark:bg-cyan-500/5 dark:hover:bg-cyan-500/10"
        : "bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10";

    const doneText =
      color === "cyan"
        ? "text-cyan-200 dark:text-cyan-300"
        : "text-emerald-200 dark:text-emerald-300";

    const hoverBorder =
      color === "cyan"
        ? "hover:border-cyan-400/30 dark:hover:border-cyan-400/25"
        : "hover:border-emerald-400/30 dark:hover:border-emerald-400/25";

    return (
      <div
        className={`
        group rounded-2xl p-5 border border-white/10 dark:border-white/5 transition-all
        bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132]/80
        dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
        ${hoverBorder}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${titleColor} text-lg`}>{title}</h3>
          <span
            className={`text-xs ${tagBg} px-2 py-1 rounded-full font-medium`}
          >
            {isBooleanArray
              ? items.filter(Boolean).length
              : items.filter((e) => e?.done).length}
            /{planLength}
          </span>
        </div>

        {/* Exercise List */}
        <ul className="space-y-3">
          {dayPlanItems.map((exercise, i) => {
            const isDone = isBooleanArray ? items[i] : items[i]?.done;
            const exerciseName =
              typeof exercise === "string" ? exercise : exercise?.name || "";

            return (
              <li
                key={i}
                onClick={() =>
                  !doneState[dateKey] && toggle(section, i, dateKey)
                }
                className={`
                cursor-pointer flex items-center gap-3 p-2 rounded-lg transition-all duration-200
                ${
                  isDone
                    ? doneBg
                    : "hover:bg-white/5 dark:hover:bg-white/[0.03]"
                }
                ${doneState[dateKey] ? "opacity-40 cursor-not-allowed" : ""}
              `}
              >
                <span className="text-xl shrink-0 transition-transform group-hover:scale-110">
                  {isDone ? "✅" : "⭕"}
                </span>

                <span
                  className={`text-sm ${
                    isDone
                      ? `${doneText} font-medium`
                      : "text-gray-300 dark:text-gray-400"
                  }`}
                >
                  {exerciseName}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500
     bg-gradient-to-br from-[#183D3D] via-[#5a2d2d] to-[#0F766E]
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
      [#0A0F1C]
      border-gray-800 text-emerald-100 font-medium"
    >
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
          {/* Current Weight */}
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
          {/* Display Current/Todays weight */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Now:</span>
            <span className="text-emerald-300 font-semibold">
              {(() => {
                // 1. If TODAY has logged weight → show it
                if (entry?.weight != null) return `${entry.weight} kg`;

                // 2. Get all past logged weights
                const pastKeys = Object.keys(logs)
                  .filter((k) => logs[k]?.weight != null && k < dateKey)
                  .sort()
                  .reverse(); // latest first

                // 3. If yesterday specifically has weight, use that first
                const yesterdayKey = dayjs(dateKey)
                  .subtract(1, "day")
                  .format("YYYY-MM-DD");
                if (logs[yesterdayKey]?.weight != null) {
                  return `${logs[yesterdayKey].weight} kg`;
                }

                // 4. If no yesterday → use most recent backdated weight
                if (pastKeys.length > 0) {
                  return `${logs[pastKeys[0]].weight} kg`;
                }

                // 5. No weight anywhere → show —
                return "—";
              })()}
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

      {/* Calendar + Daily Summary */}
      <section className="grid md:grid-cols-2 gap-4 mb-2">
        <MiniCalendar date={date} setDate={setDate} doneState={doneState} />
        <DailySummary key={date} date={date} logs={logs} />
      </section>

      {/* Workout Section */}
      <section className="mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-600 p-[1px] shadow-2xl dark:shadow-black/50">
          <div className="relative bg-gradient-to-br from-[#B82132]/95 via-[#183D3D] to-[#0F0F0F] dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] backdrop-blur-sm rounded-3xl p-6 md:p-8">
            {/* BG DECOR */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-3xl -z-10"></div>

            {/* HEADER */}
            <div className="mb-6 pb-4 border-b border-emerald-500/20 dark:border-emerald-400/15">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                    {weekday}
                  </h2>

                  <div className="flex items-center gap-2 text-emerald-100/80 dark:text-emerald-200/70">
                    <span className="text-sm font-medium">{dayPlan.title}</span>
                    <span className="text-emerald-400/60 dark:text-emerald-500/50">
                      •
                    </span>
                    <span className="text-sm">{fmtDisp(date)}</span>
                  </div>
                </div>

                {/* QUICK STATS */}
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white/5 px-3 py-2 rounded-lg border border-emerald-400/20">
                    <p className="text-[10px] uppercase tracking-wide text-emerald-300/70 font-semibold">
                      Total
                    </p>
                    <p className="text-xl font-bold text-emerald-100">
                      {dayPlan.left.length +
                        dayPlan.right.length +
                        dayPlan.finisher.length}
                    </p>
                  </div>

                  <div className="bg-white/5 px-3 py-2 rounded-lg border border-teal-400/20">
                    <p className="text-[10px] uppercase tracking-wide text-teal-300/70 font-semibold">
                      Done
                    </p>
                    <p className="text-xl font-bold text-teal-100">
                      {(Array.isArray(entry.left) &&
                      entry.left.every((item) => typeof item === "boolean")
                        ? entry.left.filter(Boolean).length
                        : entry.left.filter((e) => e?.done).length) +
                        (Array.isArray(entry.right) &&
                        entry.right.every((item) => typeof item === "boolean")
                          ? entry.right.filter(Boolean).length
                          : entry.right.filter((e) => e?.done).length) +
                        (Array.isArray(entry.finisher) &&
                        entry.finisher.every(
                          (item) => typeof item === "boolean"
                        )
                          ? entry.finisher.filter(Boolean).length
                          : entry.finisher.filter((e) => e?.done).length)}
                    </p>
                  </div>

                  <div className="bg-white/5 px-3 py-2 rounded-lg border border-cyan-400/20">
                    <p className="text-[10px] uppercase tracking-wide text-cyan-300/70 font-semibold">
                      Progress
                    </p>
                    <p className="text-xl font-bold text-cyan-100">
                      {Math.round(
                        (((Array.isArray(entry.left) &&
                        entry.left.every((item) => typeof item === "boolean")
                          ? entry.left.filter(Boolean).length
                          : entry.left.filter((e) => e?.done).length) +
                          (Array.isArray(entry.right) &&
                          entry.right.every((item) => typeof item === "boolean")
                            ? entry.right.filter(Boolean).length
                            : entry.right.filter((e) => e?.done).length) +
                          (Array.isArray(entry.finisher) &&
                          entry.finisher.every(
                            (item) => typeof item === "boolean"
                          )
                            ? entry.finisher.filter(Boolean).length
                            : entry.finisher.filter((e) => e?.done).length)) /
                          (dayPlan.left.length +
                            dayPlan.right.length +
                            dayPlan.finisher.length)) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-700 ease-out"
                  style={{
                    width: `${
                      (((Array.isArray(entry.left) &&
                      entry.left.every((item) => typeof item === "boolean")
                        ? entry.left.filter(Boolean).length
                        : entry.left.filter((e) => e?.done).length) +
                        (Array.isArray(entry.right) &&
                        entry.right.every((item) => typeof item === "boolean")
                          ? entry.right.filter(Boolean).length
                          : entry.right.filter((e) => e?.done).length) +
                        (Array.isArray(entry.finisher) &&
                        entry.finisher.every(
                          (item) => typeof item === "boolean"
                        )
                          ? entry.finisher.filter(Boolean).length
                          : entry.finisher.filter((e) => e?.done).length)) /
                        (dayPlan.left.length +
                          dayPlan.right.length +
                          dayPlan.finisher.length)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 3 COLUMN LAYOUT */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* LEFT COLUMN */}
              <ExerciseColumn
                title="Left"
                items={entry.left}
                dayPlanItems={dayPlan.left}
                planLength={dayPlan.left.length}
                color="emerald"
                section="left"
                toggle={toggle}
                doneState={doneState}
                dateKey={dateKey}
              />

              {/* RIGHT COLUMN */}
              <ExerciseColumn
                title="Right"
                items={entry.right}
                dayPlanItems={dayPlan.right}
                planLength={dayPlan.right.length}
                color="emerald"
                section="right"
                toggle={toggle}
                doneState={doneState}
                dateKey={dateKey}
              />

              {/* FINISHER COLUMN */}
              <ExerciseColumn
                title={dayPlan.finisherLabel || "Finisher"}
                items={entry.finisher}
                dayPlanItems={dayPlan.finisher}
                planLength={dayPlan.finisher.length}
                color="cyan"
                section="finisher"
                toggle={toggle}
                doneState={doneState}
                dateKey={dateKey}
              />
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-emerald-500/20">
              {/* MARK ALL / UNMARK ALL */}
              <button
                onClick={() => !doneState[dateKey] && toggleMarkAll(dateKey)}
                disabled={doneState[dateKey]}
                className={`group relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
      ${
        doneState[dateKey]
          ? "bg-gray-700/40 text-gray-400 cursor-not-allowed opacity-60"
          : (Array.isArray(entry.left) &&
            entry.left.every((item) => typeof item === "boolean")
              ? entry.left.every(Boolean)
              : entry.left.every((e) => e?.done)) &&
            (Array.isArray(entry.right) &&
            entry.right.every((item) => typeof item === "boolean")
              ? entry.right.every(Boolean)
              : entry.right.every((e) => e?.done)) &&
            (Array.isArray(entry.finisher) &&
            entry.finisher.every((item) => typeof item === "boolean")
              ? entry.finisher.every(Boolean)
              : entry.finisher.every((e) => e?.done))
          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.05] shadow-lg shadow-orange-500/30"
          : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-[1.05] shadow-lg shadow-blue-500/30"
      }
    `}
              >
                {(Array.isArray(entry.left) &&
                entry.left.every((item) => typeof item === "boolean")
                  ? entry.left.every(Boolean)
                  : entry.left.every((e) => e?.done)) &&
                (Array.isArray(entry.right) &&
                entry.right.every((item) => typeof item === "boolean")
                  ? entry.right.every(Boolean)
                  : entry.right.every((e) => e?.done)) &&
                (Array.isArray(entry.finisher) &&
                entry.finisher.every((item) => typeof item === "boolean")
                  ? entry.finisher.every(Boolean)
                  : entry.finisher.every((e) => e?.done))
                  ? "❌ Unmark All"
                  : "✔️ Mark All"}
              </button>

              {/* MARK DONE */}
              {!doneState[dateKey] ? (
                <button
                  onClick={openModal}
                  disabled={
                    !(
                      (Array.isArray(entry.left) &&
                      entry.left.every((item) => typeof item === "boolean")
                        ? entry.left.some(Boolean)
                        : entry.left.some((e) => e?.done)) ||
                      (Array.isArray(entry.right) &&
                      entry.right.every((item) => typeof item === "boolean")
                        ? entry.right.some(Boolean)
                        : entry.right.some((e) => e?.done)) ||
                      (Array.isArray(entry.finisher) &&
                      entry.finisher.every((item) => typeof item === "boolean")
                        ? entry.finisher.some(Boolean)
                        : entry.finisher.some((e) => e?.done))
                    )
                  }
                  className={`group relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
        ${
          (Array.isArray(entry.left) &&
          entry.left.every((item) => typeof item === "boolean")
            ? entry.left.some(Boolean)
            : entry.left.some((e) => e?.done)) ||
          (Array.isArray(entry.right) &&
          entry.right.every((item) => typeof item === "boolean")
            ? entry.right.some(Boolean)
            : entry.right.some((e) => e?.done)) ||
          (Array.isArray(entry.finisher) &&
          entry.finisher.every((item) => typeof item === "boolean")
            ? entry.finisher.some(Boolean)
            : entry.finisher.some((e) => e?.done))
            ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:scale-[1.05] shadow-lg shadow-emerald-500/30"
            : "bg-slate-700/40 text-slate-500 cursor-not-allowed opacity-60"
        }
      `}
                >
                  ✅ Mark Workout Done
                </button>
              ) : (
                <>
                  <button
                    onClick={() => deleteWorkout(dateKey)}
                    className="group relative px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-red-600 to-rose-600 text-white hover:scale-[1.05] shadow-lg shadow-red-500/30 transition-all duration-300"
                  >
                    ❌ Unmark & Clear
                  </button>

                  <button
                    onClick={editWorkout}
                    className="group relative px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 text-emerald-100 border border-emerald-400/30 hover:border-emerald-400/50 hover:scale-[1.05] transition-all duration-300"
                  >
                    ✏️ Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for saving workout */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onEnter={() => {
            saveWorkout();
            setShowModal(false);
          }}
        >
          <div className="space-y-6">
            {/* HEADER */}
            <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 text-transparent bg-clip-text">
              Save Workout • {fmtDisp(date)}
            </h3>

            {/* CALORIES INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                🔥 Calories Burned
              </label>

              <input
                type="number"
                className="
          w-full px-3 py-2 rounded-lg
          bg-[#0B1A1A]/80
          text-emerald-100
          border border-emerald-500/20
          placeholder-emerald-300/40
          focus:border-emerald-400/40 focus:ring-1 
          focus:ring-emerald-400 outline-none
          transition-all
        "
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

            {/* WEIGHT INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-emerald-200">
                ⚖ Current Weight (kg)
              </label>

              <input
                ref={weightInputRef}
                type="number"
                className="
          w-full px-3 py-2 rounded-lg
          bg-[#0B1A1A]/80
          text-emerald-100
          border border-emerald-500/20
          placeholder-emerald-300/40
          focus:border-emerald-400/40 focus:ring-1 
          focus:ring-emerald-400 outline-none
          transition-all
        "
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

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="
          px-4 py-2 rounded-lg border border-emerald-500/20 
          text-emerald-200 hover:bg-emerald-500/10
          transition-all
        "
              >
                Cancel
              </button>

              <button
                onClick={() => saveWorkout()}
                className="
          px-4 py-2 rounded-lg 
          bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
          hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400
          text-white font-semibold shadow-lg shadow-emerald-800/30
          transition-all hover:scale-[1.03]
        "
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
    <div
      className="border rounded-2xl p-4 h-full
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
      [#0A0F1C]
     text-[#FAFAFA] backdrop-blur-md"
    >
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

function MiniCalendar({ date, setDate, doneState, logs }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  const today = dayjs();

  useEffect(() => {
    setViewMonth(dayjs(date));
  }, [date]);

  const monthStart = viewMonth.startOf("month");
  const weekdayIndex = (monthStart.day() + 6) % 7; // Monday=0
  const start = monthStart.subtract(weekdayIndex, "day");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));

  return (
    <section
      className="border rounded-2xl p-4
     bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
      text-[#FAFAFA] backdrop-blur-md"
    >
      {/* Header */}
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

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-[10px] sm:text-xs text-center mb-1 text-gray-400">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="opacity-80">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = d.format("YYYY-MM-DD");
          const isCurMonth = d.month() === viewMonth.month();
          const isSelected = key === date;
          const isToday = d.isSame(today, "day");

          // SAFELY resolve entry
          const entry = logs?.[key];

          // Primary check: doneState (most reliable)
          const doneByState = doneState?.[key] === true;

          // Secondary check: check if ANY exercise is completed
          let doneByExercises = false;
          if (entry) {
            // Handle both boolean arrays and object arrays
            const checkArray = (arr) => {
              if (!Array.isArray(arr)) return false;
              // If it's a boolean array
              if (arr.every((item) => typeof item === "boolean")) {
                return arr.some(Boolean);
              }
              // If it's an object array
              return arr.some((e) => e?.done === true);
            };

            doneByExercises =
              checkArray(entry.left) ||
              checkArray(entry.right) ||
              checkArray(entry.finisher);
          }

          const isDone = doneByState || doneByExercises;

          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              title={d.format("DD-MM-YYYY")}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-[11px] flex items-center justify-center border transition
                ${!isCurMonth ? "opacity-30" : ""}
                ${
                  isDone
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


function Modal({ children, onClose, onEnter }) {
  // 🔥 Handle ESC + ENTER keys
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Enter" && onEnter) {
        onEnter();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onEnter]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose} // 🟢 Clicking outside closes modal
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"></div>

      {/* MODAL BOX */}
      <div
        className="
          relative w-full max-w-lg rounded-2xl p-6
          bg-gradient-to-br from-[#0F1622]/95 via-[#132033]/95 to-[#0A0F1C]/95
          border border-emerald-400/20 shadow-2xl shadow-black/40
          animate-modalIn
        "
        onClick={(e) => e.stopPropagation()} // 🛑 Prevent closing on inside click
      >
        {children}
      </div>
    </div>
  );
}




