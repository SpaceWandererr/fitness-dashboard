// Goals.jsx — Full working cleaned + dynamic wrapper version
// UI preserved. All logic retained. All 5 sections wrapped in FadeSwiper.
// Replace your existing Goals.jsx with this file.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { load, save } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/animations.css"; // MUST come after
import { Briefcase, HeartPulse, Globe, Map, Target, Brain } from "lucide-react";

const SYLLABUS_KEY = "syllabus_tree_v2";
const DEFAULT_END = "2026-12-31"; // ISO
const START_KEY = "wd_mern_start_date";
const END_KEY = "wd_mern_end_date";
const AUTO_ADVANCE_MS = 120000; // 2 minutes

/* --------------------------
  Helpers (unchanged)
---------------------------*/
function parseISOFromDDMMYYYY(str) {
  if (!str) return null;
  if (/\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const [dd, mm, yyyy] = str.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  const d = new Date(str);
  return isNaN(d) ? null : d;
}
function formatDDMMYYYY(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function daysBetween(a, b) {
  if (!a || !b) return null;
  const A = new Date(a);
  const B = new Date(b);
  A.setHours(0, 0, 0, 0);
  B.setHours(0, 0, 0, 0);
  const diff = Math.round((B - A) / 86400000);
  return diff;
}
function safeJSONParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
function computeTotals(tree) {
  function walk(node) {
    if (!node) return { total: 0, done: 0 };
    if (Array.isArray(node)) {
      const total = node.length;
      const done = node.filter((i) => i.done).length;
      return { total, done };
    }
    let total = 0,
      done = 0;
    for (const v of Object.values(node || {})) {
      const t = walk(v);
      total += t.total;
      done += t.done;
    }
    return { total, done };
  }
  return walk(tree || {});
}

/* --------------------------
  DREAM CARDS (original content)
---------------------------*/
const dreamCards = [
  {
    title: "Long-Term Vision",
    icon: <Globe className="w-5 h-5 text-cyan-300" />,
    items: [
      "Settle in New Zealand",
      "Become Senior Full-Stack Developer",
      "Financial freedom",
      "Balanced nature lifestyle",
    ],
  },
  {
    title: "Short-Term Actions",
    icon: <Target className="w-5 h-5 text-green-300" />,
    items: [
      "Master JS + DSA (90 days)",
      "Build 3 MERN Projects",
      "Daily coding + gym",
      "Apply for remote jobs",
    ],
  },
  {
    title: "NZ Migration Roadmap",
    icon: <Map className="w-5 h-5 text-blue-300" />,
    roadmap: [
      "Master MERN → Build portfolio",
      "Crack interviews",
      "Get NZ job offer",
      "Visa (AEWV) approval",
      "Relocate + Settle",
    ],
  },
  {
    title: "Career Excellence",
    icon: <Briefcase className="w-5 h-5 text-purple-300" />,
    items: [
      "MERN + Cloud Skills",
      "Clean Architecture",
      "Open Source",
      "High-level problem solving",
    ],
  },
  {
    title: "Health & Discipline",
    icon: <HeartPulse className="w-5 h-5 text-red-300" />,
    items: [
      "Lean physique",
      "6× weekly gym",
      "Early wake routine",
      "Mental clarity habits",
    ],
  },
  {
    title: "Why These Dreams Matter",
    icon: <Brain className="w-5 h-5 text-indigo-300" />,
    statement:
      "Because you want a peaceful, financially stable, skill-rich life full of purpose, calmness, and freedom.",
  },
];

/* --------------------------
  UNIVERSAL FadeSwiper
  - Autoplay only when data.length > 1
  - Fade + slide (enter/exit)
  - Drag support
---------------------------*/
function FadeSwiper({ data = [], render }) {
  const [[idx, dir], setIdx] = useState([0, 0]);
  const safeIdx = ((idx % data.length) + data.length) % data.length;

  const paginate = (d) => setIdx(([p]) => [p + d, d]);

  useEffect(() => {
    if (!data || data.length <= 1) return;
    const t = setInterval(() => paginate(1), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [data]);

  const variants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35 } },
    exit: (d) => ({ x: d < 0 ? 40 : -40, opacity: 0, transition: { duration: 0.25 } }),
  };

  // If no data, render nothing
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragElastic={0.6}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) paginate(1);
            else if (offset.x > 50) paginate(-1);
          }}
          className="absolute inset-0"
        >
          {render(data[safeIdx], safeIdx)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* --------------------------
  MAIN COMPONENT
---------------------------*/
export default function Goals() {
  const navigate = useNavigate();

  // Read syllabus totals live
  const [syllabusTree, setSyllabusTree] = useState(
    () => safeJSONParse(localStorage.getItem(SYLLABUS_KEY)) || {}
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (!e || e.key === SYLLABUS_KEY) {
        setSyllabusTree(
          safeJSONParse(localStorage.getItem(SYLLABUS_KEY)) || {}
        );
      }
    };
    window.addEventListener("storage", onStorage);
    // poll for same-tab updates (keeps in sync)
    const poll = setInterval(() => {
      setSyllabusTree(safeJSONParse(localStorage.getItem(SYLLABUS_KEY)) || {});
    }, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  const totals = useMemo(() => computeTotals(syllabusTree), [syllabusTree]);
  const { total: totalTopics, done: doneTopics } = totals;
  const merPercent = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;

  // Persist shared progress key for cross-page sync
  useEffect(() => {
    try {
      save("wd_mern_progress", merPercent);
    } catch {}
  }, [merPercent]);

  // Date settings (defaults)
  const todayISO = new Date().toISOString().slice(0, 10);
  const [startISO, setStartISO] = useState(() => localStorage.getItem(START_KEY) || todayISO);
  const [endISO, setEndISO] = useState(() => localStorage.getItem(END_KEY) || DEFAULT_END);

  useEffect(() => {
    try {
      localStorage.setItem(START_KEY, startISO);
    } catch {}
  }, [startISO]);

  useEffect(() => {
    try {
      localStorage.setItem(END_KEY, endISO);
    } catch {}
  }, [endISO]);

  // Derived date metrics
  const startDate = useMemo(() => (startISO ? new Date(startISO) : null), [startISO]);
  const endDate = useMemo(() => (endISO ? new Date(endISO) : null), [endISO]);
  const now = new Date();
  const totalDays = startDate && endDate ? daysBetween(startISO, endISO) : null;
  const daysElapsed = startDate ? daysBetween(startISO, now.toISOString().slice(0, 10)) : null;
  const daysRemaining = endDate ? daysBetween(now.toISOString().slice(0, 10), endISO) : null;

  const timeProgressPct =
    totalDays && daysElapsed !== null && totalDays > 0
      ? Math.max(0, Math.min(100, Math.round((daysElapsed / totalDays) * 100)))
      : 0;

  // pace calculations (topics/day required to finish from now)
  const remainingTopics = Math.max(0, (totalTopics || 0) - (doneTopics || 0));
  const paceRequired = daysRemaining && daysRemaining > 0 ? (remainingTopics / daysRemaining).toFixed(2) : "—";

  // projected finish
  let projectedFinishISO = null;
  if (daysElapsed > 0 && doneTopics > 0) {
    const speed = doneTopics / daysElapsed; // topics per day
    if (speed > 0) {
      const daysToFinish = remainingTopics / speed;
      const projected = new Date();
      projected.setDate(projected.getDate() + Math.ceil(daysToFinish));
      projectedFinishISO = projected.toISOString().slice(0, 10);
    }
  }

  // MERN internal page swipe (keeps original 4-page behavior)
  const [page, setPage] = useState(0);
  const totalPages = 4; // PAGES.length kept as 4 originally

  useEffect(() => {
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [totalPages]);

  const handleDragEnd = (info) => {
    const dx = info?.offset?.x ?? 0;
    const vx = info?.velocity?.x ?? 0;
    if (dx < -60 || vx < -400) setPage((p) => (p + 1) % totalPages);
    else if (dx > 60 || vx > 400) setPage((p) => (p - 1 + totalPages) % totalPages);
  };

  // ring gradient mapping (keeps original)
  function ringGradientFor(percent) {
    if (percent <= 10) return ["g_low", "#00ffd1", "#00b3ff"];
    if (percent <= 40) return ["g_mid", "#00ffd1", "#56ccff"];
    if (percent <= 70) return ["g_high", "#00ffd1", "#a13bff"];
    return ["g_max", "#00ffd1", "#ff4da6"];
  }
  const ringGradientStops = ringGradientFor(merPercent);

  const R = 64;
  const C = 2 * Math.PI * R;

  // Date popup & tmp state
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [tmpStart, setTmpStart] = useState(() => (startISO ? startISO : todayISO));
  const [tmpEnd, setTmpEnd] = useState(() => (endISO ? endISO : DEFAULT_END));
  useEffect(() => setTmpStart(startISO), [startISO]);
  useEffect(() => setTmpEnd(endISO), [endISO]);

  const saveDates = () => {
    const s = parseISOFromDDMMYYYY(tmpStart) || new Date(tmpStart);
    const e = parseISOFromDDMMYYYY(tmpEnd) || new Date(tmpEnd);
    function toISODate(d) {
      const D = new Date(d);
      if (isNaN(D)) return null;
      return D.toISOString().slice(0, 10);
    }
    const sISO = toISODate(s);
    const eISO = toISODate(e);
    if (!sISO || !eISO) {
      alert("Invalid dates");
      return;
    }
    setStartISO(sISO);
    setEndISO(eISO);
    setShowDatePopup(false);
  };

  const popupRef = useRef(null);
  useEffect(() => {
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowDatePopup(false);
      }
    }
    if (showDatePopup) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDatePopup]);

  const tiltVariants = {
    initial: { rotateX: 10, rotateY: 0 },
    hover: { rotateX: 5, rotateY: -5, transition: { duration: 0.4 } },
  };

  function ModuleProgress({ percent }) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
    return (
      <svg width="50" height="50">
        <circle cx="25" cy="25" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
        <circle cx="25" cy="25" r={radius} stroke="cyan" strokeWidth="4" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-700 ease-out" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-[10px] fill-white">{percent}%</text>
      </svg>
    );
  }

  // NZ progress numbers (kept as before)
  const basicsPercent = 95;
  const interPercent = 70;
  const advPercent = 70;
  const nzSkillsDone = 3;
  const nzDocsDone = 4;
  const nzJobDone = 2;
  const nzCitiesDone = 0;
  const totalNZ = 4 + 4 + 4 + 4;
  const completedNZ = nzSkillsDone + nzDocsDone + nzJobDone + nzCitiesDone;
  const nzPercent = Math.round((completedNZ / totalNZ) * 100);

  // NZ page logic (keeps original 1..8)
  const [nzPage, setNzPage] = useState(1);
  useEffect(() => {
    const it = setInterval(() => {
      setNzPage((prev) => (prev === 8 ? 1 : prev + 1));
    }, 120000);
    return () => clearInterval(it);
  }, []);

  const handleNZDrag = (info) => {
    if (info.offset.x < -40) setNzPage((prev) => (prev === 8 ? 1 : prev + 1));
    if (info.offset.x > 40) setNzPage((prev) => (prev === 1 ? 8 : prev - 1));
  };

  /* --------------------------
    Now we prepare the five "section-cards" as single-item arrays
    so we can wrap them in FadeSwiper without removing any logic.
    Each element is an object with a `render` function that returns the exact same UI
    that existed before. This keeps all logic intact while making sections swipable.
  ---------------------------*/

  const mernWrapper = [
    {
      // render MERN full card (same markup + logic as original)
      render: () => (
        <motion.div
          className="relative rounded-2xl"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => handleDragEnd(info)}
          whileHover={{ scale: 1.01 }}
          style={{
            transform: "translateZ(0)",
            willChange: "transform, opacity",
            isolation: "isolate",
            WebkitMaskImage: "linear-gradient(white, white)",
            maskImage: "linear-gradient(white, white)",
          }}
        >
          <div
            className="relative rounded-xl border border-[rgba(150,255,230,0.06)] bg-[rgba(10,20,30,0.35)]
              backdrop-blur-md p-5 shadow-xl h-full"
            style={{
              transformStyle: "preserve-3d",
              minHeight: 420,
              overflow: "hidden",
              boxShadow: "0 0 25px rgba(0,255,210,0.08), inset 0 0 10px rgba(255,255,255,0.04)",
              position: "relative",
            }}
          >
            {/* VERTICAL BAR + HORIZONTAL BAR + NEON corners (same as original) */}
            <div className="absolute left-0 top-0 h-full w-[4px] rounded-r-lg" style={{ background: "linear-gradient(to bottom, rgb(147,197,253), rgb(34,211,238), rgb(134,239,172))", boxShadow: "0 0 5px rgba(34,211,238,0.9), 0 0 35px rgba(134,239,172,0.8)", opacity: 0.95 }} />
            <div className="absolute bottom-0 left-0  w-full h-[4px] " style={{ background: "linear-gradient(to bottom, rgb(147,197,253), rgb(34,211,238), rgb(134,239,172))", boxShadow: "0 0 5px rgba(34,211,238,0.9), 0 0 35px rgba(134,239,172,0.8)", opacity: 0.95 }} />
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[rgba(60,240,210,0.08)] rounded-bl-xl" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[rgba(255,80,140,0.06)] rounded-tr-xl" />

            {/* SWIPER PAGES (inside card) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="absolute inset-0 p-4"
              >
                {/* PAGE 0 — Main redesigned MERN Mastery */}
                {page === 0 && (
                  <div className="w-full h-full flex flex-col justify-around ">
                    <div className="w-full text-center md:text-left ">
                      <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 justify-center md:justify-start whitespace-nowrap">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="text-4xl text-green-400 inline-block drop-shadow-[0_0_8px_rgba(0,255,100,0.6)]">
                          💠
                        </motion.div>
                        MERN MASTERY
                      </h3>
                    </div>

                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex flex-col">
                        <div className="text-sm opacity-80">Start: {formatDDMMYYYY(startISO)}</div>
                        <div className="text-sm opacity-80">End: {formatDDMMYYYY(endISO)}</div>
                        <button onClick={() => setShowDatePopup((s) => !s)} className="mt-2 text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-md">🗓 Set Dates</button>
                      </div>

                      <div className="flex-shrink-0 overflow-visible">
                        <svg width="140" height="150" viewBox="0 0 200 200">
                          <defs>
                            <linearGradient id={ringGradientStops[0]} x1="0" x2="1">
                              <stop offset="0%" stopColor={ringGradientStops[1]} />
                              <stop offset="100%" stopColor={ringGradientStops[2]} />
                            </linearGradient>

                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur stdDeviation="6" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <g transform="translate(100,100)">
                            <circle r={R} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                            <circle r={R} fill="transparent" stroke={`url(#${ringGradientStops[0]})`} strokeWidth="8" strokeDasharray={`${C} ${C}`} strokeDashoffset={C - Math.round((merPercent / 100) * C)} strokeLinecap="round" transform="rotate(-90)" style={{ filter: "url(#glow)", transition: "stroke-dashoffset .8s" }} />
                            <text x="0" y="-6" textAnchor="middle" fill="white" className="text-xl font-bold">{merPercent}%</text>
                            <text x="0" y="26" textAnchor="middle" fill="white" className="mt-2 text-xl opacity-70">MERN</text>
                          </g>
                        </svg>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="text-sm opacity-80 mb-2">Timeline</div>
                      <div className="w-full h-3 bg-white/5 rounded-full relative overflow-hidden">
                        <div className="h-3 absolute top-0 left-0 rounded-full" style={{ width: `${timeProgressPct}%`, background: `linear-gradient(90deg, ${ringGradientStops[1]}, ${ringGradientStops[2]})`, transition: "width .7s", boxShadow: `0 0 8px ${ringGradientStops[1]}, 0 0 16px ${ringGradientStops[2]}` }} />
                      </div>
                      <div className="flex justify-between text-xs opacity-70 mt-2">
                        <div>Elapsed: {timeProgressPct}%</div>
                        <div>Remaining: {100 - timeProgressPct}%</div>
                      </div>
                    </div>

                    <div className="w-full rounded-xl p-2 backdrop-blur border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm opacity-70">Snapshot</div>
                          <div className="text-base font-semibold">Topics: {doneTopics} / {totalTopics || "—"}</div>
                          <div className="text-xs opacity-70 mt-1 whitespace-nowrap">Pace needed: {paceRequired} / day</div>
                          <div className="text-xs opacity-70">Projected finish: {projectedFinishISO ? formatDDMMYYYY(projectedFinishISO) : "—"}</div>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-sm opacity-80">Days Remaining</div>
                          <div className="text-4xl font-bold leading-none my-2">{daysRemaining ?? "—"}</div>
                          <div className="text-xs opacity-70 whitespace-nowrap">Weeks: {Math.ceil((daysRemaining || 0) / 7)} • Months: {Math.ceil((daysRemaining || 0) / 30)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 1 — Basics */}
                {page === 1 && (
                  <motion.div className="w-full h-full relative flex flex-col p-3" variants={tiltVariants} initial="initial" whileHover="hover">
                    <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-teal-300 via-cyan-300 to-purple-400 opacity-60 blur-none rounded-xl mr-2" />
                    <div className="flex items-center justify-between mb-4">
                      <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="text-3xl">📘</motion.div>
                      <ModuleProgress percent={basicsPercent} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">MERN Basics</h3>
                    <p className="text-xs opacity-70 mb-4">HTML/CSS • JavaScript • React • Node Fundamentals</p>
                    <div className="space-y-3 text-sm">
                      <div>🟢 Layout (Flexbox & Grid)</div>
                      <div>🟢 ES6 + DOM + Fetch</div>
                      <div>🟢 React Hooks & Routing</div>
                      <div>🟢 Basic Node APIs</div>
                    </div>
                    <div className="mt-5">
                      <div className="text-xs opacity-60 mb-2">Tools</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">VS Code</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Git</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Postman</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs opacity-60">Output: Landing page • JS Mini Projects • Basic API</div>
                    <div className="flex-1" />
                    <div className="text-center text-xs opacity-40 mb-1">Swipe → Intermediate</div>
                  </motion.div>
                )}

                {/* PAGE 2 — Intermediate */}
                {page === 2 && (
                  <motion.div className="w-full h-full relative flex flex-col p-3" variants={tiltVariants} initial="initial" whileHover="hover">
                    <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-purple-400 via-indigo-400 to-blue-400 opacity-60 blur-none rounded mr-2" />
                    <div className="flex items-center justify-between mb-4">
                      <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="text-3xl">⚙️</motion.div>
                      <ModuleProgress percent={interPercent} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">MERN Intermediate</h3>
                    <p className="text-xs opacity-70 mb-4">Backend Strength • Database • API Patterns</p>
                    <div className="space-y-3 text-sm">
                      <div>🟣 MongoDB Schema Design</div>
                      <div>🟣 Express Auth + Middleware</div>
                      <div>🟣 React Context Optimization</div>
                      <div>🟣 Node Performance Tuning</div>
                    </div>
                    <div className="mt-5">
                      <div className="text-xs opacity-60 mb-2">Tools</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">JWT</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Mongo Compass</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Bcrypt</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs opacity-60">Output: Auth System • Full REST API • Protected Routing</div>
                    <div className="flex-1" />
                    <div className="text-center text-xs opacity-40 mb-1">Swipe → Advanced</div>
                  </motion.div>
                )}

                {/* PAGE 3 — Advanced */}
                {page === 3 && (
                  <motion.div className="w-full h-full relative flex flex-col p-3" variants={tiltVariants} initial="initial" whileHover="hover">
                    <div className="absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-red-400 via-orange-400 to-yellow-400 opacity-60 blur-none rounded mr-2" />
                    <div className="flex items-center justify-between mb-4">
                      <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 6, repeat: Infinity }} className="text-3xl">🚀</motion.div>
                      <ModuleProgress percent={advPercent} />
                    </div>
                    <h3 className="text-xl font-bold mb-1">MERN Advanced</h3>
                    <p className="text-xs opacity-70 mb-4">Scaling • Cloud • Production Pipelines</p>
                    <div className="space-y-3 text-sm">
                      <div>🔴 Docker + CI/CD</div>
                      <div>🔴 Job Queues & Workers</div>
                      <div>🔴 Redis Caching Systems</div>
                      <div>🔴 DSA — Arrays • Graphs • DP</div>
                    </div>
                    <div className="mt-5">
                      <div className="text-xs opacity-60 mb-2">Tools</div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Docker</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">Redis</div>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md">GitHub Actions</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs opacity-60">Output: Deployable App • Caching System • Docker Pipeline</div>
                    <div className="flex-1" />
                    <div className="text-center text-xs opacity-40 mb-1">Swipe → Main</div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Date Popup (retained) */}
            <AnimatePresence>
              {showDatePopup && (
                <motion.div ref={popupRef} initial={{ opacity: 0, scale: 0.98, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 6 }} transition={{ duration: 0.15 }} className="absolute left-2/2 -translate-x-1/2 bottom-6 z-50 w-[260px] p-4 rounded-xl bg-[rgba(10,18,28,0.92)] border border-white/10 backdrop-blur">
                  <div className="text-xs text-white/70 mb-3">Select Start & End Date</div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">Start Date</label>
                      <input type="date" value={startISO} onChange={(e) => setStartISO(e.target.value)} className="w-full px-2 py-2 rounded-md bg-white/5 border border-white/10 text-xs focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] opacity-70">End Date</label>
                      <input type="date" value={endISO} onChange={(e) => setEndISO(e.target.value)} className="w-full px-2 py-2 rounded-md bg-white/5 border border-white/10 text-xs focus:outline-none" />
                    </div>
                    <div className="flex justify-between mt-2">
                      <button onClick={() => setShowDatePopup(false)} className="text-xs px-3 py-1 rounded-md bg-white/5 border border-white/10">Cancel</button>
                      <button onClick={() => { saveDates(); }} className="text-xs px-3 py-1 rounded-md bg-teal-500/20 border border-teal-400/20 text-teal-300">Save</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ),
    },
  ];

  const nzWrapper = [
    {
      render: () => (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => handleNZDrag(info)}
          whileHover={{ scale: 1.01 }}
          className="rounded-xl p-5 border border-[rgba(0,240,210,0.06)] bg-[rgba(10,20,30,0.35)] backdrop-blur-xl shadow-lg relative overflow-hidden"
          style={{ transform: "translateZ(0)", willChange: "transform, opacity", isolation: "isolate", WebkitMaskImage: "linear-gradient(white, white)", maskImage: "linear-gradient(white, white)", boxShadow: "0 0 25px rgba(0,255,210,0.08), inset 0 0 10px rgba(255,255,255,0.04)" }}
        >
          <div className="absolute left-0 top-0 h-full w-[4px] rounded-r-lg" style={{ background: "linear-gradient(to bottom, rgb(147,197,253), rgb(34,211,238), rgb(134,239,172))", boxShadow: "0 0 5px rgba(34,211,238,0.9), 0 0 35px rgba(134,239,172,0.8)", opacity: 0.95 }} />
          <div className="absolute bottom-0 left-0  w-full h-[4px] " style={{ background: "linear-gradient(to bottom, rgb(147,197,253), rgb(34,211,238), rgb(134,239,172))", boxShadow: "0 0 5px rgba(34,211,238,0.9), 0 0 35px rgba(134,239,172,0.8)", opacity: 0.95 }} />

          <div className="flex items-center justify-between mb-1">
            <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="text-3xl">🇳🇿</motion.div>
            <ModuleProgress percent={nzPercent} />
          </div>

          <h3 className="text-xl font-bold mb-1">Road to New Zealand</h3>
          <p className="text-xs opacity-70 mb-4">Visa • Skills • Jobs • Savings • Documentation</p>

          {/* NZ pages preserved exactly, wrapped inside FadeSwiper */}
          <div>
            <FadeSwiper
              data={[
                { title: "Skill Preparation", items: ["MERN Stack Mastery", "Cloud (AWS / Docker)", "API + Security", "Soft Skills + Comm"] },
                { title: "Documents", items: ["IELTS (General)", "Skills Assessment", "NZ Style Resume", "Bank Savings Proof"] },
                { title: "Job Strategy", items: ["Apply to AEWV Employers", "Remote NZ Interviews", "LinkedIn Outreach", "Portfolio + Projects"] },
                { title: "Cities & Salary", items: ["Auckland — $80K–120K", "Wellington — Tech + Govt", "Christchurch — Cheaper", "Hamilton — Growing IT"] },
                { title: "Phase 1 — Skill Building", items: ["Complete MERN stack", "Start 2 projects", "Build LinkedIn"] },
                { title: "Phase 2 — Documentation", items: ["IELTS (General)", "Skills Assessment", "Savings ₹4–6L"] },
                { title: "Phase 3 — Job Applications", items: ["AEWV employers", "Remote interviews", "Portfolio polish"] },
                { title: "Phase 4 — Visa Process", items: ["Work visa", "Move to NZ", "Apply for residency"] },
              ]}
              render={(card) => (
                <div className="space-y-2">
                  <div className="font-semibold text-sm">{card.title}</div>
                  <ul className="text-xs opacity-70 space-y-1">
                    {card.items.map((i, n) => (
                      <li key={n}>• {i}</li>
                    ))}
                  </ul>
                  <div className="text-center text-xs opacity-40 mt-4">Swipe → Next Step</div>
                </div>
              )}
            />
          </div>
        </motion.div>
      ),
    },
  ];

  const fitnessWrapper = [
    {
      render: () => (
        <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-xl p-5 border border-white/5 bg-[rgba(15,20,30,0.45)] backdrop-blur-xl shadow-lg overflow-hidden">
          <h4 className="text-lg font-bold mb-1 flex items-center gap-2">🏋 Fitness Command</h4>

          {(() => {
            // original gym logic from your provided file (kept intact)
            const logs = JSON.parse(localStorage.getItem("wd_gym_logs") || "{}");
            const overrides = JSON.parse(localStorage.getItem("wd_weight_overrides") || "{}");
            const bmiLogs = JSON.parse(localStorage.getItem("bmi_logs") || "[]");
            const goals = JSON.parse(localStorage.getItem("wd_goals") || "{}");
            const target = Number(goals?.targetWeight || 0);
            const start = Number(localStorage.getItem("wd_start_weight")) || null;
            const today = new Date();
            const dateKey = today.toISOString().slice(0, 10);
            const todayLog = logs[dateKey] || {};
            const recentWeights = bmiLogs.map((e) => e?.weight).filter((w) => typeof w === "number");
            const inferredStart = recentWeights.length ? Math.max(...recentWeights.slice(-30)) : todayLog.weight ?? target;
            const effectiveStart = start ?? inferredStart;
            const curWeight = overrides[dateKey] ?? todayLog.weight ?? recentWeights.slice().reverse()[0] ?? effectiveStart;
            const height = 1.7678;
            const bmi = curWeight ? (curWeight / (height * height)).toFixed(1) : "—";
            const totalNeeded = effectiveStart - target;
            const lost = effectiveStart - curWeight;
            const pct = totalNeeded > 0 ? Math.min(100, ((lost / totalNeeded) * 100).toFixed(1)) : 0;

            return (
              <div className="space-y-3">
                <div className="text-sm opacity-75">Current weight, target weight & BMI</div>

                <div>
                  <div className="text-xs opacity-70">Lost {lost.toFixed(1)}kg / {totalNeeded.toFixed(1)}kg</div>
                  <div className="h-3 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-3 rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#00ffd1,#56ccff,#a13bff)", boxShadow: "0 0 8px #00ffd1", transition: "width .4s" }} />
                  </div>
                  <div className="text-xs opacity-60 mt-1">{pct}% done <span className="pl-6">6x / Week</span></div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center mt-1">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <div className="text-sm font-semibold">{curWeight}kg</div>
                    <div className="text-[10px] opacity-70">Current</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <div className="text-sm font-semibold">{target}kg</div>
                    <div className="text-[10px] opacity-70">Target</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                    <div className="text-sm font-semibold">{bmi}</div>
                    <div className="text-[10px] opacity-70">BMI</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      ),
    },
  ];

  const routineWrapper = [
    {
      render: () => (
        <motion.div whileHover={{ y: -4 }} className="rounded-xl p-5 border border-white/5 bg-[rgba(15,20,30,0.45)] backdrop-blur-xl shadow-lg relative overflow-hidden">
          <h4 className="relative z-10 text-lg font-bold mb-2 flex items-center gap-2">⏱ Daily Routine</h4>

          <FadeSwiper
            data={[
              {
                morning: ["5:30 — Wake", "6:00–7:45 — Gym", "7:45–8:30 — Morning routine"],
                night: ["8:30–11:30 — Coding (JS + DSA)", "11:30–12:30 — Journal + Plan"],
              },
            ]}
            render={(card) => (
              <div className="relative z-10 text-sm opacity-80 leading-relaxed">
                {card.morning.map((m, i) => <div key={`m${i}`}>{m}</div>)}
                {card.night.map((n, j) => <div key={`n${j}`}>{n}</div>)}
                <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md p-2 bg-white/5 border border-white/10 text-center">Morning Focus</div>
                  <div className="rounded-md p-2 bg-white/5 border border-white/10 text-center">Night Deep Work</div>
                  <div className="rounded-md p-2 bg-white/5 border border-white/10 text-center">Weekly Review</div>
                  <div className="rounded-md p-2 bg-white/5 border border-white/10 text-center">Portfolio Sprint</div>
                </div>
              </div>
            )}
          />
        </motion.div>
      ),
    },
  ];

  const dreamWrapper = [
    {
      render: () => (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0 }} className="rounded-xl p-3 border border-white/5 bg-[rgba(15,20,30,0.45)] backdrop-blur-xl shadow-lg relative overflow-hidden">
          <h4 className="text-lg font-bold">🌌 Dream Board</h4>
          <div className="relative min-h-[190px] h-[190px] z-10 overflow-hidden">
            <FadeSwiper
              data={dreamCards}
              render={(card) => (
                <div className="space-y-2 pr-1">
                  <div className="flex items-center gap-2">
                    {card.icon}
                    <h3 className="text-base font-semibold">{card.title}</h3>
                  </div>
                  {card.items && <ul className="text-sm opacity-80 space-y-1 pl-1">{card.items.map((p, i) => <li key={i}>• {p}</li>)}</ul>}
                  {card.roadmap && <ol className="text-sm opacity-80 space-y-1 pl-1 list-decimal list-inside">{card.roadmap.map((s, i) => <li key={i}>{s}</li>)}</ol>}
                  {card.statement && <p className="text-sm opacity-80 leading-relaxed">{card.statement}</p>}
                </div>
              )}
            />
          </div>
        </motion.div>
      ),
    },
  ];

  /* --------------------------
    Now render the layout, replacing original sections
    with FadeSwiper wrappers while preserving all logic/UI.
  ---------------------------*/

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-background text-foreground transition-colors rounded-2xl -mt-4">
      {/* subtle background holographic grid */}
      <div className="absolute inset-0 -z-10">
        <div className=" absolute inset-0 bg-gradient-to-br from-[rgba(6,30,26,0.18)] via-[rgba(6,18,30,0.12)] to-[rgba(112,14,30,0.06)]" />
        <div className="absolute inset-0 animate-grid move-grid" />
      </div>

      <header className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight whitespace-nowrap hover:tracking-wider transition-all duration-300">
          JAY SINH THAKUR
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <section className="mb-8 transform-gpu" style={{ transform: `translateZ(40px)` }}>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-snug text-center" style={{ textShadow: "0 6px 30px rgba(0,0,0,0.6), 0 0 18px rgba(40,200,180,0.06)" }}>
            <span className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-teal-300/10 to-cyan-300/6 border border-[rgba(255,255,255,0.03)]">
              🚀 My Holographic Goals Command Center
            </span>
          </h1>
          <p className="mt-3 text-center text-sm text-muted-foreground/80 max-w-2xl mx-auto">
            Futuristic view of your MERN roadmap, NZ migration plan, fitness goals and daily routine — with live countdown & holo-visuals.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* LEFT: wrap MERN (single-card array) */}
          <div>
            <FadeSwiper data={mernWrapper} render={(item) => item.render()} />
          </div>

          {/* MIDDLE: NZ + Fitness stack (two cards) */}
          <div className="space-y-6">
            <FadeSwiper data={nzWrapper} render={(it) => it.render()} />
            <FadeSwiper data={fitnessWrapper} render={(it) => it.render()} />
          </div>

          {/* RIGHT: Routine + Dream Board */}
          <div className="space-y-6">
            <FadeSwiper data={routineWrapper} render={(it) => it.render()} />
            <FadeSwiper data={dreamWrapper} render={(it) => it.render()} />
          </div>
        </div>

        {/* Footer CTA (unchanged) */}
        <section className="mt-10">
          <div className="rounded-2xl p-6 border border-[rgba(255,255,255,0.02)] bg-[linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.00))] backdrop-blur-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm opacity-80">Need help? I can:</div>
                <div className="text-lg font-semibold">
                  Generate a detailed MERN study plan, NZ job application pack, or migration checklist.
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border bg-[rgba(0,240,210,0.04)] hover:scale-105">Create MERN Plan</button>
                <button className="px-4 py-2 rounded-lg border bg-[rgba(161,59,255,0.04)] hover:scale-105">NZ Checklist</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Styles (kept same) */}
      <style>{`
        .animate-grid {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(transparent 0 0);
          background-size: 24px 24px, 100% 100%;
          animation: gridShift 8s linear infinite;
          opacity: 0.05;
        }
        @keyframes gridShift {
          0% { background-position: 0 0; transform: translateZ(-100px); }
          50% { background-position: 100px 60px; transform: translateZ(-120px); }
          100% { background-position: 0 0; transform: translateZ(-100px); }
        }
        .move-grid::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(120deg, rgba(255,255,255,0.02) 0%, rgba(0,240,210,0.02) 30%, rgba(161,59,255,0.01) 70%, rgba(255,80,140,0.01) 100%);
          mix-blend-mode: overlay;
          pointer-events: none;
          animation: streak 14s linear infinite;
          opacity: 0.6;
        }
        @keyframes streak {
          0% { transform: translate3d(-30%, -10%, 0) skewX(-6deg); opacity: 0.5; }
          50% { transform: translate3d(30%, 10%, 0) skewX(-6deg); opacity: 0.6; }
          100% { transform: translate3d(-30%, -10%, 0) skewX(-6deg); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
