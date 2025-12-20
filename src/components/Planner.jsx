// Planner.jsx — COMPLETE VERSION with all sections + fixed infinite loop + CSS animations
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

/* ------------------------- Weather Animation Components --------------------------*/
function WeatherAnimation({ condition, isNight }) {
  const conditionLower = condition?.toLowerCase() || "";

  // Thunderstorm
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return <ThunderstormAnimation />;
  }

  // Rainy
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return <RainAnimation />;
  }

  // Snowy
  if (conditionLower.includes("snow") || conditionLower.includes("sleet")) {
    return <SnowAnimation />;
  }

  // Cloudy
  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return <CloudyAnimation />;
  }

  // Foggy/Misty
  if (
    conditionLower.includes("fog") ||
    conditionLower.includes("mist") ||
    conditionLower.includes("haze")
  ) {
    return <FogAnimation />;
  }

  // Clear sky - sun or moon
  if (conditionLower.includes("clear")) {
    return isNight ? <MoonAnimation /> : <SunAnimation />;
  }

  // Default - clear animation based on time
  return isNight ? <MoonAnimation /> : <SunAnimation />;
}

// Now SunAnimation is being used!
function SunAnimation() {
  return (
    <div className="absolute inset-0 flex items-start justify-end p-2 overflow-hidden">
      <div className="relative w-24 h-24">
        {/* Outer atmospheric glow - pulsing */}
        <div className="absolute -inset-12 rounded-full bg-yellow-400/20 blur-3xl animate-sun-breathe" />
        <div
          className="absolute -inset-8 rounded-full bg-orange-400/30 blur-2xl animate-sun-breathe"
          style={{ animationDelay: "1s" }}
        />

        {/* Rotating rays container */}
        <div className="absolute inset-0 animate-sun-rotate">
          {/* Primary rays - longer */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`primary-${i}`}
              className="absolute top-1/2 left-1/2 w-1 origin-bottom"
              style={{
                height: "60px",
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-t from-yellow-400/80 via-yellow-300/50 to-transparent rounded-full" />
            </div>
          ))}

          {/* Secondary rays - shorter, offset */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`secondary-${i}`}
              className="absolute top-1/2 left-1/2 w-0.5 origin-bottom"
              style={{
                height: "45px",
                transform: `translate(-50%, -100%) rotate(${i * 30 + 15}deg)`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-t from-orange-400/60 via-yellow-200/40 to-transparent rounded-full" />
            </div>
          ))}
        </div>

        {/* Main sun body with layers */}
        <div className="absolute inset-0 rounded-full overflow-hidden animate-sun-pulse">
          {/* Core gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500" />

          {/* Surface texture */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/70 via-transparent to-orange-400/40" />

          {/* Top highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-transparent" />

          {/* Bottom shadow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-600/30 via-transparent to-transparent" />
        </div>

        {/* Inner glow around sun */}
        <div
          className="absolute -inset-2 rounded-full blur-md animate-sun-pulse"
          style={{
            animationDelay: "0.5s",
            background:
              "radial-gradient(circle, rgba(253, 224, 71, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

function MoonAnimation() {
  return (
    <div className="absolute inset-0 flex items-start justify-end p-2 overflow-hidden">
      <div className="relative w-20 h-20">
        {/* Moon glow layers */}
        <div className="absolute -inset-8 rounded-full bg-slate-300/20 blur-3xl animate-moon-glow" />
        <div
          className="absolute -inset-4 rounded-full bg-slate-200/30 blur-2xl animate-moon-glow"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Main moon body */}
        <div className="absolute inset-0 rounded-full overflow-hidden animate-moon-glow">
          {/* Base gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400" />

          {/* Surface texture overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-50/60 via-transparent to-slate-500/40" />

          {/* Top shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent" />

          {/* Bottom shadow for depth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-slate-600/40 via-transparent to-transparent" />
        </div>

        {/* Craters - more realistic */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-400/50 shadow-inner" />
        <div className="absolute top-2 right-5 w-2 h-2 rounded-full bg-slate-400/40 shadow-inner" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-slate-400/60 shadow-inner" />
        <div className="absolute top-8 right-6 w-2 h-2 rounded-full bg-slate-400/45 shadow-inner" />
        <div className="absolute bottom-7 left-5 w-2.5 h-2.5 rounded-full bg-slate-400/50 shadow-inner" />

        {/* Smaller crater details */}
        <div className="absolute top-12 left-8 w-1 h-1 rounded-full bg-slate-400/35" />
        <div className="absolute top-6 left-12 w-1 h-1 rounded-full bg-slate-400/30" />
      </div>

      {/* Realistic twinkling stars */}
      {[...Array(15)].map((_, i) => {
        const size = Math.random() > 0.7 ? "w-1.5 h-1.5" : "w-1 h-1";
        return (
          <div
            key={i}
            className={`absolute ${size} bg-white rounded-full animate-star-twinkle`}
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        );
      })}

      {/* Shooting star (occasional) */}
      <div
        className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-shooting-star"
        style={{
          top: "20%",
          left: "60%",
          transform: "rotate(-30deg)",
        }}
      />
    </div>
  );
}

function CloudyAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Multiple cloud layers for depth */}
      {[...Array(4)].map((_, i) => {
        const sizes = [
          { w: "w-24", h: "h-12", top1: "w-16 h-14", top2: "w-20 h-16" },
          { w: "w-20", h: "h-10", top1: "w-14 h-12", top2: "w-16 h-13" },
          { w: "w-28", h: "h-14", top1: "w-18 h-16", top2: "w-22 h-18" },
          { w: "w-22", h: "h-11", top1: "w-15 h-13", top2: "w-18 h-15" },
        ];

        const cloudSize = sizes[i];

        return (
          <div
            key={i}
            className="absolute animate-cloud-drift"
            style={{
              top: `${15 + i * 18}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 5}s`,
            }}
          >
            <div className="relative animate-cloud-morph">
              {/* Base cloud puff */}
              <div
                className={`${cloudSize.w} ${cloudSize.h} bg-gradient-to-br from-white/40 via-slate-200/50 to-slate-300/60 rounded-full blur-sm`}
              />

              {/* Top left puff */}
              <div
                className={`absolute -top-2 left-4 ${cloudSize.top1} bg-gradient-to-br from-white/50 via-slate-100/60 to-slate-200/70 rounded-full blur-sm`}
              />

              {/* Top right puff */}
              <div
                className={`absolute -top-3 left-8 ${cloudSize.top2} bg-gradient-to-br from-slate-100/50 via-slate-200/60 to-slate-300/70 rounded-full blur-sm`}
              />

              {/* Bottom detail puff */}
              <div
                className={`absolute top-2 left-6 w-10 h-8 bg-gradient-to-br from-white/30 to-slate-200/50 rounded-full blur-sm`}
              />

              {/* Cloud shadow/depth */}
              <div
                className={`absolute bottom-0 left-2 right-2 h-3 bg-slate-400/20 rounded-full blur-md`}
              />
            </div>
          </div>
        );
      })}

      {/* Subtle sun glow behind clouds */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-200/30 blur-3xl"
        style={{ zIndex: -1 }}
      />
    </div>
  );
}

function RainAnimation() {
  const [showLightning, setShowLightning] = React.useState(false);

  React.useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 200);
      }
    }, 3000);

    return () => clearInterval(lightningInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dark storm clouds */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-800/60 via-slate-700/40 to-transparent blur-2xl" />

      {/* Lightning flash */}
      {showLightning && (
        <div className="absolute inset-0 bg-white/40 animate-lightning-flash pointer-events-none" />
      )}

      {/* Heavy rain */}
      {[...Array(45)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-100/80 via-blue-200/60 to-transparent animate-rain-fall"
          style={{
            left: `${(i * 2.2) % 100}%`,
            top: "-100px",
            height: `${20 + (i % 5) * 3}px`,
            animationDelay: `${(i * 0.06) % 1.5}s`,
            animationDuration: `${0.5 + (i % 4) * 0.1}s`,
          }}
        />
      ))}

      {/* Rain mist */}
      <div className="absolute inset-0 bg-slate-700/10 pointer-events-none" />
    </div>
  );
}

