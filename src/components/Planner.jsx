// Planner.jsx — Full feature version aligned with Calendar theme
// - Calendar light/dark colors
// - Templates LEFT, Morning/Afternoon/Evening RIGHT
// - Temp + Sunrise + Sunset in header
// - Weather Lottie more visible
// - Mini-calendar selection glow
// All original features preserved (drag/drop, pomodoro, habits, queues, etc.)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import dayjs from "dayjs";

/* Lottie imports - update paths if necessary */
import animeSun from "../assets/weather-lottie/anime/sun.json";
import animeCloudy from "../assets/weather-lottie/anime/cloudy.json";
import animeRain from "../assets/weather-lottie/anime/rain.json";
import animeNight from "../assets/weather-lottie/anime/night.json";
import realSun from "../assets/weather-lottie/realistic/sun.json";
import realCloudy from "../assets/weather-lottie/realistic/cloudy.json";
import realRain from "../assets/weather-lottie/realistic/rain.json";
import realSnow from "../assets/weather-lottie/realistic/snow.json";
import realFog from "../assets/weather-lottie/realistic/fog.json";
import realStorm from "../assets/weather-lottie/realistic/storm.json";

/* -------------------------
  small localStorage helpers
--------------------------*/
function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/* -------------------------
  Lottie mapping helpers
--------------------------*/
const LOTTIE = {
  anime: {
    sun: animeSun,
    cloudy: animeCloudy,
    rain: animeRain,
    night: animeNight,
  },
  realistic: {
    sun: realSun,
    cloudy: realCloudy,
    rain: realRain,
    snow: realSnow,
    fog: realFog,
    storm: realStorm,
    night: realCloudy,
  },
};

