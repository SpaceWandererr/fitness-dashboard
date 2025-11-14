// src/components/Planner.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { load, save } from "../utils/localStorage.js";

/* ----------------------- Config & helpers ----------------------- */
const DEFAULT_TASKS = [
  "Gym: Push",
  "Gym: Pull",
  "Gym: Legs",
  "Code: JS 2h",
  "DSA Practice",
  "React Project",
  "Meal Prep",
  "Walk 8k steps",
];
const PRESETS = [
  { label: "Gym", task: "Gym: Workout" },
  { label: "Code", task: "Code: Focus Session" },
  { label: "DSA", task: "DSA Practice" },
  { label: "Meal", task: "Meal Prep" },
  { label: "Walk", task: "Walk 30m" },
];
const SLOT_ORDER = ["Morning", "Afternoon", "Evening"];
const QUOTES = [
  "Consistency beats intensity — Win daily.",
  "Ship small, ship often.",
  "Systems > Goals.",
  "Learn. Build. Repeat.",
  "Discipline shapes destiny.",
];

function taskEmoji(t) {
  if (/gym/i.test(t)) return "💪";
  if (/code|react|js|dsa/i.test(t)) return "💻";
  if (/walk|step/i.test(t)) return "🚶";
  if (/meal/i.test(t)) return "🍱";
  return "•";
}
function weatherCodeToMain(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([95].includes(code)) return "Thunderstorm";
  return "Weather";
}
function weatherCodeToDescription(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
  };
  return map[code] || "Weather conditions";
}
function computeStreak(doneMap) {
  let streak = 0;
  let cur = dayjs();
  while (doneMap && doneMap[cur.format("YYYY-MM-DD")]) {
    streak++;
    cur = cur.subtract(1, "day");
  }
  return streak;
}
function quoteOfTheDay() {
  const seed = dayjs().format("YYYY-MM-DD");
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  return QUOTES[s % QUOTES.length];
}
function formatDateKey(d) {
  return `wd_plan_day_${dayjs(d).format("YYYY-MM-DD")}`;
}

/* ------------------------- Load available Lottie JSONs (Vite) -------------------------
 Using import.meta.glob to gather JSONs placed under src/assets/weather-lottie/*
 -------------------------------------------------------------------------------------*/
const LOTTIE_MODULES = import.meta.glob(
  "/src/assets/weather-lottie/**/*.json",
  { eager: true }
);

function findLottieData(style, name) {
  if (!style || !name) return null;

  const target = `${name.toLowerCase()}.json`;

  for (const [path, mod] of Object.entries(LOTTIE_MODULES)) {
    const lower = path.toLowerCase();

    // must include the style folder somewhere
    if (!lower.includes(`/weather-lottie/${style}/`)) continue;

    // match file end
    if (lower.endsWith(target)) {
      return mod?.default ?? mod;
    }

    // also match nested folders like /sunny/sun.json
    if (lower.split("/").pop() === target) {
      return mod?.default ?? mod;
    }
  }

  console.warn("Lottie not found:", style, name);
  return null;
}