function SnowAnimation() {
  const [snowLevel, setSnowLevel] = useState(0);
  const [showPlow, setShowPlow] = useState(false);
  const [plowPosition, setPlowPosition] = useState(0);
  const maxSnowLevel = 25;

  // Slower snow accumulation
  useEffect(() => {
    if (showPlow) return;

    const snowAccumulation = setInterval(() => {
      setSnowLevel((prev) => {
        if (prev >= maxSnowLevel) {
          return maxSnowLevel;
        }
        return prev + 0.15; // Much slower - was 0.3
      });
    }, 400); // Slower interval - was 250ms

    return () => clearInterval(snowAccumulation);
  }, [showPlow]);

  // Trigger plow when snow reaches 25%
  useEffect(() => {
    if (snowLevel >= maxSnowLevel && !showPlow) {
      setShowPlow(true);
      setPlowPosition(0);
    }
  }, [snowLevel, showPlow]);

  // Plow movement - RIGHT TO LEFT
  useEffect(() => {
    if (!showPlow) return;

    const plowSpeed = 35;
    const plowInterval = setInterval(() => {
      setPlowPosition((prev) => {
        const newPosition = prev + 1;

        // Calculate snow clearing
        const progressPercent = (newPosition / 120) * 100;
        const remainingSnow = maxSnowLevel * (1 - progressPercent / 100);
        setSnowLevel(Math.max(0, remainingSnow));

        if (newPosition >= 120) {
          setShowPlow(false);
          setSnowLevel(0);
          setPlowPosition(0);
          return 0;
        }

        return newPosition;
      });
    }, plowSpeed);

    return () => clearInterval(plowInterval);
  }, [showPlow]);

  // Generate random bumpy snow surface
  const getSnowPath = () => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const x = i * 10;
      const y = 2 + Math.sin(i * 0.8) * 2 + Math.random() * 2;
      points.push(`${x},${y}`);
    }
    return `M0,${points[0].split(",")[1]} ${points
      .map((p, i) =>
        i === 0
          ? ""
          : `Q${p.split(",")[0]},${p.split(",")[1]} ${
              parseInt(p.split(",")[0]) + (i < 10 ? 5 : 0)
            },${points[i + 1] ? points[i + 1].split(",")[1] : p.split(",")[1]}`,
      )
      .join(" ")} L100,20 L0,20 Z`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Snowy sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-200/20 to-transparent" />

      {/* Light clouds */}
      <div className="absolute inset-0">
        {[...Array(2)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="absolute animate-cloud-drift animate-cloud-morph"
            style={{
              top: `${5 + i * 12}%`,
              animationDelay: `${i * 5}s`,
              animationDuration: `${28 + i * 4}s`,
              opacity: 0.4,
            }}
          >
            <div className="relative">
              <div className="w-28 h-14 bg-gradient-to-br from-slate-200/40 to-slate-300/50 rounded-full blur-2xl" />
              <div className="absolute -top-3 left-10 w-20 h-16 bg-gradient-to-br from-slate-100/50 to-slate-200/60 rounded-full blur-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Falling snowflakes */}
      {[...Array(30)].map((_, i) => {
        const sizes = ["w-1.5 h-1.5", "w-2 h-2", "w-2.5 h-2.5"];
        const size = sizes[i % 3];
        const speed = 4 + (i % 5) * 0.5;

        return (
          <div
            key={i}
            className={`absolute ${size} bg-white rounded-full animate-snow-fall opacity-90 shadow-sm`}
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: "-50px",
              animationDelay: `${(i * 0.3) % 5}s`,
              animationDuration: `${speed}s`,
            }}
          />
        );
      })}

      {/* Snow accumulation - BUMPY SURFACE */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-200 ease-linear"
        style={{ height: `${snowLevel}%` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Bumpy snow surface using multiple layers */}
          <div className="absolute top-0 left-0 right-0 h-6">
            {/* Create irregular bumps */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  left: `${i * 13}%`,
                  top: `${Math.sin(i) * 3}px`,
                  width: `${15 + Math.random() * 10}%`,
                  height: "12px",
                  filter: "blur(2px)",
                }}
              />
            ))}
          </div>

          {/* Main snow body */}
          <div
            className="absolute inset-0 bg-white"
            style={{ marginTop: "4px" }}
          >
            {/* Snow texture gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/30 via-white to-white" />

            {/* Add some depth with shadows */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-slate-100/20 to-transparent"
              style={{ height: "30%" }}
            />
          </div>

          {/* Sparkles */}
          {snowLevel > 8 &&
            [...Array(12)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full opacity-70 shadow-sm"
                style={{
                  top: `${8 + (i % 4) * 8}%`,
                  left: `${(i * 8.5) % 100}%`,
                }}
              />
            ))}
        </div>
      </div>

      {/* Snow Plow - FIXED DIRECTION (Right to Left) */}
      {showPlow && (
        <div
          className="absolute bottom-0 z-50"
          style={{
            left: `${100 - (plowPosition / 120) * 100}%`, // Changed from 'right' to 'left' with inverted calculation
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative">
            {/* Snow spray - now in front (left side) */}
            <div
              className="absolute -left-20 bottom-0 w-32 h-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at left bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 35%, transparent 65%)",
              }}
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                  style={{
                    left: `${i * 8}%`,
                    bottom: `${25 + Math.random() * 35}%`,
                    animation: `snow-spray ${
                      0.7 + i * 0.06
                    }s ease-out infinite`,
                    animationDelay: `${i * 0.07}s`,
                  }}
                />
              ))}
            </div>

            {/* Plow blade - angled for right-to-left movement */}
            <div className="relative w-16 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-l-2xl shadow-2xl transform skew-x-6 border-l-2 border-yellow-600">
              <div className="absolute inset-2 bg-gradient-to-br from-yellow-300/60 to-transparent rounded-l-xl" />
              <div className="absolute left-0 top-3 bottom-3 w-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-l-lg shadow-inner" />
              <div className="absolute top-6 left-3 w-8 h-0.5 bg-yellow-600/50 rounded" />
              <div className="absolute top-10 left-3 w-8 h-0.5 bg-yellow-600/50 rounded" />
              <div className="absolute top-14 left-3 w-8 h-0.5 bg-yellow-600/50 rounded" />
            </div>

            {/* Truck cabin - on the right side */}
            <div className="absolute -right-12 top-2 w-14 h-16 bg-gradient-to-br from-red-500 via-red-600 to-red-800 rounded-xl shadow-2xl border-2 border-red-700">
              <div className="absolute top-1 left-1 right-1 h-6 bg-gradient-to-br from-sky-200/60 to-sky-300/50 rounded-lg backdrop-blur-sm border border-sky-300/30">
                <div className="absolute top-0 left-0 w-4 h-3 bg-white/40 rounded-tl-lg" />
              </div>
              <div className="absolute bottom-2 left-1 right-1 h-7 bg-red-700/60 rounded border-t border-red-800/50" />
              <div className="absolute top-8 left-0 right-0 h-px bg-red-800/60" />
              <div className="absolute top-4 -right-1 w-2 h-1.5 bg-gray-800 rounded-sm" />
            </div>

            {/* Front wheel */}
            <div className="absolute -right-8 -bottom-3 w-5 h-5 bg-gray-900 rounded-full border-2 border-gray-800 shadow-xl">
              <div className="absolute inset-0.5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full" />
              <div className="absolute inset-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Back wheel */}
            <div className="absolute -right-3 -bottom-3 w-5 h-5 bg-gray-900 rounded-full border-2 border-gray-800 shadow-xl">
              <div className="absolute inset-0.5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full" />
              <div className="absolute inset-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Exhaust - on right side */}
            <div className="absolute -right-14 top-8 w-6 h-6 bg-gray-400/40 rounded-full blur-md animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}

