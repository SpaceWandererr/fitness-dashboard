// GymSimplified.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import dayjs from "dayjs";

/* ---------------------- Local Storage Utilities ---------------------- */
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
  } catch {}
}

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

// 🔹 Sunday Quote Fetcher
// robust fetch with caching, fallbacks and rate-limit handling
async function fetchSundayQuote(opts = { cooldownSeconds: 60 }) {
  // local fallback quotes (used when APIs fail or rate-limited)
  const LOCAL_FALLBACK = [
    "Discipline is doing what needs to be done even when you don’t feel like doing it. — Unknown",
    "Your body can stand almost anything. It’s your mind that you have to convince. — Unknown",
    "Push yourself because no one else is going to do it for you. — Unknown",
    "Rest is not idleness. Sometimes, rest is the most productive thing you can do. — Unknown",
    "Small consistent steps every day lead to massive results over time. — Unknown",
  ];

  // quick helpers
  const now = Date.now();
  const cacheKey = "wd_sunday_quote_cache";
  const cache = (() => {
    try {
      return JSON.parse(localStorage.getItem(cacheKey) || "null");
    } catch {
      return null;
    }
  })();

  // if cached recently, return it (prevents hammering the APIs)
  if (
    cache &&
    cache.ts &&
    now - cache.ts < (opts.cooldownSeconds || 60) * 1000
  ) {
    return cache.text;
  }

  // sources to try in order (CORS-safe or proxied)
  const sources = [
    // quotable is simple and often works (no key)
    {
      id: "quotable",
      fn: async () => {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) throw res;
        const data = await res.json();
        return `“${data.content}” — ${data.author || "Unknown"}`;
      },
    },

    // codetabs proxy to zenquotes (works for many dev setups)
    {
      id: "codetabs-zenquotes",
      fn: async () => {
        const encoded = encodeURIComponent("https://zenquotes.io/api/random");
        const res = await fetch(
          `https://api.codetabs.com/v1/proxy?quest=${encoded}`,
        );
        if (!res.ok) throw res;
        const data = await res.json();
        if (Array.isArray(data) && data[0])
          return `“${data[0].q}” — ${data[0].a || "Unknown"}`;
        throw new Error("bad-zen-format");
      },
    },

    // last-resort: fetch from a raw static JSON (may be offline or CORS blocked)
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
  ];

  // try each source until one succeeds; handle 429 specially
  for (const src of sources) {
    try {
      const txt = await src.fn();
      // cache success
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ ts: Date.now(), text: txt }),
        );
      } catch (e) {
        /* ignore storage failures */
      }
      return txt;
    } catch (err) {
      // if server returned Response, check status
      if (err && err.status) {
        // handle 429 (rate-limited) by stopping attempts and using fallback
        if (err.status === 429) {
          console.warn(`[quotes] ${src.id} rate-limited (429)`);
          break;
        }
        // if 404 / 400 for that particular source, continue to next
        console.warn(`[quotes] ${src.id} failed: ${err.status}`);
        continue;
      }
      // network or other error: log and try next
      console.warn(`[quotes] ${src.id} error:`, err);
      continue;
    }
  }

  // All sources failed or rate-limited -> try cached value even if older
  if (cache && cache.text) return cache.text;

  // last fallback: pick a random local quote and cache it
  const localPick =
    LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)];
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ ts: Date.now(), text: localPick }),
    );
  } catch {}
  return localPick;
}

