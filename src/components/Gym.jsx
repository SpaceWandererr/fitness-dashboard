import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { load, save } from "../utils/localStorage";
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

/* ---------- Default Plan (Mon → Sat) ---------- */
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
  /* ---------- Plan (editable & persisted) ---------- */
  const [plan, setPlan] = useState(() => load("wd_gym_plan", DEFAULT_PLAN));
  useEffect(() => save("wd_gym_plan", plan), [plan]);

  /* ---------- Date & weekday ---------- */
  const todayName = dayjs().format("dddd");
  const defaultDay = WEEK.includes(todayName) ? todayName : "Monday";
  const [weekday, setWeekday] = useState(defaultDay);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const dateKey = fmtISO(date);

  // Jump to next upcoming date matching selected weekday
  useEffect(() => {
    if (!weekday) return;
    const today = dayjs();
    let newDate = dayjs(date);
    if (newDate.format("dddd") !== weekday) {
      let tmp = today;
      for (let i = 0; i < 7 && tmp.format("dddd") !== weekday; i++) {
        tmp = tmp.add(1, "day");
      }
      newDate = tmp;
    }
    setDate(newDate.format("YYYY-MM-DD"));
  }, [weekday]);

  /* ---------- Logs (per-date) ---------- */
  // logs[YYYY-MM-DD] = { weekday, left[], right[], finisher[], done, calories?, bmi?, weight? }
  const [logs, setLogs] = useState(() => load("wd_gym_logs", {}));
  const persistLog = (obj) => {
    const next = { ...logs, [dateKey]: obj };
    setLogs(next);
    save("wd_gym_logs", next);
  };

  /* ---------- Target weight ---------- */
  const goals = load("wd_goals", { targetWeight: 70 });
  const [targetWeight, setTargetWeight] = useState(goals.targetWeight || 70);
  useEffect(() => save("wd_goals", { ...goals, targetWeight }), [targetWeight]);

  /* ---------- Weight overrides (Gym keeps backup even if BMI logs are deleted) ---------- */
  const [weightOverrides, setWeightOverrides] = useState(() =>
    load("wd_weight_overrides", {})
  );

  /* ---------- BMI logs (always re-read so BMI.jsx updates reflect here) ---------- */
  const bmiLogs = useMemo(() => load("bmi_logs", []), [date, logs]);

  /* Try exact same day BMI/weight first, else latest */
  const bmiForDate = useMemo(() => {
    const disp = fmtDisp(date);
    const exact = (bmiLogs || []).find((e) => e?.date === disp);
    return exact || (bmiLogs || []).slice().reverse()[0] || null;
  }, [bmiLogs, date]);

  const currentBMIFromLog = bmiForDate?.bmi ?? null;
  const currentWeightFromLog = bmiForDate?.weight ?? null;

  /* ---------- Build checks for selected date (resize-safe with plan edits) ---------- */
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
        bmi: currentBMIFromLog ?? undefined,
        weight: currentWeightFromLog ?? undefined,
      };
    }
    return {
      weekday,
      left: fit(prev.left, def.left?.length || 0),
      right: fit(prev.right, def.right?.length || 0),
      finisher: fit(prev.finisher, def.finisher?.length || 0),
      done: !!prev.done,
      calories: prev.calories,
      // Prefer latest BMI from logs, then previously saved
      bmi: currentBMIFromLog ?? prev.bmi ?? undefined,
      // Prefer previously saved weight, else from BMI logs
      weight: prev.weight ?? currentWeightFromLog ?? undefined,
    };
  }, [logs, dateKey, weekday, plan, currentBMIFromLog, currentWeightFromLog]);

  /* ---------- Completion % ---------- */
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

  /* ---------- Checkbox toggle ---------- */
  const toggle = (section, idx) => {
    const next = structuredClone(checks);
    next[section][idx] = !next[section][idx];
    persistLog(next);
  };

  /* ---------- Streaks & totals ---------- */
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

  /* ---------- Persist weekday with date ---------- */
  useEffect(() => {
    if (logs[dateKey]) persistLog({ ...checks, weekday });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekday]);

  /* ---------- Modal (calories + current weight) ---------- */
  const [showModal, setShowModal] = useState(false);
  const [caloriesInput, setCaloriesInput] = useState("");
  const [currentWeightInput, setCurrentWeightInput] = useState("");

  const canComplete =
    checks.left.some(Boolean) ||
    checks.right.some(Boolean) ||
    checks.finisher?.some?.(Boolean) ||
    false;

  const openCaloriesModal = () => {
    if (!canComplete) return;
    setCaloriesInput(checks.calories?.toString() || "");
    const overrideWeight = weightOverrides[dateKey];
    setCurrentWeightInput(
      (checks.weight ?? overrideWeight ?? currentWeightFromLog ?? "").toString()
    );
    setShowModal(true);
  };

  const saveCaloriesAndComplete = () => {
    const calories = Number(caloriesInput) || 0;
    const weight =
      Number(currentWeightInput) || currentWeightFromLog || checks.weight;

    // 1) Calculate BMI using saved height from BMI page
    const savedHeight = Number(load("bmi_height", 176)); // fallback 176 cm
    const newBmi =
      weight && savedHeight
        ? Number((weight / Math.pow(savedHeight / 100, 2)).toFixed(1))
        : currentBMIFromLog ?? null;

    // 2) Save to today's gym log
    const next = {
      ...checks,
      done: true,
      calories,
      weight,
      bmi: newBmi ?? checks.bmi,
    };
    persistLog(next);

    // 3) Mark calendar green
    const doneMap = load("wd_done", {});
    doneMap[dateKey] = true;
    save("wd_done", doneMap);

    // 4) Save/override per-date weight in Gym so we survive BMI deletions
    const overrides = load("wd_weight_overrides", {});
    overrides[dateKey] = weight;
    save("wd_weight_overrides", overrides);
    setWeightOverrides(overrides);

    // 5) Upsert into bmi_logs so BMI page sees this weight & BMI
    const disp = fmtDisp(date);
    const logsArr = load("bmi_logs", []);
    const idx = logsArr.findIndex((e) => e?.date === disp);
    if (idx >= 0) {
      logsArr[idx] = { ...logsArr[idx], weight, bmi: newBmi };
    } else {
      logsArr.push({ date: disp, weight, bmi: newBmi });
    }
    save("bmi_logs", logsArr);

    setShowModal(false);
  };

  const editCalories = () => {
    setCaloriesInput((logs[dateKey]?.calories ?? "").toString());
    const overrideWeight = weightOverrides[dateKey];
    setCurrentWeightInput(
      (
        logs[dateKey]?.weight ??
        overrideWeight ??
        currentWeightFromLog ??
        ""
      ).toString()
    );
    setShowModal(true);
  };

  const deleteCaloriesAndUnmark = () => {
    const next = { ...checks, calories: undefined, done: false };
    persistLog(next);
    const all = load("wd_done", {});
    delete all[dateKey];
    save("wd_done", all);
    // keep wd_weight_overrides intact by design
  };

  /* ---------- Mark-all toggle (only checkboxes, no completion) ---------- */
  const toggleMarkAll = () => {
    const def = plan[weekday] || { left: [], right: [], finisher: [] };
    const allDone =
      checks.left.every(Boolean) &&
      checks.right.every(Boolean) &&
      (checks.finisher?.every?.(Boolean) ?? true);

    const next = {
      ...checks,
      left: Array(def.left?.length || 0).fill(!allDone),
      right: Array(def.right?.length || 0).fill(!allDone),
      finisher: Array(def.finisher?.length || 0).fill(!allDone),
    };
    persistLog(next);
  };

  /* ---------- Edit plan day ---------- */
  const updateDayPlan = (day, updater) => {
    setPlan((p) => {
      const cur = p[day] || { title: "", left: [], right: [], finisher: [] };
      const nextDay = updater(cur);
      return { ...p, [day]: nextDay };
    });
  };

  /* ---------- Weight progress math (safe) ---------- */
  const recentWeights = (load("bmi_logs", []) || [])
    .map((b) => b?.weight)
    .filter((w) => typeof w === "number");

  const startWeight = recentWeights.length
    ? Math.max(...recentWeights.slice(-30))
    : checks.weight ?? targetWeight;

  const overrideWeight = weightOverrides[dateKey];
  // Priority: override (gym) → checks → bmi_logs → fallback
  let curWeight =
    overrideWeight ?? checks.weight ?? currentWeightFromLog ?? startWeight;

  const tw = Number(targetWeight);

  // percent helper: from startWeight (0) to targetWeight (100)
  const pct = (from, to, cur) => {
    const span = Math.abs(from - to);
    if (!isFinite(span) || span === 0) return 0;
    const p = ((from - cur) / (from - to)) * 100;
    return Math.max(0, Math.min(100, p));
  };

  const runnerPct = pct(startWeight, tw, curWeight); // 0 at start (right), 100 at goal (left in our layout)
  const diffToGoal =
    isFinite(curWeight) && isFinite(tw) ? curWeight - tw : null;

  /* ---------- Sunday rest detection ---------- */
  const isSunday = dayjs(date).format("dddd") === "Sunday";

  /* ---------- Tomorrow's plan ---------- */
  const nextDayName = (() => {
    const d = dayjs(date).add(1, "day").format("dddd");
    if (d === "Sunday") return "Rest Day (Sunday)";
    if (WEEK.includes(d)) return d;
    return "Monday";
  })();
  const nextPlan =
    nextDayName === "Rest Day (Sunday)" ? null : plan[nextDayName] || null;

  /* ---------- Chart data ---------- */
  const chartData = (bmiLogs || []).map((e) => ({
    date: e.date,
    weight: e.weight,
    bmi: e.bmi,
  }));

  /* ---------- UI ---------- */
  const dayPlan = plan[weekday] || {
    title: "",
    left: [],
    right: [],
    finisher: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gym</h1>
          <p className="text-sm opacity-70">
            Complete workouts, log calories, sync BMI/weight, and track
            progress.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={weekday}
            onChange={(e) => setWeekday(e.target.value)}
            className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
          >
            {WEEK.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      </header>

      {/* Target & progress bar (goal on left, current on right; runner moves right→left) */}
      <section className="border rounded-2xl p-4 space-y-3 relative">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm opacity-80">🎯 Target Weight</div>
          <input
            type="number"
            step="0.1"
            className="w-28 border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
            value={targetWeight}
            onChange={(e) => setTargetWeight(Number(e.target.value || 0))}
          />
          <div className="text-sm opacity-70">
            {curWeight != null
              ? diffToGoal > 0
                ? `You are ${diffToGoal.toFixed(1)} kg away`
                : diffToGoal < 0
                ? `You are ${Math.abs(diffToGoal).toFixed(1)} kg under goal`
                : "Goal reached 🎉"
              : "No weight data yet"}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm opacity-70 mb-1">
          <span>🎯 {isFinite(tw) ? `${tw} kg` : "-"}</span>
          <span>⚖️ {curWeight != null ? `${curWeight} kg` : "-"}</span>
        </div>

        {/* Bar container (relative) */}
        <div className="relative">
          {/* Main grey bar */}
          <div className="h-3 rounded-full bg-gray-300 dark:bg-gray-800 overflow-hidden" />
          {/* Green fill: from right → left, width runnerPct% */}
          <div
            className="absolute top-0 right-0 h-3 rounded-l-full"
            style={{
              width: `${runnerPct}%`,
              background: "linear-gradient(90deg, #4ade80, #22c55e)",
            }}
            title="Progress toward target"
          />
          {/* Runner emoji BELOW the bar, moves RIGHT → LEFT (your exact code kept) */}
          <div
            className="absolute -top-5 mt-1 transition-all duration-500 z-20"
            style={{ left: `calc(${100 - runnerPct}% - 15px)` }}
          >
            <span className="text-2xl drop-shadow-md">🏃‍♂️</span>
          </div>
        </div>
      </section>

      {/* Workout card (Rest if Sunday) */}
      <section className="border rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {isSunday
              ? "Rest Day (Sunday)"
              : `${weekday} • ${dayPlan.title || "Untitled"}`}
          </h2>
          {!isSunday && (
            <span
              className={`text-sm px-2 py-1 rounded ${
                checks.done
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              {checks.done ? "Completed" : "Not completed"}
            </span>
          )}
        </div>

        {!isSunday ? (
          <>
            <div className="text-sm mb-3 opacity-80">
              Completion: {completedExercises}/{totalExercises} ({completionPct}
              %)
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ExerciseList
                label="Left"
                list={dayPlan.left}
                state={checks.left}
                onToggle={(i) => toggle("left", i)}
              />
              <ExerciseList
                label="Right"
                list={dayPlan.right}
                state={checks.right}
                onToggle={(i) => toggle("right", i)}
              />
            </div>

            {!!dayPlan.finisher?.length && (
              <div className="mt-6">
                <h3 className="font-semibold">
                  {dayPlan.finisherLabel || "Finisher"}
                </h3>
                <ul className="space-y-2">
                  {dayPlan.finisher.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
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

            <div className="flex flex-wrap gap-3 mt-6 items-center">
              <button
                onClick={toggleMarkAll}
                className="border px-4 py-2 rounded"
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

              <span className="ml-auto bg-green-600 text-white px-3 py-1 rounded">
                🔥 Streak: {streak} days
              </span>
            </div>

            <div className="mt-4 text-sm flex flex-wrap items-center gap-3">
              <strong>Status:</strong>
              {checks.done ? "Done" : "Not done"}
              <span>•</span>
              <span>
                🔥 Calories:{" "}
                {checks.calories != null ? `${checks.calories} kcal` : "—"}
              </span>
              <span>•</span>
              <span>
                📊 BMI: {currentBMIFromLog != null ? currentBMIFromLog : "—"}
              </span>
              <span>•</span>
              <span>
                ⚖️ Weight: {curWeight != null ? `${curWeight} kg` : "—"}
              </span>

              {checks.done && (
                <>
                  <button
                    onClick={editCalories}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={deleteCaloriesAndUnmark}
                    className="px-2 py-1 border rounded"
                  >
                    🗑 Delete
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-3 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            Take it easy. Stretch, hydrate, and recover. 💙
          </div>
        )}
      </section>

      {/* Calendar + Daily Summary side-by-side on desktop */}
      <section className="grid md:grid-cols-2 gap-4">
        <MiniCalendar date={date} setDate={setDate} />
        <DailySummary date={date} checks={checks} targetWeight={targetWeight} />
      </section>

      {/* Weight & BMI Progress Chart */}
      <section className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Progress (Weight & BMI)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bmi"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Next day plan */}
      <section className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Next Workout</h3>
        {nextDayName === "Rest Day (Sunday)" ? (
          <div className="text-sm opacity-80">
            Tomorrow is <strong>Rest Day (Sunday)</strong>. Focus on recovery.
          </div>
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
          <div className="opacity-80 text-sm">Plan not found for tomorrow.</div>
        )}
      </section>

      {/* Badges */}
      <section className="border rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Badges</h3>
        <div className="flex flex-wrap gap-3">
          <Badge label="7-Day Streak" earned={streak >= 7} />
          <Badge label="14-Day Streak" earned={streak >= 14} />
          <Badge label="30-Day Streak" earned={streak >= 30} />
          <Badge label="No-Skip Week" earned={streak >= 7} />
          <Badge label="10 Workouts" earned={totalWorkouts >= 10} />
          <Badge label="25 Workouts" earned={totalWorkouts >= 25} />
          <Badge label="50 Workouts" earned={totalWorkouts >= 50} />
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
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                placeholder="e.g. 350"
              />
            </div>

            <div>
              <label className="text-sm block">⚖ Current Weight (kg)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
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
              checked={state[i] || false}
              onChange={() => onToggle(i)}
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DailySummary({ date, checks, targetWeight }) {
  const tw = Number(targetWeight);
  const diff = checks.weight != null ? checks.weight - tw : null;

  return (
    <div className="border rounded-2xl p-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Daily Summary</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            checks.done
              ? "bg-green-600 text-white"
              : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          {checks.done ? "✅ Done" : "❌ Not Done"}
        </span>
      </div>
      <div className="text-sm opacity-70 mt-1">📅 {fmtDisp(date)}</div>
      <div className="mt-3 space-y-1 text-sm">
        <div>
          🔥 Calories:{" "}
          {checks.calories != null ? `${checks.calories} kcal` : "—"}
        </div>
        <div>
          ⚖️ Weight: {checks.weight != null ? `${checks.weight} kg` : "—"}
        </div>
        <div>📊 BMI: {checks.bmi != null ? checks.bmi : "—"}</div>
        <div>
          🎯 Target Diff:{" "}
          {diff == null
            ? "—"
            : diff > 0
            ? `${diff.toFixed(1)} kg left`
            : diff < 0
            ? `${Math.abs(diff).toFixed(1)} kg under`
            : "Goal ✓"}
        </div>
      </div>
    </div>
  );
}

function StaticList({ label, items = [] }) {
  return (
    <div>
      <h4 className="font-medium">{label}</h4>
      <ul className="list-disc ml-6 mt-1 text-sm opacity-80">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
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

/* Mini calendar with month navigation */
function MiniCalendar({ date, setDate }) {
  const [viewMonth, setViewMonth] = useState(dayjs(date));
  const month = viewMonth;
  const start = month.startOf("month").startOf("week");
  const cells = Array.from({ length: 42 }, (_, i) => start.add(i, "day"));
  const doneMap = load("wd_done", {});
  const today = dayjs();

  const colorOf = (d) => {
    const key = d.format("YYYY-MM-DD");
    if (doneMap[key]) return "bg-green-500 text-white";
    if (d.isAfter(today, "day")) return "bg-gray-600 text-white";
    return "bg-red-500 text-white";
  };

  useEffect(() => {
    setViewMonth(dayjs(date)); // keep calendar focused on selected date's month
  }, [date]);

  return (
    <section className="border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewMonth(viewMonth.subtract(1, "month"))}
          className="px-2"
        >
          〈
        </button>
        <div className="font-semibold text-sm">{month.format("MMMM YYYY")}</div>
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
          const isCurMonth = d.month() === month.month();
          const isSelected = key === date;
          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[11px] flex items-center justify-center
                          border ${!isCurMonth ? "opacity-30" : ""} ${colorOf(
                d
              )}
                          ${isSelected ? "ring-2 ring-blue-400" : ""}`}
              title={d.format("DD-MM-YYYY")}
            >
              {d.date()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* Centered modal with blurred backdrop */
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
