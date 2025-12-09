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

  /* ========== RENDER ========== */
  return (
    <div className="min-h-[calc(60vh-var(--nav-height))] rounded-2xl px-6 py-6 transition-all duration-300 bg-gradient-to-br from-[#B82132] via-[#183D3D] to-[#0F0F0F] text-[#FAFAF9] dark:bg-gradient-to-br dark:from-[#002b29] dark:via-[#001b1f] dark:to-[#2a0000] text-foreground">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <Code className="w-7 h-7 text-cyan-300" />
              MERN Project Roadmap
            </h1>
            <p className="text-sm opacity-80 mt-1">
              70 projects • XP system • Saved locally + backend
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-black/20">
              <Award className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold">Level {level}</div>
                <div className="text-xs opacity-70">{xp} XP</div>
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl border border-border bg-black/20 flex items-center gap-3">
              <div className="text-xs opacity-70">Overall</div>
              <div className="w-28 h-2 bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="text-xs opacity-70 w-8 text-right">
                {overallProgress}%
              </div>
            </div>
          </div>
        </header>

        {/* FILTERS */}
        <div className="flex flex-col flex-wrap lg:flex-row lg:items-center justify-center gap-3 mb-6 w-full">
          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-black/10 w-full lg:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent outline-none text-sm w-full lg:w-auto"
            />
            <button
              onClick={() => setQuery("")}
              className="text-sm opacity-70 whitespace-nowrap"
            >
              Clear
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* DIFFICULTY FILTER */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-2 lg:px-3 py-2 rounded-xl border border-border bg-[#0C9A7B]/20 hover:bg-[#0C9A7B]/30 transition-colors text-xs lg:text-sm w-full lg:w-auto"
            >
              <option className="bg-[#0C9A7B]">All</option>
              <option className="bg-[#0C9A7B]">Beginner</option>
              <option className="bg-[#0C9A7B]">Intermediate</option>
              <option className="bg-[#0C9A7B]">Advanced</option>
            </select>

            {/* VIEW SWITCH */}
            <div className="flex items-center gap-1 rounded-xl overflow-hidden border border-border bg-black/10 w-full lg:w-auto">
              <button
                onClick={() => setView("sections")}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm w-full lg:w-auto flex justify-center ${
                  view === "sections" ? "bg-black/20" : ""
                }`}
              >
                <List className="inline w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                Sections
              </button>
              <button
                onClick={() => setView("roadmap")}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm w-full lg:w-auto flex justify-center ${
                  view === "roadmap" ? "bg-black/20" : ""
                }`}
              >
                <Layers className="inline w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                Roadmap
              </button>
              <button
                onClick={() => setView("top10")}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm w-full lg:w-auto flex justify-center ${
                  view === "top10" ? "bg-black/20" : ""
                }`}
              >
                <Terminal className="inline w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                Top10
              </button>
              <button
                onClick={() => setView("timeline")}
                className={`px-2 lg:px-3 py-2 text-xs lg:text-sm w-full lg:w-auto flex justify-center ${
                  view === "timeline" ? "bg-black/20" : ""
                }`}
              >
                <Clock className="inline w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                Timeline
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full lg:w-auto">
              <button className="p-2 px-3 rounded-xl border border-border bg-blue-500/20 hover:bg-blue-500/30 transition-colors w-full lg:w-auto text-xs lg:text-sm whitespace-nowrap">
                Saved locally + backend
              </button>
              {/* EXPORT JSON */}
              <button
                className="px-3 py-2 rounded-xl border border-border bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors w-full lg:w-auto text-xs lg:text-sm whitespace-nowrap"
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
                Export JSON
              </button>
              {/* RESET ALL */}
              <button
                className="px-3 py-2 rounded-xl border border-border bg-red-500/20 hover:bg-red-500/30 transition-colors w-full lg:w-auto text-xs lg:text-sm whitespace-nowrap"
                onClick={() => {
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
                Reset All
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

        {/* ROADMAP VIEW */}
        {view === "roadmap" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Roadmap</h3>
            <div className="border border-border rounded-xl p-4 bg-black/20">
              <ol className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "HTML Foundations",
                    section: "HTML",
                    note: "Basics, responsive",
                  },
                  {
                    step: 2,
                    title: "CSS Mastery",
                    section: "CSS",
                    note: "Layout, animations",
                  },
                  {
                    step: 3,
                    title: "Tailwind Components",
                    section: "TAILWIND",
                    note: "Utility-first UI",
                  },
                  {
                    step: 4,
                    title: "Vanilla JS Power",
                    section: "JAVASCRIPT",
                    note: "DOM, APIs, logic",
                  },
                  {
                    step: 5,
                    title: "React Fundamentals",
                    section: "REACT",
                    note: "Components + hooks",
                  },
                  {
                    step: 6,
                    title: "Node + Mongo",
                    section: "NODE+MONGO",
                    note: "APIs + DB",
                  },
                  {
                    step: 7,
                    title: "MERN Full Apps",
                    section: "MERN",
                    note: "End-to-end apps",
                  },
                ].map((r) => (
                  <li key={r.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-black/30">
                      <div className="font-semibold">{r.step}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs opacity-70">{r.section}</div>
                      </div>
                      <div className="text-sm opacity-70">{r.note}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 text-sm opacity-70">
                Follow steps 1→7 for a smooth MERN learning path.
              </div>
            </div>
          </div>
        )}

        {/* TOP 10 VIEW */}
        {view === "top10" && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Top 10 (career-focused projects)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {TOP_10.map((t, i) => (
                <motion.div
                  key={t}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl border border-border bg-black/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{t}</h4>
                      <p className="text-xs opacity-70 mt-1">
                        High-impact project — about 1 full week each
                      </p>
                    </div>
                    <div className="text-xs opacity-60">#{i + 1}</div>
                  </div>
                  <div className="mt-3 text-sm opacity-70">
                    Builds portfolio + skills employers care about.
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TIMELINE VIEW */}
        {view === "timeline" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Learning Roadmap</h3>
            <div className="border-t border-border pt-6 mt-6">
              <h4 className="text-md font-semibold mb-3">
                Completed Tasks Log
              </h4>
              {Object.keys(progress).length === 0 ? (
                <p className="text-sm opacity-60 text-center mt-6">
                  No completed tasks yet — complete some projects to populate
                  timeline.
                </p>
              ) : (
                Object.entries(progress)
                  .filter(([section]) => section !== "_meta")
                  .map(([section, tasks]) => (
                    <div
                      key={section}
                      className="rounded-xl border border-border p-4 bg-black/20 mb-4"
                    >
                      <h4 className="font-semibold text-sm mb-2">
                        {section.replaceAll("_", " ")}
                      </h4>
                      {Object.entries(tasks?.completionDates || {}).length ===
                      0 ? (
                        <p className="text-xs opacity-60">
                          No completed tasks yet.
                        </p>
                      ) : (
                        Object.entries(tasks?.completionDates || {}).map(
                          ([idx, date]) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs border-b border-border/30 py-1"
                            >
                              <span>
                                {PROJECT_SECTIONS[section]?.[idx] ||
                                  "Unknown Task"}
                              </span>
                              <span className="opacity-70">{date}</span>
                            </div>
                          ),
                        )
                      )}
                    </div>
                  ))
              )}
            </div>
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
