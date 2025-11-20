// StudyProjectsAdvanced.jsx
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

/*
  Final Projects Page
  - Hardcoded 7 sections (10 projects each) — upgraded list (B)
  - Top 10 recommended
  - Roadmap timeline
  - Difficulty filter + search
  - XP (RPG style), confetti (no external dep)
  - LocalStorage save (wd_ keys)
  - Theme sync with wd_dark + 'theme-changed' event
*/

// LocalStorage keys (consistent with your global namespace)
const STORE = {
  PROGRESS: "wd_projects_progress",
  XP: "wd_total_xp",
  LEVEL: "wd_level",
  BONUS: "wd_section_bonus_awarded",
};

// XP settings (RPG style chosen)
const XP_VALUES = { Beginner: 10, Intermediate: 20, Advanced: 30 };
const SECTION_BONUS = 100;

// Confetti (no-dep)
function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 999999;
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

// small helpers
const loadJSON = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Level requirement function (increasing)
const levelRequirement = (lvl) => {
  if (lvl <= 1) return 200;
  if (lvl === 2) return 400;
  if (lvl === 3) return 700;
  return 1000 + (lvl - 4) * 400;
};

// Hardcoded upgraded project lists (B = upgraded)
const PROJECT_SECTIONS = {
  HTML: [
    "Responsive Magazine Layout",
    "Interactive Resume + Download",
    "Multi-section Landing (Marketing)",
    "Accessible Form Builder",
    "Static Blog Template",
    "Portfolio w/ Filter & Lightbox",
    "Micro-Interactions Kit (CSS only)",
    "HTML Canvas Illustration Page",
    "Email Template + Inliner",
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
    "Interactive SVG & Keyframe Animations",
  ],
  TAILWIND: [
    "Admin Dashboard UI (Tailwind)",
    "E-Commerce Product Grid",
    "Tailwind Component Library",
    "Landing with Hero Builder",
    "Tailwind + HeadlessUI Modal Flow",
    "Responsive Sidebar Layout",
    "Tailwind Blog CMS Frontend",
    "Settings Page with Theme Switch",
    "Notifications & Toasters UI",
    "Search + Filters UI (Tailwind)",
  ],
  JAVASCRIPT: [
    "SPA Weather App + Caching",
    "Realtime Search + Debounce UI",
    "Pomodoro + Session Tracker",
    "Expense Tracker with Charts",
    "Drag & Drop Kanban (vanilla)",
    "Image Editor (crop + resize)",
    "Audio Player with Visualizer",
    "API Rate-Limited Fetch Demo",
    "Infinite Scroll + Virtualization",
    "Web Worker + Heavy Computation Demo",
  ],
  REACT: [
    "Component Library & Storybook",
    "Complex Form with Validation Hooks",
    "State Management Demo (Context + Reducer)",
    "React Router Multi-page App",
    "Realtime Search with Suspense",
    "Custom Hooks Pack + Tests",
    "Optimized List + Virtualization",
    "React + Canvas Interactive",
    "SSR-ready React App (Next-like)",
    "MFE microfrontend demo (basic)",
  ],
  NODE_MONGO: [
    "Auth Service (JWT & Refresh)",
    "Notes API with File Upload",
    "Payments Sandbox (test)",
    "Image Resize + CDN Middleware",
    "Role-Based Access API",
    "Searchable Posts API (text-index)",
    "Realtime via WebSockets (simple chat)",
    "Rate limiting & Security Middleware",
    "Email + Verification Flow",
    "Analytics Event Collector API",
  ],
  MERN: [
    "Full Auth + Profile + Roles",
    "MERN Blog with Editor & Uploads",
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
  "Full Auth + Profile + Roles (MERN)",
  "Portfolio with Projects & Blog (HTML/CSS/Tailwind)",
  "Kanban Board (React) / Productivity App",
  "MERN E-Commerce (end-to-end)",
  "Auth Service + Notes API (Node/Mongo)",
  "Component Library + Storybook (React)",
  "Dashboard UI (Tailwind) + Charts",
  "Chat App (MERN or React + Socket)",
  "Expense Tracker with Charts (JS/React)",
  "Deployment Demo + CI Pipeline (MERN)",
];

// difficulty helper
const difficultyForIndex = (i) => (i <= 3 ? "Beginner" : i <= 6 ? "Intermediate" : "Advanced");

// Main component
export default function StudyProjectsAdvanced() {
  // theme state synced with wd_dark
  const [dark, setDark] = useState(() => {
    const v = localStorage.getItem("wd_dark");
    return v === null ? true : JSON.parse(v);
  });

  // filter & view state
  const [query, setQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All"); // All / Beginner / Intermediate / Advanced
  const [view, setView] = useState("sections"); // sections / roadmap / top10
  const [openSection, setOpenSection] = useState(null);

  // progress / xp loaded from store
  const [progress, setProgress] = useState(() => loadState(STORE.PROGRESS, {}));
  const [xp, setXP] = useState(() => loadState(STORE.XP, 0));
  const [level, setLevel] = useState(() => loadState(STORE.LEVEL, 0));
  const [bonusGiven, setBonusGiven] = useState(() => loadState(STORE.BONUS, {}));
  const [modal, setModal] = useState(null);

  // local helper to read store with fallback
  function loadState(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  // save side-effects
  useEffect(() => localStorage.setItem(STORE.PROGRESS, JSON.stringify(progress)), [progress]);
  useEffect(() => localStorage.setItem(STORE.XP, JSON.stringify(xp)), [xp]);
  useEffect(() => localStorage.setItem(STORE.LEVEL, JSON.stringify(level)), [level]);
  useEffect(() => localStorage.setItem(STORE.BONUS, JSON.stringify(bonusGiven)), [bonusGiven]);

  // theme sync: listen for 'theme-changed'
  useEffect(() => {
    const handler = () => {
      const v = localStorage.getItem("wd_dark");
      setDark(v === null ? true : JSON.parse(v));
    };
    handler();
    window.addEventListener("theme-changed", handler);
    return () => window.removeEventListener("theme-changed", handler);
  }, []);

  // auto compute level from xp
  useEffect(() => {
    let lv = 0;
    let remaining = xp;
    while (remaining >= levelRequirement(lv + 1)) {
      remaining -= levelRequirement(lv + 1);
      lv++;
    }
    if (lv !== level) setLevel(lv);
  }, [xp]);

  // helper to compute section & overall progress
  const sectionProgress = (key) => {
    const list = PROJECT_SECTIONS[key] || [];
    if (list.length === 0) return 0;
    const done = Object.values(progress[key] || {}).filter(Boolean).length;
    return Math.round((done / list.length) * 100);
  };
  const overallProgress = () => {
    let total = 0;
    let done = 0;
    Object.entries(PROJECT_SECTIONS).forEach(([k, v]) => {
      total += v.length;
      done += Object.values(progress[k] || {}).filter(Boolean).length;
    });
    return total ? Math.round((done / total) * 100) : 0;
  };

  // toggles a project's done state and XP bookkeeping
  const toggleProject = (section, idx) => {
    const wasDone = !!(progress[section] && progress[section][idx]);
    const nextProg = { ...progress };
    if (!nextProg[section]) nextProg[section] = {};
    nextProg[section][idx] = !wasDone;
    setProgress(nextProg);

    // xp change depending on difficulty
    const diff = difficultyForIndex(idx);
    const gain = XP_VALUES[diff] || 10;
    setXP((v) => (wasDone ? Math.max(0, v - gain) : v + gain));

    // section bonus checking
    const list = PROJECT_SECTIONS[section] || [];
    const doneCount = Object.values(nextProg[section] || {}).filter(Boolean).length;
    if (doneCount === list.length && !bonusGiven[section]) {
      setXP((v) => v + SECTION_BONUS);
      setBonusGiven((b) => ({ ...b, [section]: true }));
      fireConfetti();
    }
  };

  // open modal with details
  const openModal = (section, idx, title) => {
    setModal({ section, idx, title, diff: difficultyForIndex(idx) });
  };

  // filtered list helper
  const filteredSections = useMemo(() => {
    if (!query && filterDifficulty === "All") return PROJECT_SECTIONS;
    const q = query.trim().toLowerCase();
    const out = {};
    Object.entries(PROJECT_SECTIONS).forEach(([k, list]) => {
      const filtered = list
        .map((title, idx) => ({ title, idx, diff: difficultyForIndex(idx) }))
        .filter((p) => {
          if (filterDifficulty !== "All" && p.diff !== filterDifficulty) return false;
          if (q && !p.title.toLowerCase().includes(q)) return false;
          return true;
        })
        .map((p) => p.title);
      if (filtered.length) out[k] = filtered;
    });
    return out;
  }, [query, filterDifficulty]);

  // timeline (roadmap) — recommended ordered steps (IDs match our sections)
  const ROADMAP = [
    { step: 1, title: "HTML Foundations", section: "HTML", note: "Basics, responsive" },
    { step: 2, title: "CSS Mastery", section: "CSS", note: "Layout, animations" },
    { step: 3, title: "Tailwind & Components", section: "TAILWIND", note: "Utility-first UI" },
    { step: 4, title: "Vanilla JS Power", section: "JAVASCRIPT", note: "DOM, APIs, logic" },
    { step: 5, title: "React Fundamentals", section: "REACT", note: "Components & hooks" },
    { step: 6, title: "Node + Mongo", section: "NODE_MONGO", note: "APIs & DB" },
    { step: 7, title: "MERN Full Apps", section: "MERN", note: "End-to-end apps" },
  ];

  // UI small helpers
  const xpToNext = (lvl) => levelRequirement(lvl + 1);

  // reset/export functions
  const resetAll = () => {
    localStorage.removeItem(STORE.PROGRESS);
    localStorage.removeItem(STORE.XP);
    localStorage.removeItem(STORE.LEVEL);
    localStorage.removeItem(STORE.BONUS);
    setProgress({});
    setXP(0);
    setLevel(0);
    setBonusGiven({});
  };

  const exportJSON = () => {
    const data = { progress, xp, level, bonusGiven };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wd_projects_progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // small checkbox style (modern)
  const Checkbox = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-6 h-6 flex items-center justify-center rounded-md border ${
        checked ? "bg-emerald-400/20 border-emerald-400" : "bg-transparent border-white/10"
      } transition-all`}
      aria-pressed={checked}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 ${checked ? "opacity-100" : "opacity-0"}`}
        fill="none"
        stroke="currentColor"
      >
        <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );

  // small component for difficulty pill
  const DiffPill = ({ d }) => (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        d === "Beginner" ? "bg-white/5 border-white/10" : d === "Intermediate" ? "bg-white/8 border-white/12" : "bg-white/12 border-white/20"
      }`}
    >
      {d}
    </span>
  );

  // render
  return (
    <div
      className={`min-h-screen rounded-2xl px-6 py-10 transition-all duration-300 ${
        dark ? "bg-gradient-to-br from-[#002b29] via-[#001b1f] to-[#2a0000] text-foreground" : "bg-gradient-to-br from-[#0C9A7B] via-[#0C729A] to-[#0C2B9A] text-[#FAFAF9]"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <Code className="w-7 h-7 text-cyan-300" />
              MERN Project Roadmap
            </h1>
            <p className="text-sm opacity-80 mt-1">70 projects • XP system • Saved locally</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-black/20">
              <Award className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="text-sm font-semibold">Level {level}</div>
                <div className="text-xs opacity-70">XP: {xp}</div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl border border-border bg-black/20 flex items-center gap-3">
              <div className="text-xs opacity-70">Overall</div>
              <div className="w-28 h-2 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${overallProgress()}%` }} />
              </div>
              <div className="text-xs opacity-70 w-8 text-right">{overallProgress()}%</div>
            </div>
          </div>
        </header>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-black/10">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" className="bg-transparent outline-none text-sm" />
            <button onClick={() => { setQuery(""); }} className="text-sm opacity-70">Clear</button>
          </div>

          <div className="flex items-center gap-2">
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="px-3 py-2 rounded-xl border border-border  bg-black/10 text-sm">
              <option className="bg-[#0C9A7B]">All</option>
              <option className="bg-[#0C9A7B]">Beginner</option>
              <option className="bg-[#0C9A7B]">Intermediate</option>
              <option className="bg-[#0C9A7B]">Advanced</option>
            </select>

            <div className="flex items-center gap-2 rounded-xl overflow-hidden border border-border bg-black/10">
              <button onClick={() => setView("sections")} className={`px-3 py-2 text-sm ${view === "sections" ? "bg-black/20" : ""}`}><List className="inline w-4 h-4 mr-1" />Sections</button>
              <button onClick={() => setView("roadmap")} className={`px-3 py-2 text-sm ${view === "roadmap" ? "bg-black/20" : ""}`}><Layers className="inline w-4 h-4 mr-1" />Roadmap</button>
              <button onClick={() => setView("top10")} className={`px-3 py-2 text-sm ${view === "top10" ? "bg-black/20" : ""}`}><Terminal className="inline w-4 h-4 mr-1" />Top10</button>
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <button onClick={resetAll} className="px-4 py-2 rounded-xl border border-border">Reset All</button>
            <button onClick={exportJSON} className="px-4 py-2 rounded-xl border border-border">Export JSON</button>
          </div>
        </div>

        {/* main view */}
        {view === "sections" && (
          <div className="space-y-6">
            {Object.entries(filteredSections).map(([sec, list]) => (
              <section key={sec} className="rounded-2xl border border-border p-4 backdrop-blur-md bg-black/20">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-border bg-black/30 flex items-center justify-center">
                      {sec.includes("HTML") && <LayoutList className="w-6 h-6 text-cyan-300" />}
                      {sec.includes("CSS") && <Award className="w-6 h-6 text-pink-300" />}
                      {sec.includes("TAILWIND") && <Code className="w-6 h-6 text-sky-300" />}
                      {sec.includes("JAVASCRIPT") && <Cpu className="w-6 h-6 text-yellow-300" />}
                      {sec.includes("REACT") && <Code className="w-6 h-6 text-violet-300" />}
                      {sec.includes("NODE") && <Database className="w-6 h-6 text-green-300" />}
                      {sec.includes("MERN") && <Code className="w-6 h-6 text-amber-300" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{sec.replaceAll("_", " ")}</h3>
                      <div className="text-sm opacity-70">{PROJECT_SECTIONS[sec]?.length || list.length} projects • {sectionProgress(sec)}% complete</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-40 h-3 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${sectionProgress(sec)}%` }} />
                    </div>
                    <button onClick={() => setOpenSection(openSection === sec ? null : sec)} className="px-3 py-2 rounded-xl border border-border">{openSection === sec ? "Collapse" : "Open"}</button>
                  </div>
                </header>

                <AnimatePresence>
                  {openSection === sec && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 grid sm:grid-cols-2 gap-4">
                      {list.map((title, idx) => {
                        // find original index in canonical list for XP/difficulty mapping
                        const canonList = PROJECT_SECTIONS[sec] || [];
                        const canonIdx = Math.max(0, canonList.indexOf(title) === -1 ? idx : canonList.indexOf(title));
                        const done = !!(progress[sec] && progress[sec][canonIdx]);
                        const diff = difficultyForIndex(canonIdx);

                        return (
                          <motion.article key={title + idx} whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl border border-border flex gap-3 items-start ${done ? "bg-black/40" : "bg-black/20"}`}>
                            <Checkbox checked={done} onChange={() => toggleProject(sec, canonIdx)} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className={`font-medium ${done ? "line-through opacity-60" : ""}`}>{title}</h4>
                                <div className="flex items-center gap-2">
                                  <DiffPill d={diff} />
                                  <button onClick={() => openModal(sec, canonIdx, title)} className="text-xs opacity-80">Details →</button>
                                </div>
                              </div>
                              <p className="text-xs opacity-70 mt-2">Suggested: Clean UI • Responsive • Tests • Deploy</p>
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

        {view === "roadmap" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Roadmap</h3>
            <div className="border border-border rounded-xl p-4 bg-black/20">
              <ol className="space-y-4">
                {ROADMAP.map((r) => (
                  <li key={r.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-black/30">
                      <div className="font-semibold">{r.step}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs opacity-70">• {r.section}</div>
                      </div>
                      <div className="text-sm opacity-70">{r.note}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 text-sm opacity-70">Follow steps 1→7 for a smooth MERN learning path. Each step contains 10 projects to practise.</div>
            </div>
          </div>
        )}

        {view === "top10" && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Top 10 career-focused projects</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {TOP_10.map((t, i) => (
                <motion.div key={t} whileHover={{ scale: 1.02 }} className="p-4 rounded-xl border border-border bg-black/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{t}</h4>
                      <p className="text-xs opacity-70 mt-1">High-impact project — 1 full-week effort each (approx)</p>
                    </div>
                    <div className="text-xs opacity-60">#{i + 1}</div>
                  </div>
                  <div className="mt-3 text-sm opacity-70">Why: Builds portfolio & real-world skills employers care about.</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* footer actions */}
        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-border" onClick={() => { /* quick save already auto-saves */ }}>Saved locally</button>
          <button className="px-4 py-2 rounded-xl border border-border" onClick={exportJSON}>Export JSON</button>
          <button className="px-4 py-2 rounded-xl border border-border" onClick={resetAll}>Reset All</button>
        </div>

        {/* modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="max-w-xl w-full bg-black/90 border border-border rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{modal.title}</h3>
                    <p className="text-sm opacity-80 mt-2">Section: {modal.section} • Difficulty: {modal.diff}</p>
                  </div>
                  <button onClick={() => setModal(null)} className="opacity-70 text-sm">Close</button>
                </div>

                <div className="mt-4 text-sm opacity-80">
                  <p>Checklist to complete this project:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Responsive layout</li>
                    <li>Accessibility (ARIA labels)</li>
                    <li>Basic unit / integration tests</li>
                    <li>Deploy (Vercel / Netlify)</li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-border" onClick={() => { toggleProject(modal.section, modal.idx); setModal(null); }}>Mark Complete</button>
                  <button className="px-4 py-2 rounded-xl border border-border" onClick={() => setModal(null)}>Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
