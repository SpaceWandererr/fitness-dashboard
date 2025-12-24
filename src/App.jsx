import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import {
  Menu,
  X,
  Scale,
  Dumbbell,
  BrainCircuit,
  Flame,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fitness-backend-laoe.onrender.com/api/state";

import Calendar from "./components/Calendar.jsx";
import Syllabus from "./components/Syllabus.jsx";
import Planner from "./components/Planner.jsx";
import Gallery from "./components/Gallery.jsx";
import Goals from "./components/Goals.jsx";
import Gym from "./components/Gym.jsx";
import Projects from "./components/Projects.jsx";
import Control from "./components/Control.jsx";
import GlobalUpgrade from "./components/GlobalUpgrade";

function normalizeSection(section, visited = new WeakSet()) {
  // Base cases
  if (!section || typeof section !== "object") return section;

  // PREVENT INFINITE RECURSION
  if (visited.has(section)) {
    console.warn("Circular reference detected in normalizeSection");
    return {}; // Return empty object instead
  }
  visited.add(section);

  // Handle arrays
  if (Array.isArray(section)) {
    return section.map((item) => normalizeSection(item, visited));
  }

  // Handle objects
  const normalized = {};

  // Copy properties AS-IS (don't add defaults!)
  for (const key of Object.keys(section)) {
    // Skip special metadata
    if (key.startsWith("_normalized")) {
      normalized[key] = section[key];
      continue;
    }

    // Handle nested objects/arrays recursively
    if (typeof section[key] === "object" && section[key] !== null) {
      normalized[key] = normalizeSection(section[key], visited);
    } else {
      normalized[key] = section[key];
    }
  }

  return normalized;
}

/* ======================= MAIN APP ======================= */

export default function App() {
  useEffect(() => {
    const handleVisibility = () => {
      document.documentElement.classList.toggle("paused", document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const [dark, setDark] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navRef = useRef(null);

  const [time, setTime] = useState(new Date());
  const [themeFlash, setThemeFlash] = useState(0);

  const themeBtnRef = useRef(null);
  const [flashOrigin, setFlashOrigin] = useState({ x: 0, y: 0 });
  const [dashboardState, setDashboardState] = useState({});
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  const [stats, setStats] = useState({
    weight: "—",
    gymDays: 0,
    topicsDone: 0,
    topicsTotal: 0,
    streak: 0,
  });

  const [weightHistory, setWeightHistory] = useState([]);
  const [gymLogDates, setGymLogDates] = useState([]);
  const [activePanel, setActivePanel] = useState("weight");
  // weight | gym | topics | streak

  const accent = "hsl(180, 100%, 50%)";

  // In App.jsx - Replace your FloatingScrollControl with this:
  const FloatingScrollControl = React.memo(function FloatingScrollControl({
    scrollRef,
  }) {
    const [showUpArrow, setShowUpArrow] = useState(false);

    useEffect(() => {
      const el = scrollRef?.current || window;

      const getScrollTop = () =>
        el === window ? window.scrollY : el.scrollTop;

      const getScrollableDistance = () =>
        el === window
          ? document.documentElement.scrollHeight - window.innerHeight
          : el.scrollHeight - el.clientHeight;

      const checkScroll = () => {
        const scrollTop = getScrollTop();
        const scrollableDistance = getScrollableDistance();
        const halfwayPoint = scrollableDistance * 0.5;

        setShowUpArrow((prev) => {
          if (scrollTop > halfwayPoint + 50) return true;
          if (scrollTop < halfwayPoint - 50) return false;
          return prev;
        });
      };

      let timeout;
      const onScroll = () => {
        clearTimeout(timeout);
        timeout = setTimeout(checkScroll, 1000);
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      checkScroll();

      return () => {
        el.removeEventListener("scroll", onScroll);
        clearTimeout(timeout);
      };
    }, [scrollRef]);

    const handleClick = () => {
      const el = scrollRef?.current || window;

      if (el === window) {
        window.scrollTo({
          top: showUpArrow ? 0 : document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        el.scrollTo({
          top: showUpArrow ? 0 : el.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    return (
      <button
        onClick={handleClick}
        aria-label={showUpArrow ? "Scroll to top" : "Scroll to bottom"}
        title={showUpArrow ? "Go to Top" : "Go to Bottom"}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-black/70 backdrop-blur-sm border border-teal-400/40 text-teal-300 text-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-teal-500/10 hover:scale-110 active:scale-95 transition-transform duration-150"
      >
        {showUpArrow ? "▲" : "▼"}
      </button>
    );
  });

  /* ---------- global effects ---------- */

  // live clock
  useEffect(() => {
    const update = () => setTime(new Date());
    update(); // Initial call
    const t = setInterval(update, 1000); // Update every 1 second
    return () => clearInterval(t);
  }, []);

  // nav height → used for main padding
  useEffect(() => {
    if (navRef.current) {
      const h = navRef.current.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--nav-height", `${h}px`);
    }
  }, []);

  // dark mode <html class="dark">
  // derive theme from backend
  useEffect(() => {
    if (!dashboardState?.ui?.theme) return;
    setDark(dashboardState.ui.theme === "dark");
  }, [dashboardState?.ui?.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ----------------- LOAD DASHBOARD STATE FROM BACKEND -----------------
  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      console.log("📡 Loading dashboard from backend...");
      setIsLoadingBackend(true); // ✅ Start loading

      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          console.error("❌ Backend error:", res.status);
          return;
        }

        const data = await res.json();

        // Backend may send wrapper or raw
        let state = data.dashboardState || data || {};

        // ---------------- SYLLABUS FIX ----------------

        const hasBackendSyllabus =
          state.syllabus_tree_v2 &&
          typeof state.syllabus_tree_v2 === "object" &&
          Object.keys(state.syllabus_tree_v2).length > 0;

        if (!hasBackendSyllabus) {
          console.warn(
            "📌 Backend empty → Leaving syllabus empty (Syllabus.jsx will seed)"
          );
        }

        // 🚨 Normalize only ONCE
        if (
          state.syllabus_tree_v2 &&
          typeof state.syllabus_tree_v2 === "object" &&
          !state.syllabus_tree_v2.__normalized
        ) {
          console.log("🔧 Normalizing syllabus now...");
          state.syllabus_tree_v2 = normalizeSection(
            structuredClone(state.syllabus_tree_v2)
          );
          state.syllabus_tree_v2.__normalized = true;
        } else {
          console.log("✔ Syllabus already normalized. Skipping.");
        }
        // ------------------------------------------------

        // ✅ FIXED: Always apply backend state (removed broken logic)
        if (!cancelled) {
          console.log("✅ Applying backend state");
          setDashboardState(state);

          // Cache to localStorage for next load
          try {
            localStorage.setItem("lifeosstate", JSON.stringify(state));
          } catch (err) {
            console.warn("⚠️ Could not cache to localStorage", err);
          }
        }
      } catch (err) {
        if (!cancelled) console.error("🔥 Load error:", err);
      } finally {
        if (!cancelled) setIsLoadingBackend(false); // ✅ Done loading
      }
    }

    // ✅ Load once on mount only
    loadState();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load stats from BACKEND ONLY
  // When dashboardState changes → recalc stats
  useEffect(() => {
    const gymLogs = dashboardState?.wd_gym_logs || {};
    const syllabus = dashboardState?.syllabus_tree_v2 || {};
    const doneMap = dashboardState?.wd_done || {};

    /* -------- Weight history -------- */
    const wh = Object.entries(gymLogs)
      .filter(([, v]) => typeof v?.weight === "number")
      .map(([date, v]) => ({ date, weight: v.weight }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const latestWeight = wh.length ? wh[wh.length - 1].weight : "—";
    const gymDates = Object.keys(gymLogs).sort();

    /* -------- Syllabus traversal -------- */
    function walk(node, visited = new WeakSet()) {
      if (!node || typeof node !== "object") return { total: 0, done: 0 };
      if (visited.has(node)) return { total: 0, done: 0 };
      visited.add(node);

      let total = 0;
      let done = 0;

      if (Array.isArray(node)) {
        for (const item of node) {
          const r = walk(item, visited);
          total += r.total;
          done += r.done;
        }
      } else {
        if (node.title) {
          total++;
          if (node.done) done++;
        }
        for (const child of Object.values(node)) {
          const r = walk(child, visited);
          total += r.total;
          done += r.done;
        }
      }

      return { total, done };
    }

    const { total, done: doneTopics } = walk(syllabus);

    /* -------- Streak -------- */
    let streak = 0;
    const today = dayjs();

    for (let i = 0; i < 365; i++) {
      const key = today.subtract(i, "day").format("YYYY-MM-DD");
      if (doneMap[key]) streak++;
      else break;
    }

    /* -------- Apply -------- */
    setStats({
      weight: latestWeight,
      gymDays: gymDates.length,
      topicsDone: doneTopics,
      topicsTotal: total,
      streak,
    });

    setWeightHistory(wh);
    setGymLogDates(gymDates);
  }, [
    dashboardState?.wd_gym_logs,
    dashboardState?.syllabus_tree_v2,
    dashboardState?.wd_done,
  ]);

  // inject glow CSS once
  useEffect(() => {
    if (document.getElementById("life-matrix-glow")) return;
    const style = document.createElement("style");
    style.id = "life-matrix-glow";
    style.textContent = glowCSS;
    document.head.appendChild(style);
  }, []);

  window.lifeOSsync = () => {
    window.dispatchEvent(new Event("lifeos:update"));
  };

  // ----------------- GLOBAL BACKEND SAVE ENGINE -----------------
  const updateDashboard = useCallback((updates) => {
    setDashboardState((prev) => {
      if (!prev) return prev;

      // Resolve functional or object updates SAFELY
      const resolvedUpdates =
        typeof updates === "function" ? updates(prev) : updates;

      // Merge once
      const nextState = {
        ...prev,
        ...resolvedUpdates,
        updatedAt: new Date().toISOString(),
      };

      // 🔥 IMMEDIATE backend sync (NO delay)
      fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState), // send FULL state
      }).catch((err) => {
        console.error("❌ Sync failed:", err);
      });

      return nextState;
    });
  }, []);

  // ----------------- END GLOBAL BACKEND SYNC ENGINE -----------------

  const bgClass = useMemo(
    () =>
      "bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0b0b10] dark:from-[#020617] dark:via-[#020b15] dark:to-[#020617]",
    []
  );

  return (
    <div
      className={`min-h-screen text-[#E5F9F6] ${bgClass} relative overflow-x-hidden`}
      style={{ "--accent": accent }}
    >
      <AnimatePresence>
        {themeFlash > 0 && (
          <motion.div
            key={themeFlash}
            className="fixed top-0 left-0 w-screen h-screen z-[9999] pointer-events-none"
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                left: flashOrigin.x - 70,
                top: flashOrigin.y - 60,
                width: 160,
                height: 160,
                background: dark
                  ? "radial-gradient(circle, rgba(180,210,255,0.95), rgba(180,210,255,0.4), transparent 70%)"
                  : "radial-gradient(circle, rgba(255,200,0,0.95), rgba(255,200,0,0.4), transparent 70%)",
                filter: "blur(8px)",
                willChange: "transform, opacity",
              }}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{
                scale: 12,
                opacity: 0,
              }}
              transition={{
                duration: 1.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* subtle background blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-82 -left-62 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,hsl(180,100%,50%,0.25),transparent_70%)] blur-xl" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,#b82132aa,transparent_60%)] blur-xl" />
      </div>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="
    fixed top-0 left-0 right-0 z-40
    border-b border-teal-400/25
    bg-gradient-to-r from-slate-950/90 via-teal-950/85 to-slate-950/90
    backdrop-blur-xl
    shadow-[0_10px_30px_rgba(15,118,110,0.45)]
  "
      >
        <div className="mx-auto max-w-7xl px-4 py-3">
          {/* TABLET LAYOUT: Logo on top, links below (640px - 1023px) */}
          <div className="hidden sm:flex lg:hidden flex-col gap-3">
            {/* Top row: Logo + Right controls */}
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex-shrink-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isHome ? { duration: 0.5 } : {}}
                  className="group relative"
                >
                  <h1
                    className="text-lg font-bold tracking-[0.2em] 
                    bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent
                    hover:from-teal-200 hover:via-emerald-100 hover:to-cyan-200 transition-all duration-300"
                  >
                    JAY SINH THAKUR
                  </h1>
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0 
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-full"
                  />
                </motion.div>
              </Link>

              <div className="flex items-center gap-3 ">
                <span className="text-xs font-mono text-teal-200/80 mr-6">
                  {time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </span>

                <button
                  ref={themeBtnRef}
                  onClick={() => {
                    const rect = themeBtnRef.current.getBoundingClientRect();
                    const x = rect.left + rect.width / 2 - 10;
                    const y = rect.top + rect.height / 2 - 10;

                    setFlashOrigin({ x, y });
                    setDark((prev) => {
                      const next = !prev;
                      updateDashboard({
                        ui: {
                          ...(dashboardState.ui || {}),
                          theme: next ? "dark" : "light",
                        },
                      });
                      return next;
                    });
                    setThemeFlash((prev) => prev + 1);
                  }}
                  className="relative group rounded-full w-10 h-10 flex
  items-center justify-center border
  border-yellow-400/30 dark:border-white/30
  bg-transparent backdrop-blur-xl
  shadow-[0_0_25px_rgba(255,193,7,0.6)]
  dark:shadow-[0_0_25px_rgba(255,255,255,0.6)]
  hover:shadow-[0_0_40px_rgba(255,193,7,0.9)]              
  dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]
  transition-all duration-400"
                  aria-label="Toggle dark mode"
                >
                  <div className="absolute inset-1 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500" />

                  <AnimatePresence>
                    <motion.div
                      key={dark ? "eclipse-dark" : "eclipse-light"}
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={
                        isHome ? { duration: 0.5, ease: "easeOut" } : {}
                      }
                      className="absolute inset-2 rounded-full pointer-events-none"
                      style={{
                        background: dark
                          ? "radial-gradient(circle,rgba(255,255,255,0.6), transparent 70%)"
                          : "radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)",
                      }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="relative text-xl z-10">
                      <AnimatePresence mode="wait">
                        {dark ? (
                          <motion.div
                            key="moon"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={
                              isHome
                                ? { duration: 0.9, ease: "easeOut" }
                                : undefined
                            }
                            className="relative flex items-center justify-center"
                          >
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1.5, opacity: 0.35 }}
                              transition={
                                isHome
                                  ? { duration: 1.2, ease: "easeOut" }
                                  : undefined
                              }
                              className="absolute w-8 h-8 rounded-full pointer-events-none"
                              style={{
                                background:
                                  "radial-gradient(circle, rgba(200,220,255,0.8), rgba(120,160,255,0.2), transparent)",
                                filter: "blur(7px)",
                              }}
                            />
                            <span className="drop-shadow-[0_0_16px_rgba(210,230,255,0.9)]">
                              🌙
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="sun"
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={
                              isHome
                                ? { duration: 0.9, ease: "easeOut" }
                                : undefined
                            }
                            className="relative flex items-center justify-center"
                          >
                            <motion.span
                              initial={{ scale: 0, opacity: 0.2 }}
                              animate={{ scale: 1.6, opacity: 0.4 }}
                              transition={
                                isHome
                                  ? { duration: 1.2, ease: "easeOut" }
                                  : undefined
                              }
                              className="absolute w-8 h-8 rounded-full"
                              style={{
                                background:
                                  "radial-gradient(circle, rgba(255,200,0,0.8), rgba(255,140,0,0.3), transparent)",
                                filter: "blur(8px)",
                              }}
                            />
                            <span className="drop-shadow-[0_0_18px_#FFB800]">
                              ☀️
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </span>

                    {/* ROTATING DECORATION - Always rotates */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        transformOrigin: "50% 50%",
                        willChange: "transform",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    >
                      <div
                        className="absolute select-none transition-all duration-300"
                        style={{
                          top: "-6px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "8px",
                          filter: dark
                            ? "drop-shadow(0 0 6px #FFD700)"
                            : "drop-shadow(0 0 6px #FFFFFF)",
                        }}
                      >
                        {/* FIXED: Show stars/sparkles, not the opposite icon */}
                        {dark ? "⭐" : "✨"}
                      </div>
                    </motion.div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom row: Links */}
            <div className="flex gap-2 flex-wrap">
              {links.map((l) => (
                <NavLink key={l.to} {...l} current={location.pathname} />
              ))}
            </div>
          </div>

          {/* MOBILE LAYOUT: Single row with hamburger */}
          <div className="flex sm:hidden items-center justify-between">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={isHome ? { duration: 0.5 } : {}}
                className="group relative"
              >
                <h1
                  className="text-base font-bold tracking-[0.15em] 
                  bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent
                  hover:from-teal-200 hover:via-emerald-100 hover:to-cyan-200 transition-all duration-300"
                >
                  JAY SINH THAKUR
                </h1>
                <div
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0 
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-full"
                />
              </motion.div>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-teal-200/80 mr-4">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
              <button
                ref={themeBtnRef}
                onClick={() => {
                  const rect = themeBtnRef.current.getBoundingClientRect();
                  const x = rect.left + rect.width / 2 - 10;
                  const y = rect.top + rect.height / 2 - 10;
                  setFlashOrigin({ x, y });
                  setDark((prev) => {
                    const next = !prev;
                    updateDashboard({
                      ui: {
                        ...(dashboardState.ui || {}),
                        theme: next ? "dark" : "light",
                      },
                    });
                    return next;
                  });
                  setThemeFlash((prev) => prev + 1);
                }}
                className="relative group rounded-full w-9 h-9 flex
                items-center justify-center border
                border-yellow-400/30 dark:border-white/30
                bg-transparent backdrop-blur-xl
                shadow-[0_0_25px_rgba(255,193,7,0.6)]
                dark:shadow-[0_0_25px_rgba(255,255,255,0.6)]
                hover:shadow-[0_0_40px_rgba(255,193,7,0.9)]              
                dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]
                transition-all duration-400"
                aria-label="Toggle dark mode"
              >
                <div className="absolute inset-1 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500" />
                <AnimatePresence>
                  <motion.div
                    key={dark ? "eclipse-dark" : "eclipse-light"}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={
                      isHome ? { duration: 0.5, ease: "easeOut" } : {}
                    }
                    className="absolute inset-2 rounded-full pointer-events-none"
                    style={{
                      background: dark
                        ? "radial-gradient(circle,rgba(255,255,255,0.6), transparent 70%)"
                        : "radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)",
                    }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="relative text-xl z-10">
                    <AnimatePresence mode="wait">
                      {dark ? (
                        <motion.div
                          key="moon"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={
                            isHome ? { duration: 0.9, ease: "easeOut" } : {}
                          }
                          className="relative flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.35 }}
                            transition={
                              isHome ? { duration: 1.2, ease: "easeOut" } : {}
                            }
                            className="absolute w-8 h-8 rounded-full pointer-events-none"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(200,220,255,0.8), rgba(120,160,255,0.2), transparent)",
                              filter: "blur(7px)",
                            }}
                          />
                          <span className="drop-shadow-[0_0_16px_rgba(210,230,255,0.9)]">
                            🌙
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sun"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={
                            isHome
                              ? { duration: 0.9, ease: "easeOut" }
                              : undefined
                          }
                          className="relative flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 0, opacity: 0.2 }}
                            animate={{ scale: 1.6, opacity: 0.4 }}
                            transition={
                              isHome ? { duration: 1.2, ease: "easeOut" } : {}
                            }
                            className="absolute w-8 h-8 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(255,200,0,0.8), rgba(255,140,0,0.3), transparent)",
                              filter: "blur(8px)",
                            }}
                          />
                          <span className="drop-shadow-[0_0_18px_#FFB800]">
                            ☀️
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ transformOrigin: "50% 50%" }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <div
                      className="absolute select-none transition-all duration-300"
                      style={{
                        top: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "8px",
                        filter: dark
                          ? "drop-shadow(0 0 6px #FFD700)"
                          : "drop-shadow(0 0 6px #FFFFFF)",
                      }}
                    >
                      {dark ? "☀️" : "🌙"}
                    </div>
                  </motion.div>
                </div>
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="rounded-md border border-teal-500/40 bg-black/40 p-1.5 text-teal-100"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* DESKTOP LAYOUT: Horizontal single row (1024px+) */}
          <div className="hidden lg:flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={isHome ? { duration: 0.5 } : {}}
                className="group relative"
              >
                <h1
                  className="text-xl font-bold tracking-[0.2em] 
                  bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent
                  hover:from-teal-200 hover:via-emerald-100 hover:to-cyan-200 transition-all duration-300"
                >
                  JAY SINH THAKUR
                </h1>
                <div
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/60 to-teal-400/0 
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-full"
                />
              </motion.div>
            </Link>

            <div className="flex gap-2">
              {links.map((l) => (
                <NavLink key={l.to} {...l} current={location.pathname} />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-teal-200/80 mr-6">
                {time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>

              <button
                ref={themeBtnRef}
                onClick={() => {
                  const rect = themeBtnRef.current.getBoundingClientRect();
                  const x = rect.left + rect.width / 2 - 10;
                  const y = rect.top + rect.height / 2 - 10;
                  setFlashOrigin({ x, y });
                  setDark((prev) => {
                    const next = !prev;
                    updateDashboard({
                      ui: {
                        ...(dashboardState.ui || {}),
                        theme: next ? "dark" : "light",
                      },
                    });
                    return next;
                  });
                  setThemeFlash((prev) => prev + 1);
                }}
                className="relative group rounded-full w-10 h-10 flex
                items-center justify-center border
                border-yellow-400/30 dark:border-white/30
                bg-transparent backdrop-blur-xl
                shadow-[0_0_25px_rgba(255,193,7,0.6)]
                dark:shadow-[0_0_25px_rgba(255,255,255,0.6)]
                hover:shadow-[0_0_40px_rgba(255,193,7,0.9)]              
                dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.8)]
                transition-all duration-400"
                aria-label="Toggle dark mode"
              >
                <div className="absolute inset-1 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500" />
                <AnimatePresence>
                  <motion.div
                    key={dark ? "eclipse-dark" : "eclipse-light"}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={
                      isHome ? { duration: 0.5, ease: "easeOut" } : {}
                    }
                    className="absolute inset-2 rounded-full pointer-events-none"
                    style={{
                      background: dark
                        ? "radial-gradient(circle,rgba(255,255,255,0.6), transparent 70%)"
                        : "radial-gradient(circle, rgba(255,215,0,0.6), transparent 70%)",
                    }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="relative text-xl z-10">
                    <AnimatePresence mode="wait">
                      {dark ? (
                        <motion.div
                          key="moon"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={
                            isHome ? { duration: 0.9, ease: "easeOut" } : {}
                          }
                          className="relative flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.35 }}
                            transition={
                              isHome ? { duration: 1.2, ease: "easeOut" } : {}
                            }
                            className="absolute w-8 h-8 rounded-full pointer-events-none"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(200,220,255,0.8), rgba(120,160,255,0.2), transparent)",
                              filter: "blur(7px)",
                            }}
                          />
                          <span className="drop-shadow-[0_0_16px_rgba(210,230,255,0.9)]">
                            🌙
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sun"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={
                            isHome
                              ? { duration: 0.9, ease: "easeOut" }
                              : undefined
                          }
                          className="relative flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 0, opacity: 0.2 }}
                            animate={{ scale: 1.6, opacity: 0.4 }}
                            transition={
                              isHome ? { duration: 1.2, ease: "easeOut" } : {}
                            }
                            className="absolute w-8 h-8 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(255,200,0,0.8), rgba(255,140,0,0.3), transparent)",
                              filter: "blur(8px)",
                            }}
                          />
                          <span className="drop-shadow-[0_0_18px_#FFB800]">
                            ☀️
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ transformOrigin: "50% 50%" }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <div
                      className="absolute select-none transition-all duration-300"
                      style={{
                        top: "-6px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "8px",
                        filter: dark
                          ? "drop-shadow(0 0 6px #FFD700)"
                          : "drop-shadow(0 0 6px #FFFFFF)",
                      }}
                    >
                      {dark ? "☀️" : "🌙"}
                    </div>
                  </motion.div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="sm:hidden px-3 pb-3 pt-2">
            <div className="flex justify-end">
              <div
                className="
          relative
          w-[250px]           /* control width */
          rounded-2xl
          bg-gradient-to-br from-slate-950/95 via-teal-950/90 to-slate-950/95
          border border-teal-400/30
          backdrop-blur-2xl
          shadow-[0_18px_40px_rgba(0,0,0,0.85)]
          px-2.5 py-2
          space-y-1
        "
              >
                {/* small arrow pointing to hamburger */}
                <div
                  className="
            absolute -top-1 right-4
            h-2 w-2
            rotate-45
            bg-slate-950/95
            border-t border-l border-teal-400/30
          "
                />

                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="
              flex items-center
              rounded-lg px-3 py-2
              text-[13px] text-slate-100
              bg-slate-900/40
              border border-transparent
              transition
              hover:bg-teal-500/15
              hover:border-teal-400/60
              hover:shadow-[0_0_14px_rgba(45,212,191,0.7)]
              active:scale-[0.98] active:translate-y-[1px]
            "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mr-2 shadow-[0_0_6px_rgba(45,212,191,0.9)]" />
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ROUTES */}
      <main
        style={{ paddingTop: "calc(var(--nav-height) + 12px)" }}
        className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            {/* HOME */}
            <Route
              path="/"
              element={
                isLoadingBackend ? (
                  <div
                    className="flex items-center justify-center"
                    style={{ height: "80vh" }}
                  >
                    <div className="relative">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-20 blur-xl animate-pulse" />

                      {/* Main spinner card */}
                      <div
                        className="relative bg-gradient-to-br from-[#0F0F0F] via-[#183D3D] to-[#0F0F0F] 
                    border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-xl
                    shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                      >
                        {/* Spinning circle */}
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative">
                            {/* Outer ring */}
                            <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full" />

                            {/* Spinning gradient ring */}
                            <div
                              className="absolute inset-0 w-16 h-16 border-4 border-transparent 
                          border-t-emerald-400 border-r-teal-400 
                          rounded-full animate-spin"
                            />

                            {/* Inner pulse dot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                              <div className="absolute w-3 h-3 bg-emerald-400 rounded-full" />
                            </div>
                          </div>

                          {/* Text */}
                          <div className="text-center space-y-2">
                            <h3
                              className="text-lg font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 
                         bg-clip-text text-transparent"
                            >
                              Loading Dashboard
                            </h3>
                            <p className="text-xs text-emerald-400/70 font-mono tracking-wider">
                              Syncing your data...
                            </p>
                          </div>

                          {/* Progress bar */}
                          <div className="w-48 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 
                          animate-[loading_1.5s_ease-in-out_infinite]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <style jsx>{`
                      @keyframes loading {
                        0% {
                          width: 0%;
                          margin-left: 0%;
                        }
                        50% {
                          width: 60%;
                          margin-left: 20%;
                        }
                        100% {
                          width: 0%;
                          margin-left: 100%;
                        }
                      }
                    `}</style>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={
                      isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                    }
                  >
                    <HomeDashboard
                      stats={stats}
                      weightHistory={weightHistory}
                      gymLogDates={gymLogDates}
                      activePanel={activePanel}
                      setActivePanel={setActivePanel}
                    />
                  </motion.div>
                )
              }
            />
            {/* OTHER PAGES WITH SLIDE ANIMATION */}
            <Route
              path="/syllabus"
              element={
                dashboardState ? (
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={
                      isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                    }
                  >
                    <Syllabus
                      dashboardState={dashboardState}
                      setDashboardState={setDashboardState}
                      updateDashboard={updateDashboard}
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-screen items-center justify-center text-emerald-400 text-sm">
                    Loading syllabus…
                  </div>
                )
              }
            />

            <Route
              path="/GlobalUpgrade"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <GlobalUpgrade
                    dashboardState={dashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            {/* GYM */}
            <Route
              path="/gym"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Gym
                    dashboardState={dashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            <Route
              path="/projects"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Projects
                    dashboardState={dashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            <Route
              path="/calendar"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Calendar
                    syllabus_tree_v2={dashboardState.syllabus_tree_v2}
                    gymLogs={dashboardState.wd_gym_logs}
                    doneMap={dashboardState.wd_done}
                    notesMap={dashboardState.wd_notes_v1}
                    bmiLogs={dashboardState.bmi_logs}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            <Route
              path="/planner"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Planner
                    dashboardState={dashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            <Route
              path="/gallery"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Gallery />
                </motion.div>
              }
            />
            <Route
              path="/control"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Control
                    dashboardState={dashboardState}
                    setDashboardState={setDashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            <Route
              path="/goals"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    isHome ? { duration: 0.5, ease: "easeInOut" } : {}
                  }
                >
                  <Goals
                    dashboardState={dashboardState}
                    updateDashboard={updateDashboard}
                  />
                </motion.div>
              }
            />
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-lg border-t border-cyan-500/20 py-4 text-center shadow-[0_-10px_30px_rgba(6,182,212,0.1)]">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm px-4">
          <span className="text-cyan-300 font-bold tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            🌟 Jay
          </span>
          <span className="text-cyan-500/50">|</span>
          <span className="text-cyan-200/80 font-medium">
            💪 Fitness • 💻 Code • 📈 Growth
          </span>
          <span className="text-cyan-500/50">|</span>
          <span className="text-cyan-400/70 font-medium">
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>

      <FloatingScrollControl />
    </div>
  );
}

/* ======================= HOME DASHBOARD – FULL SCREEN VISION CARDS ======================= */

function VisionCarousel({ cards }) {
  const [index, setIndex] = useState(0);
  const isHome = location.pathname === "/";

  // Auto switch every 60 seconds
  useEffect(() => {
    if (!cards || cards.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 60000); // 1 minute

    return () => clearInterval(timer);
  }, [cards]);

  if (!cards || cards.length === 0) return null;

  const prev = () =>
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);

  const next = () => setIndex((prev) => (prev + 1) % cards.length);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left / Right buttons */}
      {/* Previous Button - Hidden on mobile */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 
    hidden sm:flex
    p-3 sm:p-3.5 
    bg-teal-500/10 backdrop-blur-sm
    border border-teal-400/30 
    rounded-full 
    shadow-[0_0_20px_rgba(20,184,166,0.3)]
    hover:bg-teal-500/20 hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]
    active:scale-95
    transition-all duration-300 ease-out
    group"
      >
        <ChevronLeft
          size={18}
          className="text-teal-400 group-hover:text-teal-300 transition-colors"
        />
      </button>

      {/* Next Button - Hidden on mobile */}
      <button
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 
    hidden sm:flex
    p-3 sm:p-3.5 
    bg-teal-500/10 backdrop-blur-sm
    border border-teal-400/30 
    rounded-full 
    shadow-[0_0_20px_rgba(20,184,166,0.3)]
    hover:bg-teal-500/20 hover:border-teal-400/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]
    active:scale-95
    transition-all duration-300 ease-out
    group"
      >
        <ChevronRight
          size={18}
          className="text-teal-400 group-hover:text-teal-300 transition-colors"
        />
      </button>

      {/* Mobile Swipe Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 sm:hidden flex items-center gap-2 px-4 py-2 bg-teal-500/10 backdrop-blur-sm border border-teal-400/30 rounded-full">
        <ChevronLeft size={14} className="text-teal-400 animate-pulse" />
        <span className="text-teal-300 text-sm font-medium">
          Swipe to navigate
        </span>
        <ChevronRight size={14} className="text-teal-400 animate-pulse" />
      </div>

      {/* Centered slide – mobile gets narrower, tablet+ uses full width of card */}
      <div className="flex justify-center px-2 mb-16 mt-8 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) next();
              if (info.offset.x > 50) prev();
            }}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={
              isHome ? { duration: 0.45, ease: "easeOut" } : undefined
            }
            className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[95%]"
          >
            {cards[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function HomeDashboard({
  stats,
  weightHistory,
  gymLogDates,
  activePanel,
  setActivePanel,
}) {
  const streakLabel =
    stats.streak === 0 ? "No streak yet" : `${stats.streak} day streak`;

  // derived progress for vision cards
  const mernProgress =
    stats.topicsTotal > 0
      ? Math.min(100, Math.round((stats.topicsDone / stats.topicsTotal) * 100))
      : 0;
  const bodyProgress = Math.min(100, stats.gymDays * 3);
  const disciplineProgress = Math.min(100, stats.streak);
  const nzProgress = 30; // manual milestone % for now
  const moneyProgress = 15; // manual for now
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen space-y-16 pb-20">
      {/* HERO */}
      {/* ====== FULL DROP-IN LIFEOS v9 — NEURAL CORE EDITION ====== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={isHome ? { duration: 1.2 } : undefined}
        className="relative min-h-screen overflow-hidden bg-green"
      >
        {/* Scanning ambient background */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-black to-black" />
          <div
            className={
              isHome
                ? "absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(16,185,129,0.03)_50%,transparent_100%)] animate-[scan_12s_ease-in-out_infinite]"
                : ""
            }
          />
        </div>

        {/* Central Core Ring */}
        <div className="relative z-10 pt-2 pb-2">
          <div className="max-w-6xl mx-auto px-6 pt-32 ">
            {/* Core Title + Pulse Ring */}
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={isHome ? { rotate: 360 } : false}
                transition={
                  isHome
                    ? { duration: 120, repeat: Infinity, ease: "linear" }
                    : {}
                }
                className="absolute -top-20 w-96 h-96 border border-emerald-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={
                  isHome
                    ? { duration: 80, repeat: Infinity, ease: "linear" }
                    : {}
                }
                className="absolute -top-32 w-[500px] h-[500px] border border-cyan-500/10 rounded-full"
              />

              <h1 className="relative text-8xl md:text-9xl font-black tracking-tighter">
                <span
                  className={
                    isHome
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-600 drop-shadow-[0_0_60px_rgba(16,185,129,0.8)] animate-[pulseGlow_4s_ease-in-out_infinite]"
                      : "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-600"
                  }
                >
                  Jay&apos;s
                </span>
                <span
                  className={
                    isHome
                      ? "absolute -inset-4 bg-emerald-500/20 blur-xl animate-[pulse_3s_ease-in-out_infinite]"
                      : "absolute -inset-4 bg-emerald-500/20 blur-xl"
                  }
                />
              </h1>

              <p className="mt-8 text-2xl font-light tracking-widest text-cyan-300/80">
                VERSION UPGRADE PROTOCOL
              </p>

              <p className="mt-10 max-w-2xl text-center text-emerald-400 font-medium text-sm leading-relaxed">
                Body • Code • Discipline • Migration.
              </p>
            </div>

            {/* Orbital Module Ring - Floating HUD Cards */}
            <div className="relative mt-40">
              {/* Invisible center point for orbit */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1" />

              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
                {[
                  {
                    panel: "weight",
                    icon: "Scale",
                    value:
                      typeof stats.weight === "number"
                        ? `${stats.weight} kg`
                        : "— kg",
                    sub: "Current Mass",
                    delay: 0.2,
                  },
                  {
                    panel: "gym",
                    icon: "Strength",
                    value: stats.gymDays,
                    sub: "Sessions Executed",
                    delay: 0.4,
                  },
                  {
                    panel: "topics",
                    icon: "Neural Map",
                    value: `${stats.topicsDone}/${stats.topicsTotal}`,
                    sub: "Nodes Integrated",
                    delay: 0.6,
                  },
                  {
                    panel: "streak",
                    icon: "Fire Core",
                    value: stats.streak,
                    sub: streakLabel,
                    delay: 0.8,
                    critical: stats.streak === 0,
                  },
                ].map((module, i) => (
                  <motion.div
                    key={module.panel}
                    initial={{ opacity: 0, y: 100, rotate: -30 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      delay: module.delay,
                      duration: 1,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.08, zIndex: 50 }}
                    onClick={() => setActivePanel(module.panel)}
                    className={`relative group cursor-pointer ${
                      i === 0
                        ? "-rotate-12"
                        : i === 1
                        ? "rotate-6"
                        : i === 2
                        ? "-rotate-6"
                        : "rotate-12"
                    } transition-all duration-700`}
                  >
                    {/* Holographic Card */}
                    <div
                      className={`relative p-8 rounded-3xl border backdrop-blur-2xl
                ${
                  activePanel === module.panel
                    ? "border-emerald-400/80 bg-emerald-900/40 shadow-[0_0_50px_rgba(16,185,129,0.6)] ring-2 ring-emerald-500/40"
                    : "border-cyan-800/40 bg-black/60 hover:border-emerald-500/60 hover:bg-emerald-950/30"
                } transition-all duration-500`}
                    >
                      {/* Floating Icon */}
                      <div className="text-6xl md:text-7xl mb-4 opacity-90">
                        {module.panel === "weight" && (
                          <div className="text-teal-400 dark:text-emerald-400">
                            <Scale className="w-20 h-20 mx-auto" />
                          </div>
                        )}
                        {module.panel === "gym" && (
                          <div className="text-cyan-400 dark:text-cyan-300">
                            <Dumbbell className="w-20 h-20 mx-auto" />
                          </div>
                        )}
                        {module.panel === "topics" && (
                          <div className="text-purple-400 dark:text-purple-300">
                            <BrainCircuit className="w-20 h-20 mx-auto" />
                          </div>
                        )}
                        {module.panel === "streak" && (
                          <div
                            className={
                              module.critical
                                ? "text-red-500 animate-pulse"
                                : "text-orange-400 dark:text-orange-300"
                            }
                          >
                            {module.critical ? (
                              <AlertTriangle className="w-20 h-20 mx-auto" />
                            ) : (
                              <Flame className="w-20 h-20 mx-auto" />
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xs uppercase tracking-widest text-emerald-400/70 font-light">
                        {module.panel === "weight" && "WEIGHT ENGINE"}
                        {module.panel === "gym" && "PHYSICAL CORE"}
                        {module.panel === "topics" && "KNOWLEDGE MATRIX"}
                        {module.panel === "streak" && "WILLPOWER REACTOR"}
                      </h3>

                      <p
                        className={`mt-4 text-4xl font-black tracking-tight ${
                          module.critical
                            ? "text-red-400 animate-pulse"
                            : "text-cyan-300"
                        }`}
                      >
                        {module.value}
                      </p>
                      <p className="mt-2 text-xs text-teal-400/60 font-light">
                        {module.sub}
                      </p>

                      {/* Connection line to center (on hover/active) */}
                      {activePanel === module.panel && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />
                      )}
                    </div>

                    {/* Floating particles on active */}
                    {activePanel === module.panel && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                              x: [0, Math.random() * 200 - 100, 0],
                              y: [0, Math.random() * 200 - 100, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={
                              isHome
                                ? {
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                  }
                                : {}
                            }
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* NEURAL COMMAND DECK */}
            <motion.div
              className="mt-24 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div
                className="relative rounded-3xl overflow-hidden border-2 
                  border-teal-500/50 dark:border-emerald-500/60
                  bg-[#020617]/95 dark:bg-black/98
                  backdrop-blur-md
                  shadow-2xl 
                  ring-1 ring-teal-400/30 dark:ring-emerald-400/30"
              >
                {/* Terminal Header */}
                <div
                  className="flex items-center justify-between px-6 py-4 
                    border-b border-teal-600/40 dark:border-emerald-700/50 
                    bg-gradient-to-r from-teal-950/60 via-cyan-950/30 to-transparent 
                    dark:from-emerald-950/70 dark:via-cyan-950/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-md" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-md" />
                      <div className="w-3 h-3 rounded-full bg-teal-400/90 dark:bg-emerald-400/90 shadow-md" />
                    </div>

                    <div className="flex items-center gap-3">
                      <code className="text-xs font-mono text-teal-300 dark:text-emerald-300 tracking-wider">
                        root@lifeos
                      </code>
                      <span className="text-teal-400/60 dark:text-emerald-400/50">
                        ➜
                      </span>
                      <code className="text-sm font-mono tracking-widest text-teal-200 dark:text-emerald-200">
                        ~/core/{activePanel}
                      </code>
                      <span className="text-teal-400 dark:text-emerald-400 text-lg animate-pulse">
                        █
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-xs font-mono text-teal-300 dark:text-emerald-300">
                      EXECUTING
                    </span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div
                  className="p-8 min-h-96 bg-gradient-to-b from-transparent via-teal-950/10 to-black/40 
                    dark:via-emerald-950/15"
                >
                  <AnimatePresence mode="wait">
                    {activePanel === "weight" && (
                      <WeightPanel key="weight" history={weightHistory} />
                    )}
                    {activePanel === "gym" && (
                      <GymPanel key="gym" gymDates={gymLogDates} />
                    )}
                    {activePanel === "topics" && (
                      <TopicsPanel key="topics" stats={stats} />
                    )}
                    {activePanel === "streak" && (
                      <StreakPanel key="streak" stats={stats} />
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Status Bar */}
                <div
                  className="px-6 py-3 border-t border-teal-600/30 dark:border-emerald-700/40 
                    bg-teal-950/40 dark:bg-emerald-950/60 
                    flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-teal-400/80 dark:text-emerald-400/80 tracking-widest">
                    NO ZERO DAYS • DISCIPLINE = FREEDOM • 2026-2027
                  </span>
                  <span className="text-teal-300/90 dark:text-emerald-300/90">
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Final Horizon Line */}
            <div className="mt-8 text-center">
              <p className="text-emerald-600 font-semibold uppercase  text-center tracking-[1em] animate-[pulse_6s_ease-in-out_infinite]">
                ··· VISION HORIZON 2026–2027 ···
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      {/* ====== END OF DROP-IN ====== */}

      {/* VISION + NZ MIGRATION + CORE DIRECTIVES */}
      {/* Same content, but cards shown via VisionCarousel */}
      {/* Vision Cards Section */}
      <section className="space-y-4 px-2 max-w-8xl">
        <VisionCarousel
          cards={[
            /* MERN */
            <VisionCard
              key="mern"
              icon="🚀"
              title="MERN Mastery Overdrive"
              gradient="from-cyan-500/20 via-teal-600/20 to-emerald-600/10"
              border="border-cyan-500/40"
              glow="shadow-[0_0_40px_rgba(34,211,238,0.4)]"
              progress={mernProgress}
              phases={[
                "Foundation (MERN + JS)",
                "Execution (Projects + DSA)",
                "Domination (System Design + DevOps)",
              ]}
              metrics={[
                `Topics: ${stats.topicsDone}/${stats.topicsTotal || "?"}`,
                "Target: 5 SaaS apps",
                "Goal: 300–500 DSA problems",
              ]}
              description={
                <>
                  Turn MERN + DSA into your default language. Build SaaS
                  products that can pay for visas, tickets, and your new life.
                  <ul className="mt-6 space-y-3 text-sm">
                    <li>
                      • Master MongoDB: Schema design, aggregation, indexing,
                      sharding
                    </li>
                    <li>
                      • Express.js: REST + GraphQL APIs, JWT/OAuth, rate
                      limiting, error handling
                    </li>
                    <li>
                      • React: Hooks mastery, Redux Toolkit, React Query,
                      Next.js 14+, App Router
                    </li>
                    <li>
                      • Node.js: Event loop deep dive, clustering, PM2,
                      microservices
                    </li>
                    <li>
                      • DSA: 300+ LeetCode (Medium/Hard), system design
                      (HLD/LLD)
                    </li>
                    <li>
                      • Build 5 production-grade apps: AI SaaS, fintech
                      dashboard, real-time collab tool
                    </li>
                    <li>
                      • Full CI/CD, Docker, AWS ECS/EC2, Terraform, monitoring
                      (Datadog/Prometheus)
                    </li>
                  </ul>
                  <p className="mt-6 font-mono text-cyan-300">
                    "Code like a warrior: no bugs, no mercy. Every line is a
                    step toward financial independence."
                  </p>
                </>
              }
            />,

            /* NZ MIGRATION */
            <VisionCard
              key="nz"
              icon="🇳🇿"
              title="New Zealand Migration Launch"
              gradient="from-emerald-500/20 via-teal-600/20 to-cyan-600/10"
              border="border-emerald-500/40"
              glow="shadow-[0_0_40px_rgba(16,185,129,0.4)]"
              progress={nzProgress}
              phases={[
                "Skill Alignment",
                "Offer & AEWV",
                "Relocation & PR Path",
              ]}
              metrics={[
                "Target: Green List role",
                "AEWV-ready CV & portfolio",
                "Savings target: 15k NZD",
              ]}
              description={
                <>
                  Relocate as a high-value developer. One consistent, engineered
                  path.
                  <ul className="mt-6 space-y-3 text-sm">
                    <li>
                      • Green List roles: Software Developer, Full-Stack
                      Engineer (Tier 1)
                    </li>
                    <li>
                      • AEWV Visa: Accredited employer + ≥NZD 29.66/hr (2025
                      rate)
                    </li>
                    <li>• Target cities: Auckland, Wellington, Christchurch</li>
                    <li>
                      • Job hunt: Seek.co.nz, LinkedIn (NZ filter), TradeMe Jobs
                    </li>
                    <li>
                      • Timeline: 6–12 months skill → 3–6 months applications →
                      Offer → Visa (4–8 weeks)
                    </li>
                    <li>
                      • Post-arrival: Work-to-Residence → Straight-to-Residence
                      → PR in 3–5 years
                    </li>
                    <li>
                      • Savings goal: NZD 15,000+ buffer (visa + relocation +
                      first months)
                    </li>
                  </ul>
                  <p className="mt-6 font-mono text-emerald-300">
                    "From Gujarat grids to Kiwi horizons. Build the rocket
                    first."
                  </p>
                </>
              }
            />,

            /* BODY */
            <VisionCard
              key="body"
              icon="⚡"
              title="Body Transformation Protocol"
              gradient="from-orange-500/20 via-red-600/20 to-rose-600/10"
              border="border-orange-500/40"
              glow="shadow-[0_0_40px_rgba(251,146,60,0.4)]"
              progress={bodyProgress}
              phases={[
                "Cutting (Fat Loss)",
                "Recomp (Lean Build)",
                "Performance (Endurance)",
              ]}
              metrics={[
                `Gym sessions logged: ${stats.gymDays}`,
                "Target: -10 to -12 kg fat",
                "10k steps + 2–3 HIIT/week",
              ]}
              description={
                <>
                  Drop fat. Forge lean muscle. Run 12–14 hour focus days without
                  crashing.
                  <ul className="mt-6 space-y-3 text-sm">
                    <li>
                      • Diet: 500–700 kcal deficit, 2g protein/kg, 16:8 IF
                    </li>
                    <li>
                      • Training: 4–5× compound lifts, progressive overload, PPL
                      split
                    </li>
                    <li>• Cardio: 2× HIIT + 10k steps daily</li>
                    <li>
                      • Supplements: Creatine 5g, whey, omega-3, caffeine
                      (pre-workout)
                    </li>
                    <li>• Sleep: 7.5–8.5 hrs, consistent schedule</li>
                    <li>
                      • Goal: 12–15% body fat, visible abs, 80+ kg lean mass
                    </li>
                  </ul>
                  <p className="mt-6 font-mono text-orange-300">
                    "Pain now, power permanent."
                  </p>
                </>
              }
            />,

            /* DISCIPLINE */
            <VisionCard
              key="discipline"
              icon="🛡️"
              title="Discipline Dominion"
              gradient="from-purple-500/20 via-fuchsia-600/20 to-pink-600/10"
              border="border-purple-500/40"
              glow="shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              progress={disciplineProgress}
              phases={["Routine Setup", "Consistency Lock", "Identity Shift"]}
              metrics={[
                `No-zero streak: ${stats.streak} days`,
                "Daily journaling system",
                "Screen time < 2hrs/day",
              ]}
              description={
                <>
                  No zero days. Systems over feelings. You dictate reality.
                  <ul className="mt-6 space-y-3 text-sm">
                    <li>
                      • Morning ritual: 5 AM wake → meditate → plan → deep work
                    </li>
                    <li>• Habit stacking + environment design</li>
                    <li>• Weekly review every Sunday night</li>
                    <li>• Public accountability (X, Discord, mentor)</li>
                    <li>
                      • Mindset: Stoicism, Jocko, Goggins, extreme ownership
                    </li>
                    <li>• Metric: 95%+ daily task completion</li>
                  </ul>
                  <p className="mt-6 font-mono text-purple-300">
                    "Discipline is the only real superpower."
                  </p>
                </>
              }
            />,

            /* MONEY */
            <VisionCard
              key="money"
              icon="💸"
              title="Financial Freedom Engine"
              gradient="from-yellow-500/20 via-amber-500/20 to-orange-600/10"
              border="border-yellow-500/40"
              glow="shadow-[0_0_40px_rgba(250,204,21,0.4)]"
              progress={moneyProgress}
              phases={[
                "Skill → Income",
                "Stable Side Streams",
                "Location Freedom",
              ]}
              metrics={[
                "Target: 2 active income streams",
                "Freelance / remote MERN work",
                "Savings runway for NZ move",
              ]}
              description={
                <>
                  Use code, not luck, to buy freedom — in India first, then in
                  NZ.
                  <ul className="mt-6 space-y-3 text-sm">
                    <li>• Build a portfolio that converts into clients</li>
                    <li>• Offer MERN freelancing and dashboards / tools</li>
                    <li>• Experiment with small SaaS (subscriptions in USD)</li>
                    <li>• Maintain 6–12 month emergency fund</li>
                    <li>
                      • System for tracking expenses, savings, investments
                    </li>
                  </ul>
                  <p className="mt-6 font-mono text-yellow-200">
                    "Freedom is not a place. It's a balance sheet plus skills."
                  </p>
                </>
              }
            />,
          ]}
        />

        {/* NZ MIGRATION COMMAND BLOCK (DEEP DIVE) */}
        <NZMigrationBlock />
      </section>

      {/* Directives Section - REMOVE px-6 from section tag */}
      <section className="w-full snap-y snap-mandatory">
        <div className="w-full space-y-8">
          <div className="w-full">
            <DirectivesBlock />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ======================= FULL-SCREEN VISION CARD (UPGRADED) ======================= */

function VisionCard({
  icon,
  title,
  gradient,
  border,
  glow,
  description,
  progress = 0,
  phases = [],
  metrics = [],
}) {
  const isHome = location.pathname === "/";
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={isHome ? { duration: 0.8, ease: "easeOut" } : {}}
      className={`relative mx-auto max-w-6xl rounded-3xl border ${border} bg-gradient-to-br ${gradient} p-10 shadow-2xl backdrop-blur-xl ${glow} min-h-screen flex flex-col justify-center snap-start`}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="text-5xl sm:text-6xl">{icon}</div>
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {title}
            </h2>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-200/80">
                <span>Mission Progress</span>
                <span className="font-mono text-teal-200">
                  {isNaN(progress) ? "0" : progress.toFixed(0)}%
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Phase timeline */}
        {phases.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal-100/80 mb-2">
              Phase Timeline
            </p>
            <div className="grid gap-2 sm:grid-cols-3 text-xs">
              {phases.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-teal-400/30 bg-black/40 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold text-teal-200">
                    Phase {i + 1}
                  </p>
                  <p className="text-[11px] text-slate-200 mt-1">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metric tiles */}
        {metrics.length > 0 && (
          <div className="mt-2 grid gap-2 sm:grid-cols-3 text-xs">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-cyan-400/25 bg-black/40 px-3 py-2 text-slate-100"
              >
                {m}
              </div>
            ))}
          </div>
        )}

        {/* Original rich description */}
        <div className="mt-6 max-w-4xl text-lg leading-relaxed text-slate-200">
          {description}
        </div>
      </div>
    </motion.div>
  );
}

/* ======================= DETAIL PANELS ======================= */

function WeightPanel({ history }) {
  const latest = history.length ? history[history.length - 1].weight : null;
  const first = history.length ? history[0].weight : null;
  const diff =
    latest != null && first != null ? Number(latest) - Number(first) : null;
  const isHome = location.pathname === "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={isHome ? { duration: 0.25 } : {}}
      className="rounded-2xl border border-teal-500/25 bg-black/50 p-5 shadow-[0_0_30px_rgba(45,212,191,0.25)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-500/20 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-teal-300">Weight Engine</h3>
          <p className="text-xs text-slate-300/80">
            Tracking body recomposition over time.
          </p>
        </div>
        {latest != null && (
          <div className="text-right">
            <p className="text-xs text-slate-300/70">Change from first log</p>
            <p className="text-sm font-semibold text-emerald-300">
              {diff > 0 ? "+" : ""}
              {diff?.toFixed(1)} kg
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-[1.4fr,1fr]">
        <div className="space-y-2">
          <p className="text-xs text-slate-300/70">
            Last 10 entries (most recent at bottom):
          </p>
          <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg bg-slate-900/60 p-2 text-xs">
            {history.length === 0 && (
              <p className="text-slate-400">
                No weight logs yet. Log from the gym page to see history here.
              </p>
            )}
            {history.slice(-10).map((h) => (
              <div
                key={h.date}
                className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1"
              >
                <span className="text-slate-300">{h.date}</span>
                <span className="font-mono text-teal-300">{h.weight} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-xl bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-emerald-500/20 p-3">
          <p className="text-xs text-slate-100/90">
            Snapshot · <span className="font-semibold">Current Body State</span>
          </p>
          <div className="space-y-1 text-xs">
            <InfoRow
              label="First logged weight"
              value={first ? `${first} kg` : "—"}
            />
            <InfoRow
              label="Latest logged weight"
              value={latest ? `${latest} kg` : "—"}
            />
            <InfoRow
              label="Total entries"
              value={history.length ? history.length : "—"}
            />
            <InfoRow
              label="Direction"
              value={
                diff == null
                  ? "—"
                  : diff < 0
                    ? "Fat loss in progress ✅"
                    : diff > 0
                      ? "Weight increased ⚠️"
                      : "Stable"
              }
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-100/70">
            Rule: don’t obsess over single days. Watch the **trend** and keep
            gym + diet protocol consistent.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function GymPanel({ gymDates }) {
  const isHome = location.pathname === "/";
  const total = gymDates.length;
  const lastDate = total ? gymDates[gymDates.length - 1] : null;

  const byMonth = {};
  gymDates.forEach((d) => {
    const [y, m] = d.split("-");
    const key = `${y}-${m}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  const monthEntries = Object.entries(byMonth).slice(-4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={isHome ? { duration: 0.25 } : {}}
      className="rounded-2xl border border-indigo-500/30 bg-black/60 p-5 shadow-[0_0_32px_rgba(129,140,248,0.3)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/30 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-indigo-300">
            Gym Control Room
          </h3>
          <p className="text-xs text-slate-300/80">
            Tracking how often you enter the arena.
          </p>
        </div>
        <div className="text-right text-xs text-slate-200/80">
          <p>Total sessions logged</p>
          <p className="text-lg font-semibold text-indigo-200">{total}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-[1.2fr,1fr]">
        <div className="space-y-2">
          <p className="text-xs text-slate-300/70">Recent gym days:</p>
          <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg bg-slate-900/60 p-2 text-xs">
            {total === 0 && (
              <p className="text-slate-400">
                No gym sessions logged yet. Log from the gym page.
              </p>
            )}
            {gymDates.slice(-15).map((d) => (
              <div
                key={d}
                className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1"
              >
                <span>{d}</span>
                <span className="text-indigo-300">✅</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-xl bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-cyan-500/20 p-3 text-xs">
          <InfoRow
            label="Last gym visit"
            value={lastDate || "No sessions yet"}
          />
          <InfoRow
            label="Average per recent month"
            value={
              monthEntries.length
                ? (
                    monthEntries.reduce((acc, [, v]) => acc + v, 0) /
                    monthEntries.length
                  ).toFixed(1)
                : "—"
            }
          />
          <p className="mt-1 text-[10px] text-slate-100/80">
            Minimum standard: **3 sessions/week**. Future Jay in New Zealand is
            built here, not there.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function TopicsPanel({ stats }) {
  const isHome = location.pathname === "/";
  const [localStats, setLocalStats] = useState(stats);

  useEffect(() => {
    setLocalStats(stats);
  }, [stats]);

  const { topicsDone, topicsTotal } = localStats;

  const percent =
    topicsTotal > 0 ? Math.round((topicsDone / topicsTotal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={isHome ? { duration: 0.25 } : {}}
      className="rounded-2xl border border-emerald-500/30 bg-black/60 p-5 shadow-[0_0_32px_rgba(16,185,129,0.3)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-emerald-300">
            Coding Syllabus Matrix
          </h3>
          <p className="text-xs text-slate-300/80">
            MERN + DSA topics tracked from your syllabus tree.
          </p>
        </div>
        <div className="text-right text-xs text-slate-200/80">
          <p>Completion</p>
          <p className="text-lg font-semibold text-emerald-200">
            {topicsTotal ? `${percent}%` : "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-[1.5fr,1fr]">
        <div className="space-y-2">
          <p className="text-xs text-slate-300/70">
            Progress bar for the full stack roadmap:
          </p>
          <div className="overflow-hidden rounded-full bg-slate-900/70">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all"
              style={{ width: `${topicsTotal ? percent : 0}%` }}
            />
          </div>
          <ul className="mt-2 text-xs text-slate-200/80 space-y-1">
            <li>• Completed topics: {topicsDone}</li>
            <li>• Total tracked topics: {topicsTotal || "Not loaded"}</li>
            <li>
              • Remaining:{" "}
              {topicsTotal ? topicsTotal - topicsDone : "Need syllabus data"}
            </li>
          </ul>
        </div>

        <div className="space-y-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-lime-500/10 to-teal-500/20 p-3 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Study Rules
          </p>
          <ul className="mt-1 space-y-1 text-[11px] text-slate-100/90">
            <li>• At least 1 topic move per day.</li>
            <li>• Code → Commit → Push → Note.</li>
            <li>• Rotate: JS fundamentals → DSA → React → Backend.</li>
            <li>• Treat each topic like a gym set: full range, no ego.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function StreakPanel({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={isHome ? { duration: 0.25 } : {}}
      className="rounded-2xl border border-fuchsia-500/30 bg-black/60 p-5 shadow-[0_0_32px_rgba(217,70,239,0.3)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/30 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-fuchsia-300">
            No-Zero Day Engine
          </h3>
          <p className="text-xs text-slate-300/80">
            Streak is based on **wd_done** — any day you log progress.
          </p>
        </div>
        <div className="text-right text-xs text-slate-200/80">
          <p>Current streak</p>
          <p className="text-lg font-semibold text-fuchsia-200">
            {stats.streak} days
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 text-xs text-slate-200/85 md:flex-row">
        <div className="flex-1 rounded-xl bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-rose-500/20 p-3">
          <p className="font-semibold text-fuchsia-100">Rules of the streak</p>
          <ul className="mt-1 space-y-1">
            <li>• One logged action = day is saved.</li>
            <li>• Gym, code, or deep work — any counts.</li>
            <li>• If streak breaks: no drama, just restart immediately.</li>
          </ul>
        </div>
        <div className="flex-1 rounded-xl bg-slate-900/70 p-3">
          <p className="font-semibold text-slate-100">Future Jay Check</p>
          <p className="mt-1 text-[11px]">
            Imagine 90 days of this streak. Different body. Different mind.
            Easier New Zealand interviews. You can’t control the visa officer,
            but you control the streak.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ======================= VISION / NZ / DATA ======================= */

function NZMigrationBlock() {
  const isHome = location.pathname === "/";
  // small status bar at top to make it feel like a command dashboard
  const stages = [
    { label: "Skill Alignment", status: "ON TRACK" },
    { label: "Job Applications", status: "WARMING UP" },
    { label: "AEWV Ready", status: "PENDING" },
    { label: "Relocation Fund", status: "BUILDING" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={isHome ? { duration: 0.9, ease: "easeOut" } : {}}
      className="relative mx-auto max-w-6xl 
    rounded-2xl sm:rounded-3xl 
    border border-emerald-500/40 
    bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/10 
    p-6 sm:p-8 md:p-10
    shadow-2xl backdrop-blur-xl 
    min-h-screen sm:min-h-[95vh] flex flex-col justify-center snap-start"
      style={{
        boxShadow:
          "0 0 60px rgba(16, 185, 129, 0.5), inset 0 0 40px rgba(16, 185, 129, 0.15)",
      }}
    >
      {/* Command status bar - Improved */}
      <div className="mb-8 sm:mb-10 flex justify-end">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full">
          {stages.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-emerald-400/40 bg-black/40 backdrop-blur-sm px-3 py-2.5 flex flex-col items-start"
            >
              <span className="text-[10px] sm:text-xs text-emerald-200 font-bold uppercase tracking-wide">
                {s.label}
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-100/70 mt-0.5 font-medium">
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-12 sm:justify-end">
        {/* Flag - Large on desktop */}
        <div className="hidden sm:block sm:mr-auto">
          <div className="text-7xl lg:text-8xl opacity-80 animate-wave inline-block origin-bottom-right">
            🇳🇿
          </div>
        </div>

        {/* Main content - Right aligned on desktop */}
        <div className="flex-1 sm:max-w-2xl lg:max-w-3xl space-y-8">
          {/* Mobile header with flag */}
          <div className="flex items-center gap-4 sm:hidden">
            <div className="text-5xl opacity-80 animate-wave inline-block origin-bottom-right">
              🇳🇿
            </div>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-300 leading-tight">
              New Zealand Migration Protocol · 2025–2027
            </h2>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg font-medium text-emerald-200/90">
              Not a random dream — a structured, engineered pipeline.
            </p>
            <p className="mt-2 text-sm sm:text-base text-teal-100/80">
              Expanded with timelines, costs, contingencies, and weekly KPIs.
            </p>
          </div>

          <ol className="space-y-5 sm:space-y-6 text-sm sm:text-base">
            {[
              {
                step: "Align with Green List",
                desc: "Focus on Software / Web Developer roles on NZ's Green List. Your MERN + DSA roadmap is literally building this eligibility.",
                timeline: "6–12 months to skill up",
              },
              {
                step: "Target Accredited Employers",
                desc: "Seek, LinkedIn, company sites. Only apply to 'Accredited Employer' companies. 10+ tailored applications/week.",
                timeline: "Start now → peak in Q3 2025",
              },
              {
                step: "AEWV – Work Visa",
                desc: "Job offer → Employer job check → AEWV application. Fees: ~NZD 750 + medical/police (~NZD 500). Processing: 4–6 weeks.",
                timeline: "Target: Q4 2025 – Q1 2026",
              },
              {
                step: "Residence Pathways",
                desc: "After 24 months → Green List Straight to Residence or Work to Residence. Points: Level 7+ degree, 3+ years exp, age <55.",
                timeline: "2027–2028",
              },
              {
                step: "Long-Term Upgrade",
                desc: "Permanent Residency → Citizenship option after 5 years. High-paying tech career, clean air, safety, freedom.",
                timeline: "2030+",
              },
            ].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-4 sm:gap-5"
              >
                <span className="flex size-9 sm:size-11 md:size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-lg sm:text-xl md:text-2xl font-bold text-emerald-300 ring-2 sm:ring-4 ring-emerald-500/30">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-emerald-300 text-sm sm:text-base">
                    {item.step}
                  </p>
                  <p className="mt-1.5 text-slate-200 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="mt-2 text-[10px] sm:text-xs font-mono text-teal-300/80">
                    Timeline: {item.timeline}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-900/30 p-5 sm:p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-100">
              Migration isn't escape.
            </p>
            <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
              It's a <span className="text-emerald-400">VERSION UPGRADE</span>.
            </p>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-teal-200">
              Current Jay config decides how strong v2.0 in New Zealand will be.
            </p>
            <p className="mt-4 font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest text-emerald-300">
              Monitor immigration policy every quarter • No excuses • Execute
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DirectivesBlock() {
  const directives = [
    {
      title: "No Zero Days",
      text: "Even tiny actions compound. No day ends with nothing executed.",
      code: "EXEC-001",
    },
    {
      title: "Track Everything",
      text: "What is not tracked is invisible. Logs create leverage.",
      code: "EXEC-002",
    },
    {
      title: "Dual Assault",
      text: "Train body + brain daily. No imbalance allowed.",
      code: "EXEC-003",
    },
    {
      title: "Comfort is Enemy",
      text: "Comfort kills growth. Discomfort is the upgrade path.",
      code: "EXEC-004",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto mt-24 px-0 sm:px-6 relative">
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-3xl 
        bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.2),transparent_70%)] 
        blur-xl pointer-events-none"
      ></div>

      <div
        className="
        relative w-full
        rounded-3xl
        border border-emerald-500/40
        bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/10
        px-4 sm:px-6 md:px-10 py-6 md:py-10
        backdrop-blur-xl
        shadow-[0_0_60px_rgba(16,185,129,0.3)]
      "
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h3 className="text-sm tracking-widest uppercase text-emerald-200">
              Core Directives
            </h3>
            <p className="text-xs text-emerald-100/70 mt-1">
              System behavior rules — non negotiable
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-[11px] tracking-wider text-emerald-300/80">
            MODULE: INTERNAL OS
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT: Directive Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {directives.map((item, i) => (
              <div
                key={i}
                className="
                rounded-xl
                bg-black/30
                border border-emerald-500/20
                px-4 sm:px-6 py-4 sm:py-5
                shadow-inner shadow-black/60
                hover:border-emerald-400/40
                transition-all duration-300
              "
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-300 text-sm font-medium">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-emerald-400/70 tracking-wider">
                    {item.code}
                  </span>
                </div>

                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT: SYSTEM PANEL */}
          <div
            className="
            rounded-xl
            bg-black/30
            border border-emerald-500/30
            px-4 sm:px-6 py-5 sm:py-6
            shadow-[0_0_25px_rgba(16,185,129,0.15)]
          "
          >
            <h4 className="text-emerald-200 text-xs tracking-widest mb-4 uppercase">
              Behavior Engine
            </h4>

            <div className="space-y-4 text-sm text-emerald-100/70">
              <div>
                <span className="text-emerald-300">Mode:</span> Execution Only
              </div>

              <div>
                <span className="text-emerald-300">Failure Policy:</span> No
                emotional exit allowed.
              </div>

              <div>
                <span className="text-emerald-300">Override:</span> Comfort
                rejection enabled.
              </div>

              <div>
                <span className="text-emerald-300">Daily Objective:</span>{" "}
                Increment identity by 1%.
              </div>
            </div>

            <div className="mt-6 border-t border-emerald-500/20 pt-4 text-[11px] tracking-wider text-emerald-300/70">
              STATUS: ACTIVE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================= SMALL UI HELPERS ======================= */

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-slate-100/85">{label}</span>
      <span className="text-[11px] font-semibold text-teal-100">{value}</span>
    </div>
  );
}

function NavLink({ to, label, current }) {
  const active = current === to;
  return (
    <Link
      to={to}
      className={`rounded-md px-3 py-1 text-xs transition-all ${
        active
          ? "bg-teal-500/20 text-teal-200 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
          : "text-slate-100/90 hover:bg-black/40 hover:text-teal-200"
      }`}
    >
      {label}
    </Link>
  );
}

const links = [
  { to: "/", label: "HOME" },
  { to: "/syllabus", label: "STUDY" },
  { to: "/GlobalUpgrade", label: "MOVE" },
  { to: "/gym", label: "GYM" },
  { to: "/projects", label: "PROJECTS" },
  { to: "/calendar", label: "CALENDAR" },
  { to: "/planner", label: "PLANNER" },
  { to: "/goals", label: "GOALS" },
  { to: "/gallery", label: "PHOTOS" },
  { to: "/control", label: "CONTROL" },
];

/* ======================= UTIL ======================= */

const glowCSS = `
.glow-text {
  text-shadow:
    0 0 10px rgba(45,212,191,0.7),
    0 0 25px rgba(45,212,191,0.6),
    0 0 45px rgba(248,113,113,0.5);
}
`;
