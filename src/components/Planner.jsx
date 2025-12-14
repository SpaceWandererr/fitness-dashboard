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
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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
            },${points[i + 1] ? points[i + 1].split(",")[1] : p.split(",")[1]}`
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
    const interval = setInterval(() => {
      // Random lightning position
      setBoltPosition({
        x: 30 + Math.random() * 40,
        y: 10 + Math.random() * 20,
      });

      setFlash(true);
      setTimeout(() => setFlash(false), 150);
    }, 3000 + Math.random() * 2000); // Random interval 3-5s

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
    <div className="w-full h-full flex flex-col">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setShowSearch((s) => !s)}
          className="px-2.5 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all"
        >
          <span className="text-sm">🔍</span>
        </button>
        <h3 className="text-xs font-medium text-white/80 truncate flex-1 text-right px-2">
          {title}
        </h3>
      </div>

      {/* Search (collapsed by default) */}
      <div
        className={`transition-all duration-300 ${
          showSearch ? "max-h-64 mb-3 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <input
          value={localInput}
          onChange={(e) => {
            setLocalInput(e.target.value);
            setCityInput(e.target.value);
          }}
          placeholder="Search city..."
          className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
        />
        {suggestions?.length > 0 && (
          <div className="mt-2 max-h-36 overflow-auto rounded-lg bg-black/40 backdrop-blur-sm">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => onSelect(s)}
                className="px-3 py-2 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0"
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

      {/* Compact weather card - FIXED HEIGHT */}
      <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 shadow-xl h-[280px] flex flex-col">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-yellow-500/20 to-blue-500/10" />

        {/* Weather animation */}
        <div className="absolute inset-0">
          <WeatherAnimation condition={condition} isNight={isNight} />
        </div>

        {/* Top gradient overlay for depth */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />

        {/* Main content - temperature */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
          <div className="text-6xl font-black text-white drop-shadow-2xl mb-1">
            {temp !== null ? `${Math.round(temp)}°` : "--"}
          </div>
          <div className="text-base text-white/90 font-medium capitalize">
            {condition || "Loading..."}
          </div>
        </div>

        {/* Compact stats - 2x2 grid */}
        <div className="relative z-30 backdrop-blur-md bg-black/40 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/30 flex items-center justify-center text-sm">
                💧
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-white/50 uppercase tracking-wide">
                  Humidity
                </span>
                <span className="text-sm font-bold text-white">
                  {weatherData?.main?.humidity ?? "--"}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/30 flex items-center justify-center text-sm">
                💨
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-white/50 uppercase tracking-wide">
                  Wind
                </span>
                <span className="text-sm font-bold text-white">
                  {Math.round(weatherData?.wind?.speed ?? 0)} m/s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-500/30 flex items-center justify-center text-sm">
                🌅
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-white/50 uppercase tracking-wide">
                  Sunrise
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  {weatherData?.meta?.sunrise
                    ? dayjs(weatherData.meta.sunrise).format("h:mm A")
                    : "--"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-sm">
                🌇
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] text-white/50 uppercase tracking-wide">
                  Sunset
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  {weatherData?.meta?.sunset
                    ? dayjs(weatherData.meta.sunset).format("h:mm A")
                    : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal CSS */}
      <style>{`
      /* Snow spray particles */
@keyframes snow-spray {
  0% {
    opacity: 0.8;
    transform: translateX(0) translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-8px) translateY(-4px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translateX(-16px) translateY(-8px) scale(0.6);
  }
}

.animate-snow-spray {
  animation: snow-spray 0.8s ease-out infinite;
}

      /* Snow plow animation - moves from right to left */
@keyframes snow-plow {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(-100vw - 100px));
    opacity: 0;
  }
}

.animate-snow-plow {
  animation: snow-plow 3s linear forwards;
}


      /* Shooting star animation */
@keyframes shooting-star {
  0% {
    transform: translateX(0) translateY(0) rotate(-30deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateX(-200px) translateY(100px) rotate(-30deg);
    opacity: 0;
  }
}

.animate-shooting-star {
  animation: shooting-star 2s ease-in 3s infinite;
}

  /* ===== SUN ANIMATIONS ===== */
  
  /* Smooth ray rotation */
  @keyframes sun-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Breathing glow effect */
  @keyframes sun-breathe {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.9;
    }
  }

  /* Gentle pulsing for sun body */
  @keyframes sun-pulse {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.03);
      filter: brightness(1.1);
    }
  }

  /* Twinkling sparkles */
  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* ===== RAIN ANIMATIONS ===== */
  
  /* Realistic rain drops with acceleration */
  @keyframes rain-fall {
    0% {
      transform: translateY(-100px);
      opacity: 0.8;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(400px);
      opacity: 0;
    }
  }

  /* Rain splash effect on ground */
  @keyframes rain-splash {
    0% {
      transform: scale(0) translateY(0);
      opacity: 1;
    }
    100% {
      transform: scale(2) translateY(10px);
      opacity: 0;
    }
  }

  /* ===== SNOW ANIMATIONS ===== */
  
  /* Realistic snow falling with drift */
  @keyframes snow-fall {
    0% {
      transform: translateY(-100px) translateX(0) rotate(0deg);
      opacity: 1;
    }
    25% {
      transform: translateY(100px) translateX(10px) rotate(90deg);
      opacity: 1;
    }
    50% {
      transform: translateY(200px) translateX(-5px) rotate(180deg);
      opacity: 0.8;
    }
    75% {
      transform: translateY(300px) translateX(15px) rotate(270deg);
      opacity: 0.6;
    }
    100% {
      transform: translateY(400px) translateX(0) rotate(360deg);
      opacity: 0;
    }
  }

  /* Gentle swaying for snowflakes */
  @keyframes snow-sway {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(20px);
    }
  }

  /* ===== CLOUD ANIMATIONS ===== */
  
  /* Smooth cloud drift */
  @keyframes cloud-drift {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(150%);
    }
  }

  /* Cloud morphing effect */
  @keyframes cloud-morph {
    0%, 100% {
      border-radius: 50% 60% 50% 60%;
      transform: scale(1);
    }
    50% {
      border-radius: 60% 50% 60% 50%;
      transform: scale(1.05);
    }
  }

  /* ===== THUNDER/LIGHTNING ANIMATIONS ===== */
  
  /* Lightning flash */
  @keyframes lightning-flash {
    0%, 10%, 20%, 100% {
      opacity: 0;
    }
    5%, 15% {
      opacity: 1;
    }
  }

  /* Thunder rumble effect */
  @keyframes thunder-rumble {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-2px);
    }
    75% {
      transform: translateX(2px);
    }
  }

  /* ===== WIND/FOG ANIMATIONS ===== */
  
  /* Wind blowing effect */
  @keyframes wind-blow {
    0%, 100% {
      transform: translateX(-30%) skewX(-3deg);
      opacity: 0.4;
    }
    50% {
      transform: translateX(30%) skewX(3deg);
      opacity: 0.7;
    }
  }

  /* Fog rolling in */
  @keyframes fog-roll {
    0% {
      transform: translateX(-100%);
      opacity: 0.2;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateX(100%);
      opacity: 0.2;
    }
  }

  /* ===== MOON ANIMATIONS ===== */
  
  /* Moon glow pulse */
  @keyframes moon-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(200, 200, 255, 0.4),
                  0 0 40px rgba(200, 200, 255, 0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(200, 200, 255, 0.6),
                  0 0 60px rgba(200, 200, 255, 0.3);
    }
  }

  /* Stars twinkling */
  @keyframes star-twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  /* ===== APPLY ANIMATIONS ===== */
  
  .animate-sun-rotate {
    animation: sun-rotate 20s linear infinite;
  }

  .animate-sun-breathe {
    animation: sun-breathe 4s ease-in-out infinite;
  }

  .animate-sun-pulse {
    animation: sun-pulse 3s ease-in-out infinite;
  }

  .animate-sparkle {
    animation: sparkle 2s ease-in-out infinite;
  }

  .animate-rain-fall {
    animation: rain-fall 0.8s linear infinite;
  }

  .animate-rain-splash {
    animation: rain-splash 0.4s ease-out forwards;
  }

  .animate-snow-fall {
    animation: snow-fall 5s linear infinite;
  }

  .animate-snow-sway {
    animation: snow-sway 3s ease-in-out infinite;
  }

  .animate-cloud-drift {
    animation: cloud-drift 25s linear infinite;
  }

  .animate-cloud-morph {
    animation: cloud-morph 8s ease-in-out infinite;
  }

  .animate-lightning-flash {
    animation: lightning-flash 1.5s ease-in-out;
  }

  .animate-thunder-rumble {
    animation: thunder-rumble 0.3s ease-in-out;
  }

  .animate-wind-blow {
    animation: wind-blow 6s ease-in-out infinite;
  }

  .animate-fog-roll {
    animation: fog-roll 12s ease-in-out infinite;
  }

  .animate-moon-glow {
    animation: moon-glow 4s ease-in-out infinite;
  }

  .animate-star-twinkle {
    animation: star-twinkle 3s ease-in-out infinite;
  }

  /* ===== UTILITY ANIMATIONS ===== */
  
  /* Smooth fade in */
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`}</style>
    </div>
  );

  // Helper function for weather icons
  function getWeatherIcon(condition, isNight) {
    const iconClass = "text-4xl filter drop-shadow-lg";

    if (condition?.toLowerCase().includes("clear")) {
      return (
        <div className={`${iconClass} animate-sun-glow`}>
          {isNight ? "🌙" : "☀️"}
        </div>
      );
    }
    if (condition?.toLowerCase().includes("cloud")) {
      return <div className={iconClass}>☁️</div>;
    }
    if (condition?.toLowerCase().includes("rain")) {
      return <div className={iconClass}>🌧️</div>;
    }
    if (condition?.toLowerCase().includes("snow")) {
      return <div className={iconClass}>❄️</div>;
    }
    if (condition?.toLowerCase().includes("thunder")) {
      return <div className={iconClass}>⚡</div>;
    }
    return <div className={iconClass}>🌤️</div>;
  }
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
        {/* Parent container with improved responsive sizing */}
        <div className="w-full sm:max-w-[280px] lg:max-w-[300px]">
          <div className="rounded-xl p-4 border border-[#2F6B60]/40 bg-black/20 hover:shadow-[0_0_12px_rgba(63,167,150,0.5)] hover:border-[#2F6B60]/60 transition-all duration-300">
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
