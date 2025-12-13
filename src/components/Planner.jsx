// Planner.jsx — COMPLETE VERSION with all sections + fixed infinite loop + CSS animations
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

/* ------------------------- Weather Animation Components --------------------------*/
function WeatherAnimation({ condition, isNight }) {
  if (condition === "Clear") {
    return isNight ? <MoonAnimation /> : <SunAnimation />;
  }
  if (condition === "Cloudy") {
    return <CloudyAnimation />;
  }
  if (condition === "Rain" || condition === "Drizzle") {
    return <RainAnimation />;
  }
  if (condition === "Snow") {
    return <SnowAnimation />;
  }
  if (condition === "Thunderstorm") {
    return <ThunderstormAnimation />;
  }
  if (condition === "Fog") {
    return <FogAnimation />;
  }
  return <SunAnimation />;
}

function SunAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Sun */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_60px_rgba(251,191,36,0.8)] animate-pulse" />
        {/* Rays */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-yellow-400/80 to-transparent origin-bottom animate-sunray"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MoonAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-[0_0_40px_rgba(203,213,225,0.6)]" />
        {/* Craters */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-300/40" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-slate-300/30" />
        <div className="absolute top-8 right-6 w-2 h-2 rounded-full bg-slate-300/50" />
      </div>
      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function CloudyAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-cloud"
          style={{
            top: `${30 + i * 20}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        >
          <div className="relative">
            <div className="w-16 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full" />
            <div className="absolute -top-2 left-4 w-12 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full" />
            <div className="absolute -top-3 left-8 w-14 h-11 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RainAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CloudyAnimation />
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-6 bg-gradient-to-b from-blue-300 to-transparent animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function SnowAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <CloudyAnimation />
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-snow opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 10}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function ThunderstormAnimation() {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <RainAnimation />
      {flash && (
        <div className="absolute inset-0 bg-yellow-200/40 animate-flash" />
      )}
    </div>
  );
}

function FogAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-12 bg-gradient-to-r from-transparent via-slate-400/30 to-transparent animate-fog"
          style={{
            top: `${20 + i * 20}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------- Helper functions --------------------------*/
function mapCodeToCondition(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if (code === 95) return "Thunderstorm";
  return "Clear";
}

/* ------------------------- UI helpers --------------------------*/
const SLOT_ORDER = ["Morning", "Afternoon", "Evening"];
const DEFAULT_TASKS = [
  "💪 Gym - Upper Body",
  "💪 Gym - Lower Body",
  "💪 Gym - Core & Cardio",
  "🥗 Meal Prep",
  "🚶 Walk 10k steps",
  "💻 Code - Frontend (2h)",
  "💻 Code - Backend (2h)",
  "🧠 DSA Practice",
  "📚 Learn New Framework",
  "🐛 Debug Session",
  "📖 Tech Reading",
  "💼 Portfolio Work",
  "📝 Journaling",
  "🧘 Meditation",
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
                <span className="absolute inset-0 rounded-lg ring-2 ring-[#22c55e]/40 animate-pulse"></span>
              )}
              <div className="relative z-10">{d.date()}</div>
              {hasTasks && (
                <div className="relative z-10 w-1 h-1 rounded-full bg-[#4ADE80] mt-1 shadow-[0_0_6px_#4ADE80]" />
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
  showSearch,
  setShowSearch,
}) {
  const [localInput, setLocalInput] = useState(cityInput);

  useEffect(() => {
    setLocalInput(cityInput);
  }, [cityInput]);

  const condition = weatherData?.condition || "Clear";
  const temp = weatherData?.main?.temp ?? null;
  const isNight = weatherData?.isNight || false;

  const title = !selectedCity
    ? "Select a city"
    : typeof selectedCity === "string"
    ? selectedCity
    : `${selectedCity.name}${
        selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""
      }, ${selectedCity.country}`;

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
          <div className="max-h-40 overflow-auto border border-[#2F6B60]/40 rounded bg-black/40">
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

      {/* Card visual with CSS animations */}
      <div className="relative rounded-xl overflow-hidden border border-[#2F6B60]/40 bg-black/20 h-[270px] bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C]">
        {/* Weather animation */}
        <WeatherAnimation condition={condition} isNight={isNight} />

        {/* Info panel */}
        <div className="relative z-20 p-6 flex flex-col items-center gap-2 mt-4">
          <div className="text-3xl font-bold text-[#E8FFFA] drop-shadow-lg">
            {temp !== null ? `${Math.round(temp)}°C` : "--"}
          </div>
          <div className="text-sm text-[#9FF2E8] font-medium">{condition}</div>
        </div>

        {/* stats panel at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#071119]/90 backdrop-blur-sm z-30 text-xs text-[#CDEEE8] grid grid-cols-2 gap-y-1">
          <div>Humidity: {weatherData?.main?.humidity ?? "--"}%</div>
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

      {/* Add CSS animations */}
      <style>{`
        @keyframes sunray {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -100%) rotate(var(--rotation)) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -100%) rotate(var(--rotation)) scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float-cloud {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120vw); }
        }
        @keyframes rain {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        @keyframes snow {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes fog {
          0%, 100% { transform: translateX(-100%); opacity: 0.3; }
          50% { transform: translateX(100%); opacity: 0.6; }
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-sunray { animation: sunray 2s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-float-cloud { animation: float-cloud linear infinite; }
        .animate-rain { animation: rain linear infinite; }
        .animate-snow { animation: snow linear infinite; }
        .animate-fog { animation: fog 8s ease-in-out infinite; }
        .animate-flash { animation: flash 0.15s ease-out; }
      `}</style>
    </div>
  );
}

/* ------------------------- Main Planner --------------------------*/
export default function Planner({ dashboardState, updateDashboard }) {
  // 1. Build local unified planner object from dashboardState
  const base = dashboardState?.wd_planner || {};
  const [planner, setPlanner] = useState({
    tasks: base.tasks && base.tasks.length > 0 ? base.tasks : DEFAULT_TASKS,
    dayMap: base.dayMap || {},
    habits: { ...defaultHabits, ...base.habits },
    pomodoroSeconds:
      typeof base.pomodoroSeconds === "number" ? base.pomodoroSeconds : 25 * 60,
    focusTask: base.focusTask || "",
    weatherCityInput: base.weatherCityInput || "",
    weatherCity: base.weatherCity || null,
    streak: base.streak || 0,
  });

  // ✅ FIX: Prevent infinite loop with deep comparison
  const lastSavedPlanner = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const plannerString = JSON.stringify(planner);

    // Only save if planner actually changed
    if (lastSavedPlanner.current === plannerString) {
      return;
    }

    lastSavedPlanner.current = plannerString;

    // Save to localStorage immediately
    localStorage.setItem("wd_planner", plannerString);

    // Debounced backend save
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (updateDashboard) {
        console.log("💾 Saving planner to backend...");
        updateDashboard({ wd_planner: planner });
      }
    }, 1000);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [planner, updateDashboard]);

  // Sync when dashboardState changes (other tab updated)
  // Sync when dashboardState changes (other tab updated)
  useEffect(() => {
    if (!dashboardState?.wd_planner) return;
    const p = dashboardState.wd_planner;
    setPlanner((prev) => ({
      tasks:
        p.tasks && p.tasks.length > 0
          ? p.tasks
          : prev.tasks && prev.tasks.length > 0
          ? prev.tasks
          : DEFAULT_TASKS,
      dayMap: p.dayMap || prev.dayMap || {},
      habits: { ...prev.habits, ...defaultHabits, ...p.habits },
      pomodoroSeconds:
        typeof p.pomodoroSeconds === "number"
          ? p.pomodoroSeconds
          : prev.pomodoroSeconds,
      focusTask: p.focusTask ?? prev.focusTask,
      weatherCityInput: p.weatherCityInput ?? prev.weatherCityInput,
      weatherCity: p.weatherCity ?? prev.weatherCity,
      streak: typeof p.streak === "number" ? p.streak : prev.streak,
    }));
  }, [dashboardState?.wd_planner]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [toast, setToast] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());
  const [dragging, setDragging] = useState(false);
  const [activeDrop, setActiveDrop] = useState(null);

  const geoDebounce = useRef(null);
  const pomInterval = useRef(null);

  const dayKey = formatDateKey(selectedDate);
  const currentDay = planner.dayMap[dayKey] || {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  const cityInput = planner.weatherCityInput;
  const selectedCity = planner.weatherCity || null;

  const totalPlanned =
    (currentDay.Morning?.length || 0) +
    (currentDay.Afternoon?.length || 0) +
    (currentDay.Evening?.length || 0);

  // 2. Derived template search
  const [query, setQuery] = useState("");
  const [inlineAdd, setInlineAdd] = useState("");
  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return planner.tasks;
    return planner.tasks.filter((t) => t.toLowerCase().includes(q));
  }, [planner.tasks, query]);

  // 4. Pomodoro timer
  useEffect(() => {
    if (pomodoroRunning) {
      if (pomInterval.current) clearInterval(pomInterval.current);
      pomInterval.current = setInterval(() => {
        setPlanner((prev) => {
          const s = (prev.pomodoroSeconds || 0) - 1;
          if (s <= 0) {
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

  // 5. Geocode suggestions
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
        console.warn("geocode error:", err);
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(geoDebounce.current);
  }, [cityInput]);

  // 6. Weather loading
  useEffect(() => {
    async function loadWeatherForCity(city) {
      if (!city) {
        setWeatherData(null);
        return;
      }
      try {
        const lat = city.latitude ?? city.lat;
        const lon = city.longitude ?? city.lon;
        if (!lat || !lon) {
          setWeatherData(null);
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

        const isNight = h < sunriseH - 1 || h > sunsetH + 2;
        const condition = mapCodeToCondition(code);

        setWeatherData({
          condition,
          isNight,
          main: {
            temp: json.current?.temperature_2m ?? null,
            humidity: json.current?.relative_humidity_2m ?? 0,
          },
          wind: {
            speed: json.current?.wind_speed_10m ?? 0,
          },
          meta: {
            sunrise: sunriseStr,
            sunset: sunsetStr,
            uv: json.daily?.uv_index_max?.[0] ?? null,
          },
        });
      } catch (e) {
        console.warn("weather fetch failed:", e);
        setWeatherData(null);
      }
    }
    loadWeatherForCity(selectedCity);
  }, [selectedCity]);

  // 7. Misc small effects
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

  // 8. Planner mutations all via setPlanner
  const updateDay = (fn) => {
    setPlanner((prev) => {
      const map = { ...prev.dayMap };
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
    setPlanner((p) => ({
      ...p,
      tasks: [...p.tasks, t.trim()],
    }));
    showToast("Template added!");
  };

  const deleteTemplate = (idx) => {
    setPlanner((p) => {
      const next = [...p.tasks];
      next.splice(idx, 1);
      return { ...p, tasks: next };
    });
    showToast("Template deleted!");
  };

  const duplicateTemplate = (t) => addTaskTemplate(t + " copy");

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
      day[slot] = [...day[slot], task];
      return day;
    });
    setActiveDrop(null);
    setDragging(false);
    showToast(`Added to ${slot}!`);
  };

  const removeFrom = (slot, idx) => {
    updateDay((day) => {
      const arr = [...day[slot]];
      arr.splice(idx, 1);
      day[slot] = arr;
      return day;
    });
    showToast("Removed!");
  };

  const moveToNextSlot = (slot, idx) => {
    const idxSlot = SLOT_ORDER.indexOf(slot);
    const nextSlot = SLOT_ORDER[(idxSlot + 1) % SLOT_ORDER.length];
    updateDay((day) => {
      const fromArr = [...day[slot]];
      const t = fromArr[idx];
      fromArr.splice(idx, 1);
      const toArr = [...day[nextSlot], t];
      day[slot] = fromArr;
      day[nextSlot] = toArr;
      return day;
    });
    showToast(`Moved to ${nextSlot}!`);
  };

  // 9. Render
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
              {dayjs(liveTime).format("h:mm A")}
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
      <div className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-4">
        {/* TEMPLATES PANEL */}
        <div className="h-[500px] rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm shadow-[0_0_12px_rgba(0,0,0,0.35)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <h2 className="text-sm font-semibold text-[#9FF2E8]">
                📋 Templates
              </h2>
              <p className="text-xs text-[#7FAFA4]">
                {planner.tasks.length} available
              </p>
            </div>
          </div>

          {/* Add New */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inlineAdd.trim()) {
                addTaskTemplate(inlineAdd.trim());
                setInlineAdd("");
              }
            }}
            className="flex gap-2 mb-3 flex-shrink-0"
          >
            <input
              value={inlineAdd}
              onChange={(e) => setInlineAdd(e.target.value)}
              placeholder="Add new..."
              className="flex-1 bg-black/30 border border-[#3FA796] rounded px-3 py-2 placeholder:text-[#7FAFA4] text-sm focus:outline-none"
            />
            <button className="px-3 py-2 rounded bg-[#0A2B22] text-[#E8FFFA] text-sm border border-[#3FA796] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition">
              Add
            </button>
          </form>

          {/* Templates List */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 mb-3 pr-1 scrollbar-thin scrollbar-thumb-[#2F6B60]/60 scrollbar-track-transparent">
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
                  className="group flex items-center gap-2 p-2.5 rounded-md border border-[#2F6B60]/30 bg-gradient-to-br from-[#081C18] to-[#0F0F0F] hover:border-[#3FA796]/60 hover:shadow-[0_0_8px_rgba(63,167,150,0.4)] transition cursor-move"
                >
                  <div className="text-sm text-[#CDEEE8] truncate flex-1">
                    {t}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                    <button
                      onClick={() => duplicateTemplate(t)}
                      className="p-1.5 rounded bg-black/40 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_6px_rgba(63,167,150,0.6)] transition"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => deleteTemplate(i)}
                      className="p-1.5 rounded bg-[#7A1D2B] text-white text-xs hover:shadow-[0_0_6px_rgba(214,30,54,0.6)] transition"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Add */}
          <div className="flex gap-2 pt-2 border-t border-[#2F6B60]/30 flex-shrink-0">
            <button
              onClick={() => addTaskTemplate("💪 Gym Workout")}
              className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_6px_rgba(63,167,150,0.6)] transition"
            >
              💪 Gym
            </button>
            <button
              onClick={() => addTaskTemplate("💻 Code Focus Session")}
              className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_6px_rgba(63,167,150,0.6)] transition"
            >
              💻 Code
            </button>
            <button
              onClick={() => addTaskTemplate("🧠 DSA Practice")}
              className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_6px_rgba(63,167,150,0.6)] transition"
            >
              🧠 DSA
            </button>
          </div>
        </div>

        {/* SLOTS PANEL - REDESIGNED WITH PROPER HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-[500px]">
          {SLOT_ORDER.map((slot) => {
            const isActive = activeDrop === slot && dragging;
            const items = currentDay[slot] || [];

            return (
              <div
                key={slot}
                onDragOver={onDragOver(slot)}
                onDrop={onDrop(slot)}
                onDragEnd={onDragEnd}
                className={`rounded-xl p-3 flex flex-col border border-[#2F6B60]/40 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] hover:shadow-[0_0_8px_rgba(63,167,150,0.4)] transition ${
                  isActive
                    ? "ring-2 ring-[#3FA796] shadow-[0_0_16px_rgba(63,167,150,0.6)]"
                    : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#2F6B60]/30 flex-shrink-0">
                  <div>
                    <div className="text-sm font-semibold text-[#9FF2E8]">
                      {slot}
                    </div>
                    <div className="text-xs text-[#7FAFA4]">
                      {items.length} items
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const preset = "💪 Gym Workout";
                      updateDay((day) => ({
                        ...day,
                        [slot]: [...(day[slot] || []), preset],
                      }));
                      showToast(`Added preset to ${slot}!`);
                    }}
                    className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                  >
                    + Preset
                  </button>
                </div>

                {/* Items with proper scroll */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#2F6B60]/60 scrollbar-track-transparent">
                  <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-sm text-[#7FAFA4] border border-dashed border-[#2F6B60]/40 rounded p-4"
                      >
                        Empty — drop a task here
                      </motion.div>
                    ) : (
                      items.map((t, idx) => (
                        <motion.div
                          key={`${slot}-${t}-${idx}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="group flex items-center justify-between gap-2 p-2.5 rounded-md border border-[#2F6B60]/30 bg-black/20 hover:bg-black/30 hover:border-[#3FA796]/50 transition"
                        >
                          <div className="text-sm text-[#E8FFFA] truncate flex-1">
                            {t}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                            <button
                              onClick={() => moveToNextSlot(slot, idx)}
                              className="px-2 py-1 rounded bg-black/30 border border-[#2F6B60]/40 text-xs hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition"
                            >
                              ▶
                            </button>
                            <button
                              onClick={() => removeFrom(slot, idx)}
                              className="px-2 py-1 rounded bg-[#7A1D2B] text-white text-xs hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
                            >
                              ✕
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ROW: Focus, Habits, Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Focus & Pomodoro */}
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
                showToast("Focus cleared!");
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
                ⏹
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
              style={{ width: `${Math.min(100, (totalPlanned / 8) * 100)}%` }}
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
      </div>

      {/* CALENDAR PREVIEW + WEATHER */}
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
            {dayjs(selectedDate).format("DD MMM YYYY")} summary
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
        </div>

        {/* Weather */}
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
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed right-6 bottom-6 bg-[#031715] border border-[#2F6B60]/40 px-4 py-2 rounded shadow text-[#E8FFFA] hover:shadow-[0_0_8px_rgba(63,167,150,0.6)] transition z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
