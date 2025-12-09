// Planner.jsx — v2 with unified wd_planner object
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import dayjs from "dayjs";
import { syncToBackend } from "../utils/localStorage";

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

/* ------------------------- Lottie mapping helpers --------------------------*/
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

/* ------------------------- UI helpers --------------------------*/
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

const defaultHabits = {
  water: 0,
  meditate: false,
  reading: 0,
};

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

// NEW: internal key is simple YYYY-MM-DD, stored inside wd_planner.dayMap
function formatDateKey(d) {
  return dayjs(d).format("YYYY-MM-DD");
}

/* ------------------------- MiniCalendar --------------------------*/
function MiniCalendar({ selectedDate, setSelectedDate, dayMap }) {
  const [base, setBase] = useState(dayjs(selectedDate).startOf("month"));

  useEffect(() => {
    setBase(dayjs(selectedDate).startOf("month"));
  }, [selectedDate]);

  const start = base.startOf("month").startOf("week");
  const days = [];
  for (let i = 0; i < 42; i++) days.push(start.add(i, "day"));

  return (
    <div className="bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] border border-[#2F6B60]/40 rounded-xl p-3 w-full transition-colors">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setBase(base.subtract(1, "month"))}
          className="px-2 py-1 rounded border border-[#2F6B60]/40 text-xs text-[#9FF2E8] bg-black/20"
        >
          ◀
        </button>
        <div className="text-sm font-medium text-[#9FF2E8]">
          {base.format("MMMM YYYY")}
        </div>
        <button
          onClick={() => setBase(base.add(1, "month"))}
          className="px-2 py-1 rounded border border-[#2F6B60]/40 text-xs text-[#9FF2E8] bg-black/20"
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
          const k = formatDateKey(d);
          const isCurrentMonth = d.month() === base.month();
          const isSelected = dayjs(selectedDate).isSame(d, "day");

          const plans = dayMap?.[k] || {
            Morning: [],
            Afternoon: [],
            Evening: [],
          };
          const hasTasks =
            (plans.Morning?.length || 0) +
              (plans.Afternoon?.length || 0) +
              (plans.Evening?.length || 0) >
            0;

          const baseClasses =
            "relative p-2 rounded text-xs h-10 flex items-center justify-center flex-col transition-all cursor-pointer";
          const colorClasses = isSelected
            ? "bg-[#0A2B22] text-[#E8FFFA] ring-2 ring-[#3FA796] shadow-[0_0_10px_rgba(63,167,150,0.5)]"
            : isCurrentMonth
            ? "text-[#CDEEE8] hover:bg-black/25"
            : "text-[#7FAFA4]/60";

          return (
            <button
              key={`${k}-${i}`}
              onClick={() => setSelectedDate(d.toDate())}
              className={`${baseClasses} ${colorClasses}`}
            >
              {isSelected && (
                <span className="absolute inset-0 rounded-lg ring-2 ring-[#22c55e]/40 animate-pulse" />
              )}
              <div className="relative z-10">{d.date()}</div>
              {hasTasks && (
<<<<<<< HEAD
                <div className="relative z-10 w-1 h-1 rounded-full bg-[#4ADE80] mt-1 shadow-[0_0_6px_#4ADE80]" />
=======
                <div
                  className="relative z-10 w-1 h-1
                  rounded-full bg-[#4ADE80] mt-1 shadow-[0_0_6px_#4ADE80]"
                />
>>>>>>> 98f25d35669350584b6ca394cf6617959d442f33
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

/* ------------------------- WeatherCard --------------------------*/
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
  const [localInput, setLocalInput] = useState(cityInput);

  useEffect(() => {
    setLocalInput(cityInput);
  }, [cityInput]);

  const condition = weatherData?.weather?.[0]?.main ?? "";
  const temp = weatherData?.main?.temp ?? null;

  const title = (() => {
    if (!selectedCity) return "Select a city";
    if (typeof selectedCity === "string") return selectedCity;
    return `${selectedCity.name}${
      selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""
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
<<<<<<< HEAD
          <div className="max-h-40 overflow-auto border border-[#2F6B60]/40 rounded bg-black/40">
=======
          <div
            className="max-h-40 overflow-auto border
            border-[#2F6B60]/40 rounded bg-black/40
            "
          >
>>>>>>> 98f25d35669350584b6ca394cf6617959d442f33
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
                  {s.country} ({s.latitude?.toFixed(2)},{" "}
                  {s.longitude?.toFixed(2)})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

<<<<<<< HEAD
      <div className="relative rounded-xl overflow-hidden border border-[#2F6B60]/40 bg-black/20 h-[270px] bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]">
=======
      {/* Card visual */}
      <div
        className="relative rounded-xl overflow-hidden 
        border border-[#2F6B60]/40 bg-black/20 h-[270px]
        bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F]
        bg-gradient-to-br dark:from-[#0F1622] dark:via-[#132033] 
        dark:to-[#0A0F1C]"
      >
>>>>>>> 98f25d35669350584b6ca394cf6617959d442f33
        {/* Lottie background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          {lottieData && (
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        {/* Info panel */}
        <div className="relative z-20 p-6 flex flex-col items-center gap-2 mt-4">
          <div className="text-2xl font-medium text-[#E8FFFA] drop-shadow">
            {temp !== null ? `${Math.round(temp)}°C` : "--"}
          </div>
          <div className="text-sm text-[#9FF2E8]">{condition}</div>
        </div>

<<<<<<< HEAD
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#071119]/90 backdrop-blur-sm z-30 text-xs text-[#CDEEE8] grid grid-cols-2 gap-y-1">
          <div>Humidity: {weatherData?.main?.humidity ?? "--"}%</div>
=======
        {/* stats panel at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3
          bg-[#071119]/90 backdrop-blur-sm z-30 text-xs text-[#CDEEE8]
          grid grid-cols-2 gap-y-1
          "
        >
          <div>Humidity: {weatherData?.main?.humidity ?? "—"}%</div>
>>>>>>> 98f25d35669350584b6ca394cf6617959d442f33
          <div>Wind: {Math.round(weatherData?.wind?.speed ?? 0)} m/s</div>
          <div>UV: {weatherData?.meta?.uv ?? "--"}</div>
          <div>
            Sunrise:{" "}
            {weatherData?.meta?.sunrise
              ? dayjs(weatherData.meta.sunrise).format("h:mm A")
              : "--"}
          </div>
          <div>
            Sunset:{" "}
            {weatherData?.meta?.sunset
              ? dayjs(weatherData.meta.sunset).format("h:mm A")
              : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Main Planner --------------------------*/

export default function Planner({ dashboardState, updateDashboard }) {
  // === 1. Build local unified planner object from dashboardState ===
  const base = dashboardState?.wd_planner || {};

  const [planner, setPlanner] = useState(() => ({
    tasks: base.tasks || DEFAULT_TASKS,
    dayMap: base.dayMap || {},
    habits: base.habits || { ...defaultHabits },
    pomodoroSeconds:
      typeof base.pomodoroSeconds === "number" ? base.pomodoroSeconds : 25 * 60,
    focusTask: base.focusTask || "",
    weatherCityInput: base.weatherCityInput || "",
    weatherCity: base.weatherCity || null,
    weatherStyle: base.weatherStyle || "realistic",
    streak: base.streak || 0,
  }));

  // 🔥 Add THIS right below:
  useEffect(() => {
    // Save planner locally
    localStorage.setItem("wd_planner", JSON.stringify(planner));

    // Send update to backend
    if (typeof syncToBackend === "function") {
      syncToBackend();
    } else {
      console.warn("syncToBackend not found");
    }
  }, [planner]);

  // when dashboardState.wd_planner changes (other tab updated), resync
  useEffect(() => {
    if (!dashboardState?.wd_planner) return;
    const p = dashboardState.wd_planner;
    setPlanner((prev) => ({
      tasks: p.tasks || prev.tasks || DEFAULT_TASKS,
      dayMap: p.dayMap || prev.dayMap || {},
      habits: p.habits || prev.habits || { ...defaultHabits },
      pomodoroSeconds:
        typeof p.pomodoroSeconds === "number"
          ? p.pomodoroSeconds
          : prev.pomodoroSeconds,
      focusTask: p.focusTask ?? prev.focusTask,
      weatherCityInput: p.weatherCityInput ?? prev.weatherCityInput,
      weatherCity: p.weatherCity ?? prev.weatherCity,
      weatherStyle: p.weatherStyle || prev.weatherStyle || "realistic",
      streak: typeof p.streak === "number" ? p.streak : prev.streak,
    }));
  }, [dashboardState?.wd_planner]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [lottieData, setLottieData] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [dragging, setDragging] = useState(false);
  const [activeDrop, setActiveDrop] = useState(null);

  const geoDebounce = useRef(null);
  const pomInterval = useRef(null);
  const saveTimeoutRef = useRef(null);

  const dayKey = formatDateKey(selectedDate);
  const currentDay = planner.dayMap[dayKey] || {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  const cityInput = planner.weatherCityInput || "";
  const selectedCity = planner.weatherCity || null;
  const weatherStyle = planner.weatherStyle;

  const totalPlanned =
    (currentDay.Morning?.length || 0) +
    (currentDay.Afternoon?.length || 0) +
    (currentDay.Evening?.length || 0);

  // === 2. Derived template search ===
  const [query, setQuery] = useState("");
  const [inlineAdd, setInlineAdd] = useState("");

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return planner.tasks;
    return planner.tasks.filter((t) => t.toLowerCase().includes(q));
  }, [planner.tasks, query]);

  useEffect(() => {
    localStorage.setItem("wd_planner", JSON.stringify(planner));

    // trigger backend sync
    window.dispatchEvent(new Event("storage"));
  }, [planner]);

  // === 4. Pomodoro timer ===
  useEffect(() => {
    if (pomodoroRunning) {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = setInterval(() => {
        setPlanner((prev) => {
          const s = (prev.pomodoroSeconds || 0) - 1;
          if (s <= 0) {
            // reset + beep
            try {
              const beep = new Audio();
              beep.src =
                "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA";
              beep.play().catch(() => {});
            } catch {}
            return { ...prev, pomodoroSeconds: 25 * 60 };
          }
          return { ...prev, pomodoroSeconds: s };
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

  // === 5. Geocode suggestions ===
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
          `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=6`
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

  // === 6. Weather loading ===
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

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,sunrise,sunset,uv_index_max&timezone=auto`;

        const res = await fetch(url);
        const json = await res.json();

        const code =
          json.current?.weather_code ?? json.daily?.weather_code?.[0] ?? 0;
        const sunriseStr = json.daily?.sunrise?.[0];
        const sunsetStr = json.daily?.sunset?.[0];

        const sunriseH = sunriseStr ? new Date(sunriseStr).getHours() : 6;
        const sunsetH = sunsetStr ? new Date(sunsetStr).getHours() : 18;
        const h = new Date().getHours();

        let todLocal = "day";
        if (h < sunriseH - 1 || h > sunsetH + 2) todLocal = "night";

        const animName =
          todLocal === "night" ? "night" : mapCodeToAnimationName(code, style);
        const anim = LOTTIE[style]?.[animName] || LOTTIE[style]?.sun;

        setWeatherData({
          weather: [{ code, main: weatherCodeToMain(code) }],
          main: {
            temp: json.current?.temperature_2m ?? null,
            humidity: json.current?.relative_humidity_2m ?? 0,
          },
          wind: { speed: json.current?.wind_speed_10m ?? 0 },
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

  // === 7. Misc small effects ===
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!e.target || !e.target.closest) {
        setOpenMenuIndex(null);
        return;
      }
      const inside = e.target.closest("[data-hamburger-root]");
      if (!inside) setOpenMenuIndex(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const showToast = (msg, t = 2000) => {
    setToast(msg);
    if (t > 0) setTimeout(() => setToast(null), t);
  };

  // === 8. Planner mutations (all via setPlanner) ===
  const updateDay = (fn) => {
    setPlanner((prev) => {
      const map = { ...(prev.dayMap || {}) };
      const day = map[dayKey] || {
        Morning: [],
        Afternoon: [],
        Evening: [],
      };
      const newDay = fn({ ...day });
      map[dayKey] = newDay;
      return { ...prev, dayMap: map };
    });
  };

  const addTaskTemplate = (t) => {
    if (!t || !t.trim()) return;
    setPlanner((p) => ({ ...p, tasks: [...p.tasks, t.trim()] }));
    showToast("Template added");
  };

  const deleteTemplate = (idx) => {
    setPlanner((p) => {
      const next = [...p.tasks];
      next.splice(idx, 1);
      return { ...p, tasks: next };
    });
    showToast("Template deleted");
  };

  const duplicateTemplate = (t) => {
    addTaskTemplate(`${t} (copy)`);
  };

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
    updateDay((day) => {
      day[slot] = [...(day[slot] || []), task];
      return day;
    });
    setActiveDrop(null);
    setDragging(false);
    showToast(`Added to ${slot}`);
  };

  const removeFrom = (slot, idx) => {
    updateDay((day) => {
      const arr = [...(day[slot] || [])];
      arr.splice(idx, 1);
      day[slot] = arr;
      return day;
    });
    showToast("Removed");
  };

  const moveToNextSlot = (slot, idx) => {
    const idxSlot = SLOT_ORDER.indexOf(slot);
    const nextSlot = SLOT_ORDER[(idxSlot + 1) % SLOT_ORDER.length];
    updateDay((day) => {
      const fromArr = [...(day[slot] || [])];
      const t = fromArr[idx];
      fromArr.splice(idx, 1);
      const toArr = [...(day[nextSlot] || []), t];
      day[slot] = fromArr;
      day[nextSlot] = toArr;
      return day;
    });
    showToast(`Moved to ${nextSlot}`);
  };

  // === 9. Render ===
  const selectedWeatherMeta = {
    temp:
      weatherData?.main?.temp !== null && weatherData?.main?.temp !== undefined
        ? Math.round(weatherData.main.temp)
        : null,
    sunrise: weatherData?.meta?.sunrise || null,
    sunset: weatherData?.meta?.sunset || null,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto rounded-xl text-[#E8FFFA] bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] transition-colors duration-500 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#9FF2E8]">
            LifeOS Planner 2.0
          </h1>
          <p className="text-xs text-[#7FAFA4] mt-1">
            Drag templates → drop into slots → track focus, habits & weather.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-4 py-2 rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm text-xs sm:text-sm">
          <div>
            <div className="text-[11px] text-[#7FAFA4] uppercase">
              Planner Streak
            </div>
            <div className="text-lg font-medium">{planner.streak} days</div>
          </div>

          <div className="h-8 w-px bg-[#2F6B60]/40 hidden sm:block" />

          <div>
            <div className="text-[11px] text-[#7FAFA4] uppercase">Today</div>
            <div className="text-sm">{dayjs(liveTime).format("DD MMM")}</div>
          </div>
          <div>
            <div className="text-[11px] text-[#7FAFA4] uppercase">Time</div>
            <div className="text-sm font-semibold text-[#9FF2E8]">
              {dayjs(liveTime).format("hh:mm A")}
            </div>
          </div>

          <div className="h-8 w-px bg-[#2F6B60]/40 hidden sm:block" />

          {selectedCity && (
            <div className="max-w-[180px]">
              <div className="text-[11px] text-[#7FAFA4] uppercase">
                Location
              </div>
              <div className="text-sm truncate">
                {selectedCity.name}
                {selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""}
              </div>
              <div className="text-[11px] text-[#7FAFA4]">
                {selectedCity.country}
              </div>
            </div>
          )}

          {selectedWeatherMeta.temp !== null && (
            <div>
              <div className="text-[11px] text-[#7FAFA4] uppercase">Temp</div>
              <div className="text-base font-semibold text-[#9FF2E8]">
                {selectedWeatherMeta.temp}°C
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOP GRID: Templates + Slots */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,1.5fr] gap-4">
        {/* TEMPLATES PANEL */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm shadow-[0_0_12px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates..."
                className="flex-1 bg-black/30 border border-[#3FA796] rounded px-3 py-2 placeholder:text-[#7FAFA4] text-sm min-w-0"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inlineAdd.trim()) {
                    addTaskTemplate(inlineAdd.trim());
                    setInlineAdd("");
                  }
                }}
                className="flex gap-2 items-center"
              >
                <input
                  value={inlineAdd}
                  onChange={(e) => setInlineAdd(e.target.value)}
                  placeholder="Add new..."
                  className="bg-black/30 border border-[#3FA796] px-3 py-2 rounded text-sm"
                />
                <button className="px-3 py-2 rounded bg-[#0A2B22] text-[#E8FFFA] text-sm border border-[#3FA796] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
                  Add
                </button>
              </form>
            </div>
            <div className="text-xs text-[#7FAFA4] mt-1">
              {planner.tasks.length} templates • drag any card into a slot
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
              <AnimatePresence>
                {filteredTemplates.map((t, i) => (
                  <motion.div
                    key={`${t}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    draggable
                    onDragStart={(e) => onDragStart(e, t)}
                    onDragEnd={onDragEnd}
                    className="relative flex items-center justify-between gap-3 p-3 rounded-md border border-[#2F6B60]/30 bg-gradient-to-br from-[#081C18] to-[#0F0F0F] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition-all cursor-move"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="text-lg">{taskEmoji(t)}</div>
                      <div className="text-sm truncate">{t}</div>
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap mt-2 sm:mt-0">
                      <div className="hidden sm:flex items-center gap-2">
                        <button
                          onClick={() => duplicateTemplate(t)}
                          className="px-2 py-1 rounded bg-black/40 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteTemplate(i)}
                          className="px-2 py-1 rounded bg-[#7A1D2B] text-white text-xs hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="sm:hidden relative" data-hamburger-root>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuIndex(openMenuIndex === i ? null : i);
                          }}
                          className="px-2 py-1 rounded bg-black/40 border border-[#2F6B60]/40 text-xs"
                        >
                          ☰
                        </button>
                        <AnimatePresence>
                          {openMenuIndex === i && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="absolute right-0 mt-2 w-40 bg-[#0F0F0F] border border-[#2F6B60]/40 rounded shadow p-2 z-40"
                            >
                              <button
                                onClick={() => {
                                  duplicateTemplate(t);
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1 rounded hover:bg-[#071827]"
                              >
                                📋 Duplicate
                              </button>
                              <button
                                onClick={() => {
                                  deleteTemplate(i);
                                  setOpenMenuIndex(null);
                                }}
                                className="w-full text-left px-2 py-1 rounded text-[#FF8F8F] hover:bg-[#071827]"
                              >
                                🗑️ Delete
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
                onClick={() => addTaskTemplate("Gym Workout")}
                className="px-3 py-1 rounded bg-black/30 border text-sm border-[#2F6B60]/40 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
              >
                💪 Gym
              </button>
              <button
                onClick={() => addTaskTemplate("Code Focus Session")}
                className="px-3 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-sm hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
              >
                💻 Code
              </button>
              <button
                onClick={() => addTaskTemplate("DSA Practice")}
                className="px-3 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-sm hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
              >
                🧠 DSA
              </button>
            </div>
          </div>
        </div>

        {/* SLOTS PANEL */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {SLOT_ORDER.map((slot) => {
              const isActive = activeDrop === slot && dragging;
              const items = currentDay[slot] || [];
              return (
                <div key={slot} className="min-w-0">
                  <div
                    onDragOver={onDragOver(slot)}
                    onDrop={onDrop(slot)}
                    onDragEnd={onDragEnd}
                    className={`rounded-xl p-3 max-h-[360px] overflow-auto border border-[#2F6B60]/40 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition ${
                      isActive
                        ? "ring-2 ring-[#3FA796] shadow-[0_0_12px_rgba(63,167,150,0.5)]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm text-[#9FF2E8]">{slot}</div>
                        <div className="text-xs text-[#7FAFA4]">
                          {items.length} items
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const preset = "Gym Workout";
                          updateDay((day) => {
                            const arr = [...(day[slot] || []), preset];
                            day[slot] = arr;
                            return day;
                          });
                          showToast(`Added preset to ${slot}`);
                        }}
                        className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                      >
                        ➕ Preset
                      </button>
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence>
                        {items.map((t, idx) => (
                          <motion.div
                            key={`${t}-${idx}`}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="flex items-center justify-between p-2 rounded-md border border-[#2F6B60]/30 bg-black/20"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="text-lg">{taskEmoji(t)}</div>
                              <div className="text-sm truncate">{t}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveToNextSlot(slot, idx)}
                                className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                              >
                                ➡️
                              </button>
                              <button
                                onClick={() => removeFrom(slot, idx)}
                                className="px-2 py-1 rounded bg-[#7A1D2B] text-white text-xs hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
                              >
                                ✕
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {items.length === 0 && (
                        <div className="text-sm text-[#7FAFA4] border border-dashed border-[#2F6B60]/40 rounded p-4">
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
      </div>;

      {
        /* BOTTOM ROW: Focus + Habits + Quick links */
      }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Focus + Pomodoro */}
        <div className="rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[#9FF2E8]">Focus Mode</div>
              <div className="text-xs text-[#7FAFA4]">
                Choose one task and run a session.
              </div>
            </div>
            <button
              onClick={() => {
                setPlanner((p) => ({ ...p, focusTask: "" }));
                showToast("Focus cleared");
              }}
              className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
            >
              Clear
            </button>
          </div>

          <input
            value={planner.focusTask}
            onChange={(e) =>
              setPlanner((p) => ({ ...p, focusTask: e.target.value }))
            }
            placeholder="Today's focus..."
            className="w-full bg-black/30 border border-[#2F6B60]/40 px-3 py-2 rounded mb-3 text-sm"
          />

          {planner.focusTask && (
            <div className="text-sm text-[#CDEEE8] mb-3">
              Focus: <span className="font-medium">{planner.focusTask}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-2xl font-mono">
              {fmt(planner.pomodoroSeconds)}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setPomodoroRunning(true)}
                className="px-3 py-2 rounded bg-[#22C55E] text-black hover:shadow-[0_0_8px_rgba(34,197,94,0.6)] transition"
              >
                ▶
              </button>
              <button
                onClick={() => setPomodoroRunning(false)}
                className="px-3 py-2 rounded bg-black/30 border border-[#2F6B60]/40 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
              >
                ⏸
              </button>
              <button
                onClick={() => {
                  setPomodoroRunning(false);
                  setPlanner((p) => ({ ...p, pomodoroSeconds: 25 * 60 }));
                }}
                className="px-3 py-2 rounded bg-[#7A1D2B] text-white hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
              >
                ↻
              </button>
            </div>
          </div>
        </div>

        {/* Habits */}
        <div className="rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
          <div className="text-sm text-[#9FF2E8] mb-2">Daily Habits</div>
          <div className="space-y-3">
            {/* Water */}
            <div className="flex items-center justify-between">
              <div className="text-sm">💧 Water glasses</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPlanner((p) => ({
                      ...p,
                      habits: {
                        ...p.habits,
                        water: Math.max(0, (p.habits?.water || 0) - 1),
                      },
                    }))
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 rounded hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                >
                  −
                </button>
                <div className="w-8 text-center">
                  {planner.habits?.water ?? 0}
                </div>
                <button
                  onClick={() =>
                    setPlanner((p) => ({
                      ...p,
                      habits: {
                        ...p.habits,
                        water: (p.habits?.water || 0) + 1,
                      },
                    }))
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 rounded hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Meditate */}
            <div className="flex items-center justify-between">
              <div className="text-sm">🧘 Meditated</div>
              <input
                type="checkbox"
                checked={!!planner.habits?.meditate}
                onChange={(e) =>
                  setPlanner((p) => ({
                    ...p,
                    habits: {
                      ...p.habits,
                      meditate: e.target.checked,
                    },
                  }))
                }
              />
            </div>

            {/* Reading */}
            <div className="flex items-center justify-between">
              <div className="text-sm">📖 Reading (min)</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPlanner((p) => ({
                      ...p,
                      habits: {
                        ...p.habits,
                        reading: Math.max(0, (p.habits?.reading || 0) - 5),
                      },
                    }))
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 rounded hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                >
                  −
                </button>
                <div className="w-12 text-center">
                  {planner.habits?.reading ?? 0}
                </div>
                <button
                  onClick={() =>
                    setPlanner((p) => ({
                      ...p,
                      habits: {
                        ...p.habits,
                        reading: (p.habits?.reading || 0) + 5,
                      },
                    }))
                  }
                  className="px-2 py-1 bg-black/30 border border-[#2F6B60]/40 rounded hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 text-sm text-[#7FAFA4]">Success Bar</div>
          <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-[#2F6B60]/40">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] transition-all"
              style={{
                width: `${Math.min(100, (totalPlanned / 8) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
          <div className="text-sm text-[#9FF2E8] mb-2">Quick Links</div>
          <div className="flex flex-col gap-2">
            <a
              href="/syllabus"
              className="px-3 py-2 rounded bg-black/30 border border-[#2F6B60]/40 text-center text-sm hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
            >
              📚 Syllabus
            </a>
            <a
              href="/gym"
              className="px-3 py-2 rounded bg-black/30 border border-[#2F6B60]/40 text-center text-sm hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
            >
              💪 Gym
            </a>
            <a
              href="/projects"
              className="px-3 py-2 rounded bg-black/30 border border-[#2F6B60]/40 text-center text-sm hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
            >
              🚀 Projects
            </a>
          </div>
        </div>
      </div>;

      {/* CALENDAR + PREVIEW + WEATHER */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80">
          <MiniCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dayMap={planner.dayMap}
          />
        </div>
        {/* Day preview */}
        <div className="rounded-xl p-4 flex-1 border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
          <div className="text-sm text-[#9FF2E8] mb-2">
            {dayjs(selectedDate).format("DD MMM YYYY")} – summary
          </div>
          <div className="space-y-3 max-h-[260px] overflow-auto pr-2">
            {SLOT_ORDER.map((slot) => {
              const items = currentDay[slot] || [];
              return (
                <div
                  key={slot}
                  className="p-3 rounded bg-black/20 border border-[#2F6B60]/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#E8FFFA]">{slot}</div>
                    <div className="text-xs text-[#7FAFA4]">
                      {items.length} items
                    </div>
                  </div>

                  <div className="space-y-1">
                    {items.map((t, i) => (
                      <div
                        key={`${t}-${i}`}
                        className="flex items-center justify-between p-2 rounded border border-[#2F6B60]/40"
                      >
                        <div className="truncate text-sm">{t}</div>
                        <button
                          onClick={() => removeFrom(slot, i)}
                          className="px-2 py-1 rounded bg-[#7A1D2B] text-white text-xs hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="text-xs text-[#7FAFA4]">No tasks</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>;
        {
          /* Weather */
        }
        <div className="sm:w-full md:max-w-[260px] min-h-[320px]">
          <div className="rounded-xl p-4 min-h-[320px] h-full border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
            <WeatherCard
              cityInput={cityInput}
              setCityInput={(val) =>
                setPlanner((p) => ({ ...p, weatherCityInput: val }))
              }
              suggestions={suggestions}
              onSelect={(c) => {
                setPlanner((p) => ({ ...p, weatherCity: c }));
                setShowSearch(false);
              }}
              selectedCity={selectedCity}
              weatherData={weatherData}
              weatherStyle={weatherStyle}
              setWeatherStyle={(style) =>
                setPlanner((p) => ({ ...p, weatherStyle: style }))
              }
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              lottieData={lottieData}
            />
          </div>
        </div>;
        ;
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed right-6 bottom-6 bg-[#031715] border border-[#2F6B60]/40 px-4 py-2 rounded shadow text-[#E8FFFA] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
