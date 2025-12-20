// StudyProjectsAdvanced.jsx — FINAL FULLY WIRED VERSION
// - Local + Backend sync for everything (progress, XP, deadlines, bonuses)
// - Same UI & behavior as your advanced version
// - Uses wd_projects on backend, with _meta for XP + bonuses

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Code,
  LayoutList,
  Database,
  Cpu,
  Terminal,
  List,
  Layers,
  Clock, // clock icon for Set Deadline
} from "lucide-react";

/* LocalStorage keys (consistent with your global namespace) */
const STORE = {
  PROGRESS: "wd_projects_progress",
  XP: "wd_total_xp",
  LEVEL: "wd_level",
  BONUS: "wd_section_bonus_awarded",
};

// XP settings (RPG style)
const XP_VALUES = { Beginner: 10, Intermediate: 20, Advanced: 30 };
const SECTION_BONUS = 100;

// small helpers for localStorage
const loadJSON = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// level requirement helper
const levelRequirement = (lvl) => {
  if (lvl === 1) return 200;
  if (lvl === 2) return 400;
  if (lvl === 3) return 700;
  return 1000 + (lvl - 4) * 400;
};

/* ========== Project data (unchanged) ========== */
const PROJECT_SECTIONS = {
  HTML: [
    "Responsive Magazine Layout",
    "Interactive Resume + Download",
    "Multi-section Landing (Marketing)",
    "Accessible Form Builder",
    "Static Blog Template",
    "Portfolio w/ Filter + Lightbox",
    "Micro-Interactions Kit (CSS only)",
    "HTML Canvas Illustration Page",
    "Email Template Inliner",
    "Static CMS Clone (Read-only)",
  ],
  CSS: [
    "Glassmorphism Dashboard Card Set",
    "Advanced Responsive Grid System",
    "CSS Component Library (Buttons/Inputs)",
    "Animated Pricing Grid with Toggle",
    "Pure-CSS Image Gallery Effects",
    "Fluid Typography Demo",
    "CSS-only Modal + Tabs",
    "Complex Form Layout + Validation UI",
    "Design System Tokens Page",
    "Interactive SVG + Keyframe Animations",
  ],
  TAILWIND: [
    "Admin Dashboard UI (Tailwind)",
    "E-Commerce Product Grid",
    "Tailwind Component Library",
    "Landing with Hero + Builder",
    "Tailwind + HeadlessUI Modal Flow",
    "Responsive Sidebar Layout",
    "Tailwind Blog + CMS Frontend",
    "Settings Page with Theme Switch",
    "Notifications + Toasters UI",
    "Search + Filters UI (Tailwind)",
  ],
  JAVASCRIPT: [
    "SPA Weather App + Caching",
    "Realtime Search (Debounce) UI",
    "Pomodoro + Session Tracker",
    "Expense Tracker with Charts",
    "Drag + Drop Kanban (vanilla)",
    "Image Editor (crop/resize)",
    "Audio Player with Visualizer",
    "API Rate-Limited Fetch Demo",
    "Infinite Scroll Virtualization",
    "Web Worker Heavy Computation Demo",
  ],
  REACT: [
    "Component Library + Storybook",
    "Complex Form with Validation Hooks",
    "State Management Demo (Context/Reducer)",
    "React Router Multi-page App",
    "Realtime Search with Suspense",
    "Custom Hooks Pack + Tests",
    "Optimized List Virtualization",
    "React Canvas Interactive",
    "SSR-ready React App (Next-like)",
    "MFE (microfrontend) demo (basic)",
  ],
  "NODE+MONGO": [
    "Auth Service (JWT + Refresh)",
    "Notes API with File Upload",
    "Payments Sandbox (test)",
    "Image Resize CDN Middleware",
    "Role-Based Access API",
    "Searchable Posts API (text-index)",
    "Realtime via WebSockets (simple chat)",
    "Rate limiting + Security Middleware",
    "Email Verification Flow",
    "Analytics Event Collector API",
  ],
  MERN: [
    "Full Auth + Profile (Roles)",
    "MERN Blog with Editor + Uploads",
    "MERN Chat App (socket + db)",
    "MERN E-Commerce (cart + orders)",
    "MERN Fitness Tracker (graphing)",
    "MERN Study Tracker (your app)",
    "MERN Social Feed (like/comment)",
    "MERN SaaS Dashboard (billing stub)",
    "MERN AI Prompt Hub (frontend+api)",
    "MERN Deployment Pipeline Demo",
  ],
};

// Top 10 recommended projects (career-first)
const TOP_10 = [
  "Full Auth + Profile (Roles) — MERN",
  "Portfolio with Projects + Blog — HTML/CSS/Tailwind",
  "Kanban Board (React) Productivity App",
  "MERN E-Commerce (end-to-end)",
  "Auth Service + Notes API — Node+Mongo",
  "Component Library + Storybook — React",
  "Dashboard UI (Tailwind) + Charts",
  "Chat App (MERN or React + Socket)",
  "Expense Tracker with Charts — JS/React",
  "Deployment Demo (CI Pipeline) — MERN",
];

// difficulty helper
const difficultyForIndex = (i) =>
  i <= 3 ? "Beginner" : i <= 6 ? "Intermediate" : "Advanced";

