import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Goals.jsx - Holographic Dashboard (Style D)
 * - Adds a slide-in checklist panel on the MERN card.
 * - Swipe left to open checklist, swipe right to close.
 * - Auto toggles every 2 minutes.
 *
 * This file preserves your UI styles exactly. Only the MERN card was
 * converted into a two-layer motion container to enable the front-panel animation.
 */

const TARGET_DATE = new Date("2026-12-31T23:59:59");
const START_DATE = new Date("2024-01-01T00:00:00"); // keep as before

function useCountdown(target) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
  const months = Math.max(
    0,
    (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth())
  );
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, weeks, months, hours, minutes, seconds, diff };
}

export default function Goals() {
  const countdown = useCountdown(TARGET_DATE);

  // MERN Time Progress percent (unchanged behavior)
  const merPercent = useMemo(() => {
    const total = TARGET_DATE - START_DATE;
    const elapsed = Date.now() - START_DATE.getTime();
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }, []);

  // Parallax transform refs (unchanged)
  const wrapperRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setTilt({ x: dx * 10, y: dy * 10 });
    }
    function onLeave() {
      setTilt({ x: 0, y: 0 });
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Progress ring params (unchanged)
  const R = 64;
  const C = 2 * Math.PI * R;
  const progressStroke = Math.round((merPercent / 100) * C);

  // --------- NEW: checklist toggle + auto-rotate ----------
  const [showChecklist, setShowChecklist] = useState(false);
  const autoTimerRef = useRef(null);
  const resetAutoTimer = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    // auto toggle every 2 minutes
    autoTimerRef.current = setInterval(() => {
      setShowChecklist((s) => !s);
    }, 120000);
  };

  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  // Drag threshold handling (swipe left to open, right to close)
  const handleDragEnd = (info) => {
    const vx = info.velocity.x;
    const dx = info.offset.x;
    // If dragged left enough (negative dx) or with leftward velocity -> open
    if (dx < -80 || vx < -500) {
      setShowChecklist(true);
      resetAutoTimer();
      return;
    }
    // If dragged right enough -> close
    if (dx > 80 || vx > 500) {
      setShowChecklist(false);
      resetAutoTimer();
      return;
    }
    // Otherwise do nothing (snap back)
  };

  // Variants for the stacked panels
  const backCardVariants = {
    visible: { scale: 1, x: 0, zIndex: 10, opacity: 1, filter: "none" },
    hidden: {
      scale: 0.98,
      x: -30,
      zIndex: 5,
      opacity: 0.6,
      filter: "blur(0.6px)",
    },
  };

  const frontCardVariants = {
    hidden: { x: "100%", opacity: 0, zIndex: 20 },
    visible: { x: "0%", opacity: 1, zIndex: 30 },
  };

  // click control
  const toggleChecklist = () => {
    setShowChecklist((s) => !s);
    resetAutoTimer();
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full min-h-screen relative overflow-hidden bg-background text-foreground transition-colors"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Background holographic grid + streaks */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(6,30,26,0.18)] via-[rgba(6,18,30,0.14)] to-[rgba(112,14,30,0.08)] opacity-95 pointer-events-none" />
        <div className="absolute inset-0 animate-grid move-grid" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-10 w-[800px] h-[800px] -translate-x-1/3 -translate-y-1/4 opacity-10 blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(50,255,200,0.06),transparent_30%)]" />
          <div className="absolute right-0 bottom-20 w-[700px] h-[700px] translate-x-1/4 translate-y-1/6 opacity-8 blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,70,120,0.06),transparent_30%)]" />
        </div>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg px-3 py-2 border border-border bg-muted/20 backdrop-blur">
            <div className="font-extrabold tracking-wider text-teal-300">
              JAY SINH THAKUR
            </div>
            <div className="text-xs opacity-60">Goals • Holographic</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-border bg-card/40 backdrop-blur text-sm">
            Theme: Holographic
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* Title / hero */}
        <section
          className="mb-8 transform-gpu"
          style={{
            transform: `translateZ(40px) rotateX(${tilt.y / 6}deg) rotateY(${
              tilt.x / 8
            }deg)`,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold leading-snug text-center"
            style={{
              textShadow:
                "0 6px 30px rgba(0,0,0,0.6), 0 0 18px rgba(40,200,180,0.06)",
            }}
          >
            <span className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-teal-300/10 to-cyan-300/6 border border-[rgba(255,255,255,0.03)]">
              🚀 My Holographic Goals Command Center
            </span>
          </motion.h1>

          <p className="mt-3 text-center text-sm text-muted-foreground/80 max-w-2xl mx-auto">
            Futuristic view of your MERN roadmap, NZ migration plan, fitness
            goals and daily routine — with live countdown & holo-visuals.
          </p>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Holo Panel (MERN + Countdown) */}
          <div className="relative">
            {/* parent container keeps same dimension and look */}
            <div
              className="relative rounded-2xl border border-[rgba(150,255,230,0.06)] bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] backdrop-blur-md p-5 shadow-xl"
              style={{
                transformStyle: "preserve-3d",
                boxShadow:
                  "0 20px 60px rgba(6,20,30,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
                minHeight: 420, // keep enough height for checklist to slide in
                overflow: "hidden",
              }}
            >
              {/* neon corner brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t border-l border-[rgba(60,240,210,0.08)] rounded-bl-xl" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b border-r border-[rgba(255,80,140,0.06)] rounded-tr-xl" />

              {/* stacking context for two panels */}
              <div className="relative w-full h-full">
                {/* BACK (main) card - moves back when checklist opens */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -400, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(e, info) => handleDragEnd(info)}
                  variants={backCardVariants}
                  animate={showChecklist ? "hidden" : "visible"}
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  className="relative z-10 w-full h-full"
                  style={{ pointerEvents: showChecklist ? "none" : "auto" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-3">
                        <span className="text-xl">💠</span>
                        MERN Mastery
                      </h3>
                      <div className="text-xs text-muted-foreground/80 mt-1">
                        Target: Dec 31, 2026
                      </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-3">
                      <svg
                        width="150"
                        height="150"
                        viewBox="0 0 200 200"
                        className="transform-gpu"
                      >
                        <defs>
                          <linearGradient id="g1" x1="0" x2="1">
                            <stop offset="0%" stopColor="#00f0d1" />
                            <stop offset="100%" stopColor="#a13bff" />
                          </linearGradient>
                          <filter
                            id="glow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feGaussianBlur
                              stdDeviation="6"
                              result="coloredBlur"
                            />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        <g transform="translate(100,100)">
                          <circle
                            r={R}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="8"
                          />
                          <circle
                            r={R}
                            fill="transparent"
                            stroke="url(#g1)"
                            strokeWidth="8"
                            strokeDasharray={`${C} ${C}`}
                            strokeDashoffset={`${C - progressStroke}`}
                            strokeLinecap="round"
                            transform="rotate(-90)"
                            style={{
                              filter: "url(#glow)",
                              transition: "stroke-dashoffset 0.7s ease",
                            }}
                          />
                          <text
                            x="0"
                            y="6"
                            textAnchor="middle"
                            fontSize="18"
                            fill="white"
                            style={{ fontWeight: 700 }}
                          >
                            {merPercent}%
                          </text>
                          <text
                            x="0"
                            y="26"
                            textAnchor="middle"
                            fontSize="10"
                            fill="rgba(255,255,255,0.6)"
                          >
                            MERN Progress
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* timeline / CTA */}
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-xl p-3 bg-card/60 border border-[rgba(255,255,255,0.02)]">
                      <div className="flex justify-between items-center">
                        <div className="text-sm opacity-80">Days remaining</div>
                        <div className="text-lg font-semibold">
                          {countdown.days}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground/70">
                        Weeks: {countdown.weeks} • Months: {countdown.months}
                      </div>
                    </div>

                    <div className="rounded-xl p-3 bg-[linear-gradient(90deg,rgba(0,240,210,0.04),rgba(161,59,255,0.02))] border border-[rgba(0,240,210,0.05)]">
                      <div className="text-xs opacity-80">Quick Actions</div>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-2 rounded-lg text-sm border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)]">
                          Open Roadmap
                        </button>
                        <button className="px-3 py-2 rounded-lg text-sm border border-[rgba(0,240,210,0.06)] bg-[rgba(0,240,210,0.02)]">
                          Review Projects
                        </button>
                        <button
                          onClick={toggleChecklist}
                          className="px-3 py-2 rounded-lg text-sm border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)]"
                        >
                          View Checklist
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* FRONT (checklist) card - slides in from right and sits above */}
                <AnimatePresence>
                  {showChecklist && (
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -400, right: 400 }}
                      dragElastic={0.12}
                      onDragEnd={(e, info) => {
                        // If dragged right (positive dx) close
                        if (info.offset.x > 80 || info.velocity.x > 500) {
                          setShowChecklist(false);
                          resetAutoTimer();
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={frontCardVariants}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 28,
                      }}
                      className="absolute inset-0 z-30 rounded-2xl p-4 border border-[rgba(255,255,255,0.02)] bg-card/40 backdrop-blur-lg shadow-lg"
                      style={{
                        overflow: "auto",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold mb-2">
                          📚 MERN Learning Checklist
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowChecklist(false);
                              resetAutoTimer();
                            }}
                            className="text-sm px-3 py-1 rounded-md border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.02)]"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      {/* FULL CARD SCROLL AREA (the whole card scrolls) */}
                      <div className="mt-3 space-y-4">
                        <div>
                          <h5 className="text-sm font-semibold">HTML & CSS</h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Semantic HTML & accessibility</li>
                            <li>• Flexbox & Grid</li>
                            <li>• Responsive design</li>
                            <li>• Tailwind essentials</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold">JavaScript</h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• ES6+ features (map/filter/reduce)</li>
                            <li>• Async/Await, fetch, API handling</li>
                            <li>• DOM, events & LocalStorage</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold">React</h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Hooks: useState, useEffect, useRef</li>
                            <li>• React Router & component patterns</li>
                            <li>• Context / custom hooks</li>
                            <li>• Framer Motion & performance</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold">
                            Backend & DB
                          </h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Node.js + Express basics</li>
                            <li>• REST API design, auth (JWT)</li>
                            <li>• MongoDB & Mongoose</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold">
                            DSA / Interview Prep
                          </h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Arrays, Strings, Hashmaps</li>
                            <li>• Two pointers, sliding window</li>
                            <li>• Trees, graphs, DP basics</li>
                            <li>• Solve 150–200 questions</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold">
                            DevOps & Deployment
                          </h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Git & GitHub workflow</li>
                            <li>• Basic Docker & CI/CD</li>
                            <li>• Deploying to Vercel / Heroku / Netlify</li>
                          </ul>
                        </div>

                        <div className="pb-8">
                          <h5 className="text-sm font-semibold">
                            Projects to build
                          </h5>
                          <ul className="mt-2 text-xs opacity-90 space-y-1">
                            <li>• Dashboard / Portfolio (React + Tailwind)</li>
                            <li>• Fitness tracker (full-stack)</li>
                            <li>• Notes app with auth</li>
                            <li>• Mini SaaS / CRUD app</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Middle Column - Holo Cards Stack */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-4 border border-[rgba(255,255,255,0.02)] bg-card/40 backdrop-blur-lg shadow-lg"
              style={{
                transform: `translateZ(${tilt.x * 1.5}px) translateY(${
                  tilt.y * -1.2
                }px)`,
                transition: "transform 0.15s linear",
              }}
            >
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="text-2xl">🏝</span> NZ Migration Blueprint
              </h4>
              <p className="text-sm opacity-70">
                Getting ready for NZ — skills, visa, savings, cities.
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg p-3 bg-muted/10 border border-[rgba(255,255,255,0.02)] text-xs">
                  • Build NZ-style CV & LinkedIn
                </div>
                <div className="rounded-lg p-3 bg-muted/10 border border-[rgba(255,255,255,0.02)] text-xs">
                  • Apply to remote roles (Auckland / Wellington)
                </div>
                <div className="rounded-lg p-3 bg-muted/10 border border-[rgba(255,255,255,0.02)] text-xs">
                  • Prepare IELTS / Visa docs
                </div>
                <div className="rounded-lg p-3 bg-muted/10 border border-[rgba(255,255,255,0.02)] text-xs">
                  • Savings target: editable
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-4 border border-[rgba(255,255,255,0.02)] bg-card/40 backdrop-blur-lg shadow-lg"
            >
              <h4 className="text-lg font-bold mb-2">🏋 Fitness Command</h4>
              <div className="text-sm opacity-75">
                Daily gym, macros, sleep — track simple metrics.
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="w-full">
                  <div className="text-xs opacity-70">Weight Loss Progress</div>
                  <div className="h-3 bg-[rgba(255,255,255,0.04)] rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-teal-300 to-pink-500"
                      style={{ width: "45%" }}
                    />
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    4.5 kg lost • goal: 10 kg
                  </div>
                </div>
                <div className="w-20 text-center">
                  <div className="text-sm font-semibold">6x / wk</div>
                  <div className="text-xs opacity-60">Gym</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Floating Panels */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ y: -6 }}
              className="rounded-2xl p-5 border border-[rgba(255,255,255,0.02)] bg-card/40 backdrop-blur-lg shadow-lg"
            >
              <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                ⏱ Daily Routine
              </h4>
              <div className="text-sm opacity-70">
                5:30 AM — Wake • 6:00–7:45 — Gym • 9:30–19:00 — Office •
                20:30–23:30 — Coding • 23:30–00:30 — Journal
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md p-2 bg-muted/10 border">
                  Morning Focus
                </div>
                <div className="rounded-md p-2 bg-muted/10 border">
                  Night Deep Work
                </div>
                <div className="rounded-md p-2 bg-muted/10 border">
                  Weekly Review
                </div>
                <div className="rounded-md p-2 bg-muted/10 border">
                  Portfolio Sprint
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-5 border border-[rgba(255,255,255,0.02)] bg-card/40 backdrop-blur-lg shadow-lg"
            >
              <h4 className="text-lg font-bold mb-2">🌌 Dream Board</h4>
              <div className="flex gap-2">
                <div className="flex-1 rounded-md p-3 bg-muted/8 text-xs">
                  Live in NZ • Nature • Calm life
                </div>
                <div className="flex-1 rounded-md p-3 bg-muted/8 text-xs">
                  Senior Dev • Freedom • Salary
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer CTA / Extras */}
        <section className="mt-10">
          <div className="rounded-2xl p-6 border border-[rgba(255,255,255,0.02)] bg-[linear-gradient(90deg,rgba(255,255,255,0.01),rgba(255,255,255,0.00))] backdrop-blur-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-sm opacity-80">Need help? I can:</div>
                <div className="text-lg font-semibold">
                  Generate a detailed MERN study plan, NZ job application pack,
                  or migration checklist.
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg border bg-[rgba(0,240,210,0.04)] hover:scale-105">
                  Create MERN Plan
                </button>
                <button className="px-4 py-2 rounded-lg border bg-[rgba(161,59,255,0.04)] hover:scale-105">
                  NZ Checklist
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Styles for holographic effects */}
      <style>{`
        /* animated dotted grid */
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
        /* subtle particle drift */
        .move-grid::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(0,240,210,0.03), transparent 8%),
            radial-gradient(circle at 80% 80%, rgba(161,59,255,0.03), transparent 10%),
            radial-gradient(circle at 90% 10%, rgba(255,80,140,0.02), transparent 12%);
          opacity: 0.7;
          animation: drift 18s linear infinite;
        }
        @keyframes drift {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        /* small responsive tweaks */
        @media (max-width: 768px) {
          svg { width: 110px; height: 110px; }
        }
      `}</style>
    </div>
  );
}
