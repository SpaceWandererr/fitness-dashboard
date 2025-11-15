// src/components/Planner.jsx
// Full cleaned & rebuilt Planner component (Option A)

// ----- imports -----
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import dayjs from "dayjs";
import { load, save } from "../utils/localStorage.js";
import "../styles/animations.css"; // optional; keep if exists

// ----- Direct Lottie JSON imports (adjust paths if necessary) -----
// Anime
import animeSun from "../assets/weather-lottie/anime/sun.json";
import animeCloudy from "../assets/weather-lottie/anime/cloudy.json";
import animeRain from "../assets/weather-lottie/anime/rain.json";
import animeWinter from "../assets/weather-lottie/anime/winter.json";
import animeNight from "../assets/weather-lottie/anime/night.json";
// Realistic
import realSun from "../assets/weather-lottie/realistic/sun.json";
import realCloudy from "../assets/weather-lottie/realistic/cloudy.json";
import realRain from "../assets/weather-lottie/realistic/rain.json";
import realSnow from "../assets/weather-lottie/realistic/snow.json";
import realFog from "../assets/weather-lottie/realistic/fog.json";
import realStorm from "../assets/weather-lottie/realistic/storm.json";

// ----- LOTTIE source object -----
const LOTTIE = {
  anime: {
    sun: animeSun,
    cloudy: animeCloudy,
    rain: animeRain,
    winter: animeWinter,
    night: animeNight,
  },
  realistic: {
    sun: realSun,
    cloudy: realCloudy,
    rain: realRain,
    snow: realSnow,
    fog: realFog,
    storm: realStorm,
    // fallbacks
    night: realCloudy,
    winter: realSnow,
  },
};

// ----- constants & helpers -----
const SLOT_ORDER = ["Morning", "Afternoon", "Evening"];
const PRESETS = [
  { label: "Gym", task: "Gym: Workout" },
  { label: "Code", task: "Code: Focus Session" },
  { label: "DSA", task: "DSA Practice" },
  { label: "Meal", task: "Meal Prep" },
  { label: "Walk", task: "Walk 30m" },
];

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

const QUOTES = [
  "Consistency beats intensity — Win daily.",
  "Ship small, ship often.",
  "Systems > Goals.",
  "Learn. Build. Repeat.",
  "Discipline shapes destiny.",
];

function fmt(seconds) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function taskEmoji(t) {
  if (/gym/i.test(t)) return "💪";
  if (/code|react|js|dsa/i.test(t)) return "💻";
  if (/walk|step/i.test(t)) return "🚶";
  if (/meal/i.test(t)) return "🍱";
  return "•";
}

function formatDateKey(d) {
  return `wd_plan_day_${dayjs(d).format("YYYY-MM-DD")}`;
}

function mapCodeToAnimationName(code, style) {
  const isRealistic = style === "realistic";

  if (code === 0) return "sun";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return isRealistic ? "fog" : "cloudy";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "rain";
  if ([71, 73, 75].includes(code)) return isRealistic ? "snow" : "winter";
  if (code === 95) return isRealistic ? "storm" : "rain";
  return "sun";
}

function weatherCodeToMain(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if (code === 95) return "Thunderstorm";
  return "Weather";
}

function quoteOfTheDay() {
  const seed = dayjs().format("YYYY-MM-DD");
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  return QUOTES[s % QUOTES.length];
}

