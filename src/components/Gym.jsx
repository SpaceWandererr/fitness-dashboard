import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";

/* ---------------------- Write Queue (Paste Here!) ---------------------- */
let writeQueue = null;
let writeTimer = null;

function pushUpdate(data) {
  writeQueue = { ...writeQueue, ...data };

  clearTimeout(writeTimer);
  writeTimer = setTimeout(flushUpdate, 3000);
}

async function flushUpdate() {
  if (!writeQueue) return;

  try {
    await fetch("https://fitness-backend-laoe.onrender.com/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(writeQueue),
    });
  } catch (err) {
    console.error("BATCH SAVE FAILED", err);
  }

  writeQueue = null;
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
          LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)],
        ),
    },
  ];
  for (const src of sources) {
    try {
      const txt = await src.fn();
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ ts: Date.now(), text: txt }),
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
      JSON.stringify({ ts: Date.now(), text: localPick }),
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

/* -------------------- MERGED DAILY SUMMARY ------------------- */
function DailySummaryMerged({ date, logs, mode }) {
  const dateKey = fmtISO(date);
  const entry = logs[dateKey];

  const wd = entry?.weekday || dayjs(date).format("dddd");
  const plan = DEFAULT_PLAN[wd] || {};

  const planExercises = [
    ...(plan.left || []),
    ...(plan.right || []),
    ...(plan.finisher || []),
  ];

  const performed = [
    ...(entry?.left || []),
    ...(entry?.right || []),
    ...(entry?.finisher || []),
  ];

  /* ---------- NEW CARD METRICS ---------- */

  const parseSets = (ex) => {
    const m = ex.match(/(\d+)×(\d+)/);
    return m ? Number(m[1]) : 0;
  };

  const totalSets = planExercises.reduce((a, b) => a + parseSets(b), 0);
  const doneSets = performed.reduce(
    (a, b, i) => a + (b?.done ? parseSets(planExercises[i]) : 0),
    0,
  );

  const MUSCLES = {
    Chest: ["Press", "Fly", "Pullover"],
    Back: ["Row", "Pull", "Lat", "Dead"],
    Biceps: ["Curl"],
    Triceps: ["Tricep", "Push-down"],
    Legs: ["Squat", "Leg", "Lunges", "Calf"],
    Shoulders: ["Overhead", "Lateral", "Shrug", "Front Raise"],
    Core: ["Crunch", "Plank", "Russian", "Abs"],
  };

  const musclesWorked = [];
  for (const ex of planExercises) {
    for (const m in MUSCLES) {
      if (MUSCLES[m].some((k) => ex.includes(k))) {
        if (!musclesWorked.includes(m)) musclesWorked.push(m);
      }
    }
  }

  const duration = entry?.duration || "Not logged";
  const mood = entry?.mood || "🙂";

  const pctDone =
    planExercises.length > 0
      ? performed.filter((e) => e?.done).length / planExercises.length
      : 0;

  let perfScore =
    pctDone * 50 +
    (entry?.calories || 0) / 20 +
    (doneSets / (totalSets || 1)) * 30;

  perfScore = Math.min(100, Math.round(perfScore));

  /* put near top of DailySummaryMerged: */
  const CAL_GOAL = 500;
  const caloriesLogged =
    entry?.calories != null ? Number(entry.calories) : null;
  const caloriesDiff =
    caloriesLogged != null ? caloriesLogged - CAL_GOAL : null;

  const yesterdayKey = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
  const yesterdayWeight = logs[yesterdayKey]?.weight ?? null;
  const weightTrend =
    entry?.weight != null && yesterdayWeight != null
      ? entry.weight - yesterdayWeight
      : null;

  const message =
    pctDone === 1
      ? "🔥 Perfect workout!"
      : pctDone > 0.5
        ? "Great job! Keep pushing! 💪"
        : "You showed up. That's what matters. 🚀";

  /* ---------- SHARED GLASS CARD ---------- */
  const cardClass =
    "rounded-2xl p-4 h-full text-[#E8FFFA] flex flex-col justify-between";

  return (
    <div className={`${cardClass} `}>
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-500/20">
          <h3 className="font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent text-xl">
            {mode === "old" ? "Daily Summary" : "Enhanced Summary"}
          </h3>
          <span
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              entry?.done
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 border border-gray-600/40"
            }`}
          >
            {entry?.done ? "✅ Done" : "⭕ Not Done"}
          </span>
        </div>

        {/* -------- OLD CARD -------- */}
        {mode === "old" && (
          <div className="space-y-2">
            {/* DATE & MUSCLES */}
            <div className="mb-1 bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                  📅 {fmtDisp(date)}
                </div>
              </div>

              {/* Muscles Tags */}
              <div className="px-3 py-2 flex justify-between items-center">
                <div className="text-[13px] uppercase tracking-wider text-emerald-200/80 font-semibold border-r border-emerald-400/40 pr-3 mr-3">
                  MUSCLES
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {musclesWorked?.length > 0 ? (
                    musclesWorked.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-200 font-medium"
                      >
                        {muscle}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* CALORIES */}
              <div
                className="bg-gradient-to-br from-[#B82132]/20 via-[#8B1A28]/15 to-[#5A1119]/20 
    dark:from-[#B82132]/30 dark:via-[#8B1A28]/20 dark:to-[#5A1119]/30 
    p-3 rounded-xl border border-orange-500/30 dark:border-orange-400/20
    hover:border-orange-400/50 transition-all"
              >
                <div className="text-[9px] uppercase tracking-wider text-orange-300/70 dark:text-orange-200/60 font-semibold mb-1 flex items-center gap-1">
                  <span>🔥</span>
                  <span>Calories</span>
                </div>
                <div className="text-xl font-bold text-orange-100 dark:text-orange-200 flex items-baseline gap-1">
                  {entry?.calories ?? "—"}
                  {entry?.calories && (
                    <span className="text-[10px] text-orange-300/60 dark:text-orange-300/50 font-normal">
                      kcal
                    </span>
                  )}
                </div>
              </div>

              {/* WEIGHT */}
              <div
                className="bg-gradient-to-br from-[#183D3D]/40 via-[#0F2A2A]/30 to-[#0A1F1F]/40 
    dark:from-[#183D3D]/50 dark:via-[#0F2A2A]/40 dark:to-[#0A1F1F]/50 
    p-3 rounded-xl border border-cyan-500/30 dark:border-cyan-400/20
    hover:border-cyan-400/50 transition-all"
              >
                <div className="text-[9px] uppercase tracking-wider text-cyan-300/70 dark:text-cyan-200/60 font-semibold mb-1 flex items-center gap-1">
                  <span>⚖️</span>
                  <span>Weight</span>
                </div>
                <div className="text-xl font-bold text-cyan-100 dark:text-cyan-200 flex items-baseline gap-1">
                  {entry?.weight ?? "—"}
                  {entry?.weight && (
                    <span className="text-[10px] text-cyan-300/60 dark:text-cyan-300/50 font-normal">
                      kg
                    </span>
                  )}
                </div>
              </div>

              {/* BMI */}
              <div
                className="bg-gradient-to-br from-[#0F0F0F]/60 via-[#1A1A1A]/50 to-[#0A0A0A]/60 
    dark:from-[#0F1622]/60 dark:via-[#1A2033]/50 dark:to-[#0A0F1C]/60 
    p-3 rounded-xl border border-purple-500/30 dark:border-purple-400/20
    hover:border-purple-400/50 transition-all"
              >
                <div className="text-[9px] uppercase tracking-wider text-purple-300/70 dark:text-purple-200/60 font-semibold mb-1 flex items-center gap-1">
                  <span>📊</span>
                  <span>BMI</span>
                </div>
                <div className="text-xl font-bold text-purple-100 dark:text-purple-200">
                  {entry?.bmi ?? "—"}
                </div>
              </div>
            </div>

            {/* Exercises Card */}
            <div className="bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header */}
              <div className="px-3 py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-[9px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                  EXERCISES COMPLETED
                </div>
              </div>

              {/* Content */}
              <div className="px-3 py-2">
                {performed.some((p) => p?.done) ? (
                  <div className="space-y-1.5">
                    {planExercises.map((ex, i) =>
                      performed[i]?.done ? (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs text-emerald-200"
                        >
                          <span className="text-emerald-400">✓</span>
                          <span>{ex}</span>
                        </div>
                      ) : null,
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic py-1">
                    No exercises logged for this day
                  </div>
                )}
              </div>
            </div>

            {/* Shows next scheduled workout */}
            <div className="mt-4 pt-4 border-t border-emerald-500/20">
              <div className="text-[10px] text-emerald-200/70 uppercase tracking-wide font-semibold mb-2">
                Next Workout
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-emerald-200">
                      Tomorrow
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Chest + Triceps
                    </div>
                  </div>
                  <div className="text-2xl">💪</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------- NEW MODERN CARD -------- */}
        {mode === "new" && (
          <div className="space-y-2">
            {/* DATE & MUSCLES */}
            <div className="mb-1 bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                  📅 {fmtDisp(date)}
                </div>
              </div>

              {/* Muscles Tags */}
              <div className="px-3 py-2 flex justify-between items-center">
                <div className="text-[13px] uppercase tracking-wider text-emerald-200/80 font-semibold border-r border-emerald-400/40 pr-3 mr-3">
                  MUSCLES
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {musclesWorked?.length > 0 ? (
                    musclesWorked.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs text-emerald-200 font-medium"
                      >
                        {muscle}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs italic">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* KEY METRICS - 2x2 Grid - ALL EMERALD/TEAL */}
            <div className="grid grid-cols-2 gap-2">
              {/* SETS */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-emerald-400/30">
                <div className="text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold">
                  Sets
                </div>
                <div className="text-lg font-bold text-emerald-100">
                  {doneSets}
                  <span className="text-sm text-emerald-300/60">
                    /{totalSets}
                  </span>
                </div>
              </div>

              {/* DURATION */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-teal-400/30">
                <div className="text-[9px] uppercase tracking-wider text-teal-200/70 font-semibold">
                  Duration
                </div>
                <div className="text-lg font-bold text-teal-100">
                  {entry?.duration
                    ? `${entry.duration.hours}h ${entry.duration.minutes}m`
                    : "—"}
                </div>
              </div>

              {/* SCORE */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-cyan-400/30">
                <div className="text-[9px] uppercase tracking-wider text-cyan-200/70 font-semibold">
                  Score
                </div>
                <div className="text-lg font-bold text-cyan-100">
                  {perfScore}
                  <span className="text-sm text-cyan-300/60">/100</span>
                </div>
              </div>

              {/* MOOD */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-emerald-400/30">
                <div className="text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold">
                  Mood
                </div>
                <div className="text-lg font-bold text-emerald-100">
                  {entry?.mood ?? "—"}
                </div>
              </div>
            </div>

            {/* CALORIE STATS */}
            <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-orange-400/30">
              <div className="text-[9px] uppercase tracking-wider text-orange-200/80 font-semibold mb-1.5 flex items-center gap-1">
                🔥 Calories
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* TARGET */}
                <div className="text-center">
                  <div className="text-[9px] text-orange-200/70 mb-0.5">
                    Target
                  </div>
                  <div className="text-base font-bold text-orange-100">500</div>
                </div>

                {/* BURNED */}
                <div className="text-center">
                  <div className="text-[9px] text-emerald-200/70 mb-0.5">
                    Burned
                  </div>
                  <div className="text-base font-bold text-emerald-100">
                    {entry?.calories ?? "—"}
                  </div>
                </div>

                {/* DIFF */}
                <div className="text-center">
                  <div className="text-[9px] text-gray-300/70 mb-0.5">Diff</div>
                  {(() => {
                    const burned = entry?.calories ?? null;
                    if (burned == null)
                      return (
                        <div className="text-base font-bold text-gray-400">
                          —
                        </div>
                      );
                    const diff = burned - 500;
                    return (
                      <div
                        className={`text-base font-bold ${
                          diff >= 0 ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {diff >= 0 ? `+${diff}` : diff}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Progress Bar */}
              {entry?.calories != null && (
                <div className="h-1.5 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (entry.calories / 500) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* WEIGHT TREND */}
            <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-emerald-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold">
                    Weight Trend
                  </div>
                  <div className="text-lg font-bold text-emerald-100">
                    {weightTrend != null
                      ? weightTrend > 0
                        ? `↗️ +${weightTrend}kg`
                        : weightTrend < 0
                          ? `↘️ ${weightTrend}kg`
                          : "→ 0kg"
                      : "—"}
                  </div>
                </div>
                {weightTrend != null && (
                  <div
                    className={`text-2xl ${
                      weightTrend > 0
                        ? "text-red-300"
                        : weightTrend < 0
                          ? "text-emerald-300"
                          : "text-gray-300"
                    }`}
                  >
                    {weightTrend > 0 ? "📈" : weightTrend < 0 ? "📉" : "➡️"}
                  </div>
                )}
              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 rounded-xl border border-emerald-400/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💪</span>
                  <p className="text-emerald-100 italic text-xs leading-snug flex-1">
                    {message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- DAILY SUMMARY CAROUSEL ------------------- */
function DailySummaryCarousel({ date, logs }) {
  const modes = ["old", "new"];
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  /* ---------- Auto Swipe ---------- */
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % modes.length);
    }, 300000);
    return () => clearInterval(t);
  }, []);

  /* ---------- Swipe Logic ---------- */
  const startX = useRef(0);
  const handleStart = (e) => (startX.current = e.touches[0].clientX);
  const handleEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(diff) > 60) {
      setIndex((i) =>
        diff < 0
          ? (i + 1) % modes.length
          : (i - 1 + modes.length) % modes.length,
      );
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* LEFT BUTTON */}
      <button
        onClick={() => setIndex((i) => (i - 1 + modes.length) % modes.length)}
        className="absolute left-0 rounded-r top-1/2 -translate-y-1/2 z-20
    bg-gradient-to-r from-transparent to-[#0F766E]/60 
    border-r border-emerald-400/40 
    px-2 py-1.5 text-emerald-300 
    hover:to-emerald-500/80 hover:text-emerald-200
    transition-all duration-200 hover:px-3
    text-sm font-medium"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => setIndex((i) => (i + 1) % modes.length)}
        className="absolute right-0 rounded-l top-1/2 -translate-y-1/2 z-20
    bg-gradient-to-l from-transparent to-[#0F766E]/60 
    border-l border-emerald-400/40 
    px-2 py-1.5 text-emerald-300 
    hover:to-emerald-500/80 hover:text-emerald-200
    transition-all duration-200 hover:px-3
    text-sm font-medium"
      >
        ›
      </button>

      {/* Carousel Slides */}
      <div
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]"
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {modes.map((mode, idx) => (
            <div key={idx} className="w-full flex-shrink-0">
              <DailySummaryMerged mode={mode} date={date} logs={logs} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-2">
          {modes.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                index === i ? "bg-emerald-400" : "bg-emerald-400/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Modern Glass Modal -------------------- */
function Modal({ children, onClose, onEnter }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && onEnter) onEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onEnter]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div
        className="relative w-full max-w-lg rounded-2xl p-6
        bg-white/10 backdrop-blur-2xl 
        border border-emerald-400/30 
        shadow-xl shadow-black/50
        text-[#E8FFFA]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------- Main Component ---------------------- */

const HEIGHT_CM = 176; // used to compute BMI

/* -------------------- Exported Gym component STARTS below -------------------- */
export default function Gym() {
  const today = dayjs();
  const todayIso = today.format("YYYY-MM-DD");
  const todayName = today.format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  // Date + weekday
  const [date, setDate] = useState(todayIso);
  const [weekday, setWeekday] = useState(defaultDay);
  const userChangedWeekday = useRef(false);

  // Primary app state
  const [logs, setLogs] = useState({});
  const [doneState, setDoneState] = useState({});
  const [currWeight, setCurrWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [sundayQuote, setSundayQuote] = useState(
    "Fetching your motivational quote...",
  );

  // Modal inputs + editing states
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const weightInputRef = useRef(null);

  // Duration stored as numeric hours + minutes
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);

  // mood and edit arrays for exercises
  const [moodInput, setMoodInput] = useState("🙂");
  const [editLeft, setEditLeft] = useState([]);
  const [editRight, setEditRight] = useState([]);
  const [editFinisher, setEditFinisher] = useState([]);

  // fetch initial state from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://fitness-backend-laoe.onrender.com/api/state",
        );
        if (res.ok) {
          const data = await res.json();
          setLogs(data.wd_gym_logs || {});
          setDoneState(data.wd_done || {});
          setCurrWeight(
            data.wd_goals?.currentWeight != null
              ? data.wd_goals.currentWeight
              : "",
          );
          setTargetWeight(
            data.wd_goals?.targetWeight != null
              ? data.wd_goals.targetWeight
              : "",
          );
        } else {
          console.error("Failed to fetch state:", res.status);
        }
      } catch (err) {
        console.error("Error fetching state:", err);
      }
    })();
  }, []);

  // sync date -> weekday
  useEffect(() => {
    const wd = dayjs(date).format("dddd");
    setWeekday(wd);
  }, [date]);

  // sync weekday -> date when user changes weekday select
  useEffect(() => {
    if (!userChangedWeekday.current) return;
    const currentDate = dayjs();
    const startOfWeek = currentDate.startOf("week").add(1, "day"); // Monday as start
    const newDate = startOfWeek
      .add(WEEK.indexOf(weekday), "day")
      .format("YYYY-MM-DD");
    setDate(newDate);
    userChangedWeekday.current = false;
  }, [weekday]);

  // sunday quote
  useEffect(() => {
    if (weekday === "Sunday") {
      fetchSundayQuote()
        .then(setSundayQuote)
        .catch((e) => {
          console.warn("Sunday quote fetch failed", e);
        });
    }
  }, [weekday]);

  /* -------------------- Helper: normalizer / getEntry -------------------- */
  const getEntry = (dateKey) => {
    const plan = DEFAULT_PLAN[weekday] || { left: [], right: [], finisher: [] };
    const existing = logs[dateKey] || {};

    const normalize = (planList = [], savedList = []) => {
      return planList.map((name, i) => {
        const saved = savedList?.[i];

        // already object {name, done}
        if (saved && typeof saved === "object") return saved;

        // boolean true/false old format
        if (typeof saved === "boolean") return { name, done: saved };

        // nothing saved => default object
        return { name, done: false };
      });
    };

    return {
      weekday: existing.weekday || weekday,
      left: normalize(plan.left, existing.left),
      right: normalize(plan.right, existing.right),
      finisher: normalize(plan.finisher, existing.finisher),
      calories: existing.calories,
      weight: existing.weight,
      bmi: existing.bmi,
      done: existing.done || false,
      duration: existing.duration || null,
      mood: existing.mood || null,
    };
  };

  /* -------------------- Toggle single exercise (click in UI) -------------------- */
  const toggle = (section, idx, dateKey) => {
    // don't toggle if already marked done (finalized)
    if (doneState[dateKey]) return;

    const entry = logs[dateKey] || getEntry(dateKey);
    const updated = {
      ...entry,
      [section]: entry[section].map((item, i) =>
        i === idx ? { ...item, done: !item.done } : item,
      ),
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updated }));
  };

  /* -------------------- Toggle mark all / unmark all -------------------- */
  const toggleMarkAll = (dateKey) => {
    const entry = logs[dateKey] || getEntry(dateKey);

    const allDone =
      entry.left.every((e) => e?.done) &&
      entry.right.every((e) => e?.done) &&
      entry.finisher.every((e) => e?.done);

    const val = !allDone;

    const updated = {
      ...entry,
      left: entry.left.map((e) => ({ ...e, done: val })),
      right: entry.right.map((e) => ({ ...e, done: val })),
      finisher: entry.finisher.map((e) => ({ ...e, done: val })),
    };

    setLogs((prev) => ({ ...prev, [dateKey]: updated }));
  };

  /* -------------------- Modal open (preload modal inputs) -------------------- */
  const openModal = () => {
    if (dayjs(date).isAfter(dayjs(), "day")) {
      alert("🚫 Can't complete future workouts");
      return;
    }
    const dateKey = fmtISO(date);
    const entry = logs[dateKey] || getEntry(dateKey);

    // load inputs (strings for inputs)
    setCaloriesInput(entry.calories != null ? String(entry.calories) : "");
    setWeightInput(entry.weight != null ? String(entry.weight) : "");
    setDurationHours(entry?.duration?.hours ?? 0);
    setDurationMinutes(entry?.duration?.minutes ?? 0);
    setMoodInput(entry?.mood ?? "🙂");

    // load edit arrays (cloned so editing in modal doesn't mutate UI until save)
    setEditLeft((entry.left || []).map((it) => ({ ...it })));
    setEditRight((entry.right || []).map((it) => ({ ...it })));
    setEditFinisher((entry.finisher || []).map((it) => ({ ...it })));

    setShowModal(true);
  };

  /* -------------------- Save workout (from modal) -------------------- */
  const saveWorkout = () => {
    const dateKey = fmtISO(date);
    const existing = logs[dateKey] || getEntry(dateKey);

    const caloriesVal = Number(caloriesInput) || 0;
    const parsedWeight = weightInput === "" ? null : Number(weightInput);
    const weightVal = Number.isFinite(parsedWeight)
      ? parsedWeight
      : (existing.weight ?? null);

    const newBmi = weightVal
      ? Number((weightVal / Math.pow(HEIGHT_CM / 100, 2)).toFixed(1))
      : (existing.bmi ?? null);

    const updatedEntry = {
      weekday: existing.weekday || weekday,
      left: editLeft.length ? editLeft : existing.left,
      right: editRight.length ? editRight : existing.right,
      finisher: editFinisher.length ? editFinisher : existing.finisher,
      calories: caloriesVal,
      weight: weightVal,
      bmi: newBmi,
      done: true,
      duration: {
        hours: Number(durationHours) || 0,
        minutes: Number(durationMinutes) || 0,
      },
      mood: moodInput,
    };

    // update UI
    setLogs((prev) => ({ ...prev, [dateKey]: updatedEntry }));
    setDoneState((prev) => ({ ...prev, [dateKey]: true }));
    setShowModal(false);

    // queue/batch update to backend
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
        targetWeight,
        currentWeight: currWeight,
      },
    };

    pushUpdate(outgoing);
  };

  /* -------------------- Edit existing workout (open modal with values) -------------------- */
  const editWorkout = () => {
    const dateKey = fmtISO(date);
    const entry = logs[dateKey];

    if (entry) {
      setEditLeft((entry.left || []).map((it) => ({ ...it })));
      setEditRight((entry.right || []).map((it) => ({ ...it })));
      setEditFinisher((entry.finisher || []).map((it) => ({ ...it })));

      setCaloriesInput(entry.calories ?? "");
      setWeightInput(entry.weight ?? "");
      setDurationHours(entry?.duration?.hours ?? 0);
      setDurationMinutes(entry?.duration?.minutes ?? 0);
      setMoodInput(entry?.mood ?? "🙂");
    }

    openModal();
  };

  /* -------------------- Delete / Unmark (clear) a date entry -------------------- */
  const deleteWorkout = (dateKey) => {
    // optimistic UI update
    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });

    setDoneState((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });

    // backend payload
    const updatedLogs = { ...logs };
    delete updatedLogs[dateKey];

    const updatedDone = { ...doneState };
    delete updatedDone[dateKey];

    pushUpdate({
      wd_gym_logs: updatedLogs,
      wd_done: updatedDone,
      wd_goals: {
        targetWeight,
        currentWeight: currWeight,
      },
    });

    window.dispatchEvent(new Event("lifeos:update"));
  };

  /* -------------------- Save target / current weight (batched) -------------------- */
  const saveTargetWeight = () => {
    const raw = targetWeight;
    if (!raw || isNaN(raw)) {
      alert("Enter a valid target weight!");
      return;
    }

    const newWeight = Number(raw);
    setTargetWeight(newWeight);

    pushUpdate({
      wd_goals: {
        targetWeight: newWeight,
        currentWeight: currWeight,
      },
      wd_gym_logs: logs,
      wd_done: doneState,
    });

    console.log("Target weight saved:", newWeight);
  };

  const updateCurrentWeight = () => {
    const raw = currWeight;
    if (raw === "" || isNaN(raw)) {
      alert("Enter a valid weight!");
      return;
    }

    const newWeight = Number(raw);
    setCurrWeight(newWeight);

    pushUpdate({
      wd_goals: {
        targetWeight,
        currentWeight: newWeight,
      },
      wd_gym_logs: logs,
      wd_done: doneState,
    });

    console.log("Current weight updated:", newWeight);
  };

  /* -------------------- Reset full progress -------------------- */
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

    setLogs({});
    setDoneState({});
    setCurrWeight("");
    setTargetWeight("");
    setSundayQuote("Fetching your motivational quote...");
    window.dispatchEvent(new Event("lifeos:update"));
    alert("FULL RESET DONE ✅");
  };

  /* --------------- Derived values (entry/dayPlan/completion) --------------- */
  const dateKey = fmtISO(date);
  const entry = logs[dateKey] || getEntry(dateKey);
  const dayPlan = DEFAULT_PLAN[weekday] || {
    title: `${weekday || "Unknown"} — No Plan`,
    left: [],
    right: [],
    finisher: [],
  };

  const totalExercises =
    (dayPlan.left?.length || 0) +
    (dayPlan.right?.length || 0) +
    (dayPlan.finisher?.length || 0);
  const completedExercises =
    (entry.left?.filter(Boolean).length || 0) +
    (entry.right?.filter(Boolean).length || 0) +
    (entry.finisher?.filter(Boolean).length || 0);
  let canComplete = totalExercises > 0 && completedExercises > 0;
  if (!canComplete && !dayjs(date).isSame(dayjs(), "day")) {
    canComplete = true;
  }

  // compute progress to target
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

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500
     bg-gradient-to-br from-[#183D3D] via-[#5a2d2d] to-[#0F766E]
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
      [#0A0F1C]
      border-gray-800 text-emerald-100 font-medium"
    >
      {/* Header */}
      <header
        className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/30 
        bg-gradient-to-br from-[#0F766E]/20 via-[#183D3D]/30 to-[#0F0F0F]/20 
        backdrop-blur-xl p-5 shadow-xl shadow-black/40"
      >
        {/* Gradient Accent Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 -z-10" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Title Section */}
          <div className="space-y-1 flex-shrink-0">
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
              💪 Gym Tracker
            </h1>
            <p className="text-xs text-emerald-200/70 font-medium tracking-wide">
              Track progress • Build habits • Stay consistent
            </p>
          </div>

          {/* Controls Section - Single Row Layout */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto lg:flex-shrink-0">
            {/* Weekday Select - Compact */}
            <select
              value={weekday}
              onChange={(e) => {
                userChangedWeekday.current = true;
                setWeekday(e.target.value);
              }}
              className="px-2.5 py-2.5 w-[110px] rounded-xl border border-emerald-700/50 
                bg-[#07201f]/90 backdrop-blur-sm text-emerald-100 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                hover:bg-[#07201f] hover:border-emerald-600/60
                transition-all duration-200 cursor-pointer
                shadow-lg shadow-black/20"
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

            {/* Date Input - Compact */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2.5 py-2.5 w-[145px] rounded-xl border border-emerald-700/50 
                bg-[#07201f]/90 backdrop-blur-sm text-emerald-100 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                hover:bg-[#07201f] hover:border-emerald-600/60
                transition-all duration-200 cursor-pointer
                shadow-lg shadow-black/20
                [color-scheme:dark]"
            />

            {/* Reset Button - Compact */}
            <button
              onClick={resetProgress}
              className="flex-1 lg:flex-initial group relative overflow-hidden
                bg-gradient-to-r from-red-600 via-red-500 to-red-600 
                hover:from-red-500 hover:via-red-400 hover:to-red-500
                text-white px-4 py-2.5 rounded-xl text-sm font-bold
                shadow-lg shadow-red-900/40 hover:shadow-red-800/60
                transition-all duration-300 hover:scale-[1.02]
                border border-red-400/20 whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <span>🔄</span>
                <span>Reset Progress</span>
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Progress / Weight Section */}
      <section
        className="mb-4 border border-emerald-500/30 rounded-3xl p-5 space-y-4 
  bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
  dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
  shadow-xl shadow-black/40 backdrop-blur-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Target Weight */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1 flex-shrink-0">
              🎯 <span className="hidden sm:inline">Target</span>
            </span>
            <input
              type="number"
              step="0.1"
              placeholder="75"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveTargetWeight();
                  e.target.blur();
                }
              }}
              disabled={targetWeight && !isEditingTarget}
              className={`flex-1 min-w-0 px-2 py-1 rounded-lg border text-sm font-semibold text-center
                focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
                placeholder:text-emerald-300/30 transition-all
                ${
                  targetWeight && !isEditingTarget
                    ? "border-emerald-500/50 bg-emerald-900/20 text-emerald-200 cursor-not-allowed opacity-70"
                    : "border-emerald-500/30 bg-black/30 text-emerald-100"
                }`}
            />
            <button
              onClick={() => {
                if (targetWeight && !isEditingTarget) {
                  setIsEditingTarget(true);
                } else {
                  saveTargetWeight();
                  setIsEditingTarget(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex-shrink-0
                transition-all duration-200 hover:scale-105 shadow-sm
                ${
                  targetWeight && !isEditingTarget
                    ? "bg-orange-600/80 hover:bg-orange-500"
                    : "bg-cyan-600/80 hover:bg-cyan-500"
                }`}
            >
              {targetWeight && !isEditingTarget ? "Edit" : "Set"}
            </button>
            <span className="text-xs text-emerald-300/70 flex-shrink-0">
              kg
            </span>
          </div>

          {/* Current Weight */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1 flex-shrink-0">
              ⚖️ <span className="hidden sm:inline">Curr Weight</span>
            </span>
            <input
              type="number"
              step="0.1"
              placeholder="85"
              value={currWeight}
              onChange={(e) => setCurrWeight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateCurrentWeight();
                  e.target.blur();
                }
              }}
              disabled={currWeight && !isEditingCurrent}
              className={`flex-1 min-w-0 px-2 py-1 rounded-lg border text-sm font-semibold text-center
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
                placeholder:text-cyan-300/30 transition-all
                ${
                  currWeight && !isEditingCurrent
                    ? "border-cyan-500/50 bg-cyan-900/20 text-cyan-200 cursor-not-allowed opacity-70"
                    : "border-cyan-500/30 bg-black/30 text-cyan-100"
                }`}
            />
            <button
              onClick={() => {
                if (currWeight && !isEditingCurrent) {
                  setIsEditingCurrent(true);
                } else {
                  updateCurrentWeight();
                  setIsEditingCurrent(false);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex-shrink-0
                transition-all duration-200 hover:scale-105 shadow-sm
                ${
                  currWeight && !isEditingCurrent
                    ? "bg-orange-600/80 hover:bg-orange-500"
                    : "bg-emerald-600/80 hover:bg-emerald-500"
                }`}
            >
              {currWeight && !isEditingCurrent ? "Edit" : "Set"}
            </button>
            <span className="text-xs text-cyan-300/70 flex-shrink-0">kg</span>
          </div>

          {/* Display Current/Today's weight with trend */}
          <div className="flex flex-col gap-1.5 bg-gradient-to-br from-teal-600/10 via-teal-700/5 to-teal-800/10 rounded-xl px-3 py-2.5 border border-teal-500/30 hover:border-teal-400/50 transition-all shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-teal-400/70 font-semibold">Now</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-teal-300 font-black text-xl leading-none">
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
              {/* Trend indicator */}
              {(() => {
                const yesterdayKey = dayjs(dateKey).subtract(1, "day").format("YYYY-MM-DD");
                const todayWeight = entry?.weight;
                const yesterdayWeight = logs[yesterdayKey]?.weight;

                if (todayWeight && yesterdayWeight) {
                  const diff = todayWeight - yesterdayWeight;
                  if (diff > 0) {
                    return <span className="text-red-400 text-xs font-bold">↑{diff.toFixed(1)}</span>;
                  } else if (diff < 0) {
                    return <span className="text-emerald-400 text-xs font-bold">↓{Math.abs(diff).toFixed(1)}</span>;
                  }
                }
                return null;
              })()}
            </div>
            {/* Last logged date if not today */}
            {!entry?.weight && (() => {
              const pastKeys = Object.keys(logs)
                .filter((k) => logs[k]?.weight != null && k < dateKey)
                .sort()
                .reverse();

              if (pastKeys.length > 0) {
                const lastDate = dayjs(pastKeys[0]).format("MMM D");
                return <span className="text-teal-500/60 text-[9px]">Last: {lastDate}</span>;
              }
              return null;
            })()}
          </div>

          {/* Progress text */}
          <div className={`flex flex-col items-center justify-center rounded-xl px-3 py-2.5 border transition-all shadow-sm
            ${pctToGoal < 0 
              ? "bg-gradient-to-br from-red-600/10 via-red-700/5 to-red-800/10 border-red-500/30 hover:border-red-400/50" 
              : "bg-gradient-to-br from-emerald-600/10 via-emerald-700/5 to-emerald-800/10 border-emerald-500/30 hover:border-emerald-400/50"
            }`}>
            {pctToGoal < 0 ? (
              <>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">⚠️</span>
                  <span className="text-[10px] uppercase tracking-wider text-red-400/70 font-semibold">Regression</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-red-400 font-black text-xl leading-none">
                    {Math.abs(pctToGoal).toFixed(0)}%
                  </span>
                  <span className="text-red-300/80 text-xs font-semibold">
                    +{Math.abs(diffToGoal)} kg
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold">Progress</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-emerald-300 font-black text-xl leading-none">
                    {Math.min(100, pctToGoal).toFixed(0)}%
                  </span>
                  <span className="text-emerald-200/80 text-xs font-semibold">
                    {diffToGoal} kg left
                  </span>
                </div>
              </>
            )}
          </div>
        </div> 

        {/* Progress bar */}
        <div className="relative mt-2">
          <div className="h-4 rounded-full bg-black/40 overflow-hidden border border-white/10" />
          <div
            className="absolute top-0 h-4 rounded-full transition-all duration-700 shadow-lg"
            style={{
              left: pctToGoal < 0 ? "0" : "auto",
              right: pctToGoal >= 0 ? "0" : "auto",
              width: `${Math.min(100, Math.abs(pctToGoal))}%`,
              background:
                pctToGoal < 0
                  ? "linear-gradient(90deg, rgba(239,68,68,1), rgba(252,165,165,1))"
                  : "linear-gradient(270deg, rgba(20,184,166,1), rgba(16,185,129,1))",
            }}
          />
          <div
            className="absolute -top-5 transition-all duration-700 z-20"
            style={{
              [pctToGoal < 0 ? "left" : "right"]: `calc(${Math.min(
                100,
                Math.abs(pctToGoal),
              )}% - 16px)`,
            }}
          >
            <span
              className={`text-3xl drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] transition-transform ${
                pctToGoal < 0 ? "scale-x-[-1]" : ""
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
        <DailySummaryCarousel date={date} logs={logs} />
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
                          (item) => typeof item === "boolean",
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
                            (item) => typeof item === "boolean",
                          )
                            ? entry.finisher.filter(Boolean).length
                            : entry.finisher.filter((e) => e?.done).length)) /
                          (dayPlan.left.length +
                            dayPlan.right.length +
                            dayPlan.finisher.length)) *
                          100,
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
                          (item) => typeof item === "boolean",
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

      {/* ------------- MODAL BLOCK WITH EXERCISE EDITOR ------------- */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onEnter={saveWorkout}>
          <h2 className="text-xl font-bold text-emerald-200 mb-4">
            Log Today's Workout
          </h2>

          {/* CALORIES */}
          <label className="block text-sm text-emerald-100">
            Calories Burned
          </label>
          <input
            type="number"
            value={caloriesInput}
            onChange={(e) => setCaloriesInput(e.target.value)}
            className="w-full bg-black/20 border border-emerald-500/30 rounded-xl p-2 mt-1 mb-3 
                       text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-400/40"
            placeholder="e.g. 500"
          />

          {/* WEIGHT */}
          <label className="block text-sm text-emerald-100">Weight (kg)</label>
          <input
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="w-full bg-black/20 border border-emerald-500/30 rounded-xl p-2 mt-1 mb-3
                       text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-400/40"
            placeholder="e.g. 79.5"
          />

          {/* -------------------- DURATION -------------------- */}
          <label className="block text-sm text-emerald-100 mb-1">
            Duration
          </label>

          <div className="flex gap-4 mb-4">
            {/* Hours */}
            <div className="flex-1">
              <label className="block text-xs text-emerald-200">Hours</label>
              <input
                type="number"
                min="0"
                max="5"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-black/20 border border-emerald-500/30 rounded-xl p-2 mt-1
                           text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-400/40"
                placeholder="0"
              />
            </div>

            {/* Minutes */}
            <div className="flex-1">
              <label className="block text-xs text-emerald-200">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-black/20 border border-emerald-500/30 rounded-xl p-2 mt-1
                           text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-400/40"
                placeholder="0"
              />
            </div>
          </div>

          {/* -------------------- MOOD SELECTOR -------------------- */}
          <label className="block text-sm text-emerald-100 mb-2">Mood</label>

          <div className="flex gap-3 mb-6">
            {["😄", "🙂", "😐", "😣", "😴"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMoodInput(m)}
                className={`
                  text-2xl p-2 rounded-xl transition
                  bg-white/10 backdrop-blur-xl border border-emerald-500/20
                  shadow-inner shadow-black/20
                  hover:scale-110 active:scale-95
                  ${moodInput === m ? "ring-2 ring-emerald-400" : "opacity-70"}
                `}
              >
                {m}
              </button>
            ))}
          </div>

          {/* -------------------- EXERCISE EDITOR (OPTION B — TOGGLE CHIPS) -------------------- */}
          <h3 className="text-lg font-semibold text-emerald-200 mb-2">
            Edit Exercises
          </h3>

          {/* LEFT */}
          <div className="mb-4">
            <div className="text-sm text-emerald-300 mb-1 font-medium">
              Left
            </div>
            <div className="flex flex-wrap gap-2">
              {editLeft.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const temp = [...editLeft];
                    temp[i].done = !temp[i].done;
                    setEditLeft(temp);
                  }}
                  className={`
                    px-3 py-1 rounded-xl text-sm font-medium transition-all
                    border backdrop-blur-xl
                    ${
                      ex.done
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                        : "bg-white/10 border-white/20 text-gray-300"
                    }
                  `}
                >
                  {ex.name} {ex.done ? "✔" : "✘"}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="mb-4">
            <div className="text-sm text-emerald-300 mb-1 font-medium">
              Right
            </div>
            <div className="flex flex-wrap gap-2">
              {editRight.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const temp = [...editRight];
                    temp[i].done = !temp[i].done;
                    setEditRight(temp);
                  }}
                  className={`
                    px-3 py-1 rounded-xl text-sm font-medium transition-all
                    border backdrop-blur-xl
                    ${
                      ex.done
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                        : "bg-white/10 border-white/20 text-gray-300"
                    }
                  `}
                >
                  {ex.name} {ex.done ? "✔" : "✘"}
                </button>
              ))}
            </div>
          </div>

          {/* FINISHER */}
          <div className="mb-6">
            <div className="text-sm text-emerald-300 mb-1 font-medium">
              Finisher
            </div>
            <div className="flex flex-wrap gap-2">
              {editFinisher.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const temp = [...editFinisher];
                    temp[i].done = !temp[i].done;
                    setEditFinisher(temp);
                  }}
                  className={`
                    px-3 py-1 rounded-xl text-sm font-medium transition-all
                    border backdrop-blur-xl
                    ${
                      ex.done
                        ? "bg-cyan-500/30 border-cyan-300 text-cyan-100"
                        : "bg-white/10 border-white/20 text-gray-300"
                    }
                  `}
                >
                  {ex.name} {ex.done ? "✔" : "✘"}
                </button>
              ))}
            </div>
          </div>

          {/* -------------------- ACTION BUTTONS -------------------- */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-4 py-2 rounded-xl bg-red-500/30 border border-red-400/30 
                         text-red-200 hover:bg-red-500/40"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 rounded-xl bg-emerald-500/30 border border-emerald-400/30 
                         text-emerald-200 hover:bg-emerald-500/40"
              onClick={saveWorkout}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------- Subcomponents ---------------------- */
/* -------------------- Mini Calendar ------------------- */
function MiniCalendar({ date, setDate, doneState, logs }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  const today = dayjs();

  useEffect(() => {
    // Auto-update viewMonth to today when the actual day changes
    setViewMonth(dayjs());
  }, [dayjs().format("YYYY-MM-DD")]);

  const monthStart = viewMonth.startOf("month");
  const weekdayIndex = (monthStart.day() + 6) % 7; // Monday=0
  const start = monthStart.subtract(weekdayIndex, "day");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));

  return (
    <section
      className="border border-emerald-500/30 rounded-3xl px-5 py-2
    bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
    dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
    text-[#FAFAFA] shadow-xl shadow-black/40"
    >
      {/* Header - Dynamic Date Range with Month Navigation */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
            className="w-8 h-8 rounded-full flex items-center justify-center
        bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/30
        transition-all duration-200 hover:scale-110"
          >
            ‹
          </button>

          <div className="text-center">
            <div className="text-lg font-bold text-emerald-100">
              {viewMonth.subtract(17, "day").format("MMM D")} -{" "}
              {viewMonth.add(17, "day").format("MMM D, YYYY")}
            </div>

            <div className="flex justify-between items-center gap-2">
              {/* Selected Date Display */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-emerald-200">
                  {dayjs(date).format("dddd")}
                </div>
                <div className="text-[10px] text-emerald-300/60">
                  {dayjs(date).format("MMMM DD, YYYY")}
                </div>
              </div>

              {/* Quick Jump to Today Button */}
              <button
                onClick={() => {
                  setViewMonth(today);
                  setDate(today.format("YYYY-MM-DD"));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
      bg-cyan-500/10 hover:bg-cyan-500/20 
      border border-cyan-400/30 hover:border-cyan-400/50
      text-[10px] font-semibold text-cyan-300 hover:text-cyan-200
      uppercase tracking-wider transition-all duration-200
      hover:scale-105 shadow-sm"
              >
                <span>📍</span>
                <span>Today</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setViewMonth(viewMonth.add(1, "month"))}
            className="w-8 h-8 rounded-full flex items-center justify-center
        bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/30
        transition-all duration-200 hover:scale-110"
          >
            ›
          </button>
        </div>
      </div>
      {/* Weekday Headers - Dynamic based on today's position */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {(() => {
          // Calculate which day is 3 days before today (left edge)
          const startDay = today.subtract(3, "day");
          const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          const headers = [];

          for (let i = 0; i < 7; i++) {
            const d = startDay.add(i, "day");
            const dayIndex = (d.day() + 6) % 7; // Convert Sunday=0 to Monday=0
            const isToday = i === 3; // Middle column

            headers.push(
              <div
                key={i}
                className={`text-[10px] text-center font-semibold uppercase ${
                  isToday ? "text-yellow-300" : "text-emerald-300/60"
                }`}
              >
                {weekdays[dayIndex]}
              </div>,
            );
          }

          return headers;
        })()}
      </div>
      {/* 5 Rows × 7 Columns - Based on viewMonth */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {(() => {
          const cells = [];

          // IMPORTANT: Use viewMonth as the center date, not today
          const centerDate = viewMonth;

          // Start 17 days before viewMonth (3 left + 14 for 2 rows)
          const startDate = centerDate.subtract(17, "day");

          // Generate 5 rows × 7 days = 35 days
          for (let i = 0; i < 35; i++) {
            const d = startDate.add(i, "day");
            const key = d.format("YYYY-MM-DD");
            const isToday = d.isSame(today, "day"); // Highlight actual today
            const isSelected = key === date;

            const row = Math.floor(i / 7);
            const col = i % 7;
            const isCurrentWeek = row === 2; // Middle row

            // Opacity calculation
            let opacity = 1;
            if (!isCurrentWeek) {
              if (row < 2) {
                const baseOpacity = row === 0 ? 0.1 : 0.3;
                const fadeStep = 0.05;
                opacity = baseOpacity + col * fadeStep;
              } else {
                const baseOpacity = row === 3 ? 0.6 : 0.4;
                const fadeStep = -0.05;
                opacity = baseOpacity + col * fadeStep;
              }
            }

            const entry = logs?.[key];
            const doneByState = doneState?.[key] === true;

            let doneByExercises = false;
            if (entry) {
              const checkArray = (arr) => {
                if (!Array.isArray(arr)) return false;
                if (arr.every((item) => typeof item === "boolean")) {
                  return arr.some(Boolean);
                }
                return arr.some((e) => e?.done === true);
              };

              doneByExercises =
                checkArray(entry.left) ||
                checkArray(entry.right) ||
                checkArray(entry.finisher);
            }

            const isDone = doneByState || doneByExercises;
            const hasCalories = entry?.calories != null;
            const hasWeight = entry?.weight != null;

            cells.push(
              <div
                key={key}
                className="relative group flex flex-col items-center"
                style={{ opacity }}
              >
                <button
                  onClick={() => setDate(key)}
                  // title={d.format("DD-MM-YYYY")}
                  className={`
              w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-medium
              flex items-center justify-center border
              transition-all duration-200
              cursor-pointer hover:scale-105
              ${
                isDone
                  ? "bg-emerald-600 text-white border-emerald-400/50 shadow-md shadow-emerald-500/30"
                  : "bg-gray-700/80 text-gray-200 border-white/10 hover:bg-gray-600/80"
              }
              ${isSelected ? "ring-2 ring-cyan-400 scale-[1.08] shadow-lg" : ""}
              ${
                isToday
                  ? "border-cyan-400 ring-2 ring-cyan-400/60 font-bold scale-110 shadow-lg shadow-cyan-400/30"
                  : ""
              }
            `}
                >
                  {d.date()}
                </button>

                {hasCalories && isCurrentWeek && (
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}

                <div className="pointer-events-none absolute top-11 z-30 rounded-lg bg-black/90 px-2.5 py-1.5 text-[10px] text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-emerald-500/20 shadow-xl">
                  {d.format("MMM D")} • {isDone ? "✅ Done" : "No workout"}
                  {hasCalories && ` • ${entry.calories} kcal`}
                  {hasWeight && ` • ${entry.weight} kg`}
                </div>
              </div>,
            );
          }

          return cells;
        })()}
      </div>
      {/* Current Week Highlight */}
      <div className="pt-3 border-t border-cyan-500/30 bg-cyan-500/5 -mx-5 px-5 py-3 rounded-b-3xl">
        <div className="text-[10px] text-cyan-300 uppercase tracking-wide font-semibold mb-2 text-center">
          📍 Current Week (Row 3)
        </div>
        <div className="flex justify-between gap-1.5">
          {(() => {
            const startOfWeek = today.startOf("week").add(1, "day");
            return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, i) => {
              const currentDay = startOfWeek.add(i, "day");
              const dayKey = currentDay.format("YYYY-MM-DD");
              const dayDone = doneState?.[dayKey] === true;
              const isCurrentDay = currentDay.isSame(today, "day");

              return (
                <div key={day} className="flex-1 text-center">
                  <div
                    className={`text-[9px] mb-1 ${
                      isCurrentDay
                        ? "text-yellow-300 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {day}
                  </div>
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      dayDone
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : isCurrentDay
                          ? "bg-yellow-500/60"
                          : "bg-gray-700"
                    }`}
                  />
                </div>
              );
            });
          })()}
        </div>
      </div>
      {/* Monthly Stats */}
      <div className="mt-6 pt-4 border-t border-emerald-500/20">
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* This Month */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[9px] text-emerald-200/60 uppercase tracking-wide font-semibold mb-0.5">
              This Month
            </div>
            <div className="text-xl font-bold text-emerald-300">
              {
                Object.keys(doneState || {}).filter((k) =>
                  k.startsWith(today.format("YYYY-MM")),
                ).length
              }
              <span className="text-sm text-emerald-300/60">
                /{today.daysInMonth()}
              </span>
            </div>
            <div className="text-[9px] text-emerald-300/60">workouts</div>
          </div>

          {/* Streak */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[9px] text-cyan-200/60 uppercase tracking-wide font-semibold mb-0.5">
              Streak
            </div>
            <div className="text-xl font-bold text-cyan-300">
              {(() => {
                let streak = 0;
                let currentDate = dayjs(today);
                while (doneState?.[currentDate.format("YYYY-MM-DD")]) {
                  streak++;
                  currentDate = currentDate.subtract(1, "day");
                }
                return streak;
              })()}
            </div>
            <div className="text-[9px] text-cyan-300/60">days</div>
          </div>

          {/* Monthly Goal */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[9px] text-teal-200/60 uppercase tracking-wide font-semibold mb-0.5">
              Monthly Goal
            </div>
            <div className="text-xl font-bold text-teal-300">
              {(() => {
                const totalDays = today.daysInMonth();
                const done = Object.keys(doneState || {}).filter((k) =>
                  k.startsWith(today.format("YYYY-MM")),
                ).length;
                return Math.round((done / totalDays) * 100);
              })()}
              %
            </div>
            <div className="text-[9px] text-teal-300/60">completed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