function mapCodeToAnimationName(code, style) {
  const isReal = style === "realistic";
  if (code === 0) return "sun";
  if ([1, 2, 3].includes(code)) return "cloudy";
  if ([45, 48].includes(code)) return isReal ? "fog" : "cloudy";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "rain";
  if ([71, 73, 75].includes(code)) return isReal ? "snow" : "cloudy";
  if (code === 95) return isReal ? "storm" : "rain";
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

/* -------------------------
  UI constants
--------------------------*/
const SLOT_ORDER = ["Morning", "Afternoon", "Evening"];
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

/* -------------------------
  MiniCalendar component
--------------------------*/
function MiniCalendar({ selectedDate, setSelectedDate }) {
  const [base, setBase] = useState(dayjs(selectedDate).startOf("month"));
  useEffect(
    () => setBase(dayjs(selectedDate).startOf("month")),
    [selectedDate],
  );

  const start = base.startOf("month").startOf("week");
  const days = [];
  for (let i = 0; i < 42; i++) days.push(start.add(i, "day"));

  return (
    <div
      className="
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
      bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
      border border-[#2F6B60]/40 rounded-xl p-3 w-full
      dark:border-gray-700 transition-colors
    "
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setBase(base.subtract(1, "month"))}
          className="px-2 py-1 rounded bg-transparent border
          border-[#2F6B60]/40 text-xs text-[#9FF2E8]"
        >
          ◀
        </button>
        <div className="text-sm font-medium text-[#9FF2E8]">
          {base.format("MMMM YYYY")}
        </div>
        <button
          onClick={() => setBase(base.add(1, "month"))}
          className="px-2 py-1 rounded bg-transparent
          border border-[#2F6B60]/40 text-xs text-[#9FF2E8]"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-[#7FAFA4] mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const k = d.format("YYYY-MM-DD");
          const isCurrentMonth = d.month() === base.month();
          const isSelected = dayjs(selectedDate).isSame(d, "day");

          const hasTasks = (() => {
            const plans = load(formatDateKey(d), {
              Morning: [],
              Afternoon: [],
              Evening: [],
            });
            return (
              (plans.Morning?.length || 0) +
                (plans.Afternoon?.length || 0) +
                (plans.Evening?.length || 0) >
              0
            );
          })();

          const baseClasses =
            "relative p-2 rounded text-xs h-10 flex items-center justify-center flex-col transition-all duration-200";

          const colorClasses = isSelected
            ? "bg-[#0A2B22] text-[#E8FFFA] ring-2 ring-[#3FA796] shadow-[0_0_10px_rgba(63,167,150,0.5)]"
            : isCurrentMonth
              ? "text-[#CDEEE8] hover:bg-black/20"
              : "text-[#7FAFA4]/60";

          return (
            <button
              key={k + i}
              onClick={() => setSelectedDate(d.toDate())}
              className={`${baseClasses} ${colorClasses}`}
            >
              {/* Today / selected glow */}
              {isSelected && (
                <span className="absolute inset-0 rounded-lg ring-2 ring-[#22c55e]/40 animate-[pulse_2s_infinite]" />
              )}

              <div className="relative z-10">{d.date()}</div>
              {hasTasks && (
                <div className="relative z-10 w-1 h-1
                  rounded-full bg-[#4ADE80] mt-1 shadow-[0_0_6px_#4ADE80]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-[#7FAFA4]">
        Selected:{" "}
        <span className="font-medium text-[#E8FFFA]">
          {dayjs(selectedDate).format("DD MMM YYYY")}
        </span>
      </div>
    </div>
  );
}

/* -------------------------
  WeatherCard component
--------------------------*/
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
  lottieData,
}) {
  const [localInput, setLocalInput] = useState(cityInput || "");
  useEffect(() => setLocalInput(cityInput || ""), [cityInput]);

  const code = weatherData?.weather?.[0]?.code ?? 0;
  const condition = weatherData?.weather?.[0]?.main ?? "—";
  const temp = weatherData?.main?.temp ?? "—";

  const title = (() => {
    if (!selectedCity) return "Select a city";
    if (typeof selectedCity === "string") return selectedCity;
    return `${selectedCity.name}${
      selectedCity.admin1 ? ", " + selectedCity.admin1 : ""
    }, ${selectedCity.country}`;
  })();

  return (
    <div className="w-full h-full relative">
      <div className="flex items-center justify-between mb-2 w-full">
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="px-2 py-1 rounded bg-transparent border border-[#2F6B60]/40 text-xs text-[#9FF2E8]"
        >
          🔍
        </button>
        <div className="text-sm text-[#CDEEE8] truncate">{title}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setWeatherStyle("realistic")}
            className={`px-3 py-1 text-xs rounded border ${
              weatherStyle === "realistic"
                ? "bg-[#0A2B22] text-[#E8FFFA] border-[#3FA796] shadow-[0_0_8px_rgba(63,167,150,0.5)]"
                : "bg-transparent text-[#CDEEE8] border-[#2F6B60]/40"
            }`}
          >
            Real
          </button>
          <button
            onClick={() => setWeatherStyle("anime")}
            className={`px-3 py-1 text-xs rounded border ${
              weatherStyle === "anime"
                ? "bg-[#071A2F] text-[#E8FFFA] border-[#60A5FA] shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                : "bg-transparent text-[#CDEEE8] border-[#2F6B60]/40"
            }`}
          >
            Anime
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-3">
          <input
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              setCityInput(e.target.value);
            }}
            placeholder="Search city..."
            className="w-full bg-black/20 border border-[#2F6B60]/40 rounded px-3 py-2 mb-2 text-sm text-[#E8FFFA] placeholder:text-[#7FAFA4]"
          />
          <div className="max-h-40 overflow-auto border
            border-[#2F6B60]/40 rounded bg-black/40
            ">
            {suggestions?.map((s, i) => (
              <div
                key={i}
                onClick={() => onSelect(s)}
                className="px-3 py-2 hover:bg-[#0F1622] cursor-pointer"
              >
                <div className="font-medium text-[#E8FFFA]">
                  {s.name}
                  {s.admin1 ? `, ${s.admin1}` : ""}
                </div>
                <div className="text-xs text-[#7FAFA4]">
                  {s.country} • {s.latitude?.toFixed(2)},
                  {s.longitude?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card visual */}
      <div className="relative rounded-xl overflow-hidden 
        border border-[#2F6B60]/40 bg-black/20 h-[270px]
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
        bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
        dark:to-[#0A0F1C]">
        {/* Lottie background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 0.7 }} // more visible animation
        >
          {lottieData && (
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        {/* Info panel at top (keep temp + condition here) */}
        <div className="relative z-20 p-6 flex flex-col items-center gap-2 mt-4">
          <div className="text-2xl font-medium text-[#E8FFFA] drop-shadow">
            {temp !== "—" ? Math.round(temp) + "°C" : "—"}
          </div>
          <div className="text-sm text-[#9FF2E8]">{condition}</div>
        </div>

        {/* stats panel at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3
          bg-[#071119]/90 backdrop-blur-sm z-30 text-xs text-[#CDEEE8]
          grid grid-cols-2 gap-y-1
          bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
          bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
          dark:to-[#0A0F1C]">
          <div>Humidity: {weatherData?.main?.humidity ?? "—"}%</div>
          <div>Wind: {Math.round(weatherData?.wind?.speed ?? 0)} m/s</div>
          <div>UV: {weatherData?.meta?.uv ?? "—"}</div>
          <div>
            Sunrise:{" "}
            {weatherData?.meta?.sunrise
              ? dayjs(weatherData.meta.sunrise).format("h:mm A")
              : "—"}
          </div>
          <div>
            Sunset:{" "}
            {weatherData?.meta?.sunset
              ? dayjs(weatherData.meta.sunset).format("h:mm A")
              : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
  Main Planner component
--------------------------*/
export default function Planner() {
  // states
  const [tasks, setTasks] = useState(() => load("wd_tasks", DEFAULT_TASKS));
  const [query, setQuery] = useState("");
  const [inlineAdd, setInlineAdd] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [day, setDay] = useState(() =>
    load(formatDateKey(new Date()), {
      Morning: [],
      Afternoon: [],
      Evening: [],
    }),
  );
  const [streak, setStreak] = useState(() => load("wd_streak", 0));

  // drag
  const [dragging, setDragging] = useState(false);
  const [activeDrop, setActiveDrop] = useState(null);

  // weather
  const [cityInput, setCityInput] = useState(() =>
    load("wd_weather_city_input", ""),
  );
  const [selectedCity, setSelectedCity] = useState(() =>
    load("wd_weather_city", null),
  );
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [lottieData, setLottieData] = useState(null);
  const [weatherStyle, setWeatherStyle] = useState(() =>
    load("wd_weather_style", "realistic"),
  );
  const [showSearch, setShowSearch] = useState(false);
  const geoDebounce = useRef(null);

  // pomodoro & habits
  const [pomodoroSeconds, setPomodoroSeconds] = useState(() =>
    load("wd_pom_seconds", 25 * 60),
  );
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const pomInterval = useRef(null);
  const [habits, setHabits] = useState(() =>
    load("wd_habits", { water: 0, meditate: false, reading: 0 }),
  );

  const [focusTask, setFocusTask] = useState(
    () => localStorage.getItem("wd_focus_task") || "",
  );
  const [toast, setToast] = useState(null);

  // hamburger menu state: index of open menu or null
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // derived
  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.toLowerCase().includes(q));
  }, [tasks, query]);

  const totalPlanned =
    (day.Morning?.length || 0) +
    (day.Afternoon?.length || 0) +
    (day.Evening?.length || 0);

  // effects
  useEffect(() => {
    const key = formatDateKey(selectedDate);
    const saved = load(key, { Morning: [], Afternoon: [], Evening: [] });
    setDay(saved);
  }, [selectedDate]);

  useEffect(() => {
    const key = formatDateKey(selectedDate);
    save(key, day);
  }, [day, selectedDate]);

  useEffect(() => save("wd_tasks", tasks), [tasks]);
  useEffect(() => save("wd_pom_seconds", pomodoroSeconds), [pomodoroSeconds]);

  useEffect(() => {
    if (pomodoroRunning) {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = setInterval(() => {
        setPomodoroSeconds((s) => {
          if (s <= 1) {
            setPomodoroRunning(false);
            save("wd_pom_sessions", (load("wd_pom_sessions", 0) || 0) + 1);
            try {
              const beep = new Audio();
              beep.src =
                "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA";
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

  useEffect(() => {
    save("wd_weather_style", weatherStyle);
  }, [weatherStyle]);

  // geocode suggestions
  useEffect(() => {
    if (geoDebounce.current) clearTimeout(geoDebounce.current);
    if (!cityInput || cityInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    geoDebounce.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(cityInput.trim());
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=6`,
        );
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

  // load weather for selectedCity
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

        const code =
          json.current_weather?.weathercode ??
          json.daily?.weather_code?.[0] ??
          0;
        const sunriseStr = json.daily?.sunrise?.[0];
        const sunsetStr = json.daily?.sunset?.[0];

        const sunriseH = sunriseStr ? new Date(sunriseStr).getHours() : 6;
        const sunsetH = sunsetStr ? new Date(sunsetStr).getHours() : 18;
        const h = new Date().getHours();
        let todLocal = "day";
        if (h >= sunriseH - 1 && h < sunriseH + 2) todLocal = "sunrise";
        else if (h >= sunriseH + 2 && h < sunsetH - 1) todLocal = "day";
        else if (h >= sunsetH - 1 && h < sunsetH + 2) todLocal = "sunset";
        else todLocal = "night";

        const animName =
          todLocal === "night" ? "night" : mapCodeToAnimationName(code, style);
        const anim =
          (LOTTIE[style] && LOTTIE[style][animName]) || LOTTIE[style].sun;

        setWeatherData({
          weather: [{ code, main: weatherCodeToMain(code) }],
          main: {
            temp: json.current_weather?.temperature ?? null,
            humidity:
              json.hourly?.relative_humidity_2m?.[0] ??
              json.current_weather?.relativehumidity ??
              0,
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

  // helpers & actions
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

  // close any open hamburger menu on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!e.target) return;
      if (!e.target.closest) {
        setOpenMenuIndex(null);
        return;
      }
      const inside = e.target.closest?.("[data-hamburger-root]");
      if (!inside) setOpenMenuIndex(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const selectedWeatherMeta = {
    temp:
      weatherData?.main?.temp !== null && weatherData?.main?.temp !== undefined
        ? Math.round(weatherData.main.temp)
        : null,
    sunrise: weatherData?.meta?.sunrise || null,
    sunset: weatherData?.meta?.sunset || null,
  };

  // render
  return (
    <div
      className="
      p-6 max-w-7xl mx-auto 
      rounded-xl
      text-[#E8FFFA]
      bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
      bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
      transition-colors duration-500
    "
    >
      {/* HEADER */}
      <div
        className="flex flex-col md:flex-row md:items-center
        md:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-[#9FF2E8]">
            Daily Auto Planner
          </h1>
        </div>

        {/* Right side: Streak + Weather mini summary */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {selectedWeatherMeta.temp !== null && (
            <div className="flex flex-wrap items-center gap-5 px-4 py-2 rounded-lg border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm text-xs sm:text-sm">
              <div className="text-right">
                <div className="text-xs text-[#7FAFA4]">Streak</div>
                <div className="text-lg font-medium text-[#E8FFFA]">
                  {streak} days
                </div>
              </div>
              {/* Date */}
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                  Date
                </div>
                <div className="text-sm font-medium text-[#E8FFFA]">
                  {dayjs(liveTime).format("DD MMM YYYY")}
                </div>
              </div>

              {/* Time */}
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                  Time
                </div>
                <div className="text-sm font-semibold text-[#9FF2E8]">
                  {dayjs(liveTime).format("hh:mm A")}
                </div>
              </div>

              {/* Location */}
              {selectedCity && (
                <div className="text-center max-w-[150px] truncate">
                  <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                    Location
                  </div>
                  <div className="text-sm text-[#E8FFFA] truncate">
                    {selectedCity.name}, {selectedCity.admin1}
                  </div>
                  <div className="text-[11px] text-[#7FAFA4]">
                    {selectedCity.country}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-8 w-px bg-[#2F6B60]/40 hidden sm:block" />

              {/* Temp */}
              {selectedWeatherMeta.temp !== null && (
                <div className="text-center">
                  <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                    Temp
                  </div>
                  <div className="text-base font-semibold text-[#9FF2E8]">
                    {selectedWeatherMeta.temp}°C
                  </div>
                </div>
              )}

              {/* Sunrise */}
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                  Sunrise
                </div>
                <div className="text-sm text-[#E8FFFA]">
                  {selectedWeatherMeta.sunrise
                    ? dayjs(selectedWeatherMeta.sunrise).format("h:mm A")
                    : "—"}
                </div>
              </div>

              {/* Sunset */}
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wide text-[#7FAFA4]">
                  Sunset
                </div>
                <div className="text-sm text-[#E8FFFA]">
                  {selectedWeatherMeta.sunset
                    ? dayjs(selectedWeatherMeta.sunset).format("h:mm A")
                    : "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN TOP LAYOUT — Templates LEFT,  Slots RIGHT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,1.5fr] gap-4 mb-6">
        {/* LEFT: Templates */}
        <div className="min-w-0 flex flex-col gap-4">
          <div
            className="
            bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
            bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]
            rounded-xl p-4
            border border-[#2F6B60]/40
            backdrop-blur-sm
            shadow-[0_0_12px_rgba(0,0,0,0.35)]            
            transition-all duration-200
            dark:border-gray-700 transition-colors
          "
          >
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="flex-1 bg-black/20 border border-[#3FA796] rounded px-3 
                py-2 placeholder:text-[#7FAFA4] text-sm min-w-0
                dark:border-gray-700 transition-colors
                bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] dark:to- 
                [#0A0F1C]"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inlineAdd.trim()) {
                    addTask(inlineAdd.trim());
                    setInlineAdd("");
                  }
                }}
                className="flex gap-2 items-center"
              >
                <input
                  value={inlineAdd}
                  onChange={(e) => setInlineAdd(e.target.value)}
                  placeholder="Add new..."
                  className="bg-black/20 border border-[#3FA796] px-3 py-2 
                  dark:border-gray-700 transition-colors rounded text-sm"
                />
                <button
                  className="px-3 py-2 rounded
                  bg-[#0A2B22]
                  bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033]                           dark:to-[#0A0F1C] dark:border-gray-700 transition-colors
                  text-[#E8FFFA] text-sm border
                  border-[#3FA796] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] 
                  transition"
                >
                  Add
                </button>
              </form>

              <div className="text-xs text-[#7FAFA4] hidden md:block">
                {tasks.length} templates
              </div>
            </div>

            <div
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h- 
             [440px] overflow-auto pr-2"
            >
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
                    className="relative flex flex-col sm:flex-row sm:items-center 
                justify-between gap-3 p-3 rounded-md border border-[#2F6B60]/30 
                    bg-gradient-to-br from-[#081C18] via-[#] to-[#0F0F0F]
                    bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033]                           dark:to-[#0A0F1C] dark:border-gray-700 transition-colors
                    hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                    dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                    transition-all duration-200"
                  >
                    {/* left: icon + text */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="text-lg">{taskEmoji(t)}</div>
                      <div className="text-sm truncate ">{t}</div>
                    </div>

                    {/* right: actions (hamburger on small widths) */}
                    <div
                      className="flex items-center gap-2
                      whitespace-nowrap mt-2 sm:mt-0"
                    >
                      {/* normal actions on medium+ widths */}
                      <div className="hidden sm:flex items-center gap-2">
                        <button
                          onClick={() => {
                            const arr = JSON.parse(
                              localStorage.getItem("wd_study_queue") || "[]",
                            );
                            arr.push({ task: t, created: Date.now() });
                            localStorage.setItem(
                              "wd_study_queue",
                              JSON.stringify(arr),
                            );
                            showToast("Added to Study queue");
                          }}
                          className="px-2 py-1 rounded bg-black/20 border
                          border-[#2F6B60]/40 text-xs
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors"
                        >
                          Study
                        </button>
                        <button
                          onClick={() => {
                            const arr = JSON.parse(
                              localStorage.getItem("wd_gym_queue") || "[]",
                            );
                            arr.push({ task: t, created: Date.now() });
                            localStorage.setItem(
                              "wd_gym_queue",
                              JSON.stringify(arr),
                            );
                            showToast("Added to Gym queue");
                          }}
                          className="px-2 py-1 rounded bg-black/20
                          border border-[#2F6B60]/40 text-xs
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors"
                        >
                          Gym
                        </button>
                        <button
                          onClick={() => duplicateTemplate(t)}
                          className="
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors
                          px-2 py-1 rounded bg-black/20
                          border border-[#2F6B60]/40 text-xs"
                        >
                          ⎘
                        </button>
                        <button
                          onClick={() => deleteTemplate(i)}
                          className="
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          px-2 py-1 rounded bg-[#7A1D2B] text-white text-xs"
                        >
                          🗑
                        </button>
                      </div>

                      {/* hamburger (⋮) visible on small screens */}
                      <div className="lg:hidden relative" data-hamburger-root>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuIndex(openMenuIndex === i ? null : i);
                          }}
                          className="
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors                   
                          px-2 py-1 rounded bg-black/20
                          border border-[#2F6B60]/40 text-xs"
                        >
                          ⋮
                        </button>

                        <AnimatePresence>
                          {openMenuIndex === i && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="absolute right-0 mt-2 w-40
                              bg-[#0F0F0F] border border-[#2F6B60]/40
                              rounded shadow p-2 z-40"
                            >
                              <button
                                onClick={() => {
                                  const arr = JSON.parse(
                                    localStorage.getItem("wd_study_queue") ||
                                      "[]",
                                  );
                                  arr.push({ task: t, created: Date.now() });
                                  localStorage.setItem(
                                    "wd_study_queue",
                                    JSON.stringify(arr),
                                  );
                                  showToast("Added to Study queue");
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1
                                rounded hover:bg-[#071827]"
                              >
                                Study
                              </button>
                              <button
                                onClick={() => {
                                  const arr = JSON.parse(
                                    localStorage.getItem("wd_gym_queue") ||
                                      "[]",
                                  );
                                  arr.push({ task: t, created: Date.now() });
                                  localStorage.setItem(
                                    "wd_gym_queue",
                                    JSON.stringify(arr),
                                  );
                                  showToast("Added to Gym queue");
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1
                                rounded hover:bg-[#071827]"
                              >
                                Gym
                              </button>
                              <button
                                onClick={() => {
                                  duplicateTemplate(t);
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1
                                rounded hover:bg-[#071827]"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => {
                                  deleteTemplate(i);
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1
                                rounded text-[#FF8F8F] hover:bg-[#071827]"
                              >
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => addTask("Gym: Workout")}
                className="px-3 py-1 rounded bg-black/30 
                border text-sm border-[#2F6B60]/40
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                dark:border-gray-700 transition-colors"
              >
                Gym
              </button>
              <button
                onClick={() => addTask("Code: Focus Session")}
                className="px-3 py-1 rounded bg-black/30
                border border-[#2F6B60]/40 text-sm
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                dark:border-gray-700 transition-colors"
              >
                Code
              </button>
              <button
                onClick={() => addTask("DSA Practice")}
                className="px-3 py-1 rounded bg-black/30
                border border-[#2F6B60]/40 text-sm
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                dark:border-gray-700 transition-colors"
              >
                DSA
              </button>
            </div>
          </div>
        </div>

        {/* Planner Slots */}
        <div className="min-w-0 flex flex-col gap-4">
          {/* PLANNER COLUMNS (Morning / Afternoon / Evening) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-full ">
            {SLOT_ORDER.map((slot) => {
              const isActive = activeDrop === slot && dragging;
              return (
                <div key={slot} className="min-w-0">
                  <div
                    onDragOver={onDragOver(slot)}
                    onDrop={onDrop(slot)}
                    onDragEnd={onDragEnd}
                    className={`rounded-xl p-3 min-h-full max-h-[360px]
                    overflow-auto border border-[#2F6B60]/40
                    bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
                    bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
                    dark:to-[#0A0F1C]
                    hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                    dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                    transition-all duration-200
                    dark:border-gray-700 transition-colors
             ${
               isActive
                 ? "ring-2 ring-[#3FA796] shadow-[0_0_12px_rgba(63,167,150,0.5)]"
                 : ""
             }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm text-[#9FF2E8]">{slot}</div>
                        <div className="text-xs text-[#7FAFA4]">
                          {(day[slot] || []).length} items
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const p = "Gym: Workout";
                            const next = {
                              ...day,
                              [slot]: [...(day[slot] || []), p],
                            };
                            setDay(next);
                            save(formatDateKey(selectedDate), next);
                            showToast(`Added ${p}`);
                          }}
                          className="px-2 py-1 rounded bg-black/30
                          border border-[#2F6B60]/40 text-xs
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors"
                        >
                          +Preset
                        </button>
                        <button
                          onClick={() => {
                            (day[slot] || []).forEach((t) => {
                              const arr = JSON.parse(
                                localStorage.getItem("wd_study_queue") || "[]",
                              );
                              arr.push({ task: t, created: Date.now() });
                              localStorage.setItem(
                                "wd_study_queue",
                                JSON.stringify(arr),
                              );
                            });
                            showToast("Sent to Study queue");
                          }}
                          className="px-2 py-1 rounded bg-black/30
                          border
                          border-[#2F6B60]/40
                          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                          transition-all duration-200
                          dark:border-gray-700 transition-colors
                          text-xs"
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
                            className="flex items-center 
                            justify-between p-2 rounded-md
                            border border-[#2F6B60]/30                            
                            transition-all duration-200
                            dark:border-gray-700 transition-colors
                            "
                          >
                            <div
                              className="flex items-center gap-3 min-w-0
                              "
                            >
                              <div className="text-lg">{taskEmoji(t)}</div>
                              <div className="text-sm truncate">{t}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveToNextSlot(slot, idx)}
                                className="px-2 py-1 rounded bg-black/30
                                border border-[#2F6B60]/40 text-xs
                                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                                transition-all duration-200
                                dark:border-gray-700 transition-colors"
                              >
                                ➜
                              </button>
                              <button
                                onClick={() => removeFrom(slot, idx)}
                                className="px-2 py-1 rounded bg-[#7A1D2B]
                                text-white text-xs
                                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                                transition-all duration-200
                                dark:border-gray-700 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {(day[slot] || []).length === 0 && (
                        <div
                          className="text-sm text-[#7FAFA4]
                          border border-dashed border-[#2F6B60]/40 rounded p-4
                          dark:border-gray-700"
                        >
                          Empty — drop a task here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6
        "
      >
        {/* Pomodoro */}
        <div
          className="
          bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
          bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
          dark:to-[#0A0F1C]
          border border-[#2F6B60]/40 rounded-xl p-4
          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
          transition-all duration-200
          dark:border-gray-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[#9FF2E8]">Focus Mode</div>
              <div className="text-xs text-[#7FAFA4]">
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
                className="px-2 py-1 rounded bg-black/30 
                border border-[#2F6B60]/40 text-xs
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                dark:border-gray-700 transition-colors"
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
            className="w-full bg-black/20 border border-[#2F6B60]/40 
            px-3 py-2 rounded mb-3 text-sm
            transition-all duration-200
            dark:border-gray-700 transition-colors"
          />
          {focusTask && (
            <div className="text-sm text-[#CDEEE8] mb-3">
              Focus: <span className="font-medium">{focusTask}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-2xl font-mono">{fmt(pomodoroSeconds)}</div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setPomodoroRunning(true)}
                className="px-3 py-2 rounded bg-[#22C55E] text-black
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                transition-colors"
              >
                Start
              </button>
              <button
                onClick={() => setPomodoroRunning(false)}
                className="px-3 py-2 rounded bg-black/30 border
                border-[#2F6B60]/40
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                transition-all duration-200
                dark:border-gray-700 transition-colors"
              >
                Stop
              </button>
              <button
                onClick={() => {
                  setPomodoroSeconds(25 * 60);
                  setPomodoroRunning(false);
                }}
                className="px-3 py-2 rounded bg-[#7A1D2B] text-white
                hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                dark:hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                transition-all duration-200
                transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Habits */}
        <div
          className="
          bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
          bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
          dark:to-[#0A0F1C]
          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
          transition-all duration-200
          dark:border-gray-700 transition-colors
          border border-[#2F6B60]/40 rounded-xl p-4
          
        "
        >
          <div className="text-sm text-[#9FF2E8] mb-2">Daily Habits</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm">Water (glasses)</div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <button
                  onClick={() =>
                    setHabits({
                      ...habits,
                      water: Math.max(0, habits.water - 1),
                    })
                  }
                  className="px-2 py-1 bg-black/30
                  border border-[#2F6B60]/40 rounded
                  hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                  dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                  transition-all duration-200
                  dark:border-gray-700 transition-colors"
                >
                  -
                </button>
                <div className="w-8 text-center">{habits.water}</div>
                <button
                  onClick={() =>
                    setHabits({ ...habits, water: habits.water + 1 })
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 
                  hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                  dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                  transition-all duration-200
                  dark:border-gray-700 transition-colors rounded"
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
                onChange={(e) =>
                  setHabits({ ...habits, meditate: e.target.checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Reading (min)</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setHabits({
                      ...habits,
                      reading: Math.max(0, habits.reading - 5),
                    })
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 
                  hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                  dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                  transition-all duration-200
                  dark:border-gray-700 transition-colors rounded"
                >
                  -
                </button>
                <div className="w-12 text-center">{habits.reading}</div>
                <button
                  onClick={() =>
                    setHabits({ ...habits, reading: habits.reading + 5 })
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 
                  hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
                  dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
                  transition-all duration-200
                  dark:border-gray-700 transition-colors rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 text-sm text-[#7FAFA4]">Success Score</div>
            <div
              className="w-full bg-black/30 rounded-full h-2
              overflow-hidden border border-[#2F6B60]/40
              transition-all duration-200
              dark:border-gray-700 transition-colors"
            >
              <div
                className="h-2 rounded-full
                bg-gradient-to-r from-[#4ADE80] to-[#22C55E] transition-all
                "
                style={{ width: `${Math.min(100, totalPlanned * 8)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="
          bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
          bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
          dark:to-[#0A0F1C]
          border border-[#2F6B60]/40 rounded-xl p-4
          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
          transition-all duration-200
          dark:border-gray-700 transition-colors
        "
        >
          <div className="text-sm text-[#9FF2E8] mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <a
              href="/study"
              className="px-3 py-2 rounded bg-black/30 border
              border-[#2F6B60]/40 text-center text-sm 
              hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
              dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
              transition-all duration-200
              dark:border-gray-700 transition-colors"
            >
              Open Study Page
            </a>
            <a
              href="/gym"
              className="px-3 py-2 rounded bg-black/30 border
              border-[#2F6B60]/40 text-center text-sm
              hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
              dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
              transition-all duration-200
              dark:border-gray-700 transition-colors"
            >
              Open Gym Page
            </a>
            <button
              onClick={() => {
                const s = JSON.parse(
                  localStorage.getItem("wd_study_queue") || "[]",
                );
                const g = JSON.parse(
                  localStorage.getItem("wd_gym_queue") || "[]",
                );
                showToast(`Study: ${s.length} • Gym: ${g.length}`);
              }}
              className="px-3 py-2 rounded bg-black/30 border 
              border-[#2F6B60]/40 text-sm
              hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
              dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
              transition-all duration-200
              dark:border-gray-700 transition-colors"
            >
              Preview Queues
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR + DAY PREVIEW */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div
          className="w-full lg:w-80 
          "
        >
          <MiniCalendar
            selectedDate={selectedDate}
            setSelectedDate={(d) => setSelectedDate(d)}
          />
        </div>

        <div
          className="
          bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
          bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
          dark:to-[#0A0F1C]
          border border-[#2F6B60]/40 rounded-xl p-4 flex-1
          hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
          dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
          transition-all duration-200
          dark:border-gray-700 transition-colors
        "
        >
          <div className="text-sm text-[#9FF2E8] mb-2">Selected day plan</div>
          <div
            className="space-y-3 max-h-[260px] overflow-auto pr-2
            "
          >
            {SLOT_ORDER.map((slot) => (
              <div
                key={slot}
                className="p-3 rounded bg-black/20 border border-[#2F6B60]/40                      dark:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-[#E8FFFA]">{slot}</div>
                  <div className="text-xs text-[#7FAFA4]">
                    {(day[slot] || []).length} items
                  </div>
                </div>

                <div className="space-y-1">
                  {(day[slot] || []).map((t, i) => (
                    <div
                      key={t + i}
                      className="flex items-center
                      justify-between p-2 rounded border
                      border-[#2F6B60]/40                      
                      transition-all duration-200
                      dark:border-gray-700 transition-colors
                      dark:bg-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]"
                    >
                      <div className="truncate text-sm">{t}</div>
                      <button
                        onClick={() => removeFrom(slot, i)}
                        className="px-2 py-1 rounded bg-[#7A1D2B]
                        text-white text-xs
                        hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]                
                        transition-all duration-200
                        transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(day[slot] || []).length === 0 && (
                    <div className="text-xs text-[#7FAFA4]">No tasks</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEATHER */}
        <div className="sm:w-full md:max-w-[240px] min-h-[320px]">
          <div
            className="
            bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
            bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
            dark:to-[#0A0F1C]
              border border-[#2F6B60]/40
              rounded-xl p-4 min-h-[320px] h-full
              hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
              dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
              transition-all duration-200
              dark:border-gray-700 transition-colors
            "
          >
            <WeatherCard
              cityInput={cityInput}
              setCityInput={setCityInput}
              suggestions={suggestions}
              onSelect={(c) => {
                setSelectedCity(c);
                save("wd_weather_city", c);
              }}
              selectedCity={selectedCity}
              weatherData={weatherData}
              weatherStyle={weatherStyle}
              setWeatherStyle={setWeatherStyle}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              lottieData={lottieData}
            />
          </div>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed right-6 bottom-6 bg-[#031715] border
            border-[#2F6B60]/40 px-4 py-2 rounded shadow text-[#E8FFFA]
            hover:shadow-[0_0_8px_rgba(214,30,54,0.6)]
            dark:hover:shadow-[0_0_8px_rgba(63,167,150,0.6)]
            transition-all duration-200
            dark:border-gray-700 transition-colors"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