// ----- MiniCalendar component (self-contained) -----
function MiniCalendar({ selectedDate, setSelectedDate }) {
  const [base, setBase] = useState(dayjs(selectedDate).startOf("month"));
  useEffect(() => setBase(dayjs(selectedDate).startOf("month")), [selectedDate]);

  const start = base.startOf("month").startOf("week");
  const days = [];
  for (let i = 0; i < 42; i++) days.push(start.add(i, "day"));

  return (
    <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-3 w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setBase(base.subtract(1, "month"))} className="px-2 py-1 rounded bg-slate-800">◀</button>
        <div className="text-sm font-medium">{base.format("MMMM YYYY")}</div>
        <button onClick={() => setBase(base.add(1, "month"))} className="px-2 py-1 rounded bg-slate-800">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-slate-400 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const k = d.format("YYYY-MM-DD");
          const isCurrentMonth = d.month() === base.month();
          const isSelected = dayjs(selectedDate).isSame(d, "day");
          const plans = load(formatDateKey(d), { Morning: [], Afternoon: [], Evening: [] });
          const hasTasks = (plans.Morning?.length || plans.Afternoon?.length || plans.Evening?.length) > 0;

          return (
            <button
              key={k + i}
              onClick={() => setSelectedDate(d.toDate())}
              className={`p-2 rounded text-xs h-10 flex items-center justify-center flex-col ${isSelected ? "bg-emerald-600 text-black" : isCurrentMonth ? "text-slate-200" : "text-slate-500"} ${hasTasks ? "ring-1 ring-emerald-500/30" : ""}`}
            >
              <div>{d.date()}</div>
              {hasTasks && <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1" />}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-slate-400">
        Selected: <span className="font-medium">{dayjs(selectedDate).format("DD MMM YYYY")}</span>
      </div>
    </div>
  );
}

// ----- WeatherCard (uses LOTTIE object) -----
function WeatherCard({
  cityInput,
  setCityInput,
  suggestions,
  onSelect,
  selectedCity,
  weatherData,
  weatherStyle,
  setWeatherStyle,
  showSearch,
  setShowSearch,
}) {
  const [localInput, setLocalInput] = useState(cityInput || "");
  useEffect(() => setLocalInput(cityInput || ""), [cityInput]);

  const code = weatherData?.weather?.[0]?.code ?? 0;
  const condition = weatherData?.weather?.[0]?.main ?? "—";
  const temp = weatherData?.main?.temp ?? "—";
  const sunriseISO = weatherData?.meta?.sunrise;
  const sunsetISO = weatherData?.meta?.sunset;

  function computeTOD() {
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
    } catch {
      return "day";
    }
  }

  const tod = computeTOD();

  const animName = tod === "night" ? "night" : mapCodeToAnimationName(code, weatherStyle);
  const animationData = LOTTIE[weatherStyle][animName] || LOTTIE[weatherStyle].sun;

  const title = (() => {
    if (!selectedCity) return "—";
    if (typeof selectedCity === "string") return selectedCity;
    return `${selectedCity.name}${selectedCity.admin1 ? ", " + selectedCity.admin1 : ""}, ${selectedCity.country}`;
  })();

  return (
    <div className="relative w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setShowSearch((s) => !s)} className="px-2 py-1 rounded bg-slate-800 text-xs">🔍</button>
        <div className="text-sm text-slate-200 truncate">{title}</div>
        <div className="flex gap-2">
          <button onClick={() => setWeatherStyle("realistic")} className={`px-3 py-1 text-xs rounded ${weatherStyle === "realistic" ? "bg-emerald-500 text-black" : "bg-slate-800"}`}>Realistic</button>
          <button onClick={() => setWeatherStyle("anime")} className={`px-3 py-1 text-xs rounded ${weatherStyle === "anime" ? "bg-emerald-500 text-black" : "bg-slate-800"}`}>Anime</button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-3">
          <input value={localInput} onChange={(e) => { setLocalInput(e.target.value); setCityInput(e.target.value); }} placeholder="Search city..." className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 mb-2" />
          <div className="max-h-40 overflow-auto border border-slate-700 rounded">
            {suggestions?.map((s, i) => (
              <div key={i} onClick={() => onSelect(s)} className="px-3 py-2 hover:bg-slate-800 cursor-pointer">
                <div className="font-medium">{s.name}{s.admin1 ? `, ${s.admin1}` : ""}</div>
                <div className="text-xs text-slate-400">{s.country} • {s.latitude?.toFixed(2)}, {s.longitude?.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative bg-[#0f1923] border border-slate-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Parallax SVG + background optional - keep simple */}
          <div style={{ background: "linear-gradient(180deg,#071018,#072028)" }} className="absolute inset-0" />
        </div>

        {/* Lottie */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-100">
          <Lottie animationData={animationData} loop autoplay style={{ width: "100%", height: "100%" }} />
        </div>

        {/* Text overlay */}
        <div className="relative z-30 p-4 text-center">
          <div className="text-4xl font-semibold">{temp !== "—" ? Math.round(temp) + "°C" : "—"}</div>
          <div className="text-sm text-slate-300 mt-1">{condition}</div>
        </div>

        <div className="p-3 bg-[#071119] relative z-30 text-xs text-slate-300">
          <div>Humidity: {weatherData?.main?.humidity ?? "—"}% • Wind: {Math.round(weatherData?.wind?.speed ?? 0)} m/s</div>
          <div>UV: {weatherData?.meta?.uv ?? "—"}</div>
          <div>Sunrise: {sunriseISO ? dayjs(sunriseISO).format("hh:mm A") : "—"} • Sunset: {sunsetISO ? dayjs(sunsetISO).format("hh:mm A") : "—"}</div>
        </div>
      </div>
    </div>
  );
}

// ----- Main Planner component (clean rebuilt) -----
export default function Planner() {
  // ---------- Storage & states ----------
  const [tasks, setTasks] = useState(() => load("wd_tasks", DEFAULT_TASKS));
  const [query, setQuery] = useState("");
  const [inlineAdd, setInlineAdd] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [day, setDay] = useState(() => load(formatDateKey(new Date()), { Morning: [], Afternoon: [], Evening: [] }));

  const [streak, setStreak] = useState(() => load("wd_streak", 0));
  const [successScore, setSuccessScore] = useState(0);

  // Drag & planner UI
  const [dragging, setDragging] = useState(false);
  const [activeDrop, setActiveDrop] = useState(null);

  // Weather states
  const [cityInput, setCityInput] = useState(() => load("wd_weather_city_input", ""));
  const [selectedCity, setSelectedCity] = useState(() => load("wd_weather_city", null));
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [lottieData, setLottieData] = useState(null);
  const [weatherStyle, setWeatherStyle] = useState(() => load("wd_weather_style", "realistic"));
  const [showSearch, setShowSearch] = useState(false);
  const geoDebounce = useRef(null);

  // Pomodoro
  const [pomodoroSeconds, setPomodoroSeconds] = useState(() => load("wd_pom_seconds", 25 * 60));
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const pomInterval = useRef(null);

  // Habits
  const [habits, setHabits] = useState(() => load("wd_habits", { water: 0, meditate: false, reading: 0 }));

  // Focus & queues & toast
  const [focusTask, setFocusTask] = useState(() => localStorage.getItem("wd_focus_task") || "");
  const [toast, setToast] = useState(null);

  // Derived / memoized
  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.toLowerCase().includes(q));
  }, [tasks, query]);

  const totalPlanned = (day.Morning?.length || 0) + (day.Afternoon?.length || 0) + (day.Evening?.length || 0);

  // ---------- Effects ----------

  // Persist day when selectedDate changes
  useEffect(() => {
    const key = formatDateKey(selectedDate);
    const saved = load(key, { Morning: [], Afternoon: [], Evening: [] });
    setDay(saved);
  }, [selectedDate]);

  // Save day plan whenever it changes
  useEffect(() => {
    const key = formatDateKey(selectedDate);
    save(key, day);
  }, [day, selectedDate]);

  // Save tasks
  useEffect(() => save("wd_tasks", tasks), [tasks]);

  // Save pomodoro
  useEffect(() => save("wd_pom_seconds", pomodoroSeconds), [pomodoroSeconds]);

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroRunning) {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = setInterval(() => {
        setPomodoroSeconds((s) => {
          if (s <= 1) {
            setPomodoroRunning(false);
            save("wd_pom_sessions", (load("wd_pom_sessions", 0) || 0) + 1);
            // small beep
            try {
              const beep = new Audio();
              beep.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA";
              beep.play().catch(() => {});
            } catch {}
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

  // Save style
  useEffect(() => {
    save("wd_weather_style", weatherStyle);
  }, [weatherStyle]);

  // Geocoding debounce for suggestions
  useEffect(() => {
    if (geoDebounce.current) clearTimeout(geoDebounce.current);
    if (!cityInput || cityInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    geoDebounce.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(cityInput.trim());
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=6`);
        const json = await res.json();
        if (!json || !json.results) {
          setSuggestions([]);
          return;
        }
        const mapped = json.results.map((r) => ({
          name: r.name,
          admin1: r.admin1 || "",
          country: r.country || "",
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        setSuggestions(mapped);
      } catch (err) {
        console.warn("geocode error", err);
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(geoDebounce.current);
  }, [cityInput]);

  // Load weather whenever selectedCity or style changes
  useEffect(() => {
    async function loadWeatherForCity(city, style) {
      if (!city) {
        setWeatherData(null);
        setLottieData(null);
        return;
      }
      try {
        const lat = city.latitude ?? city.lat;
        const lon = city.longitude ?? city.lon;
        if (!lat || !lon) {
          setWeatherData(null);
          setLottieData(null);
          return;
        }
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weather_code,sunrise,sunset,uv_index_max&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();

        const code = json.current_weather?.weathercode ?? (json.daily?.weather_code?.[0] ?? 0);

        // compute TOD
        const now = new Date();
        const sunriseStr = json.daily?.sunrise?.[0];
        const sunsetStr = json.daily?.sunset?.[0];
        const sunriseH = sunriseStr ? new Date(sunriseStr).getHours() : 6;
        const sunsetH = sunsetStr ? new Date(sunsetStr).getHours() : 18;
        const h = now.getHours();
        let todLocal = "day";
        if (h >= sunriseH - 1 && h < sunriseH + 2) todLocal = "sunrise";
        else if (h >= sunriseH + 2 && h < sunsetH - 1) todLocal = "day";
        else if (h >= sunsetH - 1 && h < sunsetH + 2) todLocal = "sunset";
        else todLocal = "night";

        const animName = todLocal === "night" ? "night" : mapCodeToAnimationName(code, style);
        const anim = LOTTIE[style][animName] || LOTTIE[style].sun;

        setWeatherData({
          weather: [{ code, main: weatherCodeToMain(code) }],
          main: {
            temp: json.current_weather?.temperature ?? null,
            humidity: json.hourly?.relative_humidity_2m?.[0] ?? json.current_weather?.relativehumidity ?? 0,
          },
          wind: { speed: json.current_weather?.windspeed ?? 0 },
          meta: {
            sunrise: sunriseStr,
            sunset: sunsetStr,
            uv: json.daily?.uv_index_max?.[0] ?? null,
          },
        });

        setLottieData(anim);
      } catch (e) {
        console.warn("weather fetch failed", e);
        setWeatherData(null);
        setLottieData(null);
      }
    }

    loadWeatherForCity(selectedCity, weatherStyle);
  }, [selectedCity, weatherStyle]);

  // ---------- helpers ----------
  const showToast = (msg, t = 2000) => {
    setToast(msg);
    if (t > 0) setTimeout(() => setToast(null), t);
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

  // Drag & Drop handlers
  const onDragStart = (e, task) => {
    try {
      e.dataTransfer.setData("text/plain", task);
    } catch {}
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
    showToast(`Added to ${slot}`);
  };

  const removeFrom = (slot, idx) => {
    const next = { ...day };
    if (!Array.isArray(next[slot])) next[slot] = [];
    next[slot].splice(idx, 1);
    setDay({ ...next });
    save(formatDateKey(selectedDate), { ...next });
    showToast("Removed");
  };

  const moveToNextSlot = (slot, idx) => {
    const idxSlot = SLOT_ORDER.indexOf(slot);
    const nextSlot = SLOT_ORDER[(idxSlot + 1) % SLOT_ORDER.length];
    const next = { ...day };
    if (!Array.isArray(next[slot])) next[slot] = [];
    const t = next[slot][idx];
    next[slot].splice(idx, 1);
    next[nextSlot] = [...(next[nextSlot] || []), t];
    setDay(next);
    save(formatDateKey(selectedDate), next);
    showToast(`Moved to ${nextSlot}`);
  };

  // ---------- UI derived ----------
  const streakDisplay = streak;
  const successScoreValue = Math.min(100, Math.round(totalPlanned * 2 + (load("wd_pom_sessions", 0) || 0) * 3 + streak * 2 + (habits.water || 0)));

  // ---------- render ----------
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Planner — Developer Mode</h1>
          <p className="text-sm text-slate-400">Dark green developer theme — focused, responsive.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Streak</div>
            <div className="text-lg font-medium">{streakDisplay} days</div>
          </div>

          <div className="w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, Math.round((streakDisplay / 30) * 100))}%` }} />
          </div>

          <div className="text-sm text-slate-300 ml-2">Score {successScoreValue}/100</div>
        </div>
      </div>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {/* TEMPLATES */}
        <div className="min-w-0 lg:col-span-2">
          <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates..." className="flex-1 bg-transparent border border-slate-800 rounded px-3 py-2 placeholder:text-slate-500 text-sm min-w-0" />

              <form onSubmit={(e) => { e.preventDefault(); if (inlineAdd.trim()) { addTask(inlineAdd.trim()); setInlineAdd(""); } }} className="flex gap-2 items-center">
                <input value={inlineAdd} onChange={(e) => setInlineAdd(e.target.value)} placeholder="Add new..." className="bg-transparent border border-slate-800 px-3 py-2 rounded text-sm" />
                <button className="px-3 py-2 rounded bg-emerald-500 text-black text-sm">Add</button>
              </form>

              <div className="text-xs text-slate-500 hidden md:block">{tasks.length} templates</div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-auto scrollbar-thin">
              <AnimatePresence>
                {filteredTemplates.map((t, i) => (
                  <motion.div key={t + i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} draggable onDragStart={(e) => onDragStart(e, t)} onDragEnd={onDragEnd} className="flex items-center justify-between gap-3 p-3 rounded-md border border-slate-800 bg-gradient-to-br from-[#081218] to-[#0b1116]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-lg">{taskEmoji(t)}</div>
                      <div className="text-sm truncate">{t}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => pushToStudyQueue(t)} className="px-2 py-1 rounded bg-slate-800 text-xs">Study</button>
                      <button onClick={() => pushToGymQueue(t)} className="px-2 py-1 rounded bg-slate-800 text-xs">Gym</button>
                      <button onClick={() => duplicateTemplate(t)} className="px-2 py-1 rounded bg-slate-800 text-xs">⎘</button>
                      <button onClick={() => deleteTemplate(i)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">🗑</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => addTask(p.task)} className="px-3 py-1 rounded bg-slate-800 text-sm">{p.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* WEATHER */}
        <div className="min-w-0">
          <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4 min-h-[220px]">
            <WeatherCard
              cityInput={cityInput}
              setCityInput={setCityInput}
              suggestions={suggestions}
              onSelect={(c) => { setSelectedCity(c); save("wd_weather_city", c); }}
              selectedCity={selectedCity}
              weatherData={weatherData}
              weatherStyle={weatherStyle}
              setWeatherStyle={setWeatherStyle}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
      </div>

      {/* PLANNER COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {SLOT_ORDER.map((slot) => {
          const isActive = activeDrop === slot && dragging;
          return (
            <div key={slot} className="min-w-0">
              <div className={`rounded-xl p-3 min-h-[320px] max-h-[420px] overflow-auto border border-slate-800 bg-[#071119] ${isActive ? "ring-2 ring-emerald-400/25" : ""}`} onDragOver={onDragOver(slot)} onDrop={onDrop(slot)} onDragEnd={onDragEnd}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-slate-400">{slot}</div>
                    <div className="text-xs text-slate-500">{(day[slot] || []).length} items</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { const p = PRESETS[0]; const next = { ...day, [slot]: [...(day[slot] || []), p.task] }; setDay(next); save(formatDateKey(selectedDate), next); showToast(`Added ${p.task}`); }} className="px-2 py-1 rounded bg-slate-800 text-xs">+Preset</button>
                    <button onClick={() => { (day[slot] || []).forEach((t) => pushToStudyQueue(t)); showToast("Sent to Study queue"); }} className="px-2 py-1 rounded bg-slate-800 text-xs">→Study</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {(day[slot] || []).map((t, idx) => (
                      <motion.div key={t + idx} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-between p-2 rounded-md border border-slate-800 bg-[#081218]">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-lg">{taskEmoji(t)}</div>
                          <div className="text-sm truncate">{t}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => moveToNextSlot(slot, idx)} className="px-2 py-1 rounded bg-slate-800 text-xs">➜</button>
                          <button onClick={() => removeFrom(slot, idx)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">✕</button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {(day[slot] || []).length === 0 && <div className="text-sm text-slate-500 border border-dashed border-slate-800 rounded p-4">Empty — drop a task here</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pomodoro */}
        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-slate-400">Focus Mode</div>
              <div className="text-xs text-slate-500">One task. One session.</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setFocusTask(""); localStorage.removeItem("wd_focus_task"); showToast("Focus cleared"); }} className="px-2 py-1 rounded bg-slate-800 text-xs">Clear</button>
            </div>
          </div>

          <input value={focusTask} onChange={(e) => { setFocusTask(e.target.value); localStorage.setItem("wd_focus_task", e.target.value); }} placeholder="Today's focus..." className="w-full bg-transparent border border-slate-800 px-3 py-2 rounded mb-3 text-sm" />
          {focusTask && <div className="text-sm text-slate-300 mb-3">Focus: <span className="font-medium">{focusTask}</span></div>}

          <div className="flex items-center gap-2">
            <div className="text-2xl font-mono">{fmt(pomodoroSeconds)}</div>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setPomodoroRunning(true)} className="px-3 py-2 rounded bg-emerald-500 text-black">Start</button>
              <button onClick={() => setPomodoroRunning(false)} className="px-3 py-2 rounded bg-slate-800">Stop</button>
              <button onClick={() => { setPomodoroSeconds(25 * 60); setPomodoroRunning(false); }} className="px-3 py-2 rounded bg-red-600 text-white">Reset</button>
            </div>
          </div>
        </div>

        {/* Habits */}
        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">Daily Habits</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">Water (glasses)</div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateHabit("water", Math.max(0, habits.water - 1))} className="px-2 py-1 bg-slate-800 rounded">-</button>
                <div className="w-8 text-center">{habits.water}</div>
                <button onClick={() => updateHabit("water", habits.water + 1)} className="px-2 py-1 bg-slate-800 rounded">+</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Meditated</div>
              <input type="checkbox" checked={habits.meditate} onChange={(e) => updateHabit("meditate", e.target.checked)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Reading (min)</div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateHabit("reading", Math.max(0, habits.reading - 5))} className="px-2 py-1 bg-slate-800 rounded">-</button>
                <div className="w-12 text-center">{habits.reading}</div>
                <button onClick={() => updateHabit("reading", habits.reading + 5)} className="px-2 py-1 bg-slate-800 rounded">+</button>
              </div>
            </div>

            <div className="pt-2 text-sm text-slate-400">Success Score</div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${successScoreValue}%` }} />
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={() => { save("wd_pom_sessions", 0); save("wd_done", {}); showToast("Progress reset"); }} className="px-3 py-2 rounded bg-rose-600 text-white text-sm">Reset Progress</button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <a href="/study" className="px-3 py-2 rounded bg-slate-800 text-center">Open Study Page</a>
            <a href="/gym" className="px-3 py-2 rounded bg-slate-800 text-center">Open Gym Page</a>
            <button onClick={() => { const s = JSON.parse(localStorage.getItem("wd_study_queue") || "[]"); const g = JSON.parse(localStorage.getItem("wd_gym_queue") || "[]"); showToast(`Study: ${s.length} • Gym: ${g.length}`); }} className="px-3 py-2 rounded bg-slate-800">Preview Queues</button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE CALENDAR AND PREVIEW */}
      <div className="mt-6 flex gap-4">
        <MiniCalendar selectedDate={selectedDate} setSelectedDate={(d) => setSelectedDate(d)} />

        <div className="bg-[#0f1923] border border-slate-800 rounded-xl p-4 flex-1">
          <div className="text-sm text-slate-400 mb-2">Selected day plan</div>
          <div className="space-y-2">
            {SLOT_ORDER.map((slot) => (
              <div key={slot} className="p-3 rounded bg-[#081218] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">{slot}</div>
                  <div className="text-xs text-slate-400">{(day[slot] || []).length} items</div>
                </div>

                <div className="space-y-1">
                  {(day[slot] || []).map((t, i) => (
                    <div key={t + i} className="flex items-center justify-between p-2 rounded bg-[#071019] border border-slate-800">
                      <div className="truncate">{t}</div>
                      <div className="flex gap-2">
                        <button onClick={() => removeFrom(slot, i)} className="px-2 py-1 rounded bg-rose-600 text-white text-xs">Remove</button>
                      </div>
                    </div>
                  ))}

                  {(day[slot] || []).length === 0 && <div className="text-xs text-slate-500">No tasks</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="fixed right-6 bottom-6 bg-slate-900 border border-slate-800 px-4 py-2 rounded shadow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
