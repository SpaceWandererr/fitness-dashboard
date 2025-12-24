import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

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
const fmtDisp = (d) => dayjs(d).format("DD-MM-YYYY");

// Sunday Quote Fetcher
async function fetchSundayQuote(opts = { cooldownSeconds: 60 }) {
  const LOCAL_FALLBACK = [
    "Discipline is doing what needs to be done even when you don't feel like doing it. — Unknown",
    "Your body can stand almost anything. It's your mind that you have to convince. — Unknown",
    "Push yourself because no one else is going to do it for you. — Unknown",
    "Rest is not idleness. Sometimes, rest is the most productive thing you can do. — Unknown",
    "Small consistent steps every day lead to massive results over time. — Unknown",
  ];

  const cacheKey = "wd_sunday_quote_cache";
  const now = Date.now();
  const cooldownMs = (opts.cooldownSeconds || 60) * 1000;
  const hasLocalStorage =
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  // ---------- Read cache (ONLY real quotes) ----------
  let cache = null;
  if (hasLocalStorage) {
    try {
      cache = JSON.parse(localStorage.getItem(cacheKey));
    } catch {}
  }

  if (cache?.ts && now - cache.ts < cooldownMs && cache?.source === "api") {
    return cache.text;
  }

  // ---------- Browser-safe API (DummyJSON) ----------
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("dummyjson failed");

    const data = await res.json();
    const txt = `“${data.quote}” — ${data.author || "Unknown"}`;

    // ✅ Cache ONLY real API result
    if (hasLocalStorage) {
      try {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            ts: Date.now(),
            text: txt,
            source: "api",
          })
        );
      } catch {}
    }

    return txt;
  } catch {
    // silent fail → fallback below
  }

  // ---------- Fallback (NOT cached) ----------
  if (cache?.text && cache?.source === "api") {
    return cache.text;
  }

  return LOCAL_FALLBACK[Math.floor(Math.random() * LOCAL_FALLBACK.length)];
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
  const dateKey = dayjs(date).format("YYYY-MM-DD");

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
    0
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

  const getNextWorkoutInfo = (date) => {
    const today = dayjs(date);
    const tomorrow = today.add(1, "day");
    const wd = tomorrow.format("dddd");
    const plan = DEFAULT_PLAN[wd];

    if (!plan) {
      return { label: "Tomorrow", title: "No plan", wd };
    }

    return {
      label: tomorrow.isSame(dayjs().add(1, "day"), "day") ? "Tomorrow" : wd,
      title: plan.title || "No plan",
      wd,
    };
  };

  const nextInfo = getNextWorkoutInfo(date);

  /* ---------- SHARED GLASS CARD ---------- */
  const cardClass =
    "rounded-xl p-1 sm:rounded-2xl sm:p-x-4  h-full text-[#E8FFFA] flex flex-col justify-even";

  return (
    <div className={`${cardClass}`}>
      <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-4 ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 pb-2 border-b border-emerald-500/20 gap-2 ">
          {/* Title */}
          <h3 className="font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent text-sm sm:text-base md:text-lg">
            {mode === "old" ? "Daily Summary" : "Enhanced Summary"}
          </h3>

          {/* Next workout - now visible on mobile */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2.5 py-1.5 sm:py-1 border border-emerald-400/20 flex-1 sm:flex-none sm:w-48 justify-between">
              <div className="flex flex-col leading-tight min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-200 truncate">
                  {nextInfo.label}
                </span>
                <span className="text-[9px] text-emerald-100/80 truncate">
                  {nextInfo.title}
                </span>
              </div>
              <span className="text-base sm:text-lg flex-shrink-0">💪</span>
            </div>

            {/* Done / Not done badge */}
            <span
              className={`text-[10px] px-2.5 py-1.5 sm:px-3 rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                entry?.done
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 border border-gray-600/40"
              }`}
            >
              {entry?.done ? "✅ Done" : "⭕ Not Done"}
            </span>
          </div>
        </div>

        {/* -------- OLD CARD -------- */}
        {mode === "old" && (
          <div className="space-y-2 sm:space-y-3">
            {/* DATE & MUSCLES */}
            <div className="mb-1 bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                  📅 {fmtDisp(date)}
                </div>
              </div>

              {/* Muscles Tags */}
              <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 flex flex-col gap-2">
                <div className="text-[11px] sm:text-[13px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                  MUSCLES
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {musclesWorked?.length > 0 ? (
                    musclesWorked.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] sm:text-xs text-emerald-200 font-medium"
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
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {/* CALORIES */}
              <div className="bg-gradient-to-br from-[#B82132]/20 via-[#8B1A28]/15 to-[#5A1119]/20 dark:from-[#B82132]/30 dark:via-[#8B1A28]/20 dark:to-[#5A1119]/30 p-2 sm:p-3 rounded-xl border border-orange-500/30 dark:border-orange-400/20 hover:border-orange-400/50 transition-all">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-orange-300/70 dark:text-orange-200/60 font-semibold mb-0.5 sm:mb-1 flex items-center gap-0.5 sm:gap-1">
                  <span>🔥</span>
                  <span className="hidden xs:inline">Calories</span>
                  <span className="xs:hidden">Cal</span>
                </div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-orange-100 dark:text-orange-200 flex flex-wrap items-baseline gap-0.5">
                  <span className="break-all">{entry?.calories ?? "—"}</span>
                  {entry?.calories && (
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-orange-300/60 dark:text-orange-300/50 font-normal whitespace-nowrap">
                      kcal
                    </span>
                  )}
                </div>
              </div>

              {/* WEIGHT */}
              <div className="bg-gradient-to-br from-[#183D3D]/40 via-[#0F2A2A]/30 to-[#0A1F1F]/40 dark:from-[#183D3D]/50 dark:via-[#0F2A2A]/40 dark:to-[#0A1F1F]/50 p-2 sm:p-3 rounded-xl border border-cyan-500/30 dark:border-cyan-400/20 hover:border-cyan-400/50 transition-all">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-cyan-300/70 dark:text-cyan-200/60 font-semibold mb-0.5 sm:mb-1 flex items-center gap-0.5 sm:gap-1">
                  <span>⚖️</span>
                  <span>Weight</span>
                </div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-cyan-100 dark:text-cyan-200 flex flex-wrap items-baseline gap-0.5">
                  <span>{entry?.weight ?? "—"}</span>
                  {entry?.weight && (
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] text-cyan-300/60 dark:text-cyan-300/50 font-normal whitespace-nowrap">
                      kg
                    </span>
                  )}
                </div>
              </div>

              {/* BMI */}
              <div className="bg-gradient-to-br from-[#0F0F0F]/60 via-[#1A1A1A]/50 to-[#0A0A0A]/60 dark:from-[#0F1622]/60 dark:via-[#1A2033]/50 dark:to-[#0A0F1C]/60 p-2 sm:p-3 rounded-xl border border-purple-500/30 dark:border-purple-400/20 hover:border-purple-400/50 transition-all">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-purple-300/70 dark:text-purple-200/60 font-semibold mb-0.5 sm:mb-1 flex items-center gap-0.5 sm:gap-1">
                  <span>📊</span>
                  <span>BMI</span>
                </div>
                <div className="text-sm sm:text-base md:text-xl font-bold text-purple-100 dark:text-purple-200">
                  {entry?.bmi ?? "—"}
                </div>
              </div>
            </div>

            {/* Exercises Card */}
            <div className="bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header */}
              <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                  EXERCISES COMPLETED
                </div>
              </div>

              {/* Content */}
              <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
                {performed.some((p) => p?.done) ? (
                  <div className="space-y-1.5">
                    {planExercises.map((ex, i) =>
                      performed[i]?.done ? (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-[11px] sm:text-xs text-emerald-200"
                        >
                          <span className="text-emerald-400 flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="break-words">{ex}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic py-1">
                    No exercises logged for this day
                  </div>
                )}
              </div>
            </div>

            {/* Extra Exercises */}
            <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 px-2.5 py-2 sm:px-4 sm:py-3 rounded-xl border border-emerald-400/30 mt-2">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                  Extra Activity
                </span>
                {entry?.running?.distanceKm ||
                entry?.yogaMinutes ||
                entry?.otherExercises ? (
                  <span className="text-[10px] text-emerald-200/70">
                    Logged
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400/70 italic">
                    None
                  </span>
                )}
              </div>

              {(entry?.running?.distanceKm ||
                entry?.running?.durationMinutes ||
                entry?.yogaMinutes != null ||
                entry?.otherExercises) && (
                <div className="space-y-2">
                  {/* Mobile: Stacked layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2 text-[11px] sm:text-xs">
                    {/* Run */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-emerald-200/80 font-semibold mb-0.5">
                        Run
                      </div>
                      <div className="text-emerald-100">
                        {entry?.running?.distanceKm != null && (
                          <span className="whitespace-nowrap">
                            {entry.running.distanceKm} km
                          </span>
                        )}
                        {entry?.running?.durationMinutes != null && (
                          <span className="whitespace-nowrap">
                            {entry.running.distanceKm != null ? " · " : ""}
                            {entry.running.durationMinutes} min
                          </span>
                        )}
                        {!entry?.running?.distanceKm &&
                          !entry?.running?.durationMinutes &&
                          "-"}
                      </div>
                    </div>

                    {/* Yoga */}
                    <div>
                      <div className="text-teal-200/80 font-semibold mb-0.5">
                        Yoga
                      </div>
                      <div className="text-teal-100">
                        {entry?.yogaMinutes != null
                          ? `${entry.yogaMinutes} min`
                          : "-"}
                      </div>
                    </div>

                    {/* Felt */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-emerald-200/80 font-semibold mb-0.5">
                        Felt
                      </div>
                      <div className="text-emerald-100/90 line-clamp-2 break-words">
                        {entry?.running?.notes || entry?.mood ? (
                          <>
                            <span className="mr-1">{entry?.mood || "🙂"}</span>
                            <span>
                              {entry?.running?.notes &&
                              !["😄", "🙂", "😐", "😣", "😴"].includes(
                                entry.running.notes
                              )
                                ? entry.running.notes
                                : "Felt good overall"}
                            </span>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>

                    {/* Other */}
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-emerald-200/80 font-semibold mb-0.5">
                        Other
                      </div>
                      <div className="text-emerald-100/90 line-clamp-2 break-words">
                        {entry?.otherExercises || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------- NEW MODERN CARD -------- */}
        {mode === "new" && (
          <div className="space-y-2 sm:space-y-3">
            {/* DATE & MUSCLES */}
            <div className="mb-1 bg-gradient-to-br from-[#0F766E]/60 via-[#0c4a42]/40 to-[#0a3832]/60 dark:from-[#0F1622]/80 dark:via-[#132033]/60 dark:to-[#0A0F1C]/80 rounded-xl border border-emerald-400/30 overflow-hidden">
              {/* Header Row */}
              <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 bg-black/20 border-b border-emerald-400/20">
                <div className="text-[11px] sm:text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                  📅 {fmtDisp(date)}
                </div>
              </div>

              {/* Muscles Tags */}
              <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 flex flex-col gap-2">
                <div className="text-[11px] sm:text-[13px] uppercase tracking-wider text-emerald-200/80 font-semibold">
                  MUSCLES
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {musclesWorked?.length > 0 ? (
                    musclesWorked.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] sm:text-xs text-emerald-200 font-medium"
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

            {/* KEY METRICS - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* SETS */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2 sm:p-2.5 rounded-xl border border-emerald-400/30">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold mb-0.5">
                  Sets
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-100 break-all">
                  {doneSets}
                  <span className="text-xs sm:text-sm text-emerald-300/60">
                    /{totalSets}
                  </span>
                </div>
              </div>

              {/* DURATION */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2 sm:p-2.5 rounded-xl border border-teal-400/30">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-teal-200/70 font-semibold mb-0.5">
                  Duration
                </div>
                <div className="text-base sm:text-lg font-bold text-teal-100">
                  {entry?.duration
                    ? `${entry.duration.hours}h ${entry.duration.minutes}m`
                    : "—"}
                </div>
              </div>

              {/* SCORE */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2 sm:p-2.5 rounded-xl border border-cyan-400/30">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-cyan-200/70 font-semibold mb-0.5">
                  Score
                </div>
                <div className="text-base sm:text-lg font-bold text-cyan-100">
                  {perfScore}
                  <span className="text-xs sm:text-sm text-cyan-300/60">
                    /100
                  </span>
                </div>
              </div>

              {/* MOOD */}
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2 sm:p-2.5 rounded-xl border border-emerald-400/30">
                <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-emerald-200/70 font-semibold mb-0.5">
                  Mood
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-100">
                  {entry?.mood ?? "—"}
                </div>
              </div>
            </div>

            {/* CALORIE STATS */}
            <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 sm:p-3 rounded-xl border border-orange-400/30">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-orange-200/80 font-semibold mb-1.5 flex items-center gap-1">
                🔥 Calories
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* TARGET */}
                <div className="text-center">
                  <div className="text-[9px] text-orange-200/70 mb-0.5">
                    Target
                  </div>
                  <div className="text-sm sm:text-base font-bold text-orange-100">
                    500
                  </div>
                </div>

                {/* BURNED */}
                <div className="text-center">
                  <div className="text-[9px] text-emerald-200/70 mb-0.5">
                    Burned
                  </div>
                  <div className="text-sm sm:text-base font-bold text-emerald-100">
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
                        <div className="text-sm sm:text-base font-bold text-gray-400">
                          —
                        </div>
                      );
                    const diff = burned - 500;
                    return (
                      <div
                        className={`text-sm sm:text-base font-bold ${
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
            <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 sm:p-3 rounded-xl border border-emerald-400/30">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-200/70 font-semibold">
                    Weight Trend
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-100 truncate">
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
                    className={`text-xl sm:text-2xl flex-shrink-0 ml-2 ${
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
              <div className="bg-gradient-to-br from-[#0F766E]/50 via-[#0c4a42]/30 to-[#0a3832]/50 dark:from-[#0F1622]/70 dark:via-[#132033]/50 dark:to-[#0A0F1C]/70 p-2.5 sm:p-3 rounded-xl border border-emerald-400/30">
                <div className="flex items-start gap-2">
                  <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">
                    💪
                  </span>
                  <p className="text-emerald-100 italic text-[11px] sm:text-xs leading-snug flex-1 break-words">
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
          : (i - 1 + modes.length) % modes.length
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
export default function Gym({ dashboardState, updateDashboard }) {
  const today = dayjs();
  const todayIso = today.format("YYYY-MM-DD");
  const todayName = today.format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";

  // Date + weekday
  const [date, setDate] = useState(dayjs());
  const [weekday, setWeekday] = useState(defaultDay);
  const userChangedWeekday = useRef(false);

  // Primary app state
  const [logs, setLogs] = useState({});
  const [doneState, setDoneState] = useState({});
  const [currWeight, setCurrWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [sundayQuote, setSundayQuote] = useState(
    "Fetching your motivational quote..."
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

  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [showExerciseEditor, setShowExerciseEditor] = useState(false);

  const [runningDistance, setRunningDistance] = useState("");
  const [runningDuration, setRunningDuration] = useState("");
  const [runningNotes, setRunningNotes] = useState("");
  const [yogaMinutesInput, setYogaMinutesInput] = useState("");
  const [otherExercisesInput, setOtherExercisesInput] = useState("");

  useEffect(() => {
    if (!dashboardState) return;

    // ✅ SMART MERGE — Load backend data ONCE on mount, then prefer local changes
    setLogs((prev) => {
      const incoming = dashboardState.wd_gym_logs || {};

      // First load: take everything from backend
      if (!hasLoadedInitialData) {
        return incoming;
      }

      // Subsequent loads: prefer incoming (backend) over local to sync updates
      const merged = {};
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(incoming)]);

      allKeys.forEach((dateKey) => {
        // ✅ Prefer backend data if it exists, otherwise keep local
        merged[dateKey] = incoming[dateKey] || prev[dateKey];
      });

      return merged;
    });

    setDoneState((prev) => ({
      ...prev,
      ...(dashboardState.wd_done || {}),
    }));

    setCurrWeight(
      dashboardState.wd_goals?.currentWeight != null
        ? String(dashboardState.wd_goals.currentWeight)
        : ""
    );

    setTargetWeight(
      dashboardState.wd_goals?.targetWeight != null
        ? String(dashboardState.wd_goals.targetWeight)
        : ""
    );

    // Mark as loaded after first run
    if (!hasLoadedInitialData) {
      setHasLoadedInitialData(true);
    }
  }, [dashboardState, hasLoadedInitialData]);

  useEffect(() => {
    setLogs((prev) => {
      const cleaned = {};
      for (const [k, v] of Object.entries(prev || {})) {
        if (v && typeof v === "object") {
          cleaned[k] = v;
        }
      }
      return cleaned;
    });
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
    const newDate = startOfWeek.add(WEEK.indexOf(weekday), "day");

    setDate(newDate);
    userChangedWeekday.current = false;
  }, [weekday]);

  // sunday quote
  useEffect(() => {
    if (weekday === "Sunday") {
      fetchSundayQuote({ cooldownSeconds: 60 })
        .then((text) => {
          console.log("📝 Quote received:", text); // Debug log
          setSundayQuote(text);
        })
        .catch((e) => {
          console.warn("Sunday quote fetch failed", e);
          setSundayQuote(
            "Recovery is just as important as training. Rest, recharge, and come back stronger."
          );
        });
    }
  }, [weekday]);

  /* -------------------- Helper: normalizer / getEntry -------------------- */
  const getEntry = useCallback(
    (dateKey) => {
      const entryWeekday = dayjs(dateKey).format("dddd");
      const plan = DEFAULT_PLAN[entryWeekday];
      const existing = logs[dateKey];

      const normalize = (planList, savedList) => {
        return planList.map((name, i) => {
          const saved = savedList?.[i];

          if (saved && typeof saved === "object") return saved;
          if (typeof saved === "boolean") return { name, done: saved };
          return { name, done: false };
        });
      };

      return {
        weekday: existing?.weekday ?? entryWeekday,
        left: normalize(plan.left, existing?.left),
        right: normalize(plan.right, existing?.right),
        finisher: normalize(plan.finisher, existing?.finisher),

        calories: existing?.calories ?? null,
        weight: existing?.weight ?? null,
        bmi: existing?.bmi ?? null,
        done: existing?.done ?? false,
        duration: existing?.duration ?? null,
        mood: existing?.mood ?? null,

        // NEW FIELDS
        running: existing?.running ?? {
          distanceKm: null,
          durationMinutes: null,
          notes: "",
        },
        otherExercises: existing?.otherExercises ?? "", // free‑text
        yogaMinutes: existing?.yogaMinutes ?? null,
      };
    },
    [logs]
  );

  /* -------------------- Toggle single exercise (click in UI) -------------------- */
  const toggle = (section, index, dateKey) => {
    setLogs((prev) => {
      const base = prev[dateKey] || getEntry(dateKey);

      const left = Array.isArray(base.left) ? [...base.left] : [];
      const right = Array.isArray(base.right) ? [...base.right] : [];
      const finisher = Array.isArray(base.finisher) ? [...base.finisher] : [];

      const map = { left, right, finisher };
      const arr = map[section];

      if (!arr || !arr[index]) return prev;

      arr[index] = { ...arr[index], done: !arr[index].done };

      const updated = {
        ...base,
        left,
        right,
        finisher,
        done: base.done, // 🔑 FIX
      };

      return {
        ...prev,
        [dateKey]: updated,
      };
    });
  };

  /* -------------------- Toggle mark all / unmark all (DRAFT ONLY) -------------------- */
  const toggleMarkAll = (dateKey) => {
    // Always start from a safe entry
    const base = logs?.[dateKey] || getEntry(dateKey);

    // Normalize arrays (VERY IMPORTANT)
    const left = Array.isArray(base.left) ? base.left : [];
    const right = Array.isArray(base.right) ? base.right : [];
    const finisher = Array.isArray(base.finisher) ? base.finisher : [];

    // ✅ Simple boolean check - NO useMemo here!
    const allCurrentlyDone =
      left.length > 0 &&
      countDone(left) === left.length &&
      countDone(right) === right.length &&
      countDone(finisher) === finisher.length;

    const val = !allCurrentlyDone;

    const updatedEntry = {
      ...base,
      left: left.map((e) => ({ ...e, done: val })),
      right: right.map((e) => ({ ...e, done: val })),
      finisher: finisher.map((e) => ({ ...e, done: val })),
      done: false, // 🔒 NEVER finalize here
    };

    // UI-only draft update
    setLogs((prev) => ({
      ...prev,
      [dateKey]: updatedEntry,
    }));
  };

  /* -------------------- Modal open (preload modal inputs) -------------------- */
  const openModal = () => {
    if (dayjs(date).isAfter(dayjs(), "day")) {
      alert("🚫 Can't complete future workouts");
      return;
    }
    const dateKey = dayjs(date).format("YYYY-MM-DD");
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

    setRunningDistance(
      entry?.running?.distanceKm != null ? String(entry.running.distanceKm) : ""
    );
    setRunningDuration(
      entry?.running?.durationMinutes != null
        ? String(entry.running.durationMinutes)
        : ""
    );
    setRunningNotes(entry?.running?.notes ?? "");
    setYogaMinutesInput(
      entry?.yogaMinutes != null ? String(entry.yogaMinutes) : ""
    );
    setOtherExercisesInput(entry?.otherExercises ?? "");
    setShowModal(true);
  };

  /* -------------------- Save workout (from modal) -------------------- */
  const saveWorkout = useCallback(async () => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    const existing = logs[dateKey] ?? getEntry(dateKey);

    const caloriesVal = caloriesInput ? Number(caloriesInput) : null;
    const parsedWeight = weightInput ? Number(weightInput) : null;
    const weightVal = Number.isFinite(parsedWeight)
      ? parsedWeight
      : existing.weight ?? null;

    const newBmi =
      weightVal != null
        ? Number((weightVal / Math.pow(HEIGHT_CM / 100, 2)).toFixed(1))
        : existing.bmi ?? null;

    // NEW parsed values
    const runningDistanceVal = runningDistance ? Number(runningDistance) : null;
    const runningDurationVal = runningDuration ? Number(runningDuration) : null;
    const yogaMinutesVal = yogaMinutesInput ? Number(yogaMinutesInput) : null;

    const isDone =
      editLeft.some((e) => e.done) ||
      editRight.some((e) => e.done) ||
      editFinisher.some((e) => e.done) ||
      runningDistanceVal != null ||
      runningDurationVal != null ||
      yogaMinutesVal != null ||
      !!otherExercisesInput;

    const updatedEntry = {
      weekday: existing.weekday,
      left: editLeft.length ? editLeft : existing.left,
      right: editRight.length ? editRight : existing.right,
      finisher: editFinisher.length ? editFinisher : existing.finisher,
      calories: caloriesVal,
      weight: weightVal,
      bmi: newBmi,
      done: isDone,
      duration: {
        hours: Number(durationHours || 0),
        minutes: Number(durationMinutes || 0),
      },
      mood: moodInput || existing.mood || null,

      // NEW
      running: {
        distanceKm: runningDistanceVal,
        durationMinutes: runningDurationVal,
        notes: runningNotes || "",
      },
      yogaMinutes: yogaMinutesVal,
      otherExercises: otherExercisesInput || "",
    };

    const updatedLogs = {
      ...logs,
      [dateKey]: updatedEntry,
    };

    const updatedDone = {
      ...doneState,
      [dateKey]: isDone,
    };

    setLogs(updatedLogs);
    setDoneState(updatedDone);
    setShowModal(false);

    await updateDashboard({
      wd_gym_logs: updatedLogs,
      wd_done: updatedDone,
      wd_goals: {
        targetWeight,
        currentWeight: currWeight,
      },
    });
  }, [
    date,
    logs,
    doneState,
    caloriesInput,
    weightInput,
    editLeft,
    editRight,
    editFinisher,
    durationHours,
    durationMinutes,
    moodInput,
    runningDistance,
    runningDuration,
    runningNotes,
    yogaMinutesInput,
    otherExercisesInput,
    targetWeight,
    currWeight,
    updateDashboard,
    getEntry,
  ]);

  /* -------------------- Edit existing workout (open modal with values) -------------------- */
  const editWorkout = () => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");

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
  const deleteWorkout = async (dateKey) => {
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

    // ✅ SINGLE SOURCE OF TRUTH
    await updateDashboard({
      wd_gym_logs: updatedLogs,
      wd_done: updatedDone,
      wd_goals: {
        targetWeight,
        currentWeight: currWeight,
      },
    });
  };

  /* -------------------- Save target / current weight -------------------- */
  const saveTargetWeight = async () => {
    const raw = targetWeight;
    if (!raw || isNaN(raw)) {
      alert("Enter a valid target weight!");
      return;
    }

    const newWeight = Number(raw);
    setTargetWeight(newWeight);

    // ✅ SINGLE SOURCE OF TRUTH
    await updateDashboard({
      wd_goals: {
        targetWeight: newWeight,
        currentWeight: currWeight,
      },
      wd_gym_logs: logs,
      wd_done: doneState,
    });

    console.log("Target weight saved:", newWeight);
  };

  const updateCurrentWeight = async () => {
    const raw = currWeight;
    if (raw === "" || isNaN(raw)) {
      alert("Enter a valid weight!");
      return;
    }

    const newWeight = Number(raw);
    setCurrWeight(newWeight);

    // ✅ SINGLE SOURCE OF TRUTH
    await updateDashboard({
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

    // 🔑 SINGLE SOURCE OF TRUTH
    await updateDashboard(outgoing);

    // local UI reset (instant feedback)
    setLogs((prev) => ({}));
    setDoneState((prev) => ({}));
    setCurrWeight("");
    setTargetWeight("");
    setSundayQuote("Fetching your motivational quote...");

    alert("FULL RESET DONE ✅");
  };

  /* --------------- Derived values (entry/dayPlan/completion) --------------- */
  /* --------------- Derived values (MEMOIZED) --------------- */
  const dateKey = useMemo(() => dayjs(date).format("YYYY-MM-DD"), [date]);

  const entry = useMemo(
    () => logs[dateKey] || getEntry(dateKey),
    [logs, dateKey, getEntry]
  );

  const dayWeekday = useMemo(() => dayjs(date).format("dddd"), [date]);

  const dayPlan = useMemo(
    () =>
      DEFAULT_PLAN[dayWeekday] || {
        title: `${dayWeekday} — No Plan`,
        left: [],
        right: [],
        finisher: [],
      },
    [dayWeekday]
  );

  const totalExercises = useMemo(
    () =>
      (dayPlan.left?.length || 0) +
      (dayPlan.right?.length || 0) +
      (dayPlan.finisher?.length || 0),
    [dayPlan]
  );

  const completedExercises = useMemo(
    () =>
      (entry.left ?? []).filter((e) => e?.done).length +
      (entry.right ?? []).filter((e) => e?.done).length +
      (entry.finisher ?? []).filter((e) => e?.done).length,
    [entry]
  );

  const canComplete = useMemo(() => {
    if (totalExercises > 0 && completedExercises > 0) return true;
    if (!dayjs(date).isSame(dayjs(), "day")) return true;
    return false;
  }, [totalExercises, completedExercises, date]);

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
  // smarter fallback weight system
  let current;

  if (entry?.weight != null) {
    current = entry.weight;
  } else {
    const yesterdayKey = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");

    if (logs[yesterdayKey]?.weight != null) {
      current = logs[yesterdayKey].weight;
    } else {
      const history = Object.keys(logs)
        .filter((k) => logs[k]?.weight != null && k < dateKey)
        .sort()
        .reverse();

      if (history.length > 0) {
        current = logs[history[0]].weight; // last logged weight
      } else {
        current = baseline;
      }
    }
  }

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

  const countDone = (arr) => {
    if (!Array.isArray(arr)) return 0;

    return arr.filter((item) => (typeof item === "boolean" ? item : item?.done))
      .length;
  };

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
            {countDone(items)}
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
                  !logs?.[dateKey]?.done && toggle(section, i, dateKey)
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

  useEffect(() => {
    const t = dashboardState?.wd_goals?.targetWeight;
    const c = dashboardState?.wd_goals?.currentWeight;

    setTargetWeight(t != null ? String(t) : "");
    setCurrWeight(c != null ? String(c) : "");

    // 🔒 lock only once, after load
    setIsEditingTarget(t == null || t === "");
    setIsEditingCurrent(c == null || c === "");
  }, [dashboardState?.wd_goals]);

  // ✅ PUT IT HERE (DERIVED LOGIC SECTION)
  const allDone =
    Array.isArray(entry.left) &&
    entry.left.length > 0 &&
    countDone(entry.left) === entry.left.length &&
    countDone(entry.right) === entry.right.length &&
    countDone(entry.finisher) === entry.finisher.length;

  // 🔓 FIX: unlock ghost-locked days like yesterday
  useEffect(() => {
    const key = dayjs(date).format("YYYY-MM-DD");

    // If doneState says it's done but logs don't exist or have no exercises marked
    if (doneState?.[key]) {
      const logEntry = logs?.[key];

      // No log entry at all - clear ghost lock
      if (!logEntry) {
        console.log(`Clearing ghost lock for ${key} - no log entry`);
        setDoneState((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        return;
      }

      // Log exists but has no actual done exercises - also ghost lock
      const hasDoneExercises =
        (logEntry.left || []).some((e) => e?.done) ||
        (logEntry.right || []).some((e) => e?.done) ||
        (logEntry.finisher || []).some((e) => e?.done);

      if (!hasDoneExercises && !logEntry.done) {
        console.log(`Clearing ghost lock for ${key} - no completed exercises`);
        setDoneState((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }
    }
  }, [date, doneState, logs]);

  return (
    <div
      className="rounded-2xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500
     bg-gradient-to-br from-[#183D3D] via-[#5a2d2d] to-[#0F766E]
      dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
      [#0A0F1C] md:mt-7 lg:mt-0
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
          <div className="flex flex-col gap-1 flex-shrink-0 text-center sm:text-left">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight
  bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text 
  text-transparent drop-shadow-[0_0_12px_rgba(0,255,200,0.15)]
  animate-[fadeIn_0.6s_ease]"
            >
              💪 Gym Tracker
            </h1>

            <p className="text-xs sm:text-sm text-emerald-200/70 font-medium tracking-wide">
              Track progress • Build habits • Stay consistent
            </p>
          </div>

          {/* Controls Section - Single Row Layout */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
            {/* controls wrapper */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Week Select */}
              <select
                value={weekday}
                onChange={(e) => {
                  userChangedWeekday.current = true;
                  setWeekday(e.target.value);
                }}
                className="w-full sm:w-[110px] px-3 py-2.5 rounded-xl border border-emerald-700/50 
      bg-[#07201f]/90 text-emerald-100 text-sm font-medium shadow-lg shadow-black/20
      focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:border-emerald-600/60 
      transition-all duration-200"
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

              {/* Date Input */}
              <input
                type="date"
                value={dayjs(date).format("YYYY-MM-DD")}
                onChange={(e) => setDate(dayjs(e.target.value))}
                className="w-full sm:w-[145px] px-3 py-2.5 rounded-xl border border-emerald-700/50 
      bg-[#07201f]/90 text-emerald-100 text-sm font-medium shadow-lg shadow-black/20
      focus:outline-none focus:ring-2 focus:ring-emerald-400/60 hover:border-emerald-600/60 
      transition-all duration-200 [color-scheme:dark]"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={resetProgress}
              className="w-full sm:w-auto group relative overflow-hidden
    bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white px-4 py-2.5 
    rounded-xl text-sm font-bold border border-red-400/20 
    shadow-lg shadow-red-900/40 hover:scale-[1.02] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                🔄 Reset Progress
              </span>
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
      -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Progress / Weight Section */}
      <section
        className="mb-2 border border-emerald-500/30 rounded-3xl p-5 space-y-4 
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
                if (e.key === "Enter" && isEditingTarget) {
                  saveTargetWeight();
                  setIsEditingTarget(false);
                  e.target.blur();
                }
              }}
              disabled={!isEditingTarget}
              className={`flex-1 min-w-0 px-2 py-1 rounded-lg border text-sm font-semibold text-center
      focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
      placeholder:text-emerald-300/30 transition-all
      ${
        !isEditingTarget
          ? "border-emerald-500/50 bg-emerald-900/20 text-emerald-200 cursor-not-allowed opacity-70"
          : "border-emerald-500/30 bg-black/30 text-emerald-100"
      }`}
            />

            <button
              onClick={() => {
                if (!isEditingTarget) {
                  setIsEditingTarget(true); // ✏️ enable edit
                } else {
                  saveTargetWeight();
                  setIsEditingTarget(false); // 🔒 lock after save
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex-shrink-0
      transition-all duration-200 hover:scale-105 shadow-sm
      ${
        !isEditingTarget
          ? "bg-orange-600/80 hover:bg-orange-500"
          : "bg-cyan-600/80 hover:bg-cyan-500"
      }`}
            >
              {!isEditingTarget ? "Edit" : "Set"}
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
                if (e.key === "Enter" && isEditingCurrent) {
                  updateCurrentWeight();
                  setIsEditingCurrent(false); // 🔒 lock after save
                  e.target.blur();
                }
              }}
              disabled={!isEditingCurrent}
              className={`flex-1 min-w-0 px-2 py-1 rounded-lg border text-sm font-semibold text-center
      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
      placeholder:text-cyan-300/30 transition-all
      ${
        !isEditingCurrent
          ? "border-cyan-500/50 bg-cyan-900/20 text-cyan-200 cursor-not-allowed opacity-70"
          : "border-cyan-500/30 bg-black/30 text-cyan-100"
      }`}
            />

            <button
              onClick={() => {
                if (!isEditingCurrent) {
                  setIsEditingCurrent(true); // ✏️ enable edit
                } else {
                  updateCurrentWeight();
                  setIsEditingCurrent(false); // 🔒 lock after save
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex-shrink-0
      transition-all duration-200 hover:scale-105 shadow-sm
      ${
        !isEditingCurrent
          ? "bg-orange-600/80 hover:bg-orange-500"
          : "bg-emerald-600/80 hover:bg-emerald-500"
      }`}
            >
              {!isEditingCurrent ? "Edit" : "Set"}
            </button>

            <span className="text-xs text-cyan-300/70 flex-shrink-0">kg</span>
          </div>
          {/* Display Current/Today's weight with trend */}
          <div className="bg-gradient-to-br from-teal-600/10 via-teal-700/5 to-teal-800/10 rounded-xl px-3 py-2.5 border border-teal-500/30 shadow-sm">
            {/* Header Row */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-teal-400/70 font-semibold">
                Weight Tracking • {dayjs(date).format("MMM D")}
              </span>

              {/* Status right aligned */}
              {(() => {
                const hasWeight = entry?.weight != null;
                const isToday = useMemo(
                  () => dayjs(date).isSame(dayjs(), "day"),
                  [date]
                );
                const isFuture = useMemo(
                  () => dayjs(date).isAfter(dayjs(), "day"),
                  [date]
                );

                if (isFuture) {
                  return (
                    <span className="text-[10px] text-gray-400/70 italic">
                      Future
                    </span>
                  );
                }

                if (isToday && !hasWeight) {
                  return (
                    <span className="text-[10px] text-amber-400/80 font-medium">
                      ⚠️ Not Logged
                    </span>
                  );
                }

                if (!isToday && !hasWeight) {
                  return (
                    <span className="text-[10px] text-gray-400/70">
                      No Entry
                    </span>
                  );
                }

                if (hasWeight) {
                  return (
                    <span className="text-[10px] text-emerald-400/80 font-medium">
                      ✓ Logged
                    </span>
                  );
                }

                return null;
              })()}
            </div>

            {/* Weight + Trend + Last recorded (Right side) */}
            <div className="flex items-center justify-between">
              {/* Weight Value */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-teal-300 font-black text-2xl leading-none">
                  {(() => {
                    const hasWeight = entry?.weight != null;

                    // If current date has weight, show it
                    if (hasWeight) {
                      return entry.weight;
                    }

                    // Otherwise, find most recent weight before this date
                    const history = Object.keys(logs)
                      .filter((k) => logs[k]?.weight != null && k < dateKey)
                      .sort()
                      .reverse();

                    if (history.length > 0) {
                      return logs[history[0]].weight;
                    }

                    return "—";
                  })()}
                </span>
                {/* ALWAYS show kg when there's a weight value (current OR fallback) */}
                {(() => {
                  const hasWeight = entry?.weight != null;

                  if (hasWeight) return true;

                  // Check if fallback weight exists
                  const history = Object.keys(logs)
                    .filter((k) => logs[k]?.weight != null && k < dateKey)
                    .sort()
                    .reverse();

                  return history.length > 0;
                })() && (
                  <span className="text-[11px] text-teal-400/60 font-semibold">
                    kg
                  </span>
                )}
              </div>

              {/* Right side cluster: trend + last date - FIXED HEIGHT */}
              <div className="flex flex-col items-end justify-center gap-0.5 min-h-[34px]">
                {/* Trend arrow - RESERVED SPACE */}
                <div className="h-[14px] flex items-center justify-end">
                  {(() => {
                    const hasWeight = entry?.weight != null;
                    if (!hasWeight) return null;

                    // Find the most recent previous weight
                    const history = Object.keys(logs)
                      .filter((k) => logs[k]?.weight != null && k < dateKey)
                      .sort()
                      .reverse();

                    if (history.length === 0) return null;

                    const prevWeight = logs[history[0]].weight;
                    const diff = entry.weight - prevWeight;

                    if (Math.abs(diff) < 0.01) return null; // No change

                    return (
                      <span
                        className={`text-[11px] font-bold flex items-center gap-0.5 ${
                          diff > 0 ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {diff > 0 ? "↑" : "↓"}
                        {Math.abs(diff).toFixed(1)}kg
                      </span>
                    );
                  })()}
                </div>

                {/* Last recorded date or status - RESERVED SPACE */}
                <div className="h-[12px] flex items-center justify-end">
                  <span className="text-[9px] text-teal-500/60">
                    {(() => {
                      const hasWeight = entry?.weight != null;
                      const isToday = dayjs(date).isSame(dayjs(), "day");
                      const isFuture = dayjs(date).isAfter(dayjs(), "day");

                      // Future date - SHOW LAST WEIGHT INFO
                      if (isFuture) {
                        const history = Object.keys(logs)
                          .filter((k) => logs[k]?.weight != null && k < dateKey)
                          .sort()
                          .reverse();

                        if (history.length > 0) {
                          const lastDate = dayjs(history[0]);
                          const daysAgo = dayjs(date).diff(lastDate, "day");
                          return `Last: ${lastDate.format(
                            "MMM D"
                          )} (${daysAgo}d ago)`;
                        }
                        return "No history";
                      }

                      // Current date HAS weight
                      if (hasWeight) {
                        if (isToday) {
                          return `Logged today`;
                        }
                        return `Recorded`;
                      }

                      // Current date NO weight - show fallback source
                      const history = Object.keys(logs)
                        .filter((k) => logs[k]?.weight != null && k < dateKey)
                        .sort()
                        .reverse();

                      if (history.length > 0) {
                        const lastDate = dayjs(history[0]);
                        const daysAgo = dayjs(date).diff(lastDate, "day");

                        if (isToday) {
                          return `Last: ${lastDate.format(
                            "MMM D"
                          )} (${daysAgo}d ago)`;
                        }
                        return `From: ${lastDate.format("MMM D")}`;
                      }

                      return "No history";
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Progress text */}
          <div
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-2.5 border transition-all shadow-sm
            ${
              pctToGoal < 0
                ? "bg-gradient-to-br from-red-600/10 via-red-700/5 to-red-800/10 border-red-500/30 hover:border-red-400/50"
                : "bg-gradient-to-br from-emerald-600/10 via-emerald-700/5 to-emerald-800/10 border-emerald-500/30 hover:border-emerald-400/50"
            }`}
          >
            {pctToGoal < 0 ? (
              <>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">⚠️</span>
                  <span className="text-[10px] uppercase tracking-wider text-red-400/70 font-semibold">
                    Regression
                  </span>
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
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold">
                    Progress
                  </span>
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
                Math.abs(pctToGoal)
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
      <section className="grid gap-4 lg:grid-cols-2 w-full max-w-full overflow-hidden px-0 sm:px-4">
        {/* Calendar Section */}
        <div className="w-full min-w-0">
          <MiniCalendar
            date={date}
            setDate={setDate}
            doneState={doneState}
            logs={logs}
          />
        </div>

        {/* Summary Section */}
        <div className="w-full min-w-0">
          <DailySummaryCarousel date={date} logs={logs} />
        </div>
      </section>

      {/* Workout Section */}
      <section className="mb-6 mt-2">
        <div
          className="relative overflow-hidden rounded-3xl
         bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-600
         p-[1px] shadow-2xl dark:shadow-black/50"
        >
          <div
            className="relative
          bg-gradient-to-br from-[#B82132]/95 via-[#183D3D] to-[#0F0F0F] dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] backdrop-blur-sm rounded-3xl p-5 md:p-6"
          >
            {/* BG DECOR */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-400/5 rounded-full blur-3xl -z-10"></div>

            {weekday === "Sunday" ? (
              // SUNDAY REST DAY
              <div className="text-center py-12 md:py-16">
                <div className="mb-6">
                  <span className="text-6xl md:text-7xl mb-4 inline-block animate-pulse">
                    🧘‍♂️
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
                  Rest Day
                </h2>
                <p className="text-emerald-200/80 dark:text-emerald-300/70 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto italic">
                  "{sundayQuote}"
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-emerald-400/20">
                    <span className="text-emerald-300">💤 Sleep well</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-teal-400/20">
                    <span className="text-teal-300">🥗 Eat healthy</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-cyan-400/20">
                    <span className="text-cyan-300">💧 Stay hydrated</span>
                  </div>
                  <div className="bg-white/5 px-4 py-2 rounded-lg border border-purple-400/20">
                    <span className="text-purple-300">🧘 Stretch lightly</span>
                  </div>
                </div>
              </div>
            ) : (
              // WORKOUT DAY
              <>
                {/* HEADER */}
                <div className="mb-5 pb-4 border-b border-emerald-500/20 dark:border-emerald-400/15">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                          💪 {weekday}
                        </h2>
                        {doneState[dateKey] && (
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold whitespace-nowrap">
                            ✅ Completed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-emerald-200/80 dark:text-emerald-200/70 font-medium">
                          {dayPlan.title}
                        </span>
                        <span className="text-emerald-400/60 dark:text-emerald-500/50">
                          •
                        </span>
                        <span className="text-emerald-200/60 dark:text-emerald-300/60">
                          📅 {fmtDisp(date)}
                        </span>
                      </div>
                    </div>

                    {/* COMPACT STATS */}
                    <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                      <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-emerald-400/20 min-w-[70px]">
                        <p className="text-[9px] uppercase tracking-wider text-emerald-300/70 font-semibold mb-0.5">
                          Total
                        </p>
                        <p className="text-lg font-black text-emerald-100">
                          {dayPlan.left.length +
                            dayPlan.right.length +
                            dayPlan.finisher.length}
                        </p>
                      </div>

                      <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-teal-400/20 min-w-[70px]">
                        <p className="text-[9px] uppercase tracking-wider text-teal-300/70 font-semibold mb-0.5">
                          Done
                        </p>
                        <p className="text-lg font-black text-teal-100">
                          {countDone(entry.left) +
                            countDone(entry.right) +
                            countDone(entry.finisher)}
                        </p>
                      </div>

                      <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-cyan-400/20 min-w-[70px]">
                        <p className="text-[9px] uppercase tracking-wider text-cyan-300/70 font-semibold mb-0.5">
                          Progress
                        </p>
                        <p className="text-lg font-black text-cyan-100">
                          {Math.round(
                            ((countDone(entry.left) +
                              countDone(entry.right) +
                              countDone(entry.finisher)) /
                              Math.max(
                                1,
                                (dayPlan.left?.length || 0) +
                                  (dayPlan.right?.length || 0) +
                                  (dayPlan.finisher?.length || 0)
                              )) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-lg shadow-emerald-500/50"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((countDone(entry.left) +
                              countDone(entry.right) +
                              countDone(entry.finisher)) /
                              Math.max(
                                1,
                                (dayPlan.left?.length || 0) +
                                  (dayPlan.right?.length || 0) +
                                  (dayPlan.finisher?.length || 0)
                              )) *
                              100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* 3 COLUMN LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                  {/* LEFT COLUMN */}
                  <ExerciseColumn
                    title="💪 Left"
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
                    title="💪 Right"
                    items={entry.right}
                    dayPlanItems={dayPlan.right}
                    planLength={dayPlan.right.length}
                    color="teal"
                    section="right"
                    toggle={toggle}
                    doneState={doneState}
                    dateKey={dateKey}
                  />

                  {/* FINISHER COLUMN */}
                  <ExerciseColumn
                    title={`🔥 ${dayPlan.finisherLabel || "Finisher"}`}
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

                {/* FOOTER ACTION BAR */}
                <div className="mt-4 border-t border-emerald-500/20 pt-4">
                  <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* MARK ALL / UNMARK ALL - Disabled when workout is done */}
                    <button
                      onClick={() => toggleMarkAll(dateKey)}
                      disabled={doneState[dateKey]}
                      className={`
        w-full rounded-xl px-4 py-3 font-semibold text-sm
        flex items-center justify-center gap-2
        transition-all duration-300
        ${
          doneState[dateKey]
            ? "bg-gray-600/40 text-gray-400 cursor-not-allowed opacity-50"
            : allDone
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02] shadow-md shadow-orange-600/30"
            : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:scale-[1.02] shadow-md shadow-blue-600/30"
        }
      `}
                    >
                      {allDone ? "❌ Unmark All" : "✔️ Mark All"}
                    </button>

                    {/* MARK WORKOUT DONE - Only shows when NOT done yet */}
                    {!doneState[dateKey] && (
                      <button
                        onClick={openModal}
                        className={
                          `w-full rounded-xl px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ` +
                          (countDone(entry.left) === 0 &&
                          countDone(entry.right) === 0 &&
                          countDone(entry.finisher) === 0
                            ? "bg-gray-600/40 text-gray-100 hover:bg-gray-500/60"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:scale-105 shadow-md shadow-emerald-600/30")
                        }
                      >
                        <span className="text-xs sm:text-sm">
                          {countDone(entry.left) === 0 &&
                          countDone(entry.right) === 0 &&
                          countDone(entry.finisher) === 0
                            ? "Log Today's Activity"
                            : "Mark Workout Done / Edit"}
                        </span>
                      </button>
                    )}

                    {/* EDIT BUTTON - Shows when workout is done */}
                    {doneState[dateKey] && (
                      <button
                        onClick={editWorkout}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-sm 
          flex items-center justify-center gap-2
          text-emerald-200 bg-white/10 backdrop-blur-md 
          border border-emerald-400/30 
          hover:bg-white/15 hover:border-emerald-300/50 
          transition-all duration-300 hover:scale-[1.02]"
                      >
                        ✏️ Edit Workout
                      </button>
                    )}

                    {/* CLEAR DAY - Shows when workout is done */}
                    {doneState[dateKey] && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "⚠️ Clear this workout? This cannot be undone."
                            )
                          ) {
                            deleteWorkout(dateKey);
                          }
                        }}
                        className="w-full rounded-xl px-4 py-3 font-semibold text-sm 
          flex items-center justify-center gap-2
          bg-gradient-to-r from-red-600 to-rose-600 text-white 
          hover:scale-[1.02] transition-all duration-300 
          shadow-md shadow-red-600/30"
                      >
                        🗑️ Clear Day
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* ------------- MODAL BLOCK WITH EXERCISE EDITOR ------------- */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onEnter={saveWorkout}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent mb-5">
            Log Today's Workout
          </h2>
          {/* -------------------- QUICK STATS GRID -------------------- */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* CALORIES */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-1.5 font-semibold">
                🔥 Calories
              </label>
              <input
                type="number"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                className="w-full bg-gradient-to-br from-[#0F766E]/30 via-[#0c4a42]/20 to-[#0a3832]/30 
                     border border-emerald-400/30 rounded-xl p-2.5 
                     text-emerald-100 placeholder:text-emerald-300/40
                     outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                     transition-all duration-200"
                placeholder="500"
              />
            </div>

            {/* WEIGHT */}
            <div>
              <label className="block text-xs uppercase tracking-wide text-cyan-200/70 mb-1.5 font-semibold">
                ⚖️ Weight
              </label>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full bg-gradient-to-br from-[#183D3D]/30 via-[#0F2A2A]/20 to-[#0A1F1F]/30 
                     border border-cyan-400/30 rounded-xl p-2.5 
                     text-cyan-100 placeholder:text-cyan-300/40
                     outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400
                     transition-all duration-200"
                placeholder="79.5"
              />
            </div>
          </div>

          {/* -------------------- DURATION -------------------- */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wide text-teal-200/70 mb-1.5 font-semibold">
              ⏱️ Duration
            </label>
            <div className="flex gap-3">
              {/* Hours */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full bg-gradient-to-br from-[#0F766E]/30 via-[#0c4a42]/20 to-[#0a3832]/30 
                         border border-teal-400/30 rounded-xl p-2.5 pr-10
                         text-teal-100 placeholder:text-teal-300/40
                         outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-teal-400
                         transition-all duration-200"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-300/60 font-medium">
                    hrs
                  </span>
                </div>
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-gradient-to-br from-[#0F766E]/30 via-[#0c4a42]/20 to-[#0a3832]/30 
                         border border-teal-400/30 rounded-xl p-2.5 pr-10
                         text-teal-100 placeholder:text-teal-300/40
                         outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-teal-400
                         transition-all duration-200"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-300/60 font-medium">
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------- MOOD SELECTOR -------------------- */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-purple-200/70 mb-2 font-semibold">
              😊 Mood
            </label>
            <div className="flex gap-2 sm:gap-3">
              {["😄", "🙂", "😐", "😣", "😴"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoodInput(m)}
                  className={`
              flex-1 text-2xl sm:text-3xl p-2.5 sm:p-3 rounded-xl transition-all duration-200
              bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
              border-2 shadow-lg
              hover:scale-105 active:scale-95
              ${
                moodInput === m
                  ? "border-purple-400 bg-purple-500/20 shadow-purple-500/30 scale-105"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
              }
            `}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* RUNNING BLOCK */}
          <div className="mb-4">
            <p className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-1.5 font-semibold">
              Running
            </p>

            {/* Part 1: distance + duration */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] text-emerald-200/60 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={runningDistance}
                  onChange={(e) => setRunningDistance(e.target.value)}
                  className="w-full bg-gradient-to-br from-[#0F766E]/30 via-[#0c4a42]/20 to-[#0a3832]/30 
                   border border-emerald-400/30 rounded-xl p-2.5 
                   text-emerald-100 placeholder:text-emerald-300/40
                   outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                   transition-all duration-200"
                  placeholder="3.5"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-200/60 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={runningDuration}
                  onChange={(e) => setRunningDuration(e.target.value)}
                  className="w-full bg-gradient-to-br from-[#0F766E]/30 via-[#0c4a42]/20 to-[#0a3832]/30 
                   border border-emerald-400/30 rounded-xl p-2.5 
                   text-emerald-100 placeholder:text-emerald-300/40
                   outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                   transition-all duration-200"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Part 2: how it felt (emoji mood + optional note) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block text-[11px] uppercase tracking-wide text-emerald-200/70 font-semibold">
                  How it felt
                </span>
                {/* running-specific mood: reuse gym emoji style but separate state */}
                <div className="flex gap-1.5">
                  {["😄", "🙂", "😐", "😣", "😴"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRunningNotes(m)}
                      className={`
              w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center
              text-lg rounded-lg border backdrop-blur-xl
              transition-all duration-200
              ${
                runningNotes === m
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100 shadow-md shadow-emerald-500/30 scale-105"
                  : "border-white/10 bg-white/5 text-emerald-100/80 opacity-70 hover:opacity-100 hover:border-white/30"
              }
            `}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={
                  ["😄", "🙂", "😐", "😣", "😴"].includes(runningNotes)
                    ? "" // if only emoji selected, keep textarea empty
                    : runningNotes
                }
                onChange={(e) => setRunningNotes(e.target.value)}
                className="w-full bg-gradient-to-br from-[#0F766E]/20 via-[#0c4a42]/15 to-[#0a3832]/20 
                 border border-emerald-400/25 rounded-xl p-2.5 
                 text-emerald-100 placeholder:text-emerald-300/40
                 outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400
                 text-xs transition-all duration-200"
                placeholder="Route, pace, intervals, extra notes..."
              />
            </div>
          </div>

          {/* YOGA + OTHER EXERCISES */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-cyan-200/70 mb-1.5 font-semibold">
                Yoga (minutes)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={yogaMinutesInput}
                onChange={(e) => setYogaMinutesInput(e.target.value)}
                className="w-full bg-gradient-to-br from-183D3D30 via-0F2A2A20 to-0A1F1F30 border border-cyan-400/30 rounded-xl p-2.5 text-cyan-100 placeholder:text-cyan-300/40 outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400"
                placeholder="20"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-1.5 font-semibold">
                Other Exercises
              </label>
              <textarea
                rows={2}
                value={otherExercisesInput}
                onChange={(e) => setOtherExercisesInput(e.target.value)}
                className="w-full bg-gradient-to-br from-0F766E20 via-0c4a4215 to-0a383220 border border-emerald-400/25 rounded-xl p-2.5 text-emerald-100 placeholder:text-emerald-300/40 outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 text-xs"
                placeholder="e.g. 15 min skipping + 3 sets push‑ups"
              />
            </div>
          </div>

          {/* -------------------- COLLAPSIBLE EXERCISE EDITOR -------------------- */}
          <div className="mb-5">
            <button
              type="button"
              onClick={() => setShowExerciseEditor(!showExerciseEditor)}
              className="w-full flex items-center justify-between p-3 rounded-xl
                   bg-gradient-to-br from-emerald-500/20 to-teal-500/20
                   border border-emerald-400/30 hover:border-emerald-400/50
                   transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💪</span>
                <span className="text-sm font-semibold text-emerald-200">
                  Edit Exercise Checklist
                </span>
                <span className="text-xs text-emerald-300/60 font-medium">
                  (
                  {editLeft.filter((e) => e.done).length +
                    editRight.filter((e) => e.done).length +
                    editFinisher.filter((e) => e.done).length}{" "}
                  completed)
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-emerald-300 transition-transform duration-300 ${
                  showExerciseEditor ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* COLLAPSIBLE CONTENT */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showExerciseEditor
                  ? "max-h-[600px] opacity-100 mt-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3 p-3 rounded-xl bg-black/20 border border-emerald-400/20">
                {/* LEFT */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-emerald-300/80 mb-2 font-semibold flex items-center gap-1.5">
                    <span className="w-1 h-4 bg-emerald-400 rounded-full"></span>
                    Left Side
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
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    border backdrop-blur-xl hover:scale-105 active:scale-95
                    ${
                      ex.done
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/20"
                        : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                    }
                  `}
                      >
                        {ex.done ? "✓" : "○"} {ex.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-teal-300/80 mb-2 font-semibold flex items-center gap-1.5">
                    <span className="w-1 h-4 bg-teal-400 rounded-full"></span>
                    Right Side
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
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    border backdrop-blur-xl hover:scale-105 active:scale-95
                    ${
                      ex.done
                        ? "bg-teal-500/30 border-teal-400 text-teal-100 shadow-lg shadow-teal-500/20"
                        : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                    }
                  `}
                      >
                        {ex.done ? "✓" : "○"} {ex.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FINISHER */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-cyan-300/80 mb-2 font-semibold flex items-center gap-1.5">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full"></span>
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
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    border backdrop-blur-xl hover:scale-105 active:scale-95
                    ${
                      ex.done
                        ? "bg-cyan-500/30 border-cyan-300 text-cyan-100 shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                    }
                  `}
                      >
                        {ex.done ? "✓" : "○"} {ex.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------- ACTION BUTTONS -------------------- */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-emerald-500/20">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm
                   bg-gradient-to-r from-red-600/30 to-red-500/30 
                   border border-red-400/40 text-red-200 
                   hover:from-red-600/40 hover:to-red-500/40 hover:border-red-400/60
                   transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm
                   bg-gradient-to-r from-emerald-600/40 to-teal-600/40 
                   border border-emerald-400/50 text-emerald-100
                   hover:from-emerald-600/50 hover:to-teal-600/50 hover:border-emerald-400/70
                   shadow-lg shadow-emerald-500/20
                   transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={saveWorkout}
            >
              Save Workout
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
    setViewMonth(dayjs());
  }, [dayjs().format("YYYY-MM-DD")]);

  const monthStart = viewMonth.startOf("month");
  const weekdayIndex = (monthStart.day() + 6) % 7;
  const start = monthStart.subtract(weekdayIndex, "day");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));

  // HELPER FUNCTION: Check if date has completed exercises
  const hasCompletedExercises = (dateKey) => {
    const entry = logs?.[dateKey];
    if (!entry) return false;

    const checkArray = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return false;
      if (arr.some((item) => typeof item === "object" && item != null))
        return arr.some((e) => e?.done === true);
      if (arr.every((item) => typeof item === "boolean"))
        return arr.some((b) => b === true);
      return false;
    };

    const manualActivity =
      (entry.running?.distanceKm != null ||
        entry.running?.durationMinutes != null ||
        entry.yogaMinutes != null ||
        !!entry.otherExercises) ??
      false;

    return (
      checkArray(entry.left) ||
      checkArray(entry.right) ||
      checkArray(entry.finisher) ||
      manualActivity
    );
  };

  // HELPER FUNCTION: Get all workout days in a month
  const getWorkoutDaysInMonth = (monthFormat) => {
    const workoutDays = new Set();

    // From doneState
    Object.keys(doneState || {}).forEach((k) => {
      if (k.startsWith(monthFormat) && doneState[k] === true) {
        workoutDays.add(k);
      }
    });

    // From exercise logs
    Object.keys(logs || {}).forEach((k) => {
      if (k.startsWith(monthFormat) && hasCompletedExercises(k)) {
        workoutDays.add(k);
      }
    });

    return workoutDays.size;
  };

  // HELPER FUNCTION: Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = dayjs(today);

    while (true) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      const isDone =
        doneState?.[dateKey] === true || hasCompletedExercises(dateKey);

      if (!isDone) break;

      streak++;
      currentDate = currentDate.subtract(1, "day");
    }

    return streak;
  };

  return (
    <section
      className="
        border border-emerald-500/30 rounded-3xl 
        px-3 py-3 sm:px-5 sm:py-2.5
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] 
        dark:bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
        text-[#FAFAFA] shadow-xl shadow-black/40
        max-w-full overflow-hidden mx-auto sm:mx-0
      "
    >
      {/* Header */}
      <div className="mb-[1.3rem]">
        <div className="flex items-center justify-between mb-3 gap-2">
          <button
            onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
            className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0
              rounded-full flex items-center justify-center
              bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20
              transition-all duration-200 hover:scale-110 active:scale-95
              text-lg sm:text-xl font-bold"
          >
            ‹
          </button>

          <div className="flex-1 text-center">
            <div className="text-sm sm:text-base md:text-lg font-bold text-emerald-200/90">
              {viewMonth.subtract(17, "day").format("MMM D")} -{" "}
              {viewMonth.add(17, "day").format("MMM D, YYYY")}
            </div>
          </div>

          <button
            onClick={() => setViewMonth(viewMonth.add(1, "month"))}
            className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0
              rounded-full flex items-center justify-center
              bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20
              transition-all duration-200 hover:scale-110 active:scale-95
              text-lg sm:text-xl font-bold"
          >
            ›
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4 py-2">
          <div className="flex-1 min-w-0">
            <div className="text-base sm:text-lg md:text-xl font-bold text-emerald-200 truncate">
              {dayjs(date).format("dddd")}
            </div>
            <div className="text-xs sm:text-sm text-emerald-300/60 truncate">
              {dayjs(date).format("MMMM DD, YYYY")}
            </div>
          </div>

          <button
            onClick={() => {
              setViewMonth(today);
              setDate(today.format("YYYY-MM-DD"));
            }}
            className="flex-shrink-0 flex items-center gap-1.5 
              px-3 py-2 sm:px-4 sm:py-2.5
              rounded-xl 
              bg-cyan-500/20 hover:bg-cyan-500/30
              border border-cyan-400/30 hover:border-cyan-400/50
              text-[10px] sm:text-xs font-bold
              text-cyan-200 hover:text-cyan-100 
              uppercase tracking-wider
              transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="text-xs sm:text-sm">📍</span>
            <span>Today</span>
          </button>
        </div>
      </div>
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-[3px] sm:gap-1.5 mb-2">
        {(() => {
          const startDay = today.subtract(3, "day");
          const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          const headers = [];

          for (let i = 0; i < 7; i++) {
            const d = startDay.add(i, "day");
            const dayIndex = (d.day() + 6) % 7;
            const isToday = i === 3;

            headers.push(
              <div
                key={i}
                className={`text-[10px] text-center font-semibold uppercase ${
                  isToday ? "text-yellow-300" : "text-emerald-300/60"
                }`}
              >
                {weekdays[dayIndex]}
              </div>
            );
          }

          return headers;
        })()}
      </div>
      {/* Calendar Grid - 5 Rows × 7 Columns */}
      <div className="grid grid-cols-7 gap-[3px] sm:gap-1.5 mb-2">
        {(() => {
          const cells = [];
          const centerDate = viewMonth;
          const startDate = centerDate.subtract(17, "day");

          for (let i = 0; i < 35; i++) {
            const d = startDate.add(i, "day");
            const key = d.format("YYYY-MM-DD");
            const isToday = d.isSame(today, "day");
            const isSelected = key === date;

            const row = Math.floor(i / 7);
            const col = i % 7;
            const isCurrentWeek = row === 2;

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

            // ✅ FIXED: Check both doneState AND exercise logs
            const doneByState = doneState?.[key] === true;
            const doneByExercises = hasCompletedExercises(key);
            const isDone = doneByState || doneByExercises;

            const entry = logs?.[key];
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
                  className={`
                    w-7 h-7 sm:w-9 sm:h-9 rounded-full text-xs font-medium
                    flex items-center justify-center border
                    transition-all duration-200
                    cursor-pointer hover:scale-105
                    ${
                      isDone
                        ? "bg-emerald-600 text-white border-emerald-400/50 shadow-md shadow-emerald-500/30"
                        : "bg-gray-700/80 text-gray-200 border-white/10 hover:bg-gray-600/80"
                    }
                    ${
                      isSelected
                        ? "ring-2 ring-cyan-400 scale-[1.08] shadow-lg"
                        : ""
                    }
                    ${
                      isToday
                        ? "border-cyan-400 ring-2 ring-cyan-400/60 font-bold scale-110 shadow-lg shadow-cyan-400/30"
                        : ""
                    }
                  `}
                >
                  {d.date()}
                </button>

                <div className="pointer-events-none absolute top-8 sm:top-11 scale-90 sm:scale-100 z-30 rounded-lg bg-black/90 px-2.5 py-1.5 text-[10px] text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-emerald-500/20 shadow-xl">
                  {d.format("MMM D")} • {isDone ? "✅ Done" : "No workout"}
                  {hasCalories && ` • ${entry.calories} kcal`}
                  {hasWeight && ` • ${entry.weight} kg`}
                </div>
              </div>
            );
          }

          return cells;
        })()}
      </div>
      {/* Current Week Highlight */}
      <div className="pt-2 sm:pt-3 border-t border-cyan-500/30 bg-cyan-500/5 -mx-3 sm:-mx-5 px-3 sm:px-5 py-2 sm:py-3 rounded-b-3xl">
        <div className="text-[10px] text-cyan-300 uppercase tracking-wide font-semibold mb-2 text-center">
          📍 Current Week (Row 3)
        </div>
        <div className="flex justify-between gap-1.5">
          {(() => {
            const startOfWeek = today.startOf("week").add(1, "day");
            return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, i) => {
              const currentDay = startOfWeek.add(i, "day");
              const dayKey = currentDay.format("YYYY-MM-DD");
              // ✅ FIXED: Check both sources
              const dayDone =
                doneState?.[dayKey] === true || hasCompletedExercises(dayKey);
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
      <div className="mt-4 md:p-3 border-t border-emerald-500/20">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2 text-center pb-0">
          {/* This Month - ✅ FIXED */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[8px] sm:text-[9px] text-emerald-200/60 uppercase tracking-wide font-semibold mb-0.5">
              This Month
            </div>
            <div className="text-lg sm:text-xl font-bold text-emerald-300">
              {getWorkoutDaysInMonth(today.format("YYYY-MM"))}
              <span className="text-sm text-emerald-300/60">
                /{today.daysInMonth()}
              </span>
            </div>
            <div className="text-[9px] text-emerald-300/60">workouts</div>
          </div>

          {/* Streak - ✅ FIXED */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[9px] text-cyan-200/60 uppercase tracking-wide font-semibold mb-0.5">
              Streak
            </div>
            <div className="text-xl font-bold text-cyan-300">
              {calculateStreak()}
            </div>
            <div className="text-[9px] text-cyan-300/60">days</div>
          </div>

          {/* Monthly Goal - ✅ FIXED */}
          <div className="bg-white/5 rounded-xl p-2">
            <div className="text-[9px] text-teal-200/60 uppercase tracking-wide font-semibold mb-0.5">
              Monthly Goal
            </div>
            <div className="text-xl font-bold text-teal-300">
              {(() => {
                const totalDays = today.daysInMonth();
                const done = getWorkoutDaysInMonth(today.format("YYYY-MM"));
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