// map difficulty to auto-deadline days
const autoDeadlineDaysForDifficulty = (d) =>
  d === "Beginner" ? 3 : d === "Intermediate" ? 5 : 7;

// format helpers
const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
};

// returns remaining string; if expired, returns "Expired"
const getRemainingString = (isoDate) => {
  if (!isoDate) return "";
  const target = new Date(`${isoDate}T23:59:59`).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

/* Small confetti (unchanged) */
function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const colors = ["#00ffa3", "#00e5ff", "#ff6b6b", "#ffd93d", "#7afcff"];
  let particles = Array.from({ length: 120 }).map(() => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 160,
    y: innerHeight * 0.2 + (Math.random() - 0.5) * 80,
    vx: (Math.random() - 0.5) * 10,
    vy: -Math.random() * 6 - 2,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 60 + Math.random() * 60,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 50);
    if (particles.length) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

/* ========== MAIN COMPONENT ========== */
export default function StudyProjectsAdvanced({
  dashboardState,
  updateDashboard,
  filters = { view: "sections" },
}) {
  const [query, setQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [view, setView] = useState("sections");
  const [openSection, setOpenSection] = useState(null);

  // progress/xp state — loaded from localStorage
  // normalized shape: progress = { SECTION: { [idx]: true/false, completionDates: { [idx]: "YYYY-MM-DD" }, deadlineDates: { [idx]: "YYYY-MM-DD" } } }
  const [progress, setProgress] = useState(() => loadJSON(STORE.PROGRESS, {}));
  const [xp, setXP] = useState(() => loadJSON(STORE.XP, 0));
  const [level, setLevel] = useState(() => loadJSON(STORE.LEVEL, 0));
  const [bonusGiven, setBonusGiven] = useState(() => loadJSON(STORE.BONUS, {}));

  // modal for details and for deadline confirmation
  const [modal, setModal] = useState(null); // { section, idx, title, diff }
  const [confirmDeadline, setConfirmDeadline] = useState(null);
  // confirmDeadline shape: { section, idx, existingDate, newDate?, onConfirm: fn, onCancel: fn }

  // REF to prevent circular updates
  const isLocalChange = useRef(false);

  /* --------------------------- LOAD FROM BACKEND (PRIMARY) ---------------------------- */
  useEffect(() => {
    // Skip if this was triggered by our own local change
    if (isLocalChange.current) {
      isLocalChange.current = false;
      return;
    }

    if (
      dashboardState &&
      dashboardState.wd_projects &&
      typeof dashboardState.wd_projects === "object"
    ) {
      const { _meta, ...sections } = dashboardState.wd_projects;
      setProgress(sections);
      if (typeof _meta?.xp === "number") setXP(_meta.xp);
      if (_meta?.bonusGiven && typeof _meta.bonusGiven === "object")
        setBonusGiven(_meta.bonusGiven);
      // level will auto-derive from xp via effect below
    }
  }, [dashboardState]);

  /* --------------------------- LOCAL CACHE (SECONDARY) ---------------------------- */
  useEffect(() => {
    saveJSON(STORE.PROGRESS, progress);
  }, [progress]);
  useEffect(() => {
    saveJSON(STORE.XP, xp);
  }, [xp]);
  useEffect(() => {
    saveJSON(STORE.LEVEL, level);
  }, [level]);
  useEffect(() => {
    saveJSON(STORE.BONUS, bonusGiven);
  }, [bonusGiven]);

  /* --------------------------- THEME LISTENER (unchanged) ---------------------------- */
  useEffect(() => {
    const syncTheme = () => {
      const root = document.documentElement;
      root.classList.contains("dark");
    };
    syncTheme();
    window.addEventListener("theme-changed", syncTheme);
    return () => window.removeEventListener("theme-changed", syncTheme);
  }, []);

  /* --------------------------- LEVEL FROM XP ---------------------------- */
  useEffect(() => {
    let lv = 0;
    let remaining = xp;
    while (remaining >= levelRequirement(lv + 1)) {
      remaining -= levelRequirement(lv + 1);
      lv++;
    }
    if (lv !== level) setLevel(lv);
  }, [xp, level]);

  /* --------------------------- PROGRESS HELPERS ---------------------------- */
  const sectionProgress = (key) => {
    const list = PROJECT_SECTIONS[key];
    if (!list || list.length === 0) return 0;
    const done = Object.entries(progress[key] || {}).filter(
      ([k, v]) => !isNaN(k) && v === true,
    ).length;
    return Math.round((done / list.length) * 100);
  };

  const overallProgress = (() => {
    let total = 0;
    let done = 0;
    Object.entries(PROJECT_SECTIONS).forEach(([k, v]) => {
      total += v.length;
      const sectionDone = Object.entries(progress[k] || {}).filter(
        ([k2, v2]) => !isNaN(k2) && v2 === true,
      ).length;
      done += sectionDone;
    });
    return total ? Math.round((done / total) * 100) : 0;
  })();

  /* --------------------------- SYNC TO BACKEND (ONE PLACE) ---------------------------- */
  const syncAll = (nextProgress, nextXP, nextBonusGiven) => {
    if (typeof updateDashboard !== "function") return;

    // Set flag to prevent the useEffect from re-setting progress
    isLocalChange.current = true;

    const payload = JSON.parse(
      JSON.stringify({
        ...nextProgress,
        _meta: { xp: nextXP, bonusGiven: nextBonusGiven },
      }),
    );
    updateDashboard((prev) => ({
      ...prev,
      wd_projects: payload,
    }));
    window.dispatchEvent(new Event("lifeos_update"));
  };

  /* --------------------------- TOGGLE PROJECT ---------------------------- */
  const toggleProject = (section, idx) => {
    const wasDone = !!progress[section]?.[idx];
    const next = structuredClone(progress);
    if (!next[section]) next[section] = {};
    if (!next[section].completionDates) next[section].completionDates = {};
    if (!next[section].deadlineDates) next[section].deadlineDates = {};

    // toggle
    next[section][idx] = !wasDone;

    if (!wasDone) {
      next[section].completionDates[idx] = new Date()
        .toISOString()
        .split("T")[0];
      delete next[section].deadlineDates[idx];
    } else {
      delete next[section].completionDates[idx];
      delete next[section].deadlineDates[idx];
    }

    // XP logic
    const diff = difficultyForIndex(idx);
    const gain = XP_VALUES[diff];
    let nextXP = wasDone ? Math.max(0, xp - gain) : xp + gain;

    // bonus check
    const list = PROJECT_SECTIONS[section];
    const doneCount = Object.entries(next[section]).filter(
      ([k, v]) => !isNaN(k) && v === true,
    ).length;
    let nextBonusGiven = { ...bonusGiven };
    if (!wasDone && doneCount === list.length && !bonusGiven[section]) {
      nextXP += SECTION_BONUS;
      nextBonusGiven = { ...bonusGiven, [section]: true };
      fireConfetti();
    }

    // local UI update
    setProgress(next);
    setXP(nextXP);
    setBonusGiven(nextBonusGiven);

    // backend + localStorage sync
    syncAll(next, nextXP, nextBonusGiven);
  };

  const suggestedDeadlineFor = (idx) => {
    const diff = difficultyForIndex(idx);
    const days = autoDeadlineDaysForDifficulty(diff);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  /* ------------------------------- SET DEADLINE (button version) ------------------------------- */
  const handleSetDeadline = (section, idx) => {
    const existing = progress?.[section]?.deadlineDates?.[idx] || null;
    const suggested = existing || suggestedDeadlineFor(idx);
    setConfirmDeadline({
      section,
      idx,
      existingDate: existing,
      newDate: suggested, // prefill input
    });
  };

  const applyNewDeadline = (section, idx) => {
    const diff = difficultyForIndex(idx);
    const days = autoDeadlineDaysForDifficulty(diff);
    const d = new Date();
    d.setDate(d.getDate() + days);
    const iso = d.toISOString().split("T")[0];

    const next = structuredClone(progress);
    if (!next[section]) next[section] = {};
    if (!next[section].deadlineDates) next[section].deadlineDates = {};
    next[section].deadlineDates[idx] = iso;

    setProgress(next);
    // sync (including XP & bonus state)
    syncAll(next, xp, bonusGiven);
  };

  /* ---------------------------- SEARCH + FILTERED SECTIONS ---------------------------- */
  const filteredSections = useMemo(() => {
    if (!query && filterDifficulty === "All") return PROJECT_SECTIONS;
    const q = query.trim().toLowerCase();
    const out = {};
    Object.entries(PROJECT_SECTIONS).forEach(([k, list]) => {
      const filtered = list
        .map((title, idx) => ({
          title,
          idx,
          diff: difficultyForIndex(idx),
        }))
        .filter((p) => {
          if (filterDifficulty !== "All" && p.diff !== filterDifficulty)
            return false;
          if (q && !p.title.toLowerCase().includes(q)) return false;
          return true;
        })
        .map((p) => p.title);
      if (filtered.length) out[k] = filtered;
    });
    return out;
  }, [query, filterDifficulty]);

  /* ---------------------------- Checkbox Component ----------------------------- */
  const Checkbox = ({ checked, onToggle }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // never bubble to anything around
        onToggle();
      }}
      className={`w-6 h-6 flex items-center justify-center rounded-md border ${
        checked
          ? "bg-emerald-400/20 border-emerald-400"
          : "bg-transparent border-white/10"
      } transition-all`}
      aria-pressed={checked}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 ${checked ? "opacity-100" : "opacity-0"}`}
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  /* ---------------------------- Difficulty Pill Component ----------------------------- */
  const DiffPill = ({ d }) => (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        d === "Beginner"
          ? "bg-white/5 border-white/10"
          : d === "Intermediate"
            ? "bg-white/8 border-white/12"
            : "bg-white/12 border-white/20"
      }`}
    >
      {d}
    </span>
  );

  // At the top of your Projects.jsx file
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  /* ========== RENDER ========== */
  return (
    <div className="min-h-[calc(60vh-var(--nav-height))] rounded-2xl px-6 py-6 transition-all duration-300 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAF9] dark:bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000] text-foreground md:mt-7 lg:mt-0">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <header className="relative mb-2 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-0F766E/20 via-183D3D/30 to-0F0F0F/20 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-black/40">
          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Title Section */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,255,200,0.15)] flex items-center gap-3">
                <Code className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
                MERN Project Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/70 font-medium tracking-wide flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  70 projects
                </span>
                <span className="text-emerald-400/40">•</span>
                <span>XP system</span>
                <span className="text-emerald-400/40">•</span>
                <span>Cloud synced</span>
              </p>
            </div>

            {/* Right: Stats Cards */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Level Card */}
              <div className="group relative overflow-hidden rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-600/10 via-amber-600/5 to-orange-600/10 px-4 py-3 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Award className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 blur-md bg-yellow-400/30 group-hover:bg-yellow-400/50 transition-all" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-yellow-100">
                      Level {level}
                    </div>
                    <div className="text-xs text-yellow-200/60">{xp} XP</div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 via-teal-600/5 to-cyan-600/10 px-4 py-3 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 min-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-emerald-200/80 uppercase tracking-wider min-w-[50px]">
                    Overall
                  </div>
                  <div className="flex-1 h-2.5 bg-black/30 rounded-full overflow-hidden border border-emerald-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="text-sm font-bold text-emerald-100 min-w-[42px] text-right">
                    {overallProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* FILTERS & CONTROLS */}
        <div className="mb-6 space-y-3">
          {/* Search Bar - Full Width */}
          <div className="relative group">
            <div className="flex items-center gap-2 border border-emerald-500/30 rounded-xl px-4 py-2.5 bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 shadow-lg shadow-black/20">
              <svg
                className="w-4 h-4 text-emerald-300/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
                className="bg-transparent outline-none text-sm flex-1 text-emerald-100 placeholder:text-emerald-200/40 font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3 ">
            {/* LEFT: Difficulty Filter */}
            <div className="relative flex-1 sm:flex-initial ">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 pr-10
                 rounded-xl border border-emerald-500/30 
                 bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20 hover:border-emerald-400/50 
                 transition-all text-sm font-medium 
                 dark:text-emerald-100                  
                 focus:outline-none 
                 focus:ring-2 focus:ring-emerald-400/50 
                 cursor-pointer appearance-none"
              >
                <option
                  value="All"
                  className="bg-[#C9E9E0] dark:bg-[#0A1F1C] text-emerald-900 dark:text-emerald-100 rounded-xl"
                >
                  All Levels
                </option>
                <option
                  value="Beginner"
                  className="bg-[#C9E9E0] dark:bg-[#0A1F1C] text-emerald-900 dark:text-emerald-100"
                >
                  Beginner
                </option>
                <option
                  value="Intermediate"
                  className="bg-[#C9E9E0] dark:bg-[#0A1F1C] text-emerald-900 dark:text-emerald-100"
                >
                  Intermediate
                </option>
                <option
                  value="Advanced"
                  className="bg-[#C9E9E0] dark:bg-[#0A1F1C] text-emerald-900 dark:text-emerald-100"
                >
                  Advanced
                </option>
              </select>

              {/* Custom Arrow - Theme Aware */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-emerald-700 dark:text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* CENTER: View Switch */}
            <div className="flex items-center gap-1 rounded-xl overflow-hidden border border-emerald-500/30 bg-black/20 shadow-lg shadow-black/20 p-1">
              <button
                onClick={() => setView("sections")}
                className={`group relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  view === "sections"
                    ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sections</span>
              </button>
              <button
                onClick={() => setView("roadmap")}
                className={`group relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  view === "roadmap"
                    ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Roadmap</span>
              </button>
              <button
                onClick={() => setView("top10")}
                className={`group relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  view === "top10"
                    ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Top10</span>
              </button>
              <button
                onClick={() => setView("timeline")}
                className={`group relative px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  view === "timeline"
                    ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "text-emerald-200/60 hover:text-emerald-100 hover:bg-white/5"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
            </div>

            {/* RIGHT: Action Buttons */}
            <div className="flex gap-2 ml-auto">
              {/* EXPORT */}
              <button
                className="group relative overflow-hidden px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/20 to-teal-600/10 hover:from-emerald-500/30 hover:to-teal-500/20 transition-all duration-300 text-xs font-semibold text-emerald-100 shadow-lg shadow-black/20 hover:shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
                onClick={() => {
                  const data = { progress, xp, level, bonusGiven };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "wd_projects_progress.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* RESET */}
              <button
                className="group relative overflow-hidden px-4 py-2.5 rounded-xl border border-red-500/30 bg-gradient-to-br from-red-600/20 to-orange-600/10 hover:from-red-500/30 hover:to-orange-500/20 transition-all duration-300 text-xs font-semibold text-red-100 shadow-lg shadow-black/20 hover:shadow-red-500/20 hover:scale-105 flex items-center gap-2"
                onClick={() => {
                  if (!confirm("Reset ALL progress? This cannot be undone!"))
                    return;
                  localStorage.removeItem(STORE.PROGRESS);
                  localStorage.removeItem(STORE.XP);
                  localStorage.removeItem(STORE.LEVEL);
                  localStorage.removeItem(STORE.BONUS);
                  setProgress({});
                  setXP(0);
                  setLevel(0);
                  setBonusGiven({});
                  syncAll({}, 0, {});
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN VIEW */}
        {view === "sections" && (
          <div className="space-y-3">
            {Object.entries(filteredSections).map(([sec, list]) => (
              <section
                key={sec}
                className="rounded-2xl border border-border p-4 backdrop-blur-md bg-black/20"
              >
                {/* SECTION HEADER */}
                <header
                  onClick={() =>
                    setOpenSection(openSection === sec ? null : sec)
                  }
                  className="flex items-center justify-between cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 rounded-xl px-2 py-1 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-border bg-black/30 flex items-center justify-center">
                      {sec.includes("HTML") && (
                        <LayoutList className="w-6 h-6 text-cyan-300" />
                      )}
                      {sec.includes("CSS") && (
                        <Award className="w-6 h-6 text-pink-300" />
                      )}
                      {sec.includes("TAILWIND") && (
                        <Code className="w-6 h-6 text-sky-300" />
                      )}
                      {sec.includes("JAVASCRIPT") && (
                        <Cpu className="w-6 h-6 text-yellow-300" />
                      )}
                      {sec.includes("REACT") && (
                        <Code className="w-6 h-6 text-violet-300" />
                      )}
                      {sec.includes("NODE") && (
                        <Database className="w-6 h-6 text-green-300" />
                      )}
                      {sec.includes("MERN") && (
                        <Code className="w-6 h-6 text-amber-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {sec.replaceAll("_", " ")}
                      </h3>
                      <div className="text-sm opacity-70">
                        {PROJECT_SECTIONS[sec]?.length || list.length} projects
                        • {sectionProgress(sec)}% complete
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 sm:w-40 h-2 sm:h-3 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${sectionProgress(sec)}%` }}
                      />
                    </div>
                    <div className="text-lg opacity-70">
                      {openSection === sec ? "▲" : "▼"}
                    </div>
                  </div>
                </header>

                {/* SECTION BODY */}
                <AnimatePresence>
                  {openSection === sec && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                      {list.map((title, idx) => {
                        const canonList = PROJECT_SECTIONS[sec];
                        const canonIdx =
                          canonList.indexOf(title) !== -1
                            ? canonList.indexOf(title)
                            : idx;
                        const done = progress?.[sec]?.[canonIdx] === true;
                        const diff = difficultyForIndex(canonIdx);
                        const deadline =
                          progress?.[sec]?.deadlineDates?.[canonIdx] || null;
                        const remaining =
                          deadline && !done
                            ? getRemainingString(deadline)
                            : null;

                        return (
                          <motion.article
                            key={`${title}-${idx}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`group relative pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 rounded-xl transition-all ${
                              done
                                ? "bg-gradient-to-r from-emerald-500/10 to-transparent"
                                : "bg-gradient-to-r from-black/30 to-transparent hover:from-cyan-500/10"
                            }`}
                          >
                            {/* Timeline Dot & Line */}
                            <div className="absolute left-2 sm:left-4 top-0 bottom-0 flex flex-col items-center">
                              <div
                                className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 mt-3 transition-all ${
                                  done
                                    ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/50"
                                    : "bg-black border-cyan-500 group-hover:bg-cyan-500"
                                }`}
                              >
                                {done && (
                                  <svg
                                    className="w-full h-full text-white p-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div
                                className={`flex-1 w-px mt-2 ${
                                  done ? "bg-emerald-500/30" : "bg-white/10"
                                }`}
                              />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                              {/* Title & Difficulty */}
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProject(sec, canonIdx);
                                  }}
                                  className={`font-medium text-sm cursor-pointer transition ${
                                    done
                                      ? "line-through opacity-50"
                                      : "hover:text-cyan-300"
                                  }`}
                                >
                                  {title}
                                </h4>
                                <DiffPill d={diff} />
                              </div>

                              {/* Meta Information */}
                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                {deadline && !done && (
                                  <div
                                    className={`px-2 py-0.5 rounded ${
                                      remaining === "Expired"
                                        ? "bg-red-500/20 text-red-200"
                                        : "bg-amber-500/20 text-amber-200"
                                    }`}
                                  >
                                    {remaining === "Expired"
                                      ? `Expired: ${formatDate(deadline)}`
                                      : `Due: ${formatDate(
                                          deadline,
                                        )} (${remaining})`}
                                  </div>
                                )}

                                {done &&
                                  progress?.[sec]?.completionDates?.[
                                    canonIdx
                                  ] && (
                                    <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                                      Completed:{" "}
                                      {formatDate(
                                        progress[sec].completionDates[canonIdx],
                                      )}
                                    </div>
                                  )}
                              </div>

                              {/* Quick Actions - Hidden on desktop (hover), Always visible on mobile */}
                              <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetDeadline(sec, canonIdx);
                                  }}
                                  className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10"
                                >
                                  ⏰ Set Deadline
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModal({
                                      section: sec,
                                      idx: canonIdx,
                                      title,
                                      diff,
                                    });
                                  }}
                                  className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10"
                                >
                                  📋 Details
                                </button>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            ))}
          </div>
        )}

        {/* ROADMAP VIEW - Minimal & Feature-Full */}
        {view === "roadmap" && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-emerald-100 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Learning Roadmap
              </h3>
              <span className="text-xs text-emerald-200/60">
                7 steps to MERN mastery
              </span>
            </div>

            {/* Roadmap Cards */}
            <div className="grid gap-3">
              {[
                {
                  step: 1,
                  title: "HTML Foundations",
                  section: "HTML",
                  note: "Semantic markup & responsive design",
                  icon: "📄",
                  color: "orange",
                },
                {
                  step: 2,
                  title: "CSS Mastery",
                  section: "CSS",
                  note: "Layouts, animations & styling",
                  icon: "🎨",
                  color: "blue",
                },
                {
                  step: 3,
                  title: "Tailwind UI",
                  section: "TAILWIND",
                  note: "Utility-first components",
                  icon: "🎯",
                  color: "cyan",
                },
                {
                  step: 4,
                  title: "JavaScript",
                  section: "JAVASCRIPT",
                  note: "DOM, APIs & async patterns",
                  icon: "⚡",
                  color: "yellow",
                },
                {
                  step: 5,
                  title: "React",
                  section: "REACT",
                  note: "Components, hooks & state",
                  icon: "⚛️",
                  color: "purple",
                },
                {
                  step: 6,
                  title: "Node + Mongo",
                  section: "NODEMONGO",
                  note: "Backend APIs & database",
                  icon: "🗄️",
                  color: "green",
                },
                {
                  step: 7,
                  title: "MERN Apps",
                  section: "MERN",
                  note: "Full-stack applications",
                  icon: "🚀",
                  color: "emerald",
                },
              ].map((r) => {
                // Calculate real progress from your data
                const sectionKey = r.section;
                const sectionData = progress?.[sectionKey] || {};

                // Count completed items (handle both object {done: true} and boolean format)
                let completedCount = 0;
                let totalCount = 0;

                // Count from progress state
                Object.entries(sectionData).forEach(([key, value]) => {
                  if (key === "completionDates" || key === "deadlineDates")
                    return; // Skip meta keys
                  totalCount++;
                  if (typeof value === "object" && value?.done) {
                    completedCount++;
                  } else if (value === true) {
                    completedCount++;
                  }
                });

                const stepProgress =
                  totalCount > 0
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0;

                // Color mappings
                const colorMap = {
                  orange: {
                    border: "border-orange-500/30",
                    bg: "from-orange-500/10 to-red-500/5",
                    text: "text-orange-300",
                    progress: "from-orange-400 to-red-400",
                  },
                  blue: {
                    border: "border-blue-500/30",
                    bg: "from-blue-500/10 to-indigo-500/5",
                    text: "text-blue-300",
                    progress: "from-blue-400 to-indigo-400",
                  },
                  cyan: {
                    border: "border-cyan-500/30",
                    bg: "from-cyan-500/10 to-teal-500/5",
                    text: "text-cyan-300",
                    progress: "from-cyan-400 to-teal-400",
                  },
                  yellow: {
                    border: "border-yellow-500/30",
                    bg: "from-yellow-500/10 to-amber-500/5",
                    text: "text-yellow-300",
                    progress: "from-yellow-400 to-amber-400",
                  },
                  purple: {
                    border: "border-purple-500/30",
                    bg: "from-purple-500/10 to-pink-500/5",
                    text: "text-purple-300",
                    progress: "from-purple-400 to-pink-400",
                  },
                  green: {
                    border: "border-green-500/30",
                    bg: "from-green-500/10 to-emerald-500/5",
                    text: "text-green-300",
                    progress: "from-green-400 to-emerald-400",
                  },
                  emerald: {
                    border: "border-emerald-500/30",
                    bg: "from-emerald-500/10 to-teal-500/5",
                    text: "text-emerald-300",
                    progress: "from-emerald-400 to-teal-400",
                  },
                };

                const colors = colorMap[r.color];

                return (
                  <div
                    key={r.step}
                    className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-4 hover:border-opacity-60 transition-all duration-300 hover:scale-[1.01]`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Badge */}
                      <div className="flex-shrink-0">
                        <div
                          className={`relative w-12 h-12 rounded-full border-2 ${colors.border} bg-black/30 flex items-center justify-center`}
                        >
                          <span className="text-xl">{r.icon}</span>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black/80 border border-white/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-300">
                              {r.step}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-base font-bold ${colors.text}`}>
                            {r.title}
                          </h4>
                          <span className="text-xs font-bold text-emerald-100 min-w-[45px] text-right">
                            {stepProgress}%
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-emerald-100/60 mb-2">
                          {r.note}
                        </p>

                        {/* Progress Bar */}
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full bg-gradient-to-r ${colors.progress} transition-all duration-700 ease-out`}
                            style={{ width: `${stepProgress}%` }}
                          />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mt-2 text-xs text-emerald-200/50">
                          <span className="uppercase tracking-wide font-medium">
                            {r.section}
                          </span>
                          <span>
                            {completedCount} / {totalCount} completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Tip */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-start gap-2">
                <span className="text-sm">💡</span>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  <span className="font-semibold text-emerald-200">
                    Pro Tip:
                  </span>{" "}
                  Follow steps sequentially for best results. Each builds on the
                  previous one.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOP 10 VIEW - Minimal & Feature-Full */}
        {view === "top10" && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-emerald-100 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Career-First Projects
              </h3>
              <span className="text-xs text-yellow-200/60">
                10 portfolio essentials
              </span>
            </div>

            {/* Top 10 Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {TOP_10.map((t, i) => {
                // Medal colors for top 3
                const medalColors = {
                  0: {
                    border: "border-yellow-500/40",
                    bg: "from-yellow-500/15 to-amber-500/10",
                    badge: "bg-gradient-to-br from-yellow-400 to-amber-500",
                    icon: "🥇",
                    glow: "shadow-yellow-500/20",
                  },
                  1: {
                    border: "border-gray-400/40",
                    bg: "from-gray-500/15 to-slate-500/10",
                    badge: "bg-gradient-to-br from-gray-300 to-slate-400",
                    icon: "🥈",
                    glow: "shadow-gray-500/20",
                  },
                  2: {
                    border: "border-orange-500/40",
                    bg: "from-orange-500/15 to-red-500/10",
                    badge: "bg-gradient-to-br from-orange-400 to-red-500",
                    icon: "🥉",
                    glow: "shadow-orange-500/20",
                  },
                };

                const isTopThree = i < 3;
                const colors = isTopThree
                  ? medalColors[i]
                  : {
                      border: "border-emerald-500/30",
                      bg: "from-emerald-500/10 to-teal-500/5",
                      badge:
                        "bg-gradient-to-br from-emerald-500/80 to-teal-500/60",
                      icon: "⭐",
                      glow: "shadow-emerald-500/10",
                    };

                return (
                  <motion.div
                    key={t}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-4 hover:border-opacity-60 transition-all duration-300 ${colors.glow} hover:shadow-lg`}
                  >
                    {/* Rank Badge */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`${colors.badge} w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border border-white/20`}
                      >
                        <span className="text-sm font-black text-white">
                          {isTopThree ? colors.icon : `#${i + 1}`}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pr-10">
                      {/* Project Title */}
                      <h4 className="text-base font-bold text-emerald-100 group-hover:text-emerald-50 transition-colors mb-2 leading-tight">
                        {t}
                      </h4>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-xs font-medium text-yellow-200">
                          Portfolio Ready
                        </span>
                        {isTopThree && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-xs font-medium text-yellow-100">
                            Priority
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-emerald-100/60 mb-2 leading-relaxed">
                        High-impact project that showcases real-world skills
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-emerald-200/70">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>~1 week</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-200/70">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Career boost</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Cards */}
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {/* Why These Projects */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="font-bold text-blue-100 text-sm">
                    Why These Projects?
                  </h4>
                </div>
                <p className="text-xs text-blue-100/70 leading-relaxed">
                  Hand-picked to demonstrate full-stack skills, problem-solving,
                  and production-ready code quality.
                </p>
              </div>

              {/* Pro Tip */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <h4 className="font-bold text-purple-100 text-sm">Pro Tip</h4>
                </div>
                <p className="text-xs text-purple-100/70 leading-relaxed">
                  Complete these with clean code, documentation, and deploy
                  them. Perfect for job interviews.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE VIEW - Minimal & Feature-Full */}
        {view === "timeline" && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-emerald-100 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Completion Timeline
              </h3>
              <span className="text-xs text-emerald-200/60">
                Your learning journey
              </span>
            </div>

            {/* Check if any progress exists */}
            {Object.keys(progress).length === 0 ? (
              // Empty State
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/5 via-teal-600/5 to-cyan-600/5 p-12">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-emerald-300/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-100 mb-2">
                      No Completed Projects Yet
                    </h4>
                    <p className="text-sm text-emerald-200/60 max-w-md mx-auto">
                      Start completing projects to see your timeline. Each
                      completed project will appear here with completion dates.
                    </p>
                  </div>
                  <button
                    onClick={() => setView("sections")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-100 text-sm font-semibold hover:from-emerald-500/30 hover:to-teal-500/30 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Browse Projects
                  </button>
                </div>
              </div>
            ) : (
              // Timeline Content
              <div className="space-y-3">
                {Object.entries(progress)
                  .filter(([section]) => section !== "_meta")
                  .map(([section, tasks]) => {
                    // Count completed tasks in this section
                    const completionDates = tasks?.completionDates || {};
                    const completedCount = Object.keys(completionDates).length;

                    // Skip sections with no completed tasks
                    if (completedCount === 0) return null;

                    // Get section color
                    const sectionColors = {
                      HTML: {
                        border: "border-orange-500/30",
                        bg: "from-orange-500/10 to-red-500/5",
                        text: "text-orange-300",
                      },
                      CSS: {
                        border: "border-blue-500/30",
                        bg: "from-blue-500/10 to-indigo-500/5",
                        text: "text-blue-300",
                      },
                      TAILWIND: {
                        border: "border-cyan-500/30",
                        bg: "from-cyan-500/10 to-teal-500/5",
                        text: "text-cyan-300",
                      },
                      JAVASCRIPT: {
                        border: "border-yellow-500/30",
                        bg: "from-yellow-500/10 to-amber-500/5",
                        text: "text-yellow-300",
                      },
                      REACT: {
                        border: "border-purple-500/30",
                        bg: "from-purple-500/10 to-pink-500/5",
                        text: "text-purple-300",
                      },
                      NODEMONGO: {
                        border: "border-green-500/30",
                        bg: "from-green-500/10 to-emerald-500/5",
                        text: "text-green-300",
                      },
                      MERN: {
                        border: "border-emerald-500/30",
                        bg: "from-emerald-500/10 to-teal-500/5",
                        text: "text-emerald-300",
                      },
                    };

                    const colors = sectionColors[section] || {
                      border: "border-gray-500/30",
                      bg: "from-gray-500/10 to-slate-500/5",
                      text: "text-gray-300",
                    };

                    return (
                      <div
                        key={section}
                        className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-4 hover:border-opacity-60 transition-all`}
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold text-base ${colors.text}`}>
                            {section.replaceAll("_", " ")}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10 text-xs font-semibold text-emerald-200">
                            {completedCount} completed
                          </span>
                        </div>

                        {/* Completed Tasks List */}
                        <div className="space-y-2">
                          {Object.entries(completionDates)
                            .sort(
                              ([, dateA], [, dateB]) =>
                                new Date(dateB) - new Date(dateA),
                            ) // Sort by date, newest first
                            .map(([idx, date]) => {
                              const projectName =
                                PROJECT_SECTIONS[section]?.[idx] ||
                                "Unknown Task";

                              return (
                                <div
                                  key={idx}
                                  className="flex items-start justify-between gap-3 p-2 rounded-lg bg-black/20 border border-white/5 hover:bg-black/30 transition-colors"
                                >
                                  {/* Left: Checkmark + Name */}
                                  <div className="flex items-start gap-2 flex-1 min-w-0">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <svg
                                        className="w-4 h-4 text-emerald-300"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-sm text-emerald-100/90 leading-tight">
                                      {projectName}
                                    </span>
                                  </div>

                                  {/* Right: Date */}
                                  <span className="text-xs text-emerald-200/60 whitespace-nowrap flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {date.split("-").reverse().join("-")}{" "}
                                    {/* ✅ */}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    );
                  })}

                {/* Check if all sections have 0 completed tasks */}
                {Object.entries(progress)
                  .filter(([section]) => section !== "_meta")
                  .every(
                    ([, tasks]) =>
                      Object.keys(tasks?.completionDates || {}).length === 0,
                  ) && (
                  <div className="p-8 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 text-center">
                    <p className="text-sm text-emerald-200/60">
                      No completed tasks yet. Start completing projects to see
                      your timeline!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Stats */}
            {Object.keys(progress).length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {/* Total Completed */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-emerald-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-emerald-200/70 uppercase tracking-wide font-semibold">
                        Total Completed
                      </div>
                      <div className="text-xl font-bold text-emerald-100">
                        {Object.values(progress).reduce(
                          (acc, tasks) =>
                            acc +
                            Object.keys(tasks?.completionDates || {}).length,
                          0,
                        )}{" "}
                        projects
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Recent */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-cyan-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-cyan-200/70 uppercase tracking-wide font-semibold">
                        Most Recent
                      </div>
                      <div className="text-sm font-bold text-cyan-100">
                        {(() => {
                          let latestDate = null;
                          Object.values(progress).forEach((tasks) => {
                            Object.values(tasks?.completionDates || {}).forEach(
                              (date) => {
                                if (
                                  !latestDate ||
                                  new Date(date) > new Date(latestDate)
                                ) {
                                  latestDate = date;
                                }
                              },
                            );
                          });
                          return latestDate
                            ? latestDate.split("-").reverse().join("-")
                            : "No completions yet";
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DETAIL MODAL */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="max-w-xl w-full bg-black/90 border border-border rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{modal.title}</h3>
                    <p className="text-sm opacity-80 mt-2">
                      Section: {modal.section} • Difficulty: {modal.diff}
                    </p>
                  </div>
                  <button
                    onClick={() => setModal(null)}
                    className="opacity-70 text-sm"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-4 text-sm opacity-80">
                  <p>Checklist to complete this project:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Responsive layout</li>
                    <li>Accessibility (ARIA labels)</li>
                    <li>Basic unit tests</li>
                    <li>Deployed build</li>
                  </ul>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-xl border border-border"
                    onClick={() => {
                      toggleProject(modal.section, modal.idx);
                      setModal(null);
                    }}
                  >
                    Mark Complete
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl border border-border"
                    onClick={() => setModal(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONFIRM DEADLINE POPUP */}
        <AnimatePresence>
          {confirmDeadline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="max-w-sm w-full rounded-2xl p-5 border border-border bg-gradient-to-br from-[#0C9A7B] via-[#0C729A] to-[#0C2B9A] text-white"
              >
                <h3 className="text-lg font-semibold">
                  {confirmDeadline.existingDate
                    ? "Deadline already exists"
                    : "Set a deadline"}
                </h3>
                {confirmDeadline.existingDate && (
                  <p className="text-sm opacity-80 mt-3">
                    Deadline is currently set to:
                    <br />
                    <span className="font-semibold">
                      {formatDate(confirmDeadline.existingDate)}
                    </span>
                  </p>
                )}
                <p className="text-sm opacity-80 mt-4">
                  Select a new deadline:
                </p>
                <input
                  type="date"
                  value={confirmDeadline.newDate}
                  onChange={(e) =>
                    setConfirmDeadline((old) => ({
                      ...old,
                      newDate: e.target.value,
                    }))
                  }
                  className="mt-2 bg-black/20 border border-border px-2 py-1 rounded-md w-full"
                />
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-xl border border-border"
                    onClick={() => setConfirmDeadline(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl border border-border bg-black/30"
                    onClick={() => {
                      if (confirmDeadline.newDate) {
                        const next = structuredClone(progress);
                        if (!next[confirmDeadline.section].deadlineDates)
                          next[confirmDeadline.section].deadlineDates = {};
                        next[confirmDeadline.section].deadlineDates[
                          confirmDeadline.idx
                        ] = confirmDeadline.newDate;

                        setProgress(next);
                        syncAll(next, xp, bonusGiven);
                      }

                      setConfirmDeadline(null);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