/* ---------------------- Full 6-day Workout Plan (exact from user) ---------------------- */
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
export default function GymSimplified() {
  // ✅ move date & weekday inside the component
  const today = dayjs();
  const todayIso = today.format("YYYY-MM-DD");
  const todayName = today.format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  const [date, setDate] = useState(todayIso);
  const [weekday, setWeekday] = useState(defaultDay);
  const dateKey = fmtISO(date);
  // 💬 Sunday quote text
  const [sundayQuote, setSundayQuote] = useState(
    "Fetching your motivational quote...",
  );

  /* persist plan */
  const [plan, setPlan] = useState(() => load("wd_gym_plan", DEFAULT_PLAN));
  // 🧘 Safe Sunday Quote Fetch
  useEffect(() => {
    const wd = dayjs(date).format("dddd");
    if (wd === "Sunday") {
      fetchSundayQuote().then((quote) => {
        setPlan((prev) => {
          const safePrev = prev || {};
          const sun = safePrev.Sunday || {
            title: "Sunday Recharge Mode 🌤",
            left: [],
            right: [],
            finisherLabel: "Motivation of the Day",
            finisher: [],
          };
          return {
            ...safePrev,
            Sunday: { ...sun, finisher: [quote] },
          };
        });
      });
    }
  }, [date]);

  useEffect(() => save("wd_gym_plan", plan), [plan]);

  /* ensure any missing days are filled (safety) */
  useEffect(() => {
    const updated = { ...DEFAULT_PLAN, ...plan };
    setPlan(updated);
    save("wd_gym_plan", updated);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* logs & goals */
  const [logs, setLogs] = useState(() => load("wd_gym_logs", {}));

  useEffect(() => {
    if (weekday === "Sunday") {
      fetchSundayQuote().then(setSundayQuote);
    }
  }, [weekday]);

  useEffect(() => save("wd_gym_logs", logs), [logs]);

  const [targetWeight, setTargetWeight] = useState(() => {
    const goals = load("wd_goals", { targetWeight: 70 });
    return goals?.targetWeight ?? 70;
  });
  useEffect(() => {
    const goals = load("wd_goals", {});
    save("wd_goals", { ...goals, targetWeight });
  }, [targetWeight]);

  const [startWeight, setStartWeight] = useState(() =>
    load("wd_start_weight", null),
  );
  useEffect(() => {
    if (startWeight !== null && startWeight !== undefined) {
      save("wd_start_weight", startWeight);
    }
  }, [startWeight]);

  const [weightOverrides, setWeightOverrides] = useState(() =>
    load("wd_weight_overrides", {}),
  );
  useEffect(
    () => save("wd_weight_overrides", weightOverrides),
    [weightOverrides],
  );

  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));
  useEffect(() => save("bmi_logs", bmiLogs), [bmiLogs]);

  /* modal and inputs */
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [currentWeightInput, setCurrentWeightInput] = useState("");
  const weightInputRef = useRef(null);

  useEffect(() => {
    if (showModal && weightInputRef.current) {
      setTimeout(() => {
        weightInputRef.current?.focus();
        weightInputRef.current?.select();
      }, 10);
    }
  }, [showModal]);

  /* UI misc */
  const [saving, setSaving] = useState(false);

  /* sync date -> weekday to avoid mismatch */
  useEffect(() => {
    const name = dayjs(date).format("dddd");
    setWeekday(name);
  }, [date]);

  // 🧭 When weekday changes manually (via dropdown), adjust date accordingly
  useEffect(() => {
    // Only run when user manually selects weekday (not initial load)
    if (!WEEK.includes(weekday)) return;

    const currentDate = dayjs(date);
    const startOfWeek = currentDate.startOf("week").add(1, "day"); // Monday start
    const newDate = startOfWeek
      .add(WEEK.indexOf(weekday), "day")
      .format("YYYY-MM-DD");
    if (newDate !== date) setDate(newDate);
  }, [weekday]);

  function persistLogFor(dateIso, obj) {
    const next = { ...logs, [dateIso]: obj };
    setLogs(next);
    save("wd_gym_logs", next);
  }

  /* checks initializer - robust and stable layout (always arrays) */
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

  /* toggles */
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
    checks.left?.some(Boolean) ||
    checks.right?.some(Boolean) ||
    checks.finisher?.some(Boolean) ||
    false;

  const openCaloriesModal = () => {
    if (!canComplete) return;
    setCaloriesInput((checks.calories ?? "").toString());
    const overrideWeight = weightOverrides[dateKey];
    setCurrentWeightInput(
      ((checks.weight ?? overrideWeight ?? "") || "").toString(),
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

    if (weight) {
      const savedStart = load("wd_start_weight", null);
      // Only set start weight if it wasn't set before (let user control updates)
      if (savedStart === null || savedStart === undefined) {
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
      ((prev.weight ?? weightOverrides[dateKey] ?? "") || "").toString(),
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

  /* streak + totals */
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

  /* weight progress helpers (light) */
  const recentWeights = (load("bmi_logs", []) || [])
    .map((b) => b?.weight)
    .filter((w) => typeof w === "number");
  const inferredStart = recentWeights.length
    ? Math.max(...recentWeights.slice(-30))
    : (checks.weight ?? targetWeight);
  const effectiveStart = startWeight ?? inferredStart;
  const overrideWeight = weightOverrides[dateKey];
  let curWeight =
    overrideWeight ??
    checks.weight ??
    recentWeights.slice().reverse()[0] ??
    effectiveStart;
  const tw = Number(targetWeight);
  // 🧮 Weight progress & regression handling
  const pctToGoal = (() => {
    const start = Number(effectiveStart);
    const target = Number(tw);
    const current = Number(curWeight);

    if (!isFinite(start) || !isFinite(target) || !isFinite(current)) return 0;

    const span = start - target;
    if (span === 0) return 0;

    const progress = ((start - current) / span) * 100;

    // Clamp to range and keep regression visible
    if (progress > 120) return 120;
    if (progress < -120) return -120;
    return progress;
  })();

  const diffToGoal =
    isFinite(curWeight) && isFinite(tw) ? (curWeight - tw).toFixed(1) : null;

  /* reset progress */
  const resetProgress = () => {
    if (
      !confirm(
        "Reset ALL gym progress? This will clear logs, weights, streaks. Plan and goals will remain.",
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

  /* normalized weekday safety */
  const normalizedWeekday = WEEK.find(
    (d) => d.toLowerCase() === (weekday || "").toLowerCase(),
  );
  const dayPlan = (normalizedWeekday && plan?.[normalizedWeekday]) ||
    DEFAULT_PLAN[normalizedWeekday] || {
      title: `${weekday || "Unknown"} — No Plan`,
      left: [],
      right: [],
      finisher: [],
    };

  if (!plan || typeof plan !== "object") {
    return (
      <div className="p-4 text-red-400">
        ⚠ Error: Workout plan is missing or corrupted.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500 
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAF9]
      bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000]
      border-gray-800 text-emerald-100 font-medium"
    >
      {/* Header */}
      <header
        className="flex flex-col md:flex-row items-start
        md:items-center justify-between gap-4 mb-4
        "
      >
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
            onChange={(e) => setWeekday(e.target.value)}
            className="px-3 py-2 rounded-md border border-emerald-700 
            bg-[#07201f] text-[#FAFAF9] border-gray-700 dark:border-emerald-800
            text-emerald-100 text-sm focus:outline-none focus:ring-1
            focus:ring-emerald-400 transition"
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
            className="px-3 py-2 rounded-md border border-emerald-700
            bg-[#07201f] border-gray-700 dark:border-emerald-800
            to-[#0F0F0F] text-[#FAFAF9]
            text-emerald-100 text-sm focus:outline-none focus:ring-1 
            focus:ring-emerald-400 transition"
          />

          <button
            onClick={resetProgress}
            className="ml-auto
            bg-gradient-to-r from-red-700 via-red-600 to-red-500
            hover:from-red-600 hover:to-red-400
            text-white px-4 py-2 rounded-md text-sm font-semibold 
            shadow-md transition-all duration-200"
          >
            Reset Progress
          </button>
        </div>
      </header>

      {/* Progress / weight */}
      <section
        className="mb-4 border rounded-2xl
        p-4 space-y-3 border-gray-700 dark:border-emerald-800
        bg-gradient-to-br dark:from-[#071b1b]/60 dark:via-[#071b1b]/60 dark:to- 
        [#071b1b]/60
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#B82132]
        backdrop-blur-md min-h-[120px]"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-100">
              🎯 Target
            </span>
            <input
              type="number"
              step="0.1"
              className="w-24 px-2 py-1 rounded-md border
              border-gray-700 dark:border-emerald-800
              bg-[#0c2624] text-emerald-100 text-sm focus:outline-none
              focus:ring-1 focus:ring-emerald-400"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
            />
            <span className="text-sm text-gray-300">kg</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-100">
              ⚖️ Start
            </span>
            <input
              type="number"
              step="0.1"
              className="w-24 px-2 py-1 rounded-md border
              border-gray-700 dark:border-emerald-800 bg-[#0c2624] 
              text-emerald-100 text-sm focus:outline-none 
              focus:ring-1 focus:ring-emerald-400"
              value={startWeight ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") setStartWeight(null);
                else setStartWeight(Number(v));
              }}
            />
            <span className="text-sm text-gray-300">kg</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Now:</span>
            <span className="text-emerald-300 font-semibold">
              {curWeight ? `${curWeight} kg` : "—"}
            </span>
          </div>

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

        {/* 🏃 Progress Bar with Directional Runner */}
        <div className="relative mt-1">
          {/* Base bar */}
          <div className="h-3 rounded-full bg-[#123232]/50 overflow-hidden" />

          {/* Dynamic fill */}
          <div
            className="absolute top-0 h-3 rounded-full transition-all duration-700"
            style={{
              left: pctToGoal < 0 ? "0" : "auto",
              right: pctToGoal >= 0 ? "0" : "auto",
              width: `${Math.min(100, Math.abs(pctToGoal))}%`,
              background:
                pctToGoal < 0
                  ? "linear-gradient(90deg, rgba(255,85,85,1), rgba(255,150,150,1))" // 🔴 regression
                  : "linear-gradient(270deg, rgba(79,209,197,1), rgba(34,197,94,1))", // 🟢 progress
            }}
          />

          {/* 🏃 Runner */}
          <div
            className="absolute -top-5 mt-1 transition-all duration-700 z-20"
            style={{
              [pctToGoal < 0 ? "left" : "right"]: `calc(${Math.min(
                100,
                Math.abs(pctToGoal),
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
      <section
        className="mb-4 border rounded-2xl p-4
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAFA]
        bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000]
        backdrop-blur-md min-h-[300px] 
        transition-all duration-500"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-lg font-semibold text-emerald-200">
              {weekday} • {dayPlan.title || "No Plan Found"}
            </h2>
            <div className="text-sm text-gray-300 mt-1">
              Date: {fmtDisp(date)}
            </div>
            <div className="mt-2 text-sm text-gray-300">
              Completion: {completedExercises}/{totalExercises} (
              {completionPct || 0}%)
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-sm px-3 py-1 rounded bg-emerald-600/90 text-white shadow">
              🔥 Streak: {streak || 0} days
            </div>
          </div>
        </div>

        {/* 🧘 Sunday Conditional Layout */}
        {weekday !== "Sunday" ? (
          <>
            {/* Exercises: Stable three-column layout (Left, Right, Finisher) */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4
              transition-all duration-300 ease-in-out
              "
              style={{ minHeight: "340px" }} // keeps same height between days
            >
              {["left", "right", "finisher"].map((sectionKey, idx) => {
                const label =
                  sectionKey === "left"
                    ? "Left"
                    : sectionKey === "right"
                      ? "Right"
                      : dayPlan.finisherLabel || "Finisher";

                const list = dayPlan[sectionKey] || [];
                const state = checks[sectionKey] || [];

                return (
                  <div
                    key={sectionKey}
                    className="rounded-xl bg-white/5
                    bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#B82132] text-[#FAFAFA]
                    bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000]
                    p-4 shadow-sm border border-emerald-800/40 
                    backdrop-blur-md transition-transform duration-300
                    hover:scale-[1.01]"
                  >
                    <h3 className="text-emerald-300 text-lg font-semibold mb-3">
                      {label}
                    </h3>

                    {/* Keep consistent height to prevent reflow shake */}
                    {/* 🪄 Fade + stability wrapper starts here */}
                    <div className="transition-opacity duration-500 ease-in-out opacity-100 will-change-[opacity,transform]">
                      <div
                        className="flex flex-col gap-2"
                        style={{ minHeight: "150px" }}
                      >
                        {list.length > 0 ? (
                          list.map((item, i) => (
                            <button
                              key={i}
                              onClick={() => toggle(sectionKey, i)}
                              className={`flex items-center justify-between text-left w-full px-3 py-2 rounded-md border border-emerald-800/20 ${
                                state[i]
                                  ? "bg-emerald-600/40 text-emerald-50"
                                  : "bg-transparent hover:bg-emerald-700/10 text-emerald-200"
                              } transition-all duration-200`}
                            >
                              <span>{item}</span>
                              {state[i] && (
                                <span className="text-emerald-400 text-lg font-bold">
                                  ✔
                                </span>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-400 italic text-sm text-center mt-4">
                            No exercises
                          </p>
                        )}
                      </div>
                    </div>
                    {/* 🪄 Fade + stability wrapper ends here */}
                  </div>
                );
              })}
            </div>

            {/* Buttons — stay fixed height too */}
            <div className="flex flex-wrap gap-3 mt-6 items-center transition-all duration-200">
              <button
                onClick={toggleMarkAll}
                className="px-4 py-2 rounded border border-emerald-700 text-emerald-100 hover:bg-emerald-700/10 transition-all duration-200"
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
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                  } transition-all duration-200`}
                >
                  ✅ Mark Workout Done ({fmtDisp(date)})
                </button>
              ) : (
                <button
                  onClick={deleteCaloriesAndUnmark}
                  className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-200"
                >
                  ❌ Unmark & Clear
                </button>
              )}

              {checks.done && (
                <button
                  onClick={editCalories}
                  className="px-3 py-2 border rounded hover:bg-white/5 transition-all duration-200"
                >
                  ✏ Edit
                </button>
              )}
            </div>
          </>
        ) : (
          /* 🧘 Sunday Mode – Hide Workouts & Buttons */
          <div className="flex flex-col items-center justify-center text-center mt-8">
            <h2 className="text-2xl font-semibold text-emerald-300 mb-3">
              🌤 Sunday Recharge Mode
            </h2>

            {/* live quote text */}
            <p className="text-emerald-100 italic text-lg mb-4 fade-in">
              {sundayQuote}
            </p>

            {/* new quote button */}
            <button
              onClick={async () => {
                const newQuote = await fetchSundayQuote();
                setSundayQuote(newQuote); // ✅ triggers instant re-render
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow"
            >
              🔄 New Quote
            </button>
          </div>
        )}
      </section>

      {/* Calendar + Daily Summary */}
      <section
        className="grid md:grid-cols-2 gap-4 mb-2
        "
      >
        <MiniCalendar date={date} setDate={(d) => setDate(d)} />
        <DailySummary date={date} logs={logs} dateKey={dateKey} />
      </section>

      {/* Modal */}
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
              <label className="text-sm block text-gray-300">
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
                className="px-3 py-2 border rounded hover:bg-white/5 text-emerald-100"
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

function ExerciseList({ label, list = [], state = [], onToggle }) {
  return (
    <div className="min-h-[120px]">
      <h3 className="font-semibold mb-2 text-emerald-200">{label}</h3>
      <ul className="space-y-2">
        {list.map((t, i) => (
          <li
            key={i}
            onClick={() => onToggle(i)}
            className={`flex items-center gap-3 p-2 border rounded-xl bg-[#061414]/40 hover:shadow-md hover:shadow-emerald-500/10 transition cursor-pointer select-none ${
              state[i]
                ? "border-emerald-500 bg-emerald-800/20"
                : "border-gray-700"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                state[i]
                  ? "bg-emerald-500 text-white"
                  : "border border-gray-600 text-gray-300"
              }`}
            >
              {state[i] ? "✓" : ""}
            </div>
            <span className="text-emerald-100 text-sm">{t}</span>
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
    <div
      className="border rounded-2xl p-4 h-full
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAFA]
      bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000]
      backdrop-blur-md"
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
        <div>
          📊 BMI: {entry?.bmi != null ? entry.bmi : (latestBmi?.bmi ?? "—")}
        </div>
        <div className="mt-2">
          <h4 className="font-medium mb-1 text-emerald-200">Exercises</h4>
          {entry ? (
            <ul className="list-disc list-inside text-sm text-emerald-100">
              {(() => {
                const planStore = load("wd_gym_plan", {}) || {};
                const wd = entry?.weekday || dayjs(date).format("dddd");
                const todayPlan = planStore[wd] || {};
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

function MiniCalendar({ date, setDate }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  useEffect(() => setViewMonth(dayjs(date)), [date]);

  const start = viewMonth.startOf("month").startOf("week");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  const doneMap = load("wd_done", {});
  const today = dayjs();

  return (
    <section
      className="border rounded-2xl p-4
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAFA]
      bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000]
      backdrop-blur-md"
    >
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
        <div
          className="
  w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F1E1E] text-emerald-100 p-4 shadow-2xl
  [&_input]:bg-[#0F1E1E] [&_textarea]:bg-[#0F1E1E] [&_select]:bg-[#0F1E1E]
  [&_input]:text-emerald-100 [&_textarea]:text-emerald-100 [&_select]:text-emerald-100
  [&_input]:border-white/10 [&_textarea]:border-white/10 [&_select]:border-white/10
  [&_input]:border [&_textarea]:border [&_select]:border
"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