function ThunderstormAnimation() {
  const [flash, setFlash] = useState(false);
  const [boltPosition, setBoltPosition] = useState({ x: 50, y: 20 });

  useEffect(() => {
    const interval = setInterval(
      () => {
        // Random lightning position
        setBoltPosition({
          x: 30 + Math.random() * 40,
          y: 10 + Math.random() * 20,
        });

        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      },
      3000 + Math.random() * 2000,
    ); // Random interval 3-5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <RainAnimation />

      {/* Lightning flash */}
      {flash && (
        <>
          {/* Screen flash */}
          <div className="absolute inset-0 bg-white/60 animate-lightning-flash pointer-events-none" />

          {/* Lightning bolt */}
          <div
            className="absolute w-1 h-24 bg-gradient-to-b from-yellow-100 via-white to-transparent animate-lightning-flash blur-sm"
            style={{
              left: `${boltPosition.x}%`,
              top: `${boltPosition.y}%`,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
            }}
          />
          <div
            className="absolute w-0.5 h-20 bg-white animate-lightning-flash"
            style={{
              left: `${boltPosition.x}%`,
              top: `${boltPosition.y + 2}%`,
            }}
          />
        </>
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
  // 🌅 Morning — Body & Discipline
  "💪 Gym Session (Strength / Cardio)",
  "🚿 Post-Gym Recovery + Stretch",
  "🥗 Clean Meals (Protein Focus)",
  "🧘 5–10 min Meditation / Breathwork",

  // 🕘 Day — Stability
  "💼 Office Work (Focused, No Slack)",
  "🚶 8–10k Steps (Active Recovery)",

  // 🌙 Night — Deep Work (YOUR CORE ZONE)
  "💻 Deep Coding (MERN / Projects)",
  "🧠 DSA Practice (1–2 problems)",
  "🐛 Debug / Refactor Session",
  "📖 Tech Reading / Docs (20 min)",

  // 📈 Growth & Output
  "💼 Portfolio / Resume Improvement",
  "📝 Journal + Next-Day Plan",
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
    <div
      className="rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm overflow-hidden hover:shadow-[0_0_12px_rgba(63,167,150,0.4)] transition-all
      "
    >
      {/* Header */}
      <div className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-[#2F6B60]/30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setBase(base.subtract(1, "month"))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/40 border border-indigo-400/20 text-indigo-200 hover:bg-indigo-500/10 hover:border-indigo-400/40 transition-all"
          >
            ◀
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span className="text-sm font-bold text-[#9FF2E8]">
              {base.format("MMMM YYYY")}
            </span>
          </div>
          <button
            onClick={() => setBase(base.add(1, "month"))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-black/40 border border-indigo-400/20 text-indigo-200 hover:bg-indigo-500/10 hover:border-indigo-400/40 transition-all"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 text-[10px] text-[#7FAFA4] mb-2 font-semibold">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <div key={i} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const k = formatDateKey(d);
            const isCurrentMonth = d.month() === base.month();
            const isSelected = dayjs(selectedDate).isSame(d, "day");
            const isToday = dayjs().isSame(d, "day");
            const plans = dayMap?.[k] || {
              Morning: [],
              Afternoon: [],
              Evening: [],
              habits: {},
            };

            const habits = plans.habits || {};

            const taskCount =
              (plans.Morning?.length || 0) +
              (plans.Afternoon?.length || 0) +
              (plans.Evening?.length || 0);

            const hasTasks = taskCount > 0;

            const hasHabits =
              habits.meditate === true ||
              (habits.water || 0) > 0 ||
              (habits.reading || 0) > 0;

            const baseClasses =
              "relative p-2 rounded-lg text-xs h-10 flex items-center justify-center flex-col transition-all cursor-pointer";

            let colorClasses = "";
            if (isSelected) {
              colorClasses =
                "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.4)]";
            } else if (isToday) {
              colorClasses =
                "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 text-cyan-100";
            } else if (isCurrentMonth) {
              colorClasses =
                "bg-black/20 border border-white/5 text-[#CDEEE8] hover:bg-white/5 hover:border-white/10";
            } else {
              colorClasses =
                "bg-transparent border border-transparent text-[#7FAFA4]/40 hover:text-[#7FAFA4]/60";
            }

            return (
              <button
                key={`${k}-${i}`}
                onClick={() => setSelectedDate(d.toDate())}
                className={`${baseClasses} ${colorClasses}`}
              >
                {/* Animated pulse for selected date */}
                {isSelected && (
                  <motion.span
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-lg bg-emerald-400/20"
                  />
                )}

                {/* Date number */}
                <div className="relative z-10 font-semibold">{d.date()}</div>

                {/* Task indicator */}
                {/* Activity indicators */}
                {(hasTasks || hasHabits) && (
                  <div className="relative z-10 flex gap-0.5 mt-0.5">
                    {/* Tasks → Green */}
                    {hasTasks && (
                      <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.9)]" />
                    )}

                    {/* Habits → Blue */}
                    {hasHabits && (
                      <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.9)]" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Display */}
        <div className="mt-3 pt-3 border-t border-[#2F6B60]/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#7FAFA4]">Selected Date</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base">📌</span>
              <span className="font-semibold text-[#E8FFFA]">
                {dayjs(selectedDate).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>
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

  // FIX: Better condition extraction
  const resolveCondition = (data) => {
    if (!data) return "Clear";

    // 1️⃣ Prefer detailed description (most accurate)
    const desc = data.weather?.[0]?.description?.toLowerCase();
    if (desc) {
      if (desc.includes("thunder")) return "Thunderstorm";
      if (desc.includes("rain") || desc.includes("drizzle")) return "Rain";
      if (desc.includes("snow")) return "Snow";
      if (
        desc.includes("mist") ||
        desc.includes("fog") ||
        desc.includes("haze")
      )
        return "Fog";
      if (desc.includes("clear")) return "Clear";
      if (desc.includes("cloud")) return "Clouds";
    }

    // 2️⃣ Fallback to icon (very reliable)
    const icon = data.weather?.[0]?.icon;
    if (icon) {
      if (icon.startsWith("01")) return "Clear";
      if (
        icon.startsWith("02") ||
        icon.startsWith("03") ||
        icon.startsWith("04")
      )
        return "Clouds";
      if (icon.startsWith("09") || icon.startsWith("10")) return "Rain";
      if (icon.startsWith("11")) return "Thunderstorm";
      if (icon.startsWith("13")) return "Snow";
      if (icon.startsWith("50")) return "Fog";
    }

    // 3️⃣ Absolute fallback
    return data.weather?.[0]?.main || "Clear";
  };

  const condition = resolveCondition(weatherData);

  const temp = weatherData?.main?.temp ?? null;
  const isNight = (() => {
    if (!weatherData?.meta?.sunrise || !weatherData?.meta?.sunset) {
      const hour = new Date().getHours();
      return hour >= 18 || hour < 6;
    }

    const now = dayjs();
    const sunrise = dayjs(weatherData.meta.sunrise);
    const sunset = dayjs(weatherData.meta.sunset);

    return now.isBefore(sunrise) || now.isAfter(sunset);
  })();

  const title = !selectedCity
    ? "Select a city"
    : typeof selectedCity === "string"
      ? selectedCity
      : `${selectedCity.name}${
          selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""
        }, ${selectedCity.country}`;

  // Helper function for weather icons
  function getWeatherIcon(condition, isNight) {
    // Removed the wrapper div, just return emoji
    if (condition?.toLowerCase().includes("clear")) {
      return isNight ? "🌙" : "☀️";
    }
    if (condition?.toLowerCase().includes("cloud")) {
      return "☁️";
    }
    if (condition?.toLowerCase().includes("rain")) {
      return "🌧️";
    }
    if (condition?.toLowerCase().includes("snow")) {
      return "❄️";
    }
    if (condition?.toLowerCase().includes("thunder")) {
      return "⚡";
    }
    return "🌤️";
  }

  return (
    <div className="w-full h-full flex flex-col ">
      {/* Header - Redesigned */}
      <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-[#2F6B60]/40 rounded-xl mb-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Use dynamic weather icon */}
            <span className="text-xl">
              {getWeatherIcon(condition, isNight)}
            </span>

            <h3 className="text-sm font-bold text-[#9FF2E8]">Weather</h3>
          </div>
          <button
            onClick={() => setShowSearch((s) => !s)}
            className="px-2 py-1 rounded-lg bg-black/40 border border-cyan-400/20 text-cyan-200 text-xs hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all"
          >
            {showSearch ? "Close" : "Search"}
          </button>
        </div>

        {/* City name */}
        <div className="text-xs text-white/70 mt-1 truncate">{title}</div>
      </div>

      {/* Search (collapsed by default) */}
      <div
        className={`transition-all duration-300 ${
          showSearch ? "max-h-64 mb-3 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="rounded-lg border border-[#2F6B60]/40 bg-black/20 p-2">
          <input
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              setCityInput(e.target.value);
            }}
            placeholder="Search city..."
            className="w-full bg-black/40 border border-cyan-400/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/40 focus:bg-cyan-500/5 transition-all"
          />
          {suggestions?.length > 0 && (
            <div className="mt-2 max-h-36 overflow-auto rounded-lg bg-black/40 backdrop-blur-sm border border-[#2F6B60]/40">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(s)}
                  className="px-3 py-2 hover:bg-cyan-500/10 cursor-pointer border-b border-white/5 last:border-0 transition-all"
                >
                  <div className="text-sm text-white font-medium">
                    {s.name}
                    {s.admin1 && `, ${s.admin1}`}
                  </div>
                  <div className="text-xs text-white/50">{s.country}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weather Card - COMPACT VERSION */}
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-[#2F6B60]/40 shadow-xl flex flex-col hover:shadow-[0_0_16px_rgba(63,167,150,0.5)] transition-all">
        {/* Dynamic Background gradient based on weather */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: (() => {
              const cond = condition?.toLowerCase() || "";
              if (cond.includes("clear") && isNight)
                return "linear-gradient(to bottom right, rgba(30, 58, 138, 0.2), rgba(67, 56, 202, 0.15), rgba(88, 28, 135, 0.1))";
              if (cond.includes("clear"))
                return "linear-gradient(to bottom right, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.1))";
              if (cond.includes("cloud"))
                return "linear-gradient(to bottom right, rgba(71, 85, 105, 0.2), rgba(100, 116, 139, 0.15), rgba(148, 163, 184, 0.1))";
              if (cond.includes("rain"))
                return "linear-gradient(to bottom right, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.15), rgba(3, 105, 161, 0.1))";
              if (cond.includes("snow"))
                return "linear-gradient(to bottom right, rgba(224, 242, 254, 0.2), rgba(186, 230, 253, 0.15), rgba(125, 211, 252, 0.1))";
              if (cond.includes("thunder"))
                return "linear-gradient(to bottom right, rgba(88, 28, 135, 0.25), rgba(107, 33, 168, 0.2), rgba(126, 34, 206, 0.15))";
              return "linear-gradient(to bottom right, rgba(59, 130, 246, 0.15), rgba(34, 211, 238, 0.15), rgba(20, 184, 166, 0.1))";
            })(),
          }}
        />

        {/* Weather animation */}
        <div className="absolute inset-0">
          <WeatherAnimation condition={condition} isNight={isNight} />
        </div>

        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Main content - temperature & condition - REDUCED PADDING */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center py-4 px-4">
          {/* Temperature - SMALLER */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl font-black text-white mb-2"
            style={{
              textShadow:
                "0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2)",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
            }}
          >
            {temp !== null ? `${Math.round(temp)}°` : "--"}
          </motion.div>

          {/* Condition with icon - SMALLER */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl filter drop-shadow-lg">
              {getWeatherIcon(condition, isNight)}
            </span>
            <div className="text-base text-white/95 font-bold capitalize drop-shadow-lg">
              {condition || "Loading..."}
            </div>
          </div>

          {/* Feels like temperature - SMALLER TEXT */}
          {weatherData?.main?.feels_like && (
            <div className="text-xs text-white/70 font-medium">
              Feels like {Math.round(weatherData.main.feels_like)}°
            </div>
          )}
        </div>

        {/* Compact stats - SINGLE ROW 2x2 */}
        <div className="relative z-30 backdrop-blur-md bg-black/50 border-t border-[#2F6B60]/40">
          <div className="grid grid-cols-2 gap-2 p-2.5">
            {/* Humidity */}
            <div className="rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-blue-400/30 p-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center text-base backdrop-blur-sm border border-blue-400/30">
                💧
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-blue-200/70 uppercase tracking-wide font-medium">
                  Humidity
                </span>
                <span className="text-sm font-bold text-blue-100">
                  {weatherData?.main?.humidity ?? "--"}%
                </span>
              </div>
            </div>

            {/* Wind */}
            <div className="rounded-lg bg-gradient-to-br from-cyan-500/15 to-teal-500/10 border border-cyan-400/30 p-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/40 flex items-center justify-center text-base backdrop-blur-sm border border-cyan-400/30">
                💨
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-cyan-200/70 uppercase tracking-wide font-medium">
                  Wind
                </span>
                <span className="text-sm font-bold text-cyan-100">
                  {Math.round(weatherData?.wind?.speed ?? 0)} m/s
                </span>
              </div>
            </div>

            {/* Sunrise */}
            <div className="rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/10 border border-orange-400/30 p-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/40 flex items-center justify-center text-base backdrop-blur-sm border border-orange-400/30">
                🌅
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-orange-200/70 uppercase tracking-wide font-medium">
                  Sunrise
                </span>
                <span className="text-xs font-bold text-orange-100">
                  {weatherData?.meta?.sunrise
                    ? dayjs(weatherData.meta.sunrise).format("h:mm A")
                    : "--"}
                </span>
              </div>
            </div>

            {/* Sunset */}
            <div className="rounded-lg bg-gradient-to-br from-purple-500/15 to-pink-500/10 border border-purple-400/30 p-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/40 flex items-center justify-center text-base backdrop-blur-sm border border-purple-400/30">
                🌇
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-purple-200/70 uppercase tracking-wide font-medium">
                  Sunset
                </span>
                <span className="text-xs font-bold text-purple-100">
                  {weatherData?.meta?.sunset
                    ? dayjs(weatherData.meta.sunset).format("h:mm A")
                    : "--"}
                </span>
              </div>
            </div>
          </div>

          {/* UV Index - COMPACT SINGLE LINE */}
          {weatherData?.meta?.uv !== null &&
            weatherData?.meta?.uv !== undefined && (
              <div className="px-2.5 pb-2.5">
                <div className="rounded-lg bg-gradient-to-r from-yellow-500/15 to-orange-500/10 border border-yellow-400/30 px-2.5 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">☀️</span>
                    <span className="text-[9px] text-yellow-200/70 uppercase tracking-wide font-medium">
                      UV Index
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-yellow-100">
                      {weatherData.meta.uv}
                    </span>
                    <span
                      className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                        weatherData.meta.uv <= 2
                          ? "bg-green-500/30 text-green-200 border border-green-400/30"
                          : weatherData.meta.uv <= 5
                            ? "bg-yellow-500/30 text-yellow-200 border border-yellow-400/30"
                            : weatherData.meta.uv <= 7
                              ? "bg-orange-500/30 text-orange-200 border border-orange-400/30"
                              : "bg-red-500/30 text-red-200 border border-red-400/30"
                      }`}
                    >
                      {weatherData.meta.uv <= 2
                        ? "Low"
                        : weatherData.meta.uv <= 5
                          ? "Moderate"
                          : weatherData.meta.uv <= 7
                            ? "High"
                            : "Very High"}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Minimal CSS - Keep all your existing animations */}
      <style>{`
      /* All your existing weather animations... */
      /* (Keep the entire style block as is) */
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

  const resetCurrentDay = () => {
    if (!confirm("Reset all tasks and habits for this day?")) return;

    setPlanner((prev) => {
      const map = { ...prev.dayMap };
      map[dayKey] = {
        Morning: [],
        Afternoon: [],
        Evening: [],
        habits: {
          water: 0,
          meditate: false,
          reading: 0,
        },
      };
      return { ...prev, dayMap: map };
    });

    showToast("Day reset ✨");
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
    <div className="p-6 max-w-7xl mx-auto rounded-xl text-[#E8FFFA] bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] dark:from-[#0F1622] dark:via-[#132033] dark:to-[#0A0F1C] transition-colors duration-500 space-y-6 md:mt-7 lg:mt-0">
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
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 mb-3 pr-1 scrollbar-thin scrollbar-thumb-[#2F6B60]/60 scrollbar-track-transparent text-sm leading-snug font-medium break-words">
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
                  <div
                    title={t}
                    className="
    text-xs text-[#CDEEE8] flex-1
    leading-snug break-words
    overflow-hidden
  "
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
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
                  <div className="flex gap-2">
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

                    <button
                      onClick={resetCurrentDay}
                      className="px-2 py-1 rounded bg-[#7A1D2B]/80 border border-[#7A1D2B] text-xs text-white hover:shadow-[0_0_8px_rgba(214,30,54,0.6)] transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Items with proper scroll */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#2F6B60]/60 scrollbar-track-transparent">
                  <AnimatePresence>
                    {items.map((t, idx) => (
                      <motion.div
                        key={`${slot}-${t}-${idx}`}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="group flex items-center justify-between gap-2 p-2.5 rounded-md border border-[#2F6B60]/30 bg-black/20 hover:bg-black/30 hover:border-[#3FA796]/50 transition"
                      >
                        <div
                          title={t}
                          className="
    text-xs text-[#E8FFFA] flex-1
    leading-snug break-words
    overflow-hidden
  "
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
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
                    ))}
                  </AnimatePresence>

                  {/* Empty State with Animations */}
                  {items.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col items-center justify-center gap-3 text-sm text-[#7FAFA4] border-2 border-dashed border-[#2F6B60]/40 rounded-lg p-6 bg-gradient-to-br from-black/10 to-transparent relative overflow-hidden"
                    >
                      {/* Animated background pulse */}
                      <motion.div
                        className="absolute inset-0 bg-[#3FA796]/5 rounded-lg"
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Animated icon */}
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative z-10 text-3xl opacity-50"
                      >
                        📋
                      </motion.div>

                      {/* Text content */}
                      <div className="relative z-10 text-center">
                        <div className="font-medium text-[#9FF2E8] mb-1">
                          No tasks yet
                        </div>
                        <div className="text-xs opacity-75">
                          Drag & drop a task here
                        </div>
                      </div>

                      {/* Animated dots */}
                      <div className="relative z-10 flex gap-2 mt-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#3FA796]"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* BOTTOM ROW: Focus, Habits, Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Focus Mode - REDESIGNED */}
        <div className="rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm overflow-hidden hover:shadow-[0_0_12px_rgba(63,167,150,0.4)] transition-all">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-b border-[#2F6B60]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl"
                >
                  🎯
                </motion.span>
                <div>
                  <h3 className="text-sm font-bold text-[#9FF2E8]">
                    Focus Mode
                  </h3>
                  <p className="text-[9px] text-[#7FAFA4]">
                    Choose one task and run a session
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPomodoroRunning(false); // Stop the timer
                  setPlanner((p) => ({
                    ...p,
                    focusTask: "",
                    pomodoroSeconds: 25 * 60, // Reset timer to 25 minutes
                  }));
                  showToast("Focus cleared!");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-rose-400/30 text-xs text-rose-200 hover:bg-rose-500/20 hover:border-rose-400/50 transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Focus Task Input */}
            <div className="rounded-lg border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3">
              <input
                value={planner.focusTask}
                onChange={(e) =>
                  setPlanner((p) => ({ ...p, focusTask: e.target.value }))
                }
                placeholder="Today's focus..."
                className="w-full bg-black/40 border border-indigo-400/30 px-3 py-2 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400/50 focus:bg-indigo-500/10 transition-all"
              />
              {planner.focusTask && (
                <div className="mt-2 pt-2 border-t border-indigo-400/20">
                  <div className="text-[9px] text-indigo-300/60 mb-1">
                    CURRENT FOCUS
                  </div>
                  <div className="text-sm text-indigo-200 font-medium flex items-center gap-2">
                    <span>🔥</span>
                    <span className="truncate">{planner.focusTask}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pomodoro Timer */}
            <div className="rounded-lg border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4">
              {/* Timer Display */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Circular Progress Ring */}
                  <svg className="w-32 h-32 -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="url(#timerGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${
                        2 *
                        Math.PI *
                        58 *
                        (1 - planner.pomodoroSeconds / (25 * 60))
                      }`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient
                        id="timerGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Timer Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold font-mono text-emerald-200">
                        {fmt(planner.pomodoroSeconds)}
                      </div>
                      <div className="text-[9px] text-emerald-300/60 mt-1">
                        {pomodoroRunning ? "RUNNING" : "PAUSED"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPomodoroRunning(true)}
                  disabled={pomodoroRunning}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white text-lg hover:shadow-[0_0_16px_rgba(34,197,94,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  ▶
                </button>

                <button
                  onClick={() => setPomodoroRunning(false)}
                  disabled={!pomodoroRunning}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/40 border border-cyan-400/30 text-cyan-200 text-lg hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  ⏸
                </button>

                <button
                  onClick={() => {
                    setPomodoroRunning(false);
                    setPlanner((p) => ({ ...p, pomodoroSeconds: 25 * 60 }));
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white text-lg hover:shadow-[0_0_16px_rgba(239,68,68,0.6)] transition-all"
                >
                  ⏹
                </button>
              </div>

              {/* Session Info */}
              <div className="mt-3 pt-3 border-t border-emerald-400/20 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[9px] text-emerald-300/60 uppercase">
                    Duration
                  </div>
                  <div className="text-xs font-bold text-emerald-200">
                    25 min
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-emerald-300/60 uppercase">
                    Elapsed
                  </div>
                  <div className="text-xs font-bold text-emerald-200">
                    {Math.floor((25 * 60 - planner.pomodoroSeconds) / 60)} min
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-emerald-300/60 uppercase">
                    Remaining
                  </div>
                  <div className="text-xs font-bold text-emerald-200">
                    {Math.ceil(planner.pomodoroSeconds / 60)} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Habits - UNIFIED PROGRESS (Tasks + Habits Combined) */}
        <div className="rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm overflow-hidden hover:shadow-[0_0_12px_rgba(63,167,150,0.4)] transition-all">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-[#2F6B60]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl"
                >
                  ✨
                </motion.span>
                <h3 className="text-sm font-bold text-[#9FF2E8]">
                  Daily Progress
                </h3>
              </div>
              <div className="text-xs text-emerald-300/60">
                {(() => {
                  // Calculate total progress score (0-11 points)
                  const taskScore = totalPlanned; // 0-8 points (morning + afternoon + evening tasks)
                  const waterScore = Math.min(
                    1,
                    (planner.dayMap?.[dayKey]?.habits?.water || 0) / 8,
                  ); // 0-1 point
                  const meditateScore = planner.dayMap?.[dayKey]?.habits
                    ?.meditate
                    ? 1
                    : 0; // 0-1 point
                  const readingScore = Math.min(
                    1,
                    (planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30,
                  ); // 0-1 point
                  const total =
                    taskScore + waterScore + meditateScore + readingScore;
                  return `${Math.round((total / 11) * 100)}% Complete`;
                })()}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Water Intake */}
            <div className="rounded-lg border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💧</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-cyan-200">
                      Water Intake
                    </span>
                    <span className="text-[9px] text-cyan-300/60">
                      Target: 8 glasses
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setPlanner((p) => {
                        const prevDay = p.dayMap?.[dayKey] || {
                          Morning: [],
                          Afternoon: [],
                          Evening: [],
                          habits: {},
                        };

                        const nextDay = {
                          ...prevDay,
                          habits: {
                            ...prevDay.habits,
                            water: Math.max(
                              0,
                              (prevDay.habits?.water || 0) - 1,
                            ),
                          },
                        };

                        return {
                          ...p,
                          dayMap: {
                            ...p.dayMap,
                            [dayKey]: nextDay,
                          },
                        };
                      })
                    }
                    className="w-7 h-7 flex items-center justify-center bg-black/40 border border-cyan-400/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all text-cyan-200 font-bold"
                  >
                    −
                  </button>
                  <div className="w-10 h-7 flex items-center justify-center bg-black/40 border border-cyan-400/30 rounded-lg text-sm font-bold text-cyan-200">
                    {planner.dayMap?.[dayKey]?.habits?.water ?? 0}
                  </div>
                  <button
                    onClick={() =>
                      setPlanner((p) => {
                        const prevDay = p.dayMap?.[dayKey] || {
                          Morning: [],
                          Afternoon: [],
                          Evening: [],
                          habits: {},
                        };

                        const nextDay = {
                          ...prevDay,
                          habits: {
                            ...prevDay.habits,
                            water: Math.min(
                              12,
                              (prevDay.habits?.water || 0) + 1,
                            ),
                          },
                        };

                        return {
                          ...p,
                          dayMap: {
                            ...p.dayMap,
                            [dayKey]: nextDay,
                          },
                        };
                      })
                    }
                    className="w-7 h-7 flex items-center justify-center bg-black/40 border border-cyan-400/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all text-cyan-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Visual Water Glasses */}
              <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      i < (planner.dayMap?.[dayKey]?.habits?.water || 0)
                        ? "bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Meditation */}
            <div className="rounded-lg border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧘</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-purple-200">
                      Meditation
                    </span>
                    <span className="text-[9px] text-purple-300/60">
                      Mindfulness practice
                    </span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!planner.dayMap?.[dayKey]?.habits?.meditate}
                    onChange={(e) =>
                      setPlanner((p) => {
                        const map = { ...p.dayMap };
                        const day = map[dayKey] || {
                          Morning: [],
                          Afternoon: [],
                          Evening: [],
                          habits: {},
                        };
                        day.habits = {
                          ...day.habits,
                          meditate: e.target.checked,
                        };
                        map[dayKey] = day;
                        return { ...p, dayMap: map };
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/40 border border-purple-400/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/60 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500/40 peer-checked:to-pink-500/40 peer-checked:border-purple-400/50 peer-checked:shadow-[0_0_8px_rgba(168,85,247,0.4)]"></div>
                </label>
              </div>
            </div>

            {/* Reading */}
            <div className="rounded-lg border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-amber-200">
                      Reading Time
                    </span>
                    <span className="text-[9px] text-amber-300/60">
                      Target: 30 min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setPlanner((p) => {
                        const map = { ...p.dayMap };
                        const day = map[dayKey] || {
                          Morning: [],
                          Afternoon: [],
                          Evening: [],
                          habits: {},
                        };
                        day.habits = {
                          ...day.habits,
                          reading: Math.max(0, (day.habits?.reading || 0) - 5),
                        };
                        map[dayKey] = day;
                        return { ...p, dayMap: map };
                      })
                    }
                    className="w-7 h-7 flex items-center justify-center bg-black/40 border border-amber-400/30 rounded-lg hover:bg-amber-500/20 hover:border-amber-400/50 transition-all text-amber-200 font-bold"
                  >
                    −
                  </button>
                  <div className="w-12 h-7 flex items-center justify-center bg-black/40 border border-amber-400/30 rounded-lg text-sm font-bold text-amber-200">
                    {planner.dayMap?.[dayKey]?.habits?.reading ?? 0}
                  </div>
                  <button
                    onClick={() =>
                      setPlanner((p) => {
                        const map = { ...p.dayMap };
                        const day = map[dayKey] || {
                          Morning: [],
                          Afternoon: [],
                          Evening: [],
                          habits: {},
                        };
                        day.habits = {
                          ...day.habits,
                          reading: (day.habits?.reading || 0) + 5,
                        };
                        map[dayKey] = day;
                        return { ...p, dayMap: map };
                      })
                    }
                    className="w-7 h-7 flex items-center justify-center bg-black/40 border border-amber-400/30 rounded-lg hover:bg-amber-500/20 hover:border-amber-400/50 transition-all text-amber-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Reading Progress Bar */}
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      ((planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30) *
                        100,
                    )}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                  style={{
                    boxShadow: "0 0 8px rgba(251,191,36,0.6)",
                  }}
                />
              </div>
              <div className="text-[9px] text-amber-300/60 mt-1">
                {planner.dayMap?.[dayKey]?.habits?.reading || 0} / 30 min
              </div>
            </div>

            {/* UNIFIED Progress Bar - Combines Tasks + Habits */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-200">
                  Daily Score
                </span>
                <span className="text-[10px] text-emerald-300/60">
                  {(() => {
                    const taskScore = totalPlanned; // 0-8
                    const waterScore = Math.min(
                      1,
                      (planner.dayMap?.[dayKey]?.habits?.water || 0) / 8,
                    ); // 0-1
                    const meditateScore = planner.dayMap?.[dayKey]?.habits
                      ?.meditate
                      ? 1
                      : 0; // 0-1
                    const readingScore = Math.min(
                      1,
                      (planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30,
                    ); // 0-1
                    const total =
                      taskScore + waterScore + meditateScore + readingScore;
                    return `${total.toFixed(1)} / 11 points`;
                  })()}
                </span>
              </div>
              <div className="relative w-full bg-black/40 rounded-full h-3 overflow-hidden border border-emerald-400/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(() => {
                      const taskScore = totalPlanned; // 0-8
                      const waterScore = Math.min(
                        1,
                        (planner.dayMap?.[dayKey]?.habits?.water || 0) / 8,
                      );
                      const meditateScore = planner.dayMap?.[dayKey]?.habits
                        ?.meditate
                        ? 1
                        : 0;
                      const readingScore = Math.min(
                        1,
                        (planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30,
                      );
                      const total =
                        taskScore + waterScore + meditateScore + readingScore;
                      return Math.round((total / 11) * 100);
                    })()}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                  style={{
                    boxShadow: "0 0 12px rgba(52,211,153,0.6)",
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 w-1/2"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    }}
                  />
                </motion.div>
              </div>
              <div className="text-[9px] text-emerald-300/60 mt-1 text-center">
                Tasks ({totalPlanned}/8) + Water (
                {Math.min(
                  1,
                  (planner.dayMap?.[dayKey]?.habits?.water || 0) / 8,
                ).toFixed(1)}
                ) + Meditation (
                {planner.dayMap?.[dayKey]?.habits?.meditate ? 1 : 0}) + Reading
                (
                {Math.min(
                  1,
                  (planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30,
                ).toFixed(1)}
                )
              </div>
            </div>
          </div>
        </div>

        {/* Daily Achievements & Streaks - COMPACT WITH ALL FEATURES */}
        <div className="rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm overflow-hidden hover:shadow-[0_0_12px_rgba(63,167,150,0.4)] transition-all">
          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-[#2F6B60]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-base"
                >
                  🏆
                </motion.span>
                <h3 className="text-sm font-bold text-[#9FF2E8]">
                  Achievements
                </h3>
              </div>
              <div className="text-xs text-amber-300/60">
                {planner.streak} day streak
              </div>
            </div>
          </div>

          <div className="p-3 space-y-2">
            {/* Streak Card - Compact */}
            <div className="rounded-lg border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="text-xs font-semibold text-amber-200">
                      Current Streak
                    </div>
                    <div className="text-[8px] text-amber-300/60">
                      Keep the momentum going!
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-200">
                  {planner.streak}
                </div>
              </div>

              {/* Streak Progress to Next Milestone */}
              <div className="mt-1.5">
                <div className="flex items-center justify-between text-[8px] text-amber-300/60 mb-0.5">
                  <span>Next milestone</span>
                  <span>{Math.ceil(planner.streak / 7) * 7} days</span>
                </div>
                <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(planner.streak % 7) * (100 / 7)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    style={{
                      boxShadow: "0 0 6px rgba(251,191,36,0.6)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div>
              <div className="text-sm font-semibold text-[#9FF2E8] mb-1.5">
                Today's Badges
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Early Bird Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    new Date().getHours() < 6
                      ? "border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">🌅</div>
                  <div className="text-[10px] font-semibold text-cyan-200">
                    Early Bird
                  </div>
                  <div className="text-[9px] text-cyan-300/60">Before 6 AM</div>
                </div>

                {/* Task Master Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    totalPlanned >= 6
                      ? "border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-[10px] font-semibold text-emerald-200">
                    Task Master
                  </div>
                  <div className="text-[9px] text-emerald-300/60">6+ tasks</div>
                </div>

                {/* Hydration Hero Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    (planner.dayMap?.[dayKey]?.habits?.water || 0) >= 8
                      ? "border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-[10px] font-semibold text-blue-200">
                    Hydration Hero
                  </div>
                  <div className="text-[9px] text-blue-300/60">8 glasses</div>
                </div>

                {/* Zen Master Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    planner.dayMap?.[dayKey]?.habits?.meditate
                      ? "border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">🧘</div>
                  <div className="text-[10px] font-semibold text-purple-200">
                    Zen Master
                  </div>
                  <div className="text-[9px] text-purple-300/60">Meditated</div>
                </div>

                {/* Bookworm Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    (planner.dayMap?.[dayKey]?.habits?.reading || 0) >= 30
                      ? "border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-[10px] font-semibold text-amber-200">
                    Bookworm
                  </div>
                  <div className="text-[9px] text-amber-300/60">30+ min</div>
                </div>

                {/* Perfect Day Badge */}
                <div
                  className={`rounded-lg border p-2 text-center transition-all ${
                    (() => {
                      const taskScore = totalPlanned;
                      const waterScore =
                        (planner.dayMap?.[dayKey]?.habits?.water || 0) / 8;
                      const meditateScore = planner.dayMap?.[dayKey]?.habits
                        ?.meditate
                        ? 1
                        : 0;
                      const readingScore =
                        (planner.dayMap?.[dayKey]?.habits?.reading || 0) / 30;
                      const total =
                        taskScore + waterScore + meditateScore + readingScore;
                      return total >= 11;
                    })()
                      ? "border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/10"
                      : "border-white/10 bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-[10px] font-semibold text-yellow-200">
                    Perfect Day
                  </div>
                  <div className="text-[9px] text-yellow-300/60">
                    100% score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CALENDAR PREVIEW + WEATHER */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6 items-stretch">
        {/* ================= LEFT: MINI CALENDAR ================= */}
        <div className="h-full">
          <div className="h-full rounded-xl border border-[#2F6B60]/40 bg-black/20 p-3">
            <MiniCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dayMap={planner.dayMap}
            />
          </div>
        </div>

        {/* ================= CENTER: DAY SUMMARY ================= */}
        <div className="h-full rounded-xl border border-[#2F6B60]/40 bg-black/20 backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-[#2F6B60]/30 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h3 className="text-sm font-bold text-[#9FF2E8]">
                  Day Summary
                </h3>
              </div>
              <div className="text-xs text-indigo-300/60">
                {dayjs(selectedDate).format("DD MMM YYYY")}
              </div>
            </div>
          </div>

          {/* Scroll area takes remaining height */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-[#2F6B60]/60 scrollbar-track-transparent">
            {SLOT_ORDER.map((slot) => {
              const items = currentDay[slot] || [];

              const slotColors = {
                Morning: {
                  gradient: "from-amber-500/10 to-orange-500/10",
                  border: "border-amber-400/20",
                  text: "text-amber-200",
                  emoji: "🌅",
                },
                Afternoon: {
                  gradient: "from-cyan-500/10 to-blue-500/10",
                  border: "border-cyan-400/20",
                  text: "text-cyan-200",
                  emoji: "☀️",
                },
                Evening: {
                  gradient: "from-purple-500/10 to-pink-500/10",
                  border: "border-purple-400/20",
                  text: "text-purple-200",
                  emoji: "🌙",
                },
              };

              const colors = slotColors[slot];

              return (
                <div
                  key={slot}
                  className={`rounded-lg border ${colors.border} bg-gradient-to-br ${colors.gradient}`}
                >
                  <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {colors.emoji} {slot}
                    </span>
                    <span className="text-[10px] text-white/50">
                      {items.length} tasks
                    </span>
                  </div>

                  <div className="p-2">
                    {items.length ? (
                      items.map((t, i) => (
                        <div
                          key={i}
                          className="text-xs text-white/80 p-2 rounded bg-black/30 mb-1"
                        >
                          {t}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-white/40 text-center py-3">
                        No tasks scheduled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT: WEATHER ================= */}
        <div className="h-full">
          <div className="h-full rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 flex flex-col">
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