/* -------------------------- MiniCalendar Component -------------------------- */
function MiniCalendar({ selectedDate, setSelectedDate }) {
  const [base, setBase] = useState(dayjs(selectedDate).startOf("month"));
  useEffect(
    () => setBase(dayjs(selectedDate).startOf("month")),
    [selectedDate]
  );

  const start = base.startOf("month").startOf("week");
  const days = [];
  for (let i = 0; i < 42; i++) days.push(start.add(i, "day"));

  return (
    <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-3 w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setBase(base.subtract(1, "month"))}
          className="px-2 py-1 rounded bg-slate-800"
        >
          ◀
        </button>
        <div className="text-sm font-medium">{base.format("MMMM YYYY")}</div>
        <button
          onClick={() => setBase(base.add(1, "month"))}
          className="px-2 py-1 rounded bg-slate-800"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-slate-400 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={d + i} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const k = d.format("YYYY-MM-DD");
          const isCurrentMonth = d.month() === base.month();
          const isSelected = dayjs(selectedDate).isSame(d, "day");
          const plans = load(formatDateKey(d), {
            Morning: [],
            Afternoon: [],
            Evening: [],
          });
          const hasTasks =
            (plans.Morning?.length ||
              plans.Afternoon?.length ||
              plans.Evening?.length) > 0;

          return (
            <button
              key={k + i}
              onClick={() => setSelectedDate(d.toDate())}
              className={`p-2 rounded text-xs h-10 flex items-center justify-center flex-col ${
                isSelected
                  ? "bg-emerald-600 text-black"
                  : isCurrentMonth
                  ? "text-slate-200"
                  : "text-slate-500"
              } ${hasTasks ? "ring-1 ring-emerald-500/30" : ""}`}
            >
              <div>{d.date()}</div>
              {hasTasks && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Selected:{" "}
        <span className="font-medium">
          {dayjs(selectedDate).format("DD MMM YYYY")}
        </span>
      </div>
    </div>
  );
}

/* ------------------------ ParallaxScene (Realistic) ------------------------ */
function ParallaxScene({ timeOfDay = "day", conditionCode = 0 }) {
  const sunrise = timeOfDay === "sunrise";
  const sunset = timeOfDay === "sunset";
  const night = timeOfDay === "night";
  const skyTint = sunrise
    ? "rgba(255,180,80,0.08)"
    : sunset
    ? "rgba(255,120,80,0.08)"
    : night
    ? "rgba(10,15,30,0.24)"
    : "rgba(60,160,255,0.04)";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        style={{ background: skyTint }}
        className="absolute inset-0 mix-blend-screen"
      />

      <svg
        className="absolute left-0 bottom-0 w-[140%] h-full transform -translate-x-8 animate-move-slow"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mtnGrad" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="#0b1320"
              stopOpacity={night ? 1 : 0.85}
            />
            <stop offset="100%" stopColor="#051018" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <path
          d="M0 30 L10 18 L20 22 L30 10 L40 18 L50 8 L60 20 L70 14 L80 26 L90 12 L100 30 L100 40 L0 40 Z"
          fill="url(#mtnGrad)"
        />
      </svg>

      <svg
        className="absolute left-0 bottom-0 w-[120%] h-full transform -translate-x-2 animate-move-medium"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32 L12 20 L24 24 L36 14 L48 26 L60 16 L72 28 L84 18 L96 30 L100 34 L100 40 L0 40 Z"
          fill="#0f1b26"
          opacity={night ? 0.95 : 0.9}
        />
      </svg>
      {/* trees (foreground) */}
      <svg
        className="absolute left-0 bottom-0 w-[110%] h-full transform animate-move-fast"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#062018">
          <rect x="2" y="28" width="2" height="8" />
          <path d="M1 28 Q6 20 11 28 Z" />
          <rect x="12" y="28" width="2" height="8" />
          <path d="M11 28 Q16 20 21 28 Z" />
          <g transform="translate(30,0)">
            <rect x="2" y="28" width="2" height="8" />
            <path d="M1 28 Q6 20 11 28 Z" />
          </g>
          <g transform="translate(55,0)">
            <rect x="2" y="28" width="2" height="8" />
            <path d="M1 28 Q6 20 11 28 Z" />
          </g>
        </g>
      </svg>

      {/* river (foreground bottom) */}
      <svg
        className="absolute left-0 bottom-0 w-full h-24"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="riverGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e6fa0" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#043a5e" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <path
          d="M0 30 C20 26 30 34 50 30 C70 26 80 34 100 30 L100 40 L0 40 Z"
          fill="url(#riverGrad)"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="M0 30 C20 26 30 34 50 30 C70 26 80 34 100 30 L100 40 L0 40 Z; M0 30 C18 30 32 28 50 30 C68 32 82 28 100 30 L100 40 L0 40 Z; M0 30 C20 26 30 34 50 30 C70 26 80 34 100 30 L100 40 L0 40 Z"
          />
        </path>
      </svg>

      {/* clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 40"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#6b7c8a" opacity={0.2}>
            <ellipse
              cx="20"
              cy="8"
              rx="14"
              ry="6"
              className="animate-cloud-1"
            />
            <ellipse
              cx="60"
              cy="6"
              rx="16"
              ry="7"
              className="animate-cloud-2"
            />
            <ellipse
              cx="85"
              cy="10"
              rx="10"
              ry="5"
              className="animate-cloud-3"
            />
          </g>
        </svg>
      </div>

      <style>{`
        @keyframes move-slow { 0% { transform: translateX(0) } 50% { transform: translateX(-2%) } 100% { transform: translateX(0) } }
        @keyframes move-medium { 0% { transform: translateX(0) } 50% { transform: translateX(-4%) } 100% { transform: translateX(0) } }
        @keyframes move-fast { 0% { transform: translateX(0) } 50% { transform: translateX(-6%) } 100% { transform: translateX(0) } }
        .animate-move-slow { animation: move-slow 14s ease-in-out infinite; }
        .animate-move-medium { animation: move-medium 10s ease-in-out infinite; }
        .animate-move-fast { animation: move-fast 8s ease-in-out infinite; }
        @keyframes cloud1 { 0% { transform: translateX(0) } 100% { transform: translateX(-6%) } }
        .animate-cloud-1 { animation: cloud1 22s linear infinite; }
        .animate-cloud-2 { animation: cloud1 28s linear infinite; transform-origin: center; }
        .animate-cloud-3 { animation: cloud1 18s linear infinite; transform-origin: center; }
      `}</style>
    </div>
  );
}

/* -------------------------- tiny helper -------------------------- */
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* -------------------------- Weather helpers -------------------------- */
function mapCodeToAnimationName(code) {
  if (code === 0) return "sun";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "rain";
  if ([71, 73, 75].includes(code)) return "snow";
  if ([95].includes(code)) return "storm";
  return "sun";
}

/* -------------------------- WeatherCard (Ultra Realistic) -------------------------- */
function WeatherCard({
  cityInput,
  setCityInput,
  suggestions,
  onSelect,
  selectedCity,
  weatherData,
  lottieData,
  setWeatherStyle,
  weatherStyle,
  showSearch,
  setShowSearch,
}) {
  const [localInput, setLocalInput] = useState(cityInput || "");
  useEffect(() => setLocalInput(cityInput || ""), [cityInput]);

  const title = (() => {
    if (!selectedCity) return "—";
    if (typeof selectedCity === "string") return selectedCity;
    return `${selectedCity.name}${
      selectedCity.admin1 ? ", " + selectedCity.admin1 : ""
    }, ${selectedCity.country}`;
  })();

  const code = weatherData?.weather?.[0]?.code ?? 0;
  const condition = weatherData?.weather?.[0]?.main ?? "—";
  const temp = weatherData?.main?.temp ?? "—";
  const sunriseISO = weatherData?.meta?.sunrise;
  const sunsetISO = weatherData?.meta?.sunset;

  function timeOfDay() {
    try {
      const now = new Date();
      if (sunriseISO && sunsetISO) {
        const sunrise = new Date(sunriseISO).getHours();
        const sunset = new Date(sunsetISO).getHours();
        const h = now.getHours();
        if (h >= sunrise - 1 && h < sunrise + 2) return "sunrise";
        if (h >= sunrise + 2 && h < sunset - 1) return "day";
        if (h >= sunset - 1 && h < sunset + 2) return "sunset";
        return "night";
      } else {
        const h = now.getHours();
        if (h >= 5 && h < 8) return "sunrise";
        if (h >= 8 && h < 17) return "day";
        if (h >= 17 && h < 19) return "sunset";
        return "night";
      }
    } catch (e) {
      return "day";
    }
  }
  const tod = timeOfDay();
  const name = mapCodeToAnimationName(code);
  const finalAnim = tod === "night" ? "night" : name;
  const d =
    findLottieData(weatherStyle, finalAnim) ||
    findLottieData(weatherStyle, "sun");

  const bgTone =
    tod === "sunrise"
      ? "from-yellow-400/6 to-emerald-500/6"
      : tod === "day"
      ? "from-sky-400/6 to-emerald-500/6"
      : tod === "sunset"
      ? "from-orange-400/6 to-purple-600/6"
      : "from-slate-800/6 to-slate-900/6";

  const SetBtn = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded bg-emerald-500 text-black text-sm"
    >
      Set
    </button>
  );

  return (
    <div className={`relative rounded-lg overflow-hidden`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSearch((s) => !s)}
            className="p-2 bg-slate-800 rounded text-sm"
          >
            🔍
          </button>
          <div className="text-xs text-slate-300">{title}</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-400 mr-2">Style</div>
          <div className="flex items-center gap-1 bg-slate-800 rounded p-1">
            <button
              onClick={() => {
                setWeatherStyle("realistic");
                save("wd_weather_style", "realistic");
              }}
              className={`px-2 py-1 rounded text-xs ${
                weatherStyle === "realistic"
                  ? "bg-emerald-500 text-black"
                  : "text-slate-300"
              }`}
            >
              Realistic
            </button>
            <button
              onClick={() => {
                setWeatherStyle("anime");
                save("wd_weather_style", "anime");
              }}
              className={`px-2 py-1 rounded text-xs ${
                weatherStyle === "anime"
                  ? "bg-emerald-500 text-black"
                  : "text-slate-300"
              }`}
            >
              Anime
            </button>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                setCityInput(e.target.value);
              }}
              placeholder="Search city..."
              className="flex-1 bg-transparent border border-slate-800 px-3 py-2 rounded text-sm"
            />
            <SetBtn
              onClick={() => {
                if (suggestions && suggestions.length === 1)
                  onSelect(suggestions[0]);
              }}
            />
          </div>
          <div className="relative">
            <AnimatePresence>
              {suggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 max-h-40 overflow-auto scrollbar-thin bg-[#081018] border border-slate-800 rounded w-full z-50"
                >
                  {suggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => onSelect(s)}
                      className="p-2 hover:bg-slate-800 cursor-pointer text-sm flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">
                          {s.name}
                          {s.admin1 ? `, ${s.admin1}` : ""}
                        </div>
                        <div className="text-xs text-slate-400">
                          {s.country} • {s.latitude.toFixed(2)},{" "}
                          {s.longitude.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">Select</div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div
        className={`rounded-lg overflow-hidden border border-slate-800 ${
          "bg-gradient-to-br " + bgTone
        }`}
      >
        <div className="relative w-full h-44 md:h-52">
          <ParallaxScene timeOfDay={tod} conditionCode={code} />

          <div className="absolute inset-0">
            <AnimatePresence>
              {lottieData && (
                <motion.div
                  key={`${weatherStyle}-${
                    weatherData?.weather?.[0]?.code ?? "na"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Lottie
                    animationData={lottieData}
                    loop={true}
                    style={{ width: "100%", height: "100%" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="text-4xl font-semibold drop-shadow">
              {temp !== "—" ? Math.round(temp) + "°C" : "—"}
            </div>
            <div className="text-sm text-slate-200 mt-1">{condition}</div>
          </div>
        </div>

        <div className="p-3 bg-[#071119]">
          {weatherData ? (
            <div className="text-sm text-slate-300 space-y-1">
              <div>
                Humidity: {weatherData.main.humidity}% • Wind:{" "}
                {Math.round(weatherData.wind.speed)} m/s
              </div>
              <div>UV: {weatherData.meta?.uv ?? "—"}</div>
              <div>
                Sunrise:{" "}
                {weatherData.meta?.sunrise
                  ? new Date(weatherData.meta.sunrise).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}{" "}
                • Sunset:{" "}
                {weatherData.meta?.sunset
                  ? new Date(weatherData.meta?.sunset).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 mt-2">
              Weather not available (set API key & city).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* -------------------------- MAIN Planner Component -------------------------- */
export default function Planner() {
  // core data
  const [tasks, setTasks] = useState(() => load("wd_tasks", DEFAULT_TASKS));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [day, setDay] = useState(() =>
    load(formatDateKey(new Date()), { Morning: [], Afternoon: [], Evening: [] })
  );
  const [doneToday, setDoneToday] = useState(
    () => !!load("wd_done", {})[dayjs().format("YYYY-MM-DD")]
  );

  // UI state
  const [query, setQuery] = useState("");
  const [dragging, setDragging] = useState(false);
  const [activeDrop, setActiveDrop] = useState(null);

  // weather + city
  const [cityInput, setCityInput] = useState(
    () => load("wd_weather_city", null)?.name ?? ""
  );
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(() =>
    load("wd_weather_city", null)
  );
  const [weatherData, setWeatherData] = useState(null);

  // style toggle persisted
  const [weatherStyle, setWeatherStyle] = useState(() =>
    load("wd_weather_style", "realistic")
  );
  const [lottieData, setLottieData] = useState(null);

  // search hidden
  const [showSearch, setShowSearch] = useState(false);
  const geoDebounce = useRef(null);

  // pomodoro & other states
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(() =>
    load("wd_pom_seconds", 25 * 60)
  );
  const pomInterval = useRef(null);

  const [habits, setHabits] = useState(() =>
    load("wd_habits", { water: 0, meditate: false, reading: 0 })
  );
  const [focusTask, setFocusTask] = useState(
    () => localStorage.getItem("wd_focus_task") || ""
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const key = formatDateKey(selectedDate);
    const saved = load(key, { Morning: [], Afternoon: [], Evening: [] });
    setDay(saved);
  }, [selectedDate]);

  useEffect(() => {
    const key = formatDateKey(selectedDate);
    save(key, day);
  }, [day, selectedDate]);

  useEffect(() => {
    const anyPlanned = [...day.Morning, ...day.Afternoon, ...day.Evening].some(
      (t) => /gym|code/i.test(t)
    );
    if (anyPlanned && doneToday) {
      const all = load("wd_done", {});
      all[dayjs().format("YYYY-MM-DD")] = true;
      save("wd_done", all);
    }
  }, [day, doneToday]);

  useEffect(() => {
    console.log("Loaded Lottie files:", Object.keys(LOTTIE_MODULES));
  }, []);

  /* ------------------ geocoding suggestions (debounced) ------------------ */
  useEffect(() => {
    if (geoDebounce.current) clearTimeout(geoDebounce.current);
    if (!cityInput || cityInput.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }
    geoDebounce.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(cityInput.trim());
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=6`
        );
        const json = await res.json();
        if (!json || !json.results) {
          setCitySuggestions([]);
          return;
        }
        const mapped = json.results.map((r) => ({
          name: r.name,
          admin1: r.admin1 || "",
          country: r.country || "",
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        setCitySuggestions(mapped);
      } catch (err) {
        console.warn("geocode error", err);
        setCitySuggestions([]);
      }
    }, 300);
    return () => clearTimeout(geoDebounce.current);
  }, [cityInput]);

  /* ------------------ load weather for selectedCity and choose Lottie ------------------ */
  useEffect(() => {
    async function loadWeatherFor(lat, lon) {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset,uv_index_max&hourly=temperature_2m,apparent_temperature,weathercode&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();

        const mapped = {
          main: {
            temp: json.current_weather?.temperature ?? null,
            humidity:
              (json.hourly?.relativehumidity_2m &&
                json.hourly.relativehumidity_2m[0]) ||
              50,
          },
          wind: { speed: json.current_weather?.windspeed ?? 0 },
          weather: [
            {
              main: weatherCodeToMain(json.current_weather?.weathercode ?? 0),
              description: weatherCodeToDescription(
                json.current_weather?.weathercode ?? 0
              ),
              code: json.current_weather?.weathercode ?? 0,
            },
          ],
          meta: {
            sunrise: json.daily?.sunrise?.[0] ?? null,
            sunset: json.daily?.sunset?.[0] ?? null,
            uv: json.daily?.uv_index_max?.[0] ?? null,
            lat: json.latitude,
            lon: json.longitude,
          },
        };
        setWeatherData(mapped);

        const code = json.current_weather?.weathercode ?? 0;
        const name = mapCodeToAnimationName(code);
        const d =
          findLottieData(weatherStyle, tod === "night" ? "night" : name) ||
          findLottieData(weatherStyle, "sun");
        setLottieData(d || null);
      } catch (err) {
        console.warn("weather fetch failed", err);
        setWeatherData(null);
        setLottieData(null);
      }
    }

    if (
      selectedCity &&
      (selectedCity.latitude ||
        selectedCity.lat ||
        selectedCity.longitude ||
        selectedCity.lon)
    ) {
      const lat = selectedCity.latitude ?? selectedCity.lat;
      const lon = selectedCity.longitude ?? selectedCity.lon;
      loadWeatherFor(lat, lon);
      return;
    }

    if (typeof selectedCity === "string" && selectedCity.trim()) {
      (async () => {
        try {
          const q = encodeURIComponent(selectedCity.trim());
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1`
          );
          const json = await res.json();
          if (json && json.results && json.results[0]) {
            const r = json.results[0];
            const obj = {
              name: r.name,
              admin1: r.admin1 || "",
              country: r.country || "",
              latitude: r.latitude,
              longitude: r.longitude,
            };
            setSelectedCity(obj);
            save("wd_weather_city", obj);
            loadWeatherFor(r.latitude, r.longitude);
          } else {
            setWeatherData(null);
            setLottieData(null);
          }
        } catch (e) {
          setWeatherData(null);
          setLottieData(null);
        }
      })();
    } else {
      setWeatherData(null);
      setLottieData(null);
    }
  }, [selectedCity, weatherStyle]);
  /* ------------------ drag & drop & templates & queues ------------------ */
  const onDragStart = (e, task) => {
    e.dataTransfer.setData("text/plain", task);
    setDragging(true);
  };
  const onDragEnd = () => {
    setDragging(false);
    setActiveDrop(null);
  };
  const onDragOver = (slot) => (e) => {
    e.preventDefault();
    setActiveDrop(slot);
  };
  const onDrop = (slot) => (e) => {
    e.preventDefault();
    const task = e.dataTransfer.getData("text/plain");
    if (!task) return;
    const next = { ...day, [slot]: [...(day[slot] || []), task] };
    setDay(next);
    save(formatDateKey(selectedDate), next);
    setActiveDrop(null);
    setDragging(false);
    showToast("Added to " + slot);
  };

  const addTask = (t) => {
    if (!t || !t.trim()) return;
    const next = [...tasks, t.trim()];
    setTasks(next);
    save("wd_tasks", next);
    showToast("Template added");
  };
  const deleteTemplate = (idx) => {
    const next = [...tasks];
    next.splice(idx, 1);
    setTasks(next);
    save("wd_tasks", next);
    showToast("Template deleted");
  };
  const duplicateTemplate = (t) => addTask(t + " (copy)");
  const removeFrom = (slot, idx) => {
    const next = { ...day };
    next[slot].splice(idx, 1);
    setDay({ ...next });
    save(formatDateKey(selectedDate), { ...next });
    showToast("Removed");
  };

  const pushToStudyQueue = (task) => {
    const arr = JSON.parse(localStorage.getItem("wd_study_queue") || "[]");
    arr.push({ task, created: Date.now() });
    localStorage.setItem("wd_study_queue", JSON.stringify(arr));
    showToast("Added to Study queue");
  };
  const pushToGymQueue = (task) => {
    const arr = JSON.parse(localStorage.getItem("wd_gym_queue") || "[]");
    arr.push({ task, created: Date.now() });
    localStorage.setItem("wd_gym_queue", JSON.stringify(arr));
    showToast("Added to Gym queue");
  };

  const updateHabit = (k, v) => {
    const n = { ...habits, [k]: v };
    setHabits(n);
    save("wd_habits", n);
  };

  /* ------------------ filtered templates & success score ------------------ */
  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.toLowerCase().includes(q));
  }, [tasks, query]);

  const totalPlanned =
    (day.Morning?.length || 0) +
    (day.Afternoon?.length || 0) +
    (day.Evening?.length || 0);
  const streak = computeStreak(load("wd_done", {}));
  const successScore = (() => {
    const planned = totalPlanned;
    const pomSessions = load("wd_pom_sessions", 0) || 0;
    const s = Math.min(
      100,
      Math.round(planned * 2 + pomSessions * 3 + streak * 2 + habits.water)
    );
    return s;
  })();

  /* ------------------ Pomodoro ------------------ */
  useEffect(() => save("wd_pom_seconds", pomodoroSeconds), [pomodoroSeconds]);

  useEffect(() => {
    if (pomodoroRunning) {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = setInterval(() => {
        setPomodoroSeconds((s) => {
          if (s <= 1) {
            setPomodoroRunning(false);
            try {
              const beep = new Audio();
              beep.src =
                "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA";
              beep.play().catch(() => {});
            } catch (e) {}
            save("wd_pom_sessions", (load("wd_pom_sessions", 0) || 0) + 1);
            return 25 * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = null;
    }
    return () => {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = null;
    };
  }, [pomodoroRunning]);

  const fmtTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  function showToast(msg, t = 2200) {
    setToast(msg);
    setTimeout(() => setToast(null), t);
  }

  /* ------------------ RENDER ------------------ */
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Planner — Developer Mode</h1>
          <p className="text-sm text-slate-400">
            Dark green developer theme — focused, responsive.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Streak</div>
            <div className="text-lg font-medium">{streak} days</div>
          </div>
          <div className="w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${Math.min(100, Math.round((streak / 30) * 100))}%`,
              }}
            />
          </div>
          <div className="text-sm text-slate-300 ml-2">
            Score {successScore}/100
          </div>
        </div>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        <div className="min-w-0 lg:col-span-2">
          <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="flex-1 bg-transparent border border-slate-800 rounded px-3 py-2 placeholder:text-slate-500 text-sm min-w-0"
              />
              <AddTemplateInline onAdd={(t) => addTask(t)} />
              <div className="text-xs text-slate-500 hidden md:block">
                Templates: {tasks.length}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-auto scrollbar-thin mt-3">
              <AnimatePresence>
                {filteredTemplates.map((t, i) => (
                  <motion.div
                    key={t + i}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    draggable
                    onDragStart={(e) => onDragStart(e, t)}
                    onDragEnd={onDragEnd}
                    className="flex items-center justify-between gap-3 p-3 rounded-md border border-slate-800 bg-gradient-to-br from-[#081218] to-[#0b1116]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-lg">{taskEmoji(t)}</div>
                      <div className="text-sm truncate">{t}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => pushToStudyQueue(t)}
                        className="px-2 py-1 rounded bg-slate-800 text-xs"
                      >
                        Study
                      </button>
                      <button
                        onClick={() => pushToGymQueue(t)}
                        className="px-2 py-1 rounded bg-slate-800 text-xs"
                      >
                        Gym
                      </button>
                      <button
                        onClick={() => duplicateTemplate(t)}
                        className="px-2 py-1 rounded bg-slate-800 text-xs"
                      >
                        ⎘
                      </button>
                      <button
                        onClick={() => deleteTemplate(i)}
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs"
                      >
                        🗑
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => addTask(p.task)}
                  className="px-3 py-1 rounded bg-slate-800 text-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="min-w-0">
          <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4 min-h-[220px]">
            <WeatherCard
              cityInput={cityInput}
              setCityInput={setCityInput}
              suggestions={citySuggestions}
              onSelect={(c) => {
                setSelectedCity(c);
                save("wd_weather_city", c);
              }}
              selectedCity={selectedCity}
              weatherData={weatherData}
              lottieData={lottieData}
              setWeatherStyle={(s) => {
                setWeatherStyle(s);
                save("wd_weather_style", s);
              }}
              weatherStyle={weatherStyle}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
      </div>

      {/* Planner columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {SLOT_ORDER.map((slot) => {
          const isActive = activeDrop === slot && dragging;
          return (
            <div key={slot} className="min-w-0">
              <div
                className={`rounded-xl p-3 min-h-[320px] max-h-[420px] overflow-auto border border-slate-800 bg-[#071119] ${
                  isActive ? "ring-2 ring-emerald-400/25" : ""
                }`}
                onDragOver={onDragOver(slot)}
                onDrop={onDrop(slot)}
                onDragEnd={onDragEnd}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-slate-400">{slot}</div>
                    <div className="text-xs text-slate-500">
                      {(day[slot] || []).length} items
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const p = PRESETS[0];
                        const next = {
                          ...day,
                          [slot]: [...(day[slot] || []), p.task],
                        };
                        setDay(next);
                        save(formatDateKey(selectedDate), next);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 text-xs"
                    >
                      +Preset
                    </button>
                    <button
                      onClick={() => {
                        (day[slot] || []).forEach((t) => pushToStudyQueue(t));
                        showToast("Sent to Study queue");
                      }}
                      className="px-2 py-1 rounded bg-slate-800 text-xs"
                    >
                      →Study
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {(day[slot] || []).map((t, idx) => (
                      <motion.div
                        key={t + idx}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center justify-between p-2 rounded-md border border-slate-800 bg-[#081218]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-lg">{taskEmoji(t)}</div>
                          <div className="text-sm truncate">{t}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const idxSlot = SLOT_ORDER.indexOf(slot);
                              const nextSlot =
                                SLOT_ORDER[(idxSlot + 1) % SLOT_ORDER.length];
                              const next = { ...day };
                              next[slot].splice(idx, 1);
                              next[nextSlot] = [...next[nextSlot], t];
                              setDay(next);
                              save(formatDateKey(selectedDate), next);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 text-xs"
                          >
                            ➜
                          </button>
                          <button
                            onClick={() => removeFrom(slot, idx)}
                            className="px-2 py-1 rounded bg-red-600 text-white text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(day[slot] || []).length === 0 && (
                    <div className="text-sm text-slate-500 border border-dashed border-slate-800 rounded p-4">
                      Empty — drop a task here
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row: Pomodoro, Habits, Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-slate-400">Focus Mode</div>
              <div className="text-xs text-slate-500">
                One task. One session.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFocusTask("");
                  localStorage.removeItem("wd_focus_task");
                  showToast("Focus cleared");
                }}
                className="px-2 py-1 rounded bg-slate-800 text-xs"
              >
                Clear
              </button>
            </div>
          </div>

          <input
            value={focusTask}
            onChange={(e) => {
              setFocusTask(e.target.value);
              localStorage.setItem("wd_focus_task", e.target.value);
            }}
            placeholder="Today's focus..."
            className="w-full bg-transparent border border-slate-800 px-3 py-2 rounded mb-3 text-sm"
          />
          {focusTask && (
            <div className="text-sm text-slate-300 mb-3">
              Focus: <span className="font-medium">{focusTask}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-2xl font-mono">{fmtTime(pomodoroSeconds)}</div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => {
                  setPomodoroRunning(true);
                }}
                className="px-3 py-2 rounded bg-emerald-500 text-black"
              >
                Start
              </button>
              <button
                onClick={() => {
                  setPomodoroRunning(false);
                }}
                className="px-3 py-2 rounded bg-slate-800"
              >
                Stop
              </button>
              <button
                onClick={() => {
                  setPomodoroSeconds(25 * 60);
                  setPomodoroRunning(false);
                }}
                className="px-3 py-2 rounded bg-red-600 text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">Daily Habits</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">Water (glasses)</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateHabit("water", Math.max(0, habits.water - 1))
                  }
                  className="px-2 py-1 bg-slate-800 rounded"
                >
                  -
                </button>
                <div className="w-8 text-center">{habits.water}</div>
                <button
                  onClick={() => updateHabit("water", habits.water + 1)}
                  className="px-2 py-1 bg-slate-800 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Meditated</div>
              <input
                type="checkbox"
                checked={habits.meditate}
                onChange={(e) => updateHabit("meditate", e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Reading (min)</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateHabit("reading", Math.max(0, habits.reading - 5))
                  }
                  className="px-2 py-1 bg-slate-800 rounded"
                >
                  -
                </button>
                <div className="w-12 text-center">{habits.reading}</div>
                <button
                  onClick={() => updateHabit("reading", habits.reading + 5)}
                  className="px-2 py-1 bg-slate-800 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 text-sm text-slate-400">Success Score</div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${successScore}%` }}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  save("wd_pom_sessions", 0);
                  save("wd_done", {});
                  setToast("Progress reset");
                }}
                className="px-3 py-2 rounded bg-rose-600 text-white text-sm"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <a
              href="/study"
              className="px-3 py-2 rounded bg-slate-800 text-center"
            >
              Open Study Page
            </a>
            <a
              href="/gym"
              className="px-3 py-2 rounded bg-slate-800 text-center"
            >
              Open Gym Page
            </a>
            <button
              onClick={() => {
                const s = JSON.parse(
                  localStorage.getItem("wd_study_queue") || "[]"
                );
                const g = JSON.parse(
                  localStorage.getItem("wd_gym_queue") || "[]"
                );
                alert(`Study: ${s.length} • Gym: ${g.length}`);
              }}
              className="px-3 py-2 rounded bg-slate-800"
            >
              Preview Queues
            </button>
          </div>
        </div>
      </div>

      {/* Right-side calendar preview */}
      <div className="mt-6 flex gap-4">
        <MiniCalendar
          selectedDate={selectedDate}
          setSelectedDate={(d) => setSelectedDate(d)}
        />
        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4 flex-1">
          <div className="text-sm text-slate-400 mb-2">Selected day plan</div>
          <div className="space-y-2">
            {SLOT_ORDER.map((slot) => (
              <div
                key={slot}
                className="p-3 rounded bg-[#081218] border border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">{slot}</div>
                  <div className="text-xs text-slate-400">
                    {(day[slot] || []).length} items
                  </div>
                </div>
                <div className="space-y-1">
                  {(day[slot] || []).map((t, i) => (
                    <div
                      key={t + i}
                      className="flex items-center justify-between p-2 rounded bg-[#071019] border border-slate-800"
                    >
                      <div className="truncate">{t}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            removeFrom(slot, i);
                          }}
                          className="px-2 py-1 rounded bg-rose-600 text-white text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {(day[slot] || []).length === 0 && (
                    <div className="text-xs text-slate-500">No tasks</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed right-6 bottom-6 bg-slate-900 border border-slate-800 px-4 py-2 rounded shadow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------- AddTemplateInline --------------------- */
function AddTemplateInline({ onAdd }) {
  const [v, setV] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) {
          onAdd(v.trim());
          setV("");
        }
      }}
      className="flex gap-2 items-center"
    >
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Add new template..."
        className="bg-transparent border border-slate-800 px-3 py-2 rounded text-sm"
      />
      <button className="px-3 py-2 rounded bg-emerald-500 text-black text-sm">
        Add
      </button>
    </form>
  );
}
